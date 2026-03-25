const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

// explanation을 meaning 기반으로 수정
// 패턴: "meaning": "실제 의미" ... "explanation": "기존 설명"
// -> "explanation": "\"단어\"은(는) 실제 의미을(를) 의미합니다."

let updatedCount = 0;

// 각 항목을 찾아서 수정
const itemRegex = /\{\s*"word":\s*"([^"]+)"[^}]*"meaning":\s*"([^"]+)"[^}]*"explanation":\s*"([^"]+)"/g;

vocabData = vocabData.replace(itemRegex, (match, word, meaning, explanation) => {
  // meaning이 단순 띄어쓰기가 아니고, explanation이 단순 띄어쓰기 형태인 경우
  const wordNoSpace = word.replace(/\s+/g, '');
  const meaningNoSpace = meaning.replace(/\s+/g, '');
  
  // explanation에서 현재 의미 추출
  const explainMatch = explanation.match(/은\(는\)\s*([^을]+)을\(를\)/);
  if (explainMatch) {
    const currentExplainMeaning = explainMatch[1].trim();
    const currentExplainNoSpace = currentExplainMeaning.replace(/\s+/g, '');
    
    // explanation의 의미가 단순 띄어쓰기이고, meaning은 아닌 경우 업데이트
    if (currentExplainNoSpace === wordNoSpace && meaningNoSpace !== wordNoSpace) {
      updatedCount++;
      const newExplanation = `\\"${word}\\"은(는) ${meaning}을(를) 의미합니다.`;
      return match.replace(`"explanation": "${explanation}"`, `"explanation": "${newExplanation}"`);
    }
  }
  
  return match;
});

console.log(`explanation 업데이트: ${updatedCount}개`);

fs.writeFileSync(vocabDataPath, vocabData, 'utf-8');
console.log('파일 저장 완료');
