const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP';

const folders = ['science', 'social', 'korlit', 'worldlit', 'person'];

let totalUpdated = 0;

for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  if (!fs.existsSync(folderPath)) continue;

  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.html') && !f.startsWith('on_'));

  console.log(`\n📁 처리 중: ${folder} (${files.length}개 파일)`);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 기존 브레인업 스타일 (한 줄)
    const oldCss = `.webtoon-dropdown { display: none; position: absolute; top: calc(100% + 8px); right: 0; width: 340px; max-height: 70vh; background: #fffef5; border-radius: 16px; border: 2px solid #e6b800; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); overflow: hidden; }
.webtoon-dropdown.active { display: block; animation: dropdownSlide 0.25s ease; }
@keyframes dropdownSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.webtoon-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: linear-gradient(135deg, #FFF9E0 0%, #FFF3C4 100%); border-bottom: 1px solid #e6b800; }
.webtoon-dropdown-header span { font-size: 14px; font-weight: 700; color: #6b5000; }
.webtoon-dropdown-close { background: none; border: none; font-size: 20px; color: #6b5000; cursor: pointer; padding: 0 5px; line-height: 1; }
.webtoon-dropdown-close:hover { color: #ff6b6b; }
.webtoon-dropdown-body { padding: 15px; overflow-y: auto; max-height: calc(70vh - 50px); }
.webtoon-dropdown-body img { width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.webtoon-dropdown-body img:last-child { margin-bottom: 0; }`;

    // 브레인온 스타일로 교체
    const newCss = `.webtoon-dropdown { position: absolute; top: 100%; right: 0; width: 600px; max-height: 0; overflow: hidden; background: #fffbe6; border-radius: 0 0 16px 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); transition: max-height 0.4s ease, opacity 0.3s ease; opacity: 0; }
.webtoon-dropdown.active { max-height: 70vh; opacity: 1; border: 2px solid #e6b800; border-top: none; }
.webtoon-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fff8cc; border-bottom: 1px solid #e6b800; position: sticky; top: 0; z-index: 1; }
.webtoon-dropdown-header span { font-size: 14px; font-weight: 600; color: #6b5000; }
.webtoon-dropdown-close { background: rgba(0,0,0,0.1); border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 18px; color: #6b5000; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.webtoon-dropdown-close:hover { background: rgba(0,0,0,0.2); }
.webtoon-dropdown-body { max-height: calc(70vh - 50px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
.webtoon-dropdown-body img { display: block; width: 100%; height: auto; }
@media (max-width: 600px) { .webtoon-dropdown { width: 90vw; right: -10px; } }`;

    if (content.includes('width: 340px')) {
      content = content.replace(oldCss, newCss);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ ${file}`);
      totalUpdated++;
    }
  }
}

console.log(`\n✅ 완료! 업데이트: ${totalUpdated}개`);
