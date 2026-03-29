# tvplus.com.tr

**Kaynak:** https://tvplus.com.tr/canli-tv/yayin-akisi  
**Tür:** Next.js SSR + EPG PlayBillList API (çok günlü destek)  
**Kanal sayısı:** 300+  
**Günlük sayı:** 3

---

## Komutlar

### EPG İndir

```sh
npm run grab --- --site=tvplus.com.tr
```

### EPG İndir (klasöre kaydet)

```sh
npm run grab --- --site=tvplus.com.tr --output=./sites/tvplus.com.tr/guides.xml
```

### Kanal Listesini Güncelle

```sh
npm run channels:parse --- --config=./sites/tvplus.com.tr/tvplus.com.tr.config.js --output=./sites/tvplus.com.tr/tvplus.com.tr.channels.xml
```

### Test

```sh
npm test --- tvplus.com.tr
```

---

## Teknik Detaylar

### Güncel gün (Next.js SSR)
- `slug/id` formatındaki kanallar için: `_next/data/{buildId}/tr/canli-tv/yayin-akisi/{slug}--{id}.json`
- Yalnızca bugünkü programları içerir

### Çok günlü EPG (PlayBillList API)
- Endpoint: `https://izmaottvscXX.tvplus.com.tr:33207/EPG/JSON/PlayBillList`
- Yöntem: `POST` (JSON body)
- Auth: `Authenticate` endpoint'i → `XSESSIONID` cookie
- `begintime` / `endtime`: `YYYYMMDDHHMMSS` formatında UTC zaman aralığı

```json
{
  "type": "2",
  "channelid": "4353",
  "begintime": "20260329210000",
  "endtime": "20260330205950",
  "isFillProgram": 1
}
```

---

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `tvplus.com.tr.config.js` | Parser, API ve oturum yapılandırması |
| `tvplus.com.tr.channels.xml` | Kanal listesi |
| `tvplus.com.tr.test.js` | Birim testleri |
| `__data__/content.json` | Test fixture verisi (Next.js JSON) |
| `__data__/build.html` | buildId çıkarılan HTML fixture |
