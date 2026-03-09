const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

// 손상된 코드 패턴
const brokenPattern = /\/\* =+ \(임시 alert 버전 openRemedial 삭제\) =+ \*\/[\s\S]*?\/\/ =+ 보완학습 문제 뱅크 \(객관식 2문제씩\) =+[\s\S]*?\);[\s]*passage\.normalize\(\);[\s]*\}/g;

// 올바른 clearEvidenceHighlights 함수
const correctCode = `function clearEvidenceHighlights() {
  const passage = document.querySelector('.passage-text');
  if (!passage) return;
  const highlights = passage.querySelectorAll('.evidence-highlight');
  highlights.forEach(h => {
    const text = h.textContent.replace(/[0-9]번$/,'');
    h.replaceWith(document.createTextNode(text));
  });
  passage.normalize();
}`;

let fixedCount = 0;

for (let i = 1; i <= 40; i++) {
  const unit = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people2_${unit}.html`);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  if (html.match(brokenPattern)) {
    html = html.replace(brokenPattern, correctCode);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ 구문 오류 수정: on_people2_${unit}.html`);
    fixedCount++;
  } else {
    // 다른 패턴 확인
    if (html.includes('임시 alert 버전 openRemedial 삭제')) {
      console.log(`⚠️ 다른 패턴 발견: on_people2_${unit}.html - 수동 확인 필요`);
    }
  }
}

console.log(`\n🎉 완료! 총 ${fixedCount}개 파일 수정됨`);
