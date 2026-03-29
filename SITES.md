# Siteler

Bu projede aktif olan EPG kaynak siteleri:

| Site | URL | Kanal Sayısı | Durum |
|------|-----|:------------:|:-----:|
| [dsmart.com.tr](dsmart.com.tr) | https://www.dsmart.com.tr/yayin-akisi | 103 | 🟢 |
| [tivibu.com.tr](tivibu.com.tr) | https://www.tivibu.com.tr/canli-tv | 140 | 🟢 |
| [turksatkablo.com.tr](turksatkablo.com.tr) | https://www.turksatkablo.com.tr/yayin-akisi.aspx | 133 | 🟢 |
| [tvplus.com.tr](tvplus.com.tr) | https://tvplus.com.tr/canli-tv/yayin-akisi | 300+ | 🟢 |

---

## Hızlı Başlangıç

```sh
# Kurulum
npm install

# Tüm sitelerde EPG indir
guides_create.cmd

# Tek site EPG indir
npm run grab --- --site=tvplus.com.tr

# Kanal listelerini güncelle
channel_create.cmd
```

---

## Site Detayları

### dsmart.com.tr
- **Kaynak:** HTML tabanlı yayın akışı sayfası
- **Güncelleme:** Manuel (`channel_create.cmd`)
- **Config:** [dsmart.com.tr.config.js](dsmart.com.tr/dsmart.com.tr.config.js)

### tivibu.com.tr
- **Kaynak:** POST API (`Channel/GetPrevueList`) + CSRF token doğrulaması
- **Güncelleme:** Manuel (`channel_create.cmd`)
- **Config:** [tivibu.com.tr.config.js](tivibu.com.tr/tivibu.com.tr.config.js)

### turksatkablo.com.tr
- **Kaynak:** JSON tabanlı günlük EPG dosyası
- **Güncelleme:** Manuel (`channel_create.cmd`)
- **Config:** [turksatkablo.com.tr.config.js](turksatkablo.com.tr/turksatkablo.com.tr.config.js)

### tvplus.com.tr
- **Kaynak:** Next.js SSR + EPG PlayBillList API (çok günlü destek)
- **Güncelleme:** Manuel (`channel_create.cmd`)
- **Config:** [tvplus.com.tr.config.js](tvplus.com.tr/tvplus.com.tr.config.js)
