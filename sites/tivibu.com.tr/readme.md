# tivibu.com.tr

**Kaynak:** https://www.tivibu.com.tr/canli-tv  
**Tür:** POST API tabanlı (`Channel/GetPrevueList`) — CSRF token doğrulaması  
**Kanal sayısı:** ~140  
**Günlük sayı:** 3

---

## Komutlar

### EPG İndir

```sh
npm run grab --- --site=tivibu.com.tr
```

### EPG İndir (klasöre kaydet)

```sh
npm run grab --- --site=tivibu.com.tr --output=./sites/tivibu.com.tr/guides.xml
```

### Kanal Listesini Güncelle

```sh
npm run channels:parse --- --config=./sites/tivibu.com.tr/tivibu.com.tr.config.js --output=./sites/tivibu.com.tr/tivibu.com.tr.channels.xml
```

### Test

```sh
npm test --- tivibu.com.tr
```

---

## Teknik Detaylar

- Ana sayfa (`GET /canli-tv`) üzerinden CSRF token çekilir
- Program listesi `POST /Channel/GetPrevueList` API'ya gönerilir
- CSRF token 30 dakika boyunca önbellekte tutulur

---

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `tivibu.com.tr.config.js` | Parser, API ve oturum yapılandırması |
| `tivibu.com.tr.channels.xml` | Kanal listesi |
| `tivibu.com.tr.test.js` | Birim testleri |
| `__data__/content.json` | Test fixture verisi (API yanıtı) |
| `__data__/no_content.json` | Boş yanıt test verisi |
