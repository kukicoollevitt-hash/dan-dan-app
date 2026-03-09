const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// 기존 320px 스타일 패턴 (여러 줄)
const oldCssPattern = /\.webtoon-dropdown \{\s*display: none;\s*position: absolute;\s*top: calc\(100% \+ 8px\);\s*right: 0;\s*width: 320px;[\s\S]*?\.webtoon-dropdown-body img \{[^}]+\}/;

// 브레인온 스타일 (600px)
const newCss = `.webtoon-dropdown { position: absolute; top: 100%; right: 0; width: 600px; max-height: 0; overflow: hidden; background: #fffbe6; border-radius: 0 0 16px 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); transition: max-height 0.4s ease, opacity 0.3s ease; opacity: 0; }
.webtoon-dropdown.active { max-height: 70vh; opacity: 1; border: 2px solid #e6b800; border-top: none; }
.webtoon-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fff8cc; border-bottom: 1px solid #e6b800; position: sticky; top: 0; z-index: 1; }
.webtoon-dropdown-header span { font-size: 14px; font-weight: 600; color: #6b5000; }
.webtoon-dropdown-close { background: rgba(0,0,0,0.1); border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 18px; color: #6b5000; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.webtoon-dropdown-close:hover { background: rgba(0,0,0,0.2); }
.webtoon-dropdown-body { max-height: calc(70vh - 50px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
.webtoon-dropdown-body img { display: block; width: 100%; height: auto; }
@media (max-width: 600px) { .webtoon-dropdown { width: 90vw; right: -10px; } }`;

