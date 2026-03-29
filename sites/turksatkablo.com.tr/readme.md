# turksatkablo.com.tr

**Kaynak:** https://www.turksatkablo.com.tr/yayin-akisi.aspx  
**Tür:** JSON tabanlı günlük EPG dosyası  
**Kanal sayısı:** ~133  
**Günlük sayı:** 3

---

## Komutlar

### EPG İndir

```sh
npm run grab --- --site=turksatkablo.com.tr
```

### EPG İndir (klasöre kaydet)

```sh
npm run grab --- --site=turksatkablo.com.tr --output=./sites/turksatkablo.com.tr/guides.xml
```

### Kanal Listesini Güncelle

```sh
npm run channels:parse --- --config=./sites/turksatkablo.com.tr/turksatkablo.com.tr.config.js --output=./sites/turksatkablo.com.tr/turksatkablo.com.tr.channels.xml
```

### Test

```sh
npm test --- turksatkablo.com.tr
```

---

## Teknik Detaylar

- URL formatı: `https://www.turksatkablo.com.tr/userUpload/EPG/DD.json?_=<timestamp>`
- Her kanal için günlük JSON dosyası çekilir
- Zaman dilimi: **Istanbul (UTC+3)**

---

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `turksatkablo.com.tr.config.js` | Parser ve URL yapılandırması |
| `turksatkablo.com.tr.channels.xml` | Kanal listesi |
| `turksatkablo.com.tr.test.js` | Birim testleri |
| `__data__/content.json` | Test fixture verisi |
| `__data__/no_content.html` | Boş yanıt test verisi |
