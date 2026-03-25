const fs = require('fs');
const path = require('path');

// 영어 괄호 표기 패턴 삭제
// 예: "천부인권(Natural Rights)" → "천부인권"
// 예: "시민적 각성(Civic Awakening)" → "시민적 각성"
function removeEnglishTerms(content) {
  // 패턴 1: 한글(영어) - 괄호 안에 영어만 있는 경우
  // [A-Za-z\s\-'.,&/]+ 로 영어 단어와 공백, 하이픈, 아포스트로피 등을 매칭
  let result = content.replace(/\(([A-Za-z][A-Za-z\s\-'.,&\/]+[A-Za-z])\)/g, '');

  // 패턴 2: 한글(영어, 영어) - 쉼표로 구분된 여러 영어 용어
  result = result.replace(/\(([A-Za-z][A-Za-z\s\-'.,&\/;]+)\)/g, (match, inner) => {
    // 영어만 있는지 확인 (한자나 한글이 없는 경우)
    if (!/[\u4e00-\u9fff\uac00-\ud7af]/.test(inner)) {
      return '';
    }
    return match;
  });

  // 패턴 3: span 태그 안의 영어 괄호 표기
  result = result.replace(/<span class="highlight">([^<]+)\(([A-Za-z][A-Za-z\s\-'.,&\/]+)\)<\/span>/g,
    '<span class="highlight">$1</span>');

  // 영어 약어만 있는 경우도 삭제: (NGO), (AI), (UN) 등
  result = result.replace(/\(([A-Z]{2,})\)/g, '');

  // 영어 약어와 설명: (LLM, Large Language Model) 패턴
  result = result.replace(/\(([A-Z]{2,}),?\s*[A-Za-z\s\-'.,]+\)/g, '');

  // 연속된 공백 정리
  result = result.replace(/  +/g, ' ');

  return result;
}

// 처리할 파일 목록
const lawFiles = [];
const physicsFiles = [];

const creativeBookDir = '/Users/dandan/Desktop/brainmoon_academy0325/public/creative-book';

// law 파일 목록 생성
for (let i = 1; i <= 6; i++) {
  const num = String(i).padStart(2, '0');
  lawFiles.push(`law${num}_season1_34.html`);
}

// physics 파일 목록 생성
for (let i = 1; i <= 20; i++) {
  const num = String(i).padStart(2, '0');
  physicsFiles.push(`physics${num}_season1_34.html`);
}

const allFiles = [...lawFiles, ...physicsFiles];

let processedCount = 0;
let errorCount = 0;

for (const fileName of allFiles) {
  const filePath = path.join(creativeBookDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`파일 없음: ${fileName}`);
    continue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = removeEnglishTerms(content);

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`수정됨: ${fileName}`);
      processedCount++;
    } else {
      console.log(`변경 없음: ${fileName}`);
    }
  } catch (err) {
    console.error(`오류: ${fileName} - ${err.message}`);
    errorCount++;
  }
}

console.log(`\n완료: ${processedCount}개 파일 수정, ${errorCount}개 오류`);
