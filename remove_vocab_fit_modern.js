const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_modern_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_modern_01': ['은은하다', '헛디디다', '쫓겨나다', '머뭇거리다'],
  'fit_modern_02': ['창백하다'],
  'fit_modern_03': ['분노', '대항'],
  'fit_modern_04': ['싸늘하다', '울부짖다'],
  'fit_modern_06': ['흐느끼다'],
  'fit_modern_07': ['순박하다'],
  'fit_modern_11': ['얼굴이 곱다', '방탕하다', '쫓겨나다'],
  'fit_modern_12': ['기생하다', '방황하다'],
  'fit_modern_13': ['축내다'],
  'fit_modern_17': ['생각하지 않다'],
  'fit_modern_18': ['헤어지다'],
  'fit_modern_19': ['지치다', '사라지다']
};

Object.entries(removals).forEach(([unit, words]) => {
  words.forEach(word => {
    // vocab 배열에서 제거
    const escapedWord = word.replace(/[()]/g, '\\$&');
    const vocabRegex = new RegExp(`\\s*\\['${escapedWord}',\\s*'[^']*'\\],?\\n?`, 'g');
    const before = content;
    content = content.replace(vocabRegex, '');
    if (before !== content) {
      console.log(`vocab 제거: ${unit} - ${word}`);
    }

    // vocabFill에서 제거
    const vocabFillRegex = new RegExp(`\\s*\\{\\s*no:\\s*\\d+,\\s*text:\\s*'[^']*',\\s*answer:\\s*'${escapedWord}'[^}]*\\},?\\n?`, 'g');
    const before2 = content;
    content = content.replace(vocabFillRegex, '');
    if (before2 !== content) {
      console.log(`vocabFill 제거: ${unit} - ${word}`);
    }
  });
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/fit_modern_content.js", content);
console.log("\nvocab 제거 완료!");
