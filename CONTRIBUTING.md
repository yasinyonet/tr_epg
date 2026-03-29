# Katkı Kılavuzu

- [Nasıl yapılır?](#nasıl-yapılır)
- [Proje Yapısı](#proje-yapısı)
- [Komut Dosyaları](#komut-dosyaları)

---

## Nasıl yapılır?

### Rehbere kanal nasıl eklenir?

Kanal eklemek için bir [talep formu](https://github.com/iptv-org/epg/issues/new?assignees=&labels=channel+request&projects=&template=2_channel-request.yml) doldurabilirsiniz.

Kanalı kendiniz eklemek istiyorsanız şu adımları izleyin:

[SITES.md](SITES.md) dosyasından uygun siteyi seçin. Ardından site klasörüne gidip `*.channels.xml` dosyasını açın.

İstediğiniz kanalın listede olmadığından emin olun. Yoksa, aşağıdaki formatta listenin sonuna ekleyin:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<channels>
  ...
  <channel site="SITE" site_id="SITE_ID" lang="DIL_KODU" xmltv_id="YAYIN_ID">KANAL_ADI</channel>
</channels>
```

| Özellik    | Açıklama                                                                                                                                 | Örnek         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| SITE       | Sitenin alan adı.                                                                                                                        | `example.com` |
| SITE_ID    | Kaynaktaki kanal için benzersiz kimlik.                                                                                                  | `hbo`         |
| DIL_KODU   | Rehberin dili ([ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) kodu).                                                 | `tr`          |
| YAYIN_ID   | Rehberin ait olduğu yayın kimliği (`<KANAL_ID>@<FEED_ID>`). Tüm listesi [iptv-org.github.io](https://iptv-org.github.io/) adresindedir. | `StarTV.tr`   |
| KANAL_ADI  | Kaynakta kullanılan kanal adı.                                                                                                           | `Star TV`     |

Değişiklikleri [commit](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits) edin ve [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) gönderin.

---

### Bozuk rehber nasıl bildirilir?

Rehberi indirirken hata alıyorsanız veya hiçbir şey yüklenmiyorsa, lütfen bu [formu](https://github.com/iptv-org/epg/issues/new?assignees=&labels=broken+guide&projects=&template=3_broken-guide.yml) doldurun.

---

### Yeni bir kaynak nasıl eklenir?

JavaScript bilginiz yoksa topluluktan destek isteyebilirsiniz: [talep formu](https://github.com/iptv-org/epg/issues/new?assignees=&labels=source+request&projects=&template=1_source-request.yml).

Aksi takdirde, [/sites](/sites) klasörüne yeni bir klasör oluşturun ve içine en az 4 dosya ekleyin:

<details>
<summary>example.com.config.js</summary>
<br>

Bu dosya; belirli bir kanal ve tarih için API'ya nasıl istek atılacağını ve yanıtın nasıl parse edileceğini tanımlar.

```js
module.exports = {
  site: 'example.com',
  url({ channel, date }) {
    return `https://example.com/api/${channel.site_id}/${date.format('YYYY-MM-DD')}`
  },
  parser(context) {
    try {
      return JSON.parse(context.content)
    } catch {
      return []
    }
  }
}
```

### İstek Bağlam Nesnesi (Request Context)

`url()`, `logo()`, `request.data()`, `request.headers()` fonksiyonları içinde `context` nesnesine erişilebilir:

- `channel`: Mevcut kanalı tanımlayan nesne (`xmltv_id`, `site_id`, `name`, `lang`)
- `date`: İstenen tarih için `dayjs` örneği

### Parser Bağlam Nesnesi (Parser Context)

`parser()` fonksiyonu içinde `context` nesnesine erişilebilir:

- `channel`: Mevcut kanalı tanımlayan nesne
- `date`: İstenen tarih için `dayjs` örneği
- `content`: Yanıt verisi (String)
- `buffer`: Yanıt verisi (ArrayBuffer)
- `headers`: Yanıt başlıkları
- `request`: İstek yapılandırması
- `cached`: Bu isteğin önbellekten gelip gelmediği (boolean)

### Program Özellikleri

Parser sırasında her programa atanabilecek özellikler:

| Özellik         | Takma Adlar                      | Tür                                        | Zorunlu |
| --------------- | -------------------------------- | ------------------------------------------ | ------- |
| start           |                                  | `String \| Number \| Date()`               | evet    |
| stop            |                                  | `String \| Number \| Date()`               | evet    |
| title           | titles                           | `String \| Object \| String[] \| Object[]` | evet    |
| subTitle        | subTitles, sub_title, sub_titles | `String \| Object \| String[] \| Object[]` | hayır   |
| description     | desc, descriptions               | `String \| Object \| String[] \| Object[]` | hayır   |
| date            |                                  | `String \| Number \| Date()`               | hayır   |
| category        | categories                       | `String \| Object \| String[] \| Object[]` | hayır   |
| season          |                                  | `String \| Number`                         | hayır   |
| episode         |                                  | `String \| Number`                         | hayır   |
| image           | images                           | `String \| Object \| String[] \| Object[]` | hayır   |
| rating          | ratings                          | `String \| Object \| String[] \| Object[]` | hayır   |
| director        | directors                        | `String \| Object \| String[] \| Object[]` | hayır   |
| actor           | actors                           | `String \| Object \| String[] \| Object[]` | hayır   |

</details>

<details>
<summary>example.com.test.js</summary>
<br>

Bu dosya ile oluşturulan config'i test edebilir ve beklediğiniz gibi çalıştığını doğrulayabilirsiniz.

```js
const { parser, url } = require('./example.com.config.js')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
dayjs.extend(utc)

const date = dayjs.utc('2025-01-12', 'YYYY-MM-DD').startOf('d')
const channel = { site_id: 'bbc1', xmltv_id: 'BBCOne.uk' }

it('geçerli url oluşturabilir', () => {
  expect(url({ channel, date })).toBe('https://example.com/api/bbc1/2025-01-12')
})

it('yanıtı parse edebilir', () => {
  const content =
    '[{"title":"Program 1","start":"2025-01-12T00:00:00.000Z","stop":"2025-01-12T00:30:00.000Z"}]'

  const results = parser({ content })

  expect(results.length).toBe(1)
  expect(results[0]).toMatchObject({
    title: 'Program 1',
    start: '2025-01-12T00:00:00.000Z',
    stop: '2025-01-12T00:30:00.000Z'
  })
})

it('boş rehberi işleyebilir', () => {
  const result = parser({ date, channel, content: '' })
  expect(result).toMatchObject([])
})
```

Test dokümantasyonu: https://jestjs.io/docs/using-matchers

</details>

<details>
<summary>example.com.channels.xml</summary>
<br>

Bu dosya kaynakta bulunan kanal listesini içerir.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<channels>
  <channel site="example.com" lang="tr" xmltv_id="StarTV.tr" site_id="star-tv">Star TV</channel>
</channels>
```

</details>

<details>
<summary>readme.md</summary>
<br>

Bu dosya config'in nasıl kullanılacağına dair talimatları içerir.

````
# example.com

https://example.com

### EPG İndir

```sh
npm run grab --- --site=example.com
```

### Test

```sh
npm test --- example.com
```
````

</details>

Tüm dosyaları hızlıca oluşturmak için şu komutu kullanabilirsiniz:

```sh
npm run sites:init --- example.com
```

Dosyaları tamamladıktan sonra config testini çalıştırın:

```sh
npm test --- example.com
```

Ardından tüm kanalların doğru `xmltv_id`'ye sahip olduğunu kontrol edin:

```sh
npm run channels:validate sites/example.com/example.com.channels.xml
```

Son olarak rehberi indirmeyi deneyin:

```sh
npm run grab --- example.com
```

Her şey yolunda giderse değişiklikleri [commit](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits) edin.

---

### Kanallar nasıl eşleştirilir?

Her kanalın `*.channels.xml` dosyasındaki `xmltv_id` değerinin [iptv-org/database](https://github.com/iptv-org/database) ile uyumlu olması gerekir.

Kontrolü hızlandırmak için:

```sh
npm run channels:edit path/to/channels.xml
```

Bu komut listeden doğru ID'yi seçmenizi sağlar:

```sh
? "Star TV" için kanal ID seçin (star-tv): (Ok tuşlarını kullanın)
❯ StarTV.tr (Star TV)
  StarTV2.tr (Star TV 2)
  Yaz...
  Atla
```

---

### Sunucumu GUIDES.md'ye nasıl eklerim?

Sunucunuzun genel dizinine `worker.json` dosyası yerleştirin:

<details>
<summary>worker.json</summary>
<br>

```json
{
  "channels": "path/to/channels.xml",
  "guide": "path/to/guide.xml"
}
```

</details>

Ardından sunucu alan adınızı veya IP adresinizi `workers.txt` dosyasına ekleyin.

İsteğiniz onaylandıktan sonra otomatik olarak [GUIDES.md](GUIDES.md) dosyasına eklenir.

---

## Proje Yapısı

- `.github/`
  - `ISSUE_TEMPLATE/`: Sorun (issue) şablonları.
  - `workflows/`: GitHub Actions iş akışları.
  - `CODE_OF_CONDUCT.md`: Davranış kuralları.
- `scripts/`: Projede kullanılan tüm komut dosyaları.
- `sites/`: Tüm sitelerin yapılandırmaları, kanal listeleri ve testleri.
- `tests/`: Komut dosyalarını kontrol eden testler.
- `CONTRIBUTING.md`: Katkı kılavuzu (bu dosya).
- `GUIDES.md`: Mevcut rehberlerin listesi ve durumu.
- `README.md`: Proje açıklaması.
- `SITES.md`: Desteklenen sitelerin listesi ve durumu.

---

## Komut Dosyaları

Bu komutlar rutin süreçleri otomatikleştirmek için oluşturulmuştur. Kullanmak için [Node.js](https://nodejs.org/en) kurulu olmalıdır.

```sh
npm run <komut-adı>
```

| Komut | Açıklama |
|-------|----------|
| `channels:lint` | Kanal listelerini sözdizimi hatalarına karşı kontrol eder |
| `channels:parse` | Site yapılandırmasına göre kanal listesi oluşturur |
| `channels:format` | `*.channels.xml` dosyalarını biçimlendirir |
| `channels:edit` | Kanalları hızlıca eşleştirmek için yardımcı araç |
| `channels:validate` | Kanal açıklamalarındaki hataları denetler |
| `sites:init` | Şablondan yeni site yapılandırması oluşturur |
| `sites:update` | [SITES.md](SITES.md) dosyasını günceller |
| `guides:update` | [GUIDES.md](GUIDES.md) dosyasını günceller |
| `grab` | Belirtilen kaynaktan EPG verisini indirir |
| `serve` | Web sunucusunu başlatır |
| `lint` | Komut dosyalarını sözdizimi hatalarına karşı kontrol eder |
| `test` | Tüm testleri çalıştırır |
