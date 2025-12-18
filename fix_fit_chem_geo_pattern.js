const fs = require('fs');
const path = require('path');

const scienceDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/science';

// fit_chem_02 ~ fit_chem_20 파일 수정 (01은 이미 수동 수정됨)
for (let i = 2; i <= 20; i++) {
  const num = i.toString().padStart(2, '0');
  const filename = `fit_chem_${num}.html`;
  const filePath = path.join(scienceDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${filename}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. CUR_UNIT 패턴 수정: geo[_-]?(\d{1,2}) -> fit_chem[_-]?(\d{1,2})
  const patterns = [
    // URL 파라미터 패턴
    { find: /\.match\(\/geo\[_-\]\?\(\\d\{1,2\}\)\/\)/g, replace: `.match(/fit_chem[_-]?(\\d{1,2})/)` },
    // 파일명 패턴
    { find: /\.match\(\/geo\[_-\]\?\(\\d\{1,2\}\)\\\.html\/\)/g, replace: `.match(/fit_chem[_-]?(\\d{1,2})\\.html/)` },
    // unit 설정
    { find: /unit = `geo_\$\{m\[1\]\.padStart\(2,'0'\)\}`;/g, replace: `unit = \`fit_chem_\${m[1].padStart(2,'0')}\`;` },
    { find: /unit = `geo_\$\{m2\[1\]\.padStart\(2,'0'\)\}`;/g, replace: `unit = \`fit_chem_\${m2[1].padStart(2,'0')}\`;` },
    { find: /unit = `geo_\$\{m3\[1\]\.padStart\(2,'0'\)\}`;/g, replace: `unit = \`fit_chem_\${m3[1].padStart(2,'0')}\`;` },
    // localStorage 키
    { find: /`dan-geo-report-state:\$\{window\.CUR_UNIT\}`/g, replace: `\`dan-fit_chem-report-state:\${window.CUR_UNIT}\`` },
    { find: /`current-geo-tab:\$\{/g, replace: `\`current-fit_chem-tab:\${` },
    // PAGE_KEY 패턴
    { find: /cur\.match\(\/geo_\(\\d\{1,2\}\)\/\)/g, replace: `cur.match(/fit_chem_(\\d{1,2})/)` },
    { find: /BRAINUP_social_fit_chem_/g, replace: `BRAINUP_science_fit_chem_` },
    // 주석
    { find: /\?unit=geo_XX/g, replace: `?unit=fit_chem_XX` },
    { find: /geo_XX\.html/g, replace: `fit_chem_XX.html` },
    { find: /\(geo_02\.html과 같은 폴더\)/g, replace: `(fit_chem_02.html과 같은 폴더)` },
  ];

  for (const p of patterns) {
    if (content.match(p.find)) {
      content = content.replace(p.find, p.replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filename}`);
  } else {
    console.log(`No changes: ${filename}`);
  }
}

console.log('\n========== Done ==========');
