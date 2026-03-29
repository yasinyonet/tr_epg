# dsmart.com.tr

**Kaynak:** https://www.dsmart.com.tr/yayin-akisi  
**Tür:** HTML tabanlı yayın akışı  
**Kanal sayısı:** ~103  
**Günlük sayı:** 3

---

## Komutlar

### EPG İndir

```sh
npm run grab --- --site=dsmart.com.tr
```

### EPG İndir (klasöre kaydet)

```sh
npm run grab --- --site=dsmart.com.tr --output=./sites/dsmart.com.tr/guides.xml
```

### Kanal Listesini Güncelle

```sh
npm run channels:parse --- --config=./sites/dsmart.com.tr/dsmart.com.tr.config.js --output=./sites/dsmart.com.tr/dsmart.com.tr.channels.xml
```

### Test

```sh
npm test --- dsmart.com.tr
```

---

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `dsmart.com.tr.config.js` | Parser ve URL yapılandırması |
| `dsmart.com.tr.channels.xml` | Kanal listesi |
| `dsmart.com.tr.test.js` | Birim testleri |
| `__data__/content.json` | Test fixture verisi |
