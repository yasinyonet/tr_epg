# turksatkablo.com.tr

https://www.turksatkablo.com.tr/yayin-akisi.aspx

### Download the guide

```sh
npm run grab --- --site=turksatkablo.com.tr
```
### Download the guide output source folder

```sh
npm run grab --- --site=turksatkablo.com.tr --output=./sites/turksatkablo.com.tr/guides.xml
```

### Update channel list

```sh
npm run channels:parse --- --config=./sites/turksatkablo.com.tr/turksatkablo.com.tr.config.js --output=./sites/turksatkablo.com.tr/turksatkablo.com.tr.channels.xml
```

### Test

```sh
npm test --- turksatkablo.com.tr
```
