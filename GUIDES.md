# EPG Rehberleri

Bu projede oluşturulan EPG rehberlerinin listesi.

## Mevcut Rehberler

| Site | Kanal Sayısı | Güncelleme | Çıktı Dosyası |
|------|:------------:|:----------:|--------------|
| dsmart.com.tr | 103 | Günlük | `sites/dsmart.com.tr/guides.xml` |
| tivibu.com.tr | 140 | Günlük | `sites/tivibu.com.tr/guides.xml` |
| turksatkablo.com.tr | 133 | Günlük | `sites/turksatkablo.com.tr/guides.xml` |
| tvplus.com.tr | 300+ | Günlük | `sites/tvplus.com.tr/guides.xml` |

## Rehber Oluşturma

```sh
# Tek site
npm run grab --- --site=tvplus.com.tr --output=./sites/tvplus.com.tr/guides.xml

# Tüm siteler (CMD)
guides_create.cmd
```

## Rehber Formatı

Oluşturulan `guides.xml` dosyaları XMLTV formatındadır ve Jellyfin, Plex, Emby, TiviMate gibi uygulamalarla doğrudan kullanılabilir.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<tv>
  <programme start="20260329210000 +0000" stop="20260329220000 +0000" channel="StarTV.tr">
    <title lang="tr">Program Adı</title>
    <desc lang="tr">Program açıklaması</desc>
  </programme>
</tv>
```
