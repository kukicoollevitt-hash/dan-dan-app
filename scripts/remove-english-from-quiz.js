const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 모든 시즌 퀴즈 파일들에서 영어 병기 제거
const quizFiles = glob.sync('/Users/dandan/Desktop/brainmoon_academy0325/public/creative-book/*_season1_quiz.html');

let totalChanges = 0;

// question 라인에서 영어 병기 제거하는 함수
function removeEnglishFromQuestion(question) {
  // 한글(영어) 패턴 제거 - 괄호 안이 영어로만 이루어진 경우
  let newQuestion = question.replace(/([가-힣]+)\(([a-zA-Z][a-zA-Z0-9\s\-_:]+)\)/g, '$1');

  // '한글'(영어) 패턴 제거
  newQuestion = newQuestion.replace(/'([가-힣]+)'\(([a-zA-Z][a-zA-Z0-9\s\-_:]+)\)/g, "'$1'");

  // 띄어쓰기 후 (영어) 패턴 제거 - 예: "생태적 지위(ecological niche)"
  newQuestion = newQuestion.replace(/([가-힣]+)\s*\(([a-zA-Z][a-zA-Z0-9\s\-_:]+)\)/g, '$1');

  return newQuestion;
}

quizFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;

  // 모든 question 라인에서 영어 병기 제거 (시즌 구분 없이)
  content = content.replace(/question:\s*"([^"]+)"/g, (match, question) => {
    const newQuestion = removeEnglishFromQuestion(question);
    if (newQuestion !== question) {
      return `question: "${newQuestion}"`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    // 변경된 영어 병기 개수 계산
    const originalMatches = (originalContent.match(/question:.*\([a-zA-Z][a-zA-Z0-9\s\-_:]+\)/g) || []).length;
    const newMatches = (content.match(/question:.*\([a-zA-Z][a-zA-Z0-9\s\-_:]+\)/g) || []).length;
    const changes = originalMatches - newMatches;
    if (changes > 0) {
      console.log(`${path.basename(file)}: ${changes}개 영어 병기 제거`);
      totalChanges += changes;
    }
  }
});

console.log(`\n총 ${totalChanges}개 영어 병기 제거 완료`);