// 이미지 경로 설정
const imageConfigs = [
  // science
  { prefix: 'deep_earth_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/지구과학${u.toString().padStart(2,'0')}/딥지구과학${i.toString().padStart(2,'0')}.jpg`, count: 10 },
  { prefix: 'deep_bio_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/생물${u.toString().padStart(2,'0')}/생물${u.toString().padStart(2,'0')}_${i.toString().padStart(2,'0')}.jpg`, count: 9 },
  { prefix: 'deep_chem_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/화학${u.toString().padStart(2,'0')}/화학${u.toString().padStart(2,'0')}_${i.toString().padStart(2,'0')}.jpg`, count: 8 },
  { prefix: 'deep_physics_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/물리${u.toString().padStart(2,'0')}/물리${u}_${i.toString().padStart(2,'0')}.jpg`, count: 9 },
  // social
  { prefix: 'deep_geo_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/지리${u.toString().padStart(2,'0')}/지리${u.toString().padStart(2,'0')}_${i.toString().padStart(2,'0')}.png`, count: 8 },
  { prefix: 'deep_pol_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/정치경제${u.toString().padStart(2,'0')}/정치경제${u.toString().padStart(2,'0')}_${i.toString().padStart(2,'0')}.png`, count: 8 },
  { prefix: 'deep_soc_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/사회문화${u.toString().padStart(2,'0')}/사회문화${u.toString().padStart(2,'0')}_${i.toString().padStart(2,'0')}.jpeg`, count: 8 },
  { prefix: 'deep_law_', maxUnit: 20, wrapAt20: false, genPath: (u, i, w) => `/images/웹툰/법${u.toString().padStart(2,'0')}/법${u.toString().padStart(2,'0')}_${i.toString().padStart(2,'0')}.png`, count: 8 },
  // korlit
  { prefix: 'deep_modern_', maxUnit: 40, wrapAt20: true, genPath: (u, i, w) => `/images/웹툰/현대문학${w.toString().padStart(2,'0')}/현대문학${w.toString().padStart(2,'0')}_${i.toString().padStart(2,'0')}.png`, count: 9 },
  { prefix: 'deep_classic_', maxUnit: 40, wrapAt20: true, genPath: (u, i, w) => `/images/웹툰/고전문학${w.toString().padStart(2,'0')}/고전문학_${i.toString().padStart(2,'0')}.jpg`, count: 9 },
  // person
  { prefix: 'deep_people1_', maxUnit: 40, wrapAt20: true, genPath: (u, i, w) => `/images/웹툰/한국인물${w.toString().padStart(2,'0')}/한국인물_${i.toString().padStart(2,'0')}.jpg`, count: 9 },
  { prefix: 'deep_people2_', maxUnit: 40, wrapAt20: true, genPath: (u, i, w) => `/images/웹툰/세계인물${w.toString().padStart(2,'0')}/세계인물_${i.toString().padStart(2,'0')}.jpg`, count: 9 },
  // worldlit
  { prefix: 'deep_world1_', maxUnit: 40, wrapAt20: true, genPath: (u, i, w) => `/images/웹툰/세계문학1_${w.toString().padStart(2,'0')}/세계문학1_${i.toString().padStart(2,'0')}.jpg`, count: 9 },
  { prefix: 'deep_world2_', maxUnit: 40, wrapAt20: true, genPath: (u, i, w) => `/images/웹툰/세계문학2_${w.toString().padStart(2,'0')}/세계문학2_${i.toString().padStart(2,'0')}.jpg`, count: 9 },
];

const folders = ['science', 'social', 'korlit', 'person', 'worldlit'];

let cssUpdated = 0;
let headerUpdated = 0;
let imageUpdated = 0;

for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.startsWith('deep_') && f.endsWith('.html') && !f.includes('backup') && !f.includes('old'));

  console.log(`\n📁 처리 중: ${folder} (${files.length}개 deep_ 파일)`);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. CSS 스타일 수정 (320px → 600px)
    if (content.includes('width: 320px') && oldCssPattern.test(content)) {
      content = content.replace(oldCssPattern, newCss);
      cssUpdated++;
      changed = true;
    }

    // 2. 헤더 수정 (h4 → span, webtoon-close-btn → webtoon-dropdown-close)
    if (content.includes('<h4>📖 웹툰 힌트</h4>')) {
      content = content.replace('<h4>📖 웹툰 힌트</h4>', '<span>📖 배경지식 쉽게 익히기</span>');
      headerUpdated++;
      changed = true;
    }
    if (content.includes('webtoon-close-btn')) {
      content = content.replace(/class="webtoon-close-btn"/g, 'class="webtoon-dropdown-close"');
      content = content.replace(/>✕<\/button>/g, '>&times;</button>');
      changed = true;
    }

    // 3. 이미지 경로 수정
    const config = imageConfigs.find(c => file.startsWith(c.prefix));
    if (config && content.includes('webtoon-dropdown-body')) {
      const unitMatch = file.match(/_(\d+)\.html$/);
      if (unitMatch) {
        const unit = parseInt(unitMatch[1]);
        const webtoonUnit = config.wrapAt20 && unit > 20 ? unit - 20 : unit;

        let imgTags = [];
        for (let i = 1; i <= config.count; i++) {
          const imgPath = config.genPath(unit, i, webtoonUnit);
          imgTags.push(`                <img data-src="${imgPath}" alt="웹툰 힌트 ${i}">`);
        }

        const newBody = `<div class="webtoon-dropdown-body" id="webtoonBody">\n${imgTags.join('\n')}\n              </div>`;
        const oldBodyPattern = /<div class="webtoon-dropdown-body" id="webtoonBody">[\s\S]*?<\/div>/;

        if (oldBodyPattern.test(content)) {
          const newContent = content.replace(oldBodyPattern, newBody);
          if (newContent !== content) {
            content = newContent;
            imageUpdated++;
            changed = true;
          }
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ ${file}`);
    }
  }
}

console.log(`\n✅ 완료!`);
console.log(`   CSS 수정: ${cssUpdated}개`);
console.log(`   헤더 수정: ${headerUpdated}개`);
console.log(`   이미지 경로 수정: ${imageUpdated}개`);
