const cheerio = require('cheerio')
const axios = require('axios')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

function parseSeasonInfo(seasonInfo) {
  if (!seasonInfo) return { season: undefined, episode: undefined }
  // Format: "1. Sezon - 116. Bölüm"
  const seasonMatch  = seasonInfo.match(/(\d+)\.\s*Sezon/)
  const episodeMatch = seasonInfo.match(/(\d+)\.\s*B[öo]l[üu]m/)
  return {
    season:  seasonMatch  ? parseInt(seasonMatch[1],  10) : undefined,
    episode: episodeMatch ? parseInt(episodeMatch[1], 10) : undefined
  }
}

const baseUrl = 'https://tvplus.com.tr/canli-tv/yayin-akisi'

// Bilinen EPG sunucu listesi (değişebilir, önce auth başarılı olanı kullan)
const EPG_HOSTS = [
  'izmaottvsc22', 'izmaottvsc24', 'izmaottvsc01',
  'izmaottvsc10', 'izmaottvsc15', 'izmaottvsc20'
]

// Oturum cache
let _epgSession = null

async function getEpgSession() {
  if (_epgSession) return _epgSession

  for (const host of EPG_HOSTS) {
    try {
      const res = await axios.post(
        `https://${host}.tvplus.com.tr:33207/EPG/JSON/Authenticate`,
        {
          terminaltype: 'webtv',
          terminalvendor: 'Chrome',
          osversion: 'Win32',
          userType: '3',
          utcEnable: '1',
          timezone: 'Europe/Istanbul'
        },
        { timeout: 10000 }
      )

      const cookies = res.headers['set-cookie'] || []
      const cookieStr = cookies.map(c => c.split(';')[0]).join('; ')

      if (cookieStr) {
        _epgSession = { host, cookieStr }
        return _epgSession
      }
    } catch {
      // Bu host çalışmıyor, diğerini dene
    }
  }

  return null
}

async function fetchPlaybillList(channelId, date) {
  const session = await getEpgSession()
  if (!session) throw new Error('EPG session alınamadı')

  const pad = n => String(n).padStart(2, '0')
  const d = dayjs.utc(date)
  // Istanbul günü: UTC-3 saat gerideyiz (UTC+03:00)
  // O günün Istanbul 00:00'ı = bir önceki günün UTC 21:00
  const prevDay = d.subtract(1, 'day')
  const begintime = `${prevDay.format('YYYY')}${pad(prevDay.month()+1)}${pad(prevDay.date())}210000`
  const endtime   = `${d.format('YYYY')}${pad(d.month()+1)}${pad(d.date())}205950`

  const res = await axios.post(
    `https://${session.host}.tvplus.com.tr:33207/EPG/JSON/PlayBillList`,
    { type: '2', channelid: String(channelId), begintime, endtime, isFillProgram: 1 },
    { timeout: 15000, headers: { Cookie: session.cookieStr } }
  )

  // Session expired → oturumu yenile ve tekrar dene
  if (res.data.retcode === -2) {
    _epgSession = null
    return fetchPlaybillList(channelId, date)
  }

  return res.data.playbilllist || []
}

module.exports = {
  site: 'tvplus.com.tr',
  days: 3, // 3 günlük EPG çek

  async url({ channel }) {

    if (!module.exports.buildId) {
      module.exports.buildId = await module.exports.fetchBuildId()
    }

    const channelId = channel.site_id.replace('/', '--')

    return `https://tvplus.com.tr/_next/data/${module.exports.buildId}/tr/canli-tv/yayin-akisi/${channelId}.json?title=${channelId}`
  },

  async parser({ content, date, channel }) {

    const programs = []

    if (!content) return programs

    // site_id formatı: "slug/numericId" veya "SinemaTV.tr@SD" (xmltv_id stili)
    // Numerik ID'yi site_id'den çıkar
    const idMatch = (channel.site_id || '').match(/\/(\d+)$/)

    if (idMatch) {
      // Yeni API: EPG sunucusundan çek (çok günlü destek)
      try {
        const numericId = idMatch[1]
        const items = await fetchPlaybillList(numericId, date)

        for (const item of items) {
          const { season, episode } = parseSeasonInfo(item.seasonInfo)
          const image = Array.isArray(item.pictures) && item.pictures.length > 0
            ? item.pictures[0].href
            : (item.picture || '')

          programs.push({
            title: item.name,
            description: item.introduce,
            category: item.genres,
            image,
            season,
            episode,
            start: dayjs.utc(item.starttime),
            stop: dayjs.utc(item.endtime)
          })
        }
      } catch (err) {
        console.error(`[tvplus] EPG API hatası (${channel.site_id}):`, err.message)
      }

      return programs
    }

    // Eski format (xmltv_id stili site_id): next.js JSON parse
    let data
    try {
      data = JSON.parse(content)
    } catch {
      return programs
    }

    // Yeni next.js API: pageProps.pageData.playbills (sadece bugün)
    let list = null
    let isNewApi = false

    if (Array.isArray(data?.pageProps?.pageData?.playbills)) {
      list = data.pageProps.pageData.playbills
      isNewApi = true
    } else if (Array.isArray(data?.pageProps?.allPlaybillList)) {
      list = []
      data.pageProps.allPlaybillList.forEach(group => group.forEach(s => list.push(s)))
    }

    if (!list) return programs

    const targetDateStr = date ? dayjs.utc(date).format('YYYY-MM-DD') : null

    list.forEach(schedule => {

      if (targetDateStr) {
        let scheduleUtcDate
        if (isNewApi) {
          scheduleUtcDate = dayjs.utc(schedule.starttime).format('YYYY-MM-DD')
        } else {
          scheduleUtcDate = schedule.starttime ? schedule.starttime.substring(0, 10) : null
        }
        if (scheduleUtcDate !== targetDateStr) return
      }

      const { season, episode } = parseSeasonInfo(schedule.seasonInfo)

      programs.push({
        title: schedule.name,
        description: schedule.introduce,
        category: schedule.genres,
        image: schedule.picture,
        season,
        episode,
        start: isNewApi ? dayjs.utc(schedule.starttime) : dayjs.utc(schedule.starttime),
        stop:  isNewApi ? dayjs.utc(schedule.endtime)   : dayjs.utc(schedule.endtime)
      })

    })

    return programs
  },

  async channels() {

    const channels = []

    try {

      const html = await axios.get(baseUrl).then(r => r.data)

      const $ = cheerio.load(html)

      $('a[href*="/canli-tv/yayin-akisi/"]').each((i, el) => {

        const href = $(el).attr('href')

        const match = href.match(/yayin-akisi\/(.+)--(\d+)/)

        if (!match) return

        const slug = match[1]
        const id = match[2]

        const name = $(el).text().trim()

        const logo = $(el).find('img').attr('src')

        channels.push({
          lang: 'tr',
          name: name,
          site_id: `${slug}/${id}`,
          xmltv_id: `${name.replace(/\s+/g,'')}.tr`,
          logo: logo
        })

      })

    } catch (err) {

      console.error('Channel parse error:', err.message)

    }

    return channels
  },

  async fetchBuildId() {

    try {

      const html = await axios.get(baseUrl).then(r => r.data)

      const $ = cheerio.load(html)

      const nextData = $('#__NEXT_DATA__').html()

      if (!nextData) return null

      const json = JSON.parse(nextData)

      return json.buildId

    } catch {

      return null

    }

  }
}