const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP';

// 각 폴더와 과목 정의
const folders = {
  science: ['bio', 'earth', 'physics', 'chem'],
  social: ['soc', 'geo', 'law', 'pol'],
  korlit: ['modern', 'classic'],
  worldlit: ['world1', 'world2'],
  person: ['people1', 'people2']
};

// 단원 수 정의
const unitCounts = {
  bio: 20, earth: 20, physics: 20, chem: 20,
  soc: 20, geo: 20, law: 20, pol: 20,
  modern: 40, classic: 40,
  world1: 40, world2: 40,
  people1: 40, people2: 40
};

let totalUpdated = 0;

for (const [folder, subjects] of Object.entries(folders)) {
  for (const subject of subjects) {
    const count = unitCounts[subject];
    for (let i = 1; i <= count; i++) {
      const num = i.toString().padStart(2, '0');
      const filename = `on_${subject}_${num}.html`;
      const filePath = path.join(baseDir, folder, filename);

      if (!fs.existsSync(filePath)) {
        console.log(`SKIP (not found): ${filename}`);
        continue;
      }

      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      // 1. fit_ → on_ 치환 (주요 패턴들)
      // CUR_UNIT 패턴
      content = content.replace(/fit_bio/g, 'on_bio');
      content = content.replace(/fit_earth/g, 'on_earth');
      content = content.replace(/fit_physics/g, 'on_physics');
      content = content.replace(/fit_chem/g, 'on_chem');
      content = content.replace(/fit_soc/g, 'on_soc');
      content = content.replace(/fit_geo/g, 'on_geo');
      content = content.replace(/fit_law/g, 'on_law');
      content = content.replace(/fit_pol/g, 'on_pol');
      content = content.replace(/fit_modern/g, 'on_modern');
      content = content.replace(/fit_classic/g, 'on_classic');
      content = content.replace(/fit_world1/g, 'on_world1');
      content = content.replace(/fit_world2/g, 'on_world2');
      content = content.replace(/fit_people1/g, 'on_people1');
      content = content.replace(/fit_people2/g, 'on_people2');

      // 2. BRAINFIT → BRAINON
      content = content.replace(/BRAINFIT/g, 'BRAINON');
      content = content.replace(/BRAIN핏/g, 'BRAIN온');

      // 3. content.js 참조 변경
      content = content.replace(/fit_bio_content\.js/g, 'on_bio_content.js');
      content = content.replace(/fit_earth_content\.js/g, 'on_earth_content.js');
      content = content.replace(/fit_physics_content\.js/g, 'on_physics_content.js');
      content = content.replace(/fit_chem_content\.js/g, 'on_chem_content.js');
      content = content.replace(/fit_soc_content\.js/g, 'on_soc_content.js');
      content = content.replace(/fit_geo_content\.js/g, 'on_geo_content.js');
      content = content.replace(/fit_law_content\.js/g, 'on_law_content.js');
      content = content.replace(/fit_pol_content\.js/g, 'on_pol_content.js');
      content = content.replace(/fit_modern_content\.js/g, 'on_modern_content.js');
      content = content.replace(/fit_classic_content\.js/g, 'on_classic_content.js');
      content = content.replace(/fit_world1_content\.js/g, 'on_world1_content.js');
      content = content.replace(/fit_world2_content\.js/g, 'on_world2_content.js');
      content = content.replace(/fit_people1_content\.js/g, 'on_people1_content.js');
      content = content.replace(/fit_people2_content\.js/g, 'on_people2_content.js');

      // 4. localStorage 키 등 기타 패턴
      content = content.replace(/dan-fit_/g, 'dan-on_');
      content = content.replace(/current-fit_/g, 'current-on_');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        totalUpdated++;
        console.log(`Updated: ${folder}/${filename}`);
      } else {
        console.log(`No changes: ${folder}/${filename}`);
      }
    }
  }
}

console.log(`\n========== Done ==========`);
console.log(`Total updated: ${totalUpdated} files`);
