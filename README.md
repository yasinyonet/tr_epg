# EPG Grabber — Türkiye

Türkiye'deki TV kanalları için EPG (Elektronik Program Rehberi) verilerini otomatik olarak indiren araç.

## İçindekiler

- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Siteler](#siteler)
- [Komutlar](#komutlar)
- [Test](#test)

---

## Kurulum

[Node.js](https://nodejs.org/en) kurulu olmalıdır.

```sh
npm install
```

---

## Kullanım

### Yayın akışı indir

```sh
npm run grab --- --site=<site-adı>
```

Örnek:
```sh
npm run grab --- --site=tvplus.com.tr
```

### Belirli klasöre kaydet

```sh
npm run grab --- --site=tvplus.com.tr --output=./sites/tvplus.com.tr/guides.xml
```

### Kanal listesini güncelle

```sh
npm run channels:parse --- --config=./sites/<site>/<site>.config.js --output=./sites/<site>/<site>.channels.xml
```

### Zamanlanmış çalıştırma

```sh
npx chronos --execute="npm run grab --- --site=tvplus.com.tr" --pattern="0 0,12 * * *" --log
```

### Tüm siteleri çalıştır (CMD)

```sh
guides_create.cmd
```

### Tüm kanalları güncelle (CMD)

```sh
channel_create.cmd
```

---

## Siteler

| Site | Açıklama | Kaynak |
|------|----------|--------|
| [dsmart.com.tr](sites/dsmart.com.tr) | D-Smart uydu yayın paketi | https://www.dsmart.com.tr |
| [tivibu.com.tr](sites/tivibu.com.tr) | Tivibu IPTV platformu (Türk Telekom) | https://www.tivibu.com.tr |
| [turksatkablo.com.tr](sites/turksatkablo.com.tr) | Türksat Kablo TV | https://www.turksatkablo.com.tr |
| [tvplus.com.tr](sites/tvplus.com.tr) | TVPlus IPTV platformu | https://tvplus.com.tr |

---

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run grab --- --site=<site>` | Belirtilen sitenin EPG verisini indir |
| `npm run grab --- --site=<site> --output=<path>` | Belirli bir konuma kaydet |
| `npm run channels:parse --- --config=<path> --output=<path>` | Kanal listesini yenile |
| `npm test --- <site>` | Site birim testini çalıştır |

### Grab seçenekleri

| Seçenek | Açıklama | Varsayılan |
|---------|----------|------------|
| `--site` | Site adı | — |
| `--days` | Kaç günlük EPG çekilsin | Site config'den |
| `--output` | Çıktı dosyası | `guide.xml` |
| `--maxConnections` | Eş zamanlı istek sayısı | `1` |
| `--timeout` | İstek zaman aşımı (ms) | `30000` |
| `--delay` | İstekler arası bekleme (ms) | `0` |

---

## Test

```sh
# Tek site testi
npm test --- tvplus.com.tr

# Tüm testler
npm test
```

---

## Lisans

[![CC0](http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg)](LICENSE)
