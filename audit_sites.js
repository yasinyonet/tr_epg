const fs = require('fs');
const path = require('path');

const sitesDir = path.join(__dirname, 'sites');
const sites = fs.readdirSync(sitesDir).filter(d => fs.statSync(path.join(sitesDir, d)).isDirectory()).sort();

const results = { empty_parser: [], no_guides: [], has_parser_no_data: [] };

for (const site of sites) {
  const guidesFile = path.join(sitesDir, site, 'guides.xml');
  const cfgFile = path.join(sitesDir, site, `${site}.config.js`);
  
  let hasData = false;
  if (fs.existsSync(guidesFile)) {
    const c = fs.readFileSync(guidesFile, 'utf8');
    hasData = c.includes('<programme ');
  }
  
  if (hasData) continue;
  
  if (!fs.existsSync(cfgFile)) continue;
  
  const cfg = fs.readFileSync(cfgFile, 'utf8');
  const isEmptyParser = /parser:\s*function\s*\([^)]*\)\s*\{\s*return\s*\[\]/.test(cfg);
  const hasRealLogic = /cheerio|\.each\(|querySelectorAll|\.find\(/.test(cfg);
  
  // Extract URL from config
  let url = '';
  const urlMatch = cfg.match(/return\s+[`'"]([^`'"]+)[`'"]/);
  if (urlMatch) url = urlMatch[1];
  
  if (!fs.existsSync(guidesFile)) {
    results.no_guides.push({ site, isEmptyParser, url });
  } else if (isEmptyParser) {
    results.empty_parser.push({ site, url });
  } else {
    results.has_parser_no_data.push({ site, url });
  }
}

const out = {
  no_guides: results.no_guides,
  empty_parser: results.empty_parser,
  has_parser_no_data: results.has_parser_no_data
};

fs.writeFileSync(path.join(__dirname, 'audit_result.json'), JSON.stringify(out, null, 2));
console.log('NO GUIDES:', results.no_guides.length);
console.log('EMPTY PARSER:', results.empty_parser.length);
console.log('HAS PARSER BUT NO DATA:', results.has_parser_no_data.length);
console.log('\nSaved to audit_result.json');
