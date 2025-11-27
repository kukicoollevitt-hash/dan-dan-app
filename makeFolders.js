// makeFolders.js
const fs = require('fs');
const path = require('path');

// 📂 기준 경로: public 폴더
const BASE = path.join(__dirname, 'public');

// 폴더 구조 정의
const structure = {
  BRAINM: {
    nonfiction: ['naesin', 'suneung'],         // 비문학: 내신교과 / 수능모고
    modernlit: ['poem', 'novel', 'etc'],       // 현대문학: 시 / 소설 / 극·수필·희곡
    classiclit: ['gosi', 'gonovel', 'goessay'],// 고전문학: 시가 / 소설 / 수필
    grammar: ['modern', 'middle']              // 문법: 현대 / 중세
  },
  BRAINH: {
    nonfiction: ['naesin', 'suneung'],
    modernlit: ['poem', 'novel', 'etc'],
    classiclit: ['gosi', 'gonovel', 'goessay'],
    grammar: ['modern', 'middle']
  }
};

// 📁 폴더 생성 함수
function makeDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    console.log('📁 생성됨:', p);
  }
}

// 메인 실행
for (const [series, fields] of Object.entries(structure)) {
  const seriesPath = path.join(BASE, series);
  makeDir(seriesPath);

  for (const [field, subjects] of Object.entries(fields)) {
    for (const sub of subjects) {
      const fullPath = path.join(seriesPath, field, sub);
      makeDir(fullPath);
    }
  }
}

console.log('\n✅ 모든 폴더가 성공적으로 생성되었습니다!');
