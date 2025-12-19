const fs = require('fs');
const path = require('path');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP';

// 폴더와 과목 매핑
const folders = {
  science: ['bio', 'earth', 'physics', 'chem'],
  social: ['soc', 'geo', 'law', 'pol'],
  korlit: ['modern', 'classic'],
  worldlit: ['world1', 'world2'],
  person: ['people1', 'people2']
};

let totalProcessed = 0;

for (const [folder, subjects] of Object.entries(folders)) {
  for (const subject of subjects) {
    const srcFile = path.join(baseDir, folder, `${subject}_content.js`);
    const destFile = path.join(baseDir, folder, `on_${subject}_content.js`);

    if (!fs.existsSync(srcFile)) {
      console.log(`SKIP (원본 없음): ${srcFile}`);
      continue;
    }

    let content = fs.readFileSync(srcFile, 'utf8');

    // 1. 단원 인식 부분 수정 (on_ prefix)
    // CUR_UNIT 체크 부분
    content = content.replace(
      new RegExp(`window\\.CUR_UNIT\\.startsWith\\('${subject}_'\\)`, 'g'),
      `window.CUR_UNIT.startsWith('on_${subject}_')`
    );

    // console.log 부분
    content = content.replace(
      new RegExp(`\\[${subject}_content\\.js\\]`, 'g'),
      `[on_${subject}_content.js]`
    );

    // URL 파라미터 파싱
    content = content.replace(
      new RegExp(`${subject}\\[_-\\]\\?\\(\\\\d\\{1,2\\}\\)`, 'g'),
      `on_${subject}[_-]?(\\d{1,2})`
    );

    // 단원키 생성
    content = content.replace(
      new RegExp(`\`${subject}_\\$\\{`, 'g'),
      `\`on_${subject}_\${`
    );

    // 기본값
    content = content.replace(
      new RegExp(`'${subject}_01'`, 'g'),
      `'on_${subject}_01'`
    );

    // 2. CONTENTS 객체 내 단원키 변경 (bio_01 → on_bio_01 등)
    // 20단원까지 (science, social)
    for (let i = 1; i <= 40; i++) {
      const num = i.toString().padStart(2, '0');
      // 객체 키 변경
      content = content.replace(
        new RegExp(`^(\\s*)${subject}_${num}:`, 'gm'),
        `$1on_${subject}_${num}:`
      );
      // 주석 내 단원명
      content = content.replace(
        new RegExp(`===== ${subject}_${num}`, 'g'),
        `===== on_${subject}_${num}`
      );
    }

    fs.writeFileSync(destFile, content);
    console.log(`✅ 복사 완료: ${folder}/${subject}_content.js → on_${subject}_content.js`);
    totalProcessed++;
  }
}

console.log(`\n========== 완료 ==========`);
console.log(`총 ${totalProcessed}개 파일 처리됨`);
