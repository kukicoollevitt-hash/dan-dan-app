const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

// 기존 320px 스타일 (여러 줄)
const oldCssPattern = /\.webtoon-dropdown \{\s*display: none;\s*position: absolute;\s*top: calc\(100% \+ 8px\);\s*right: 0;\s*width: 320px;[\s\S]*?\.webtoon-dropdown-body img \{[^}]+\}/;

// 브레인온 스타일 (600px, 한 줄)
const newCss = `.webtoon-dropdown { position: absolute; top: 100%; right: 0; width: 600px; max-height: 0; overflow: hidden; background: #fffbe6; border-radius: 0 0 16px 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); transition: max-height 0.4s ease, opacity 0.3s ease; opacity: 0; }
.webtoon-dropdown.active { max-height: 70vh; opacity: 1; border: 2px solid #e6b800; border-top: none; }
.webtoon-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fff8cc; border-bottom: 1px solid #e6b800; position: sticky; top: 0; z-index: 1; }
.webtoon-dropdown-header span { font-size: 14px; font-weight: 600; color: #6b5000; }
.webtoon-dropdown-close { background: rgba(0,0,0,0.1); border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 18px; color: #6b5000; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.webtoon-dropdown-close:hover { background: rgba(0,0,0,0.2); }
.webtoon-dropdown-body { max-height: calc(70vh - 50px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
.webtoon-dropdown-body img { display: block; width: 100%; height: auto; }
@media (max-width: 600px) { .webtoon-dropdown { width: 90vw; right: -10px; } }`;

const folders = ['science', 'social', 'korlit', 'person', 'worldlit'];

let totalUpdated = 0;

for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.startsWith('fit_') && f.endsWith('.html'));

  console.log(`\n📁 처리 중: ${folder} (${files.length}개 fit_ 파일)`);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 320px 스타일이 있는지 확인
    if (content.includes('width: 320px') && content.includes('.webtoon-dropdown')) {
      // 기존 CSS 블록 교체
      if (oldCssPattern.test(content)) {
        content = content.replace(oldCssPattern, newCss);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`   ✅ ${file}`);
        totalUpdated++;
      } else {
        console.log(`   ⚠️ ${file} (패턴 불일치)`);
      }
    }
  }
}

console.log(`\n✅ 완료! CSS 스타일 수정: ${totalUpdated}개`);
