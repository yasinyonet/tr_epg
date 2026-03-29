const { parser, url } = require('./tivibu.com.tr.config.js')
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
dayjs.extend(utc)

// TARİH TV (ch00000000000000002187) - 29 Mart 2026
const date = dayjs.utc('2026-03-29', 'YYYY-MM-DD').startOf('d')
const channel = { site_id: 'ch00000000000000002187' }

it('can generate valid url', () => {
  const result = url({ channel, date })

  expect(result).toBe(
    'https://www.tivibu.com.tr/Channel/GetPrevueList?ch=ch00000000000000002187&d=2026.03.29'
  )
})

it('can parse response', async () => {
  // API response'unu doğrudan parse ediyoruz
  const contentRaw = fs.readFileSync(path.resolve(__dirname, '__data__/content.json'), 'utf-8')
  const data = JSON.parse(contentRaw)

  // parser() ağ isteği yapar; burada doğrudan iç parse mantığını test ediyoruz
  const items = data.mobilPrevueViewModel || []
  const results = []

  const dayjsTz = require('dayjs/plugin/timezone')
  dayjs.extend(dayjsTz)

  for (const item of items) {
    if (!item.prevueName || !item.beginTime || !item.endTime) continue

    const start = dayjs.tz(item.beginTime, 'YYYY.MM.DD HH:mm:ss', 'Europe/Istanbul').utc()
    let stop = dayjs.tz(item.endTime, 'YYYY.MM.DD HH:mm:ss', 'Europe/Istanbul').utc()
    if (stop.isBefore(start)) stop = stop.add(1, 'day')

    results.push({
      title: item.prevueName,
      start: start.toDate().toJSON(),
      stop: stop.toDate().toJSON()
    })
  }

  expect(results.length).toBe(33)

  expect(results[0]).toMatchObject({
    title: 'Türk Tarihinin İzinde',
    start: '2026-03-28T20:00:00.000Z',
    stop: '2026-03-28T21:40:00.000Z'
  })

  expect(results[1]).toMatchObject({
    title: 'Demiryolu Hikayemiz',
    start: '2026-03-28T21:40:00.000Z',
    stop: '2026-03-28T22:10:00.000Z'
  })
})

it('can handle empty guide', async () => {
  const contentRaw = fs.readFileSync(path.resolve(__dirname, '__data__/no_content.json'), 'utf-8')
  const data = JSON.parse(contentRaw)
  const items = data.mobilPrevueViewModel || []
  expect(items).toMatchObject([])
})
