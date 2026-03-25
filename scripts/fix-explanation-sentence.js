const fs = require('fs');
const path = require('path');

// 한글 받침 확인 함수
function hasFinalConsonant(char) {
  if (!char) return false;
  const code = char.charCodeAt(0);
  // 한글 유니코드 범위: 가(44032) ~ 힣(55203)
  if (code < 44032 || code > 55203) return false;
  // 받침 있으면 (code - 44032) % 28 !== 0
  return (code - 44032) % 28 !== 0;
}

// 조사 선택 함수
function getJosa(word, type) {
  // 마지막 글자 (괄호, 영문 등 제외)
  const lastChar = word.replace(/[^가-힣]/g, '').slice(-1);
  const hasBatchim = hasFinalConsonant(lastChar);

  switch(type) {
    case '은는': return hasBatchim ? '은' : '는';
    case '을를': return hasBatchim ? '을' : '를';
    case '이가': return hasBatchim ? '이' : '가';
    default: return '';
  }
}

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

let updatedCount = 0;

// 라인별로 처리
const lines = vocabData.split('\n');
let currentWord = '';
let currentMeaning = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // word 추출
  const wordMatch = line.match(/"word":\s*"([^"]+)"/);
  if (wordMatch) {
    currentWord = wordMatch[1];
  }

  // meaning 추출
  const meaningMatch = line.match(/"meaning":\s*"([^"]+)"/);
  if (meaningMatch) {
    currentMeaning = meaningMatch[1];
  }

  // explanation 수정
  const explainMatch = line.match(/"explanation":\s*"([^"]*)"/);
  if (explainMatch && currentWord && currentMeaning) {
    // 단어와 의미에 맞는 조사 계산
    const josa1 = getJosa(currentWord, '은는');
    const josa2 = getJosa(currentMeaning, '을를');

    // 새로운 explanation 생성
    const newExplanation = `\\"${currentWord}\\"${josa1} ${currentMeaning}${josa2} 의미합니다.`;

    // 라인 전체를 새로 구성
    lines[i] = `    "explanation": "${newExplanation}",`;
    updatedCount++;
  }
}

console.log(`explanation 업데이트: ${updatedCount}개`);

// 샘플 출력
console.log('\n샘플 확인:');
const samples = [
  { word: '생물', meaning: '스스로 양분을 얻고 번식하며 살아가는 존재' },
  { word: '광합성', meaning: '식물이 햇빛으로 양분을 만드는 과정' },
  { word: '중력', meaning: '지구가 물체를 중심으로 끌어당기는 힘' },
  { word: '인공지능', meaning: '사람처럼 생각하고 판단하는 컴퓨터 기술' },
];

samples.forEach(({ word, meaning }) => {
  const josa1 = getJosa(word, '은는');
  const josa2 = getJosa(meaning, '을를');
  console.log(`  "${word}"${josa1} ${meaning}${josa2} 의미합니다.`);
});

// 파일 저장
fs.writeFileSync(vocabDataPath, lines.join('\n'), 'utf-8');
console.log('\n파일 저장 완료');
