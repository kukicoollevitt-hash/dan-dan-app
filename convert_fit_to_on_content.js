const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP';

// content.js 파일 목록
const contentFiles = [
  { folder: 'science', files: ['on_bio_content.js', 'on_earth_content.js', 'on_physics_content.js', 'on_chem_content.js'] },
  { folder: 'social', files: ['on_soc_content.js', 'on_geo_content.js', 'on_law_content.js', 'on_pol_content.js'] },
  { folder: 'korlit', files: ['on_modern_content.js', 'on_classic_content.js'] },
  { folder: 'worldlit', files: ['on_world1_content.js', 'on_world2_content.js'] },
  { folder: 'person', files: ['on_people1_content.js', 'on_people2_content.js'] }
];

let totalUpdated = 0;

for (const { folder, files } of contentFiles) {
  for (const filename of files) {
    const filePath = path.join(baseDir, folder, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`SKIP (not found): ${folder}/${filename}`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. fit_ → on_ 치환 (단원 키)
    content = content.replace(/fit_bio_/g, 'on_bio_');
    content = content.replace(/fit_earth_/g, 'on_earth_');
    content = content.replace(/fit_physics_/g, 'on_physics_');
    content = content.replace(/fit_chem_/g, 'on_chem_');
    content = content.replace(/fit_soc_/g, 'on_soc_');
    content = content.replace(/fit_geo_/g, 'on_geo_');
    content = content.replace(/fit_law_/g, 'on_law_');
    content = content.replace(/fit_pol_/g, 'on_pol_');
    content = content.replace(/fit_modern_/g, 'on_modern_');
    content = content.replace(/fit_classic_/g, 'on_classic_');
    content = content.replace(/fit_world1_/g, 'on_world1_');
    content = content.replace(/fit_world2_/g, 'on_world2_');
    content = content.replace(/fit_people1_/g, 'on_people1_');
    content = content.replace(/fit_people2_/g, 'on_people2_');

    // 2. 변수명 치환 (FIT_BIO_CONTENT → ON_BIO_CONTENT 등)
    content = content.replace(/FIT_BIO_CONTENT/g, 'ON_BIO_CONTENT');
    content = content.replace(/FIT_EARTH_CONTENT/g, 'ON_EARTH_CONTENT');
    content = content.replace(/FIT_PHYSICS_CONTENT/g, 'ON_PHYSICS_CONTENT');
    content = content.replace(/FIT_CHEM_CONTENT/g, 'ON_CHEM_CONTENT');
    content = content.replace(/FIT_SOC_CONTENT/g, 'ON_SOC_CONTENT');
    content = content.replace(/FIT_GEO_CONTENT/g, 'ON_GEO_CONTENT');
    content = content.replace(/FIT_LAW_CONTENT/g, 'ON_LAW_CONTENT');
    content = content.replace(/FIT_POL_CONTENT/g, 'ON_POL_CONTENT');
    content = content.replace(/FIT_MODERN_CONTENT/g, 'ON_MODERN_CONTENT');
    content = content.replace(/FIT_CLASSIC_CONTENT/g, 'ON_CLASSIC_CONTENT');
    content = content.replace(/FIT_WORLD1_CONTENT/g, 'ON_WORLD1_CONTENT');
    content = content.replace(/FIT_WORLD2_CONTENT/g, 'ON_WORLD2_CONTENT');
    content = content.replace(/FIT_PEOPLE1_CONTENT/g, 'ON_PEOPLE1_CONTENT');
    content = content.replace(/FIT_PEOPLE2_CONTENT/g, 'ON_PEOPLE2_CONTENT');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalUpdated++;
      console.log(`Updated: ${folder}/${filename}`);
    } else {
      console.log(`No changes: ${folder}/${filename}`);
    }
  }
}

console.log(`\n========== Done ==========`);
console.log(`Total updated: ${totalUpdated} files`);
