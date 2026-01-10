const fs = require('fs');
const path = require('path');

// law_01~10 파일에서 REMEDIAL_BANK를 learning-common.js 로드 전으로 이동

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `law_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. 기존 window.REMEDIAL_BANK 블록 찾기 (script 태그 포함)
  const remedialMatch = content.match(/<!-- ✅ 보완학습 데이터 -->\s*<script>\s*window\.REMEDIAL_BANK = \{[\s\S]*?\};\s*<\/script>/);

  if (!remedialMatch) {
    // 다른 패턴 시도 - 인라인 스크립트 내부에 있는 경우
    const inlineMatch = content.match(/\/\/ ===== 보완학습 문제 뱅크[\s\S]*?window\.REMEDIAL_BANK = \{[\s\S]*?\};/);

    if (inlineMatch) {
      console.log(`[INFO] law_${num} - 인라인 스크립트 내 REMEDIAL_BANK 발견, 별도 처리 필요`);

      // REMEDIAL_BANK 데이터 추출
      const dataMatch = content.match(/window\.REMEDIAL_BANK = (\{[\s\S]*?\});[\s\n]*(?:\/\/|function|let|const|var|\})/);

      if (dataMatch) {
        // learning-common.js 로드 전에 삽입할 스크립트
        const newScript = `<!-- ✅ 보완학습 데이터 (learning-common.js 로드 전에 정의) -->
<script>
window.REMEDIAL_BANK = ${dataMatch[1]};
</script>

`;

        // learning-common.js 로드 라인 찾기
        const commonJsPattern = /<script src="\/assets\/js\/learning-common\.js[^"]*"><\/script>/;

        if (commonJsPattern.test(content)) {
          // learning-common.js 로드 전에 삽입
          content = content.replace(commonJsPattern, (match) => newScript + match);

          // 기존 인라인 REMEDIAL_BANK 제거 (주석과 데이터)
          content = content.replace(/\/\/ ===== 보완학습 문제 뱅크 \(객관식 2문제씩\) =====\s*window\.REMEDIAL_BANK = \{[\s\S]*?\};[\s\n]*/, '');

          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`[OK] law_${num} REMEDIAL_BANK를 learning-common.js 로드 전으로 이동`);
        }
      }
    } else {
      console.log(`[SKIP] law_${num} - REMEDIAL_BANK 없음`);
    }
    continue;
  }

  const remedialBlock = remedialMatch[0];

  // 2. 기존 위치에서 제거
  content = content.replace(remedialBlock, '');

  // 3. learning-common.js 로드 전에 삽입
  const commonJsPattern = /<script src="\/assets\/js\/learning-common\.js[^"]*"><\/script>/;

  if (commonJsPattern.test(content)) {
    content = content.replace(commonJsPattern, (match) => remedialBlock + '\n\n' + match);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] law_${num} REMEDIAL_BANK를 learning-common.js 로드 전으로 이동`);
  } else {
    console.log(`[SKIP] law_${num} - learning-common.js 로드 라인 없음`);
  }
}

console.log('\n✅ law_01~10 REMEDIAL_BANK 위치 수정 완료!');
