const axios = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Kaydedilmiş oturum verisi (önbellekleme için)
let _session = null;
let _sessionExpires = 0;

async function getSession() {
  const now = Date.now();
  if (_session && now < _sessionExpires) return _session;

  const res = await axios.get('https://www.tivibu.com.tr/canli-tv', {
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8'
    }
  });

  const html = res.data;
  const cookies = res.headers['set-cookie'] || [];
  const cookieStr = cookies.map(c => c.split(';')[0]).join('; ');

  // Form token: <input type="hidden" class="token" name="CSRF-TOKEN-TVBUDNBX!-FORM" value="CfDJ8...">
  const tokenMatch = html.match(/class="token"[^>]+value="([^"]+)"/);
  if (!tokenMatch) throw new Error('CSRF token bulunamadı');

  _session = {
    cookieStr,
    csrfToken: tokenMatch[1]
  };
  _sessionExpires = now + 30 * 60 * 1000; // 30 dakika cache
  return _session;
}

async function getPrevueList(channelCode, dateBegin, dateEnd) {
  const session = await getSession();
  const body = `channelCode=${channelCode}&channelDateBegin=${encodeURIComponent(dateBegin)}&channelDateEnd=${encodeURIComponent(dateEnd)}`;

  const res = await axios.post(
    'https://www.tivibu.com.tr/Channel/GetPrevueList',
    body,
    {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'RequestVerificationToken': session.csrfToken,
        'Cookie': session.cookieStr,
        'Referer': 'https://www.tivibu.com.tr/canli-tv',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }
  );
  return res.data.mobilPrevueViewModel || [];
}

module.exports = {
  site: 'tivibu.com.tr',
  days: 3, // 3 günlük EPG çek

  url({ channel, date }) {
    // url fonksiyonu zorunlu, ama biz parser içinde API çağırıyoruz
    // Yine de sistemin görmesi için placeholder döndürüyoruz
    const pad = n => String(n).padStart(2, '0');
    const d = date.toDate ? date.toDate() : new Date(date);
    const dateStr = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    return `https://www.tivibu.com.tr/Channel/GetPrevueList?ch=${channel.site_id}&d=${dateStr}`;
  },

  async parser({ channel, date }) {
    const programs = [];
    try {
      const pad = n => String(n).padStart(2, '0');
      const d = date.toDate ? date.toDate() : new Date(date);
      const dateStr = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
      const dateBegin = `${dateStr} 00:00:00`;
      const dateEnd = `${dateStr} 23:59:59`;

      const items = await getPrevueList(channel.site_id, dateBegin, dateEnd);

      for (const item of items) {
        if (!item.prevueName || !item.beginTime || !item.endTime) continue;

        // beginTime / endTime format: "2026.03.29 14:00:00" (local Istanbul time)
        const start = dayjs.tz(item.beginTime, 'YYYY.MM.DD HH:mm:ss', 'Europe/Istanbul').utc();
        let stop = dayjs.tz(item.endTime, 'YYYY.MM.DD HH:mm:ss', 'Europe/Istanbul').utc();

        if (stop.isBefore(start)) {
          stop = stop.add(1, 'day');
        }

        programs.push({
          title: item.prevueName,
          description: item.description || '',
          category: item.genre || '',
          image: item.prevueImage || '',
          start: start.toDate(),
          stop: stop.toDate()
        });
      }
    } catch (err) {
      console.error(`[tivibu] Parser hatası (${channel.site_id}):`, err.message);
    }

    return programs;
  },

  async channels() {
    try {
      const res = await axios.get('https://www.tivibu.com.tr/canli-tv', {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const $ = cheerio.load(res.data);
      const channels = [];
      const seen = new Set();

      $('.channelsMobile .fullLink[channelcode]').each((i, el) => {
        const code = $(el).attr('channelcode');
        const name = $(el).find('.channelsTitle a').text().trim().replace(/\s+/g, ' ');
        if (code && name && !seen.has(code)) {
          seen.add(code);
          channels.push({ lang: 'tr', site_id: code, name });
        }
      });

      return channels;
    } catch (err) {
      console.error('[tivibu] Kanal listesi alınamadı:', err.message);
      return [];
    }
  }
};
