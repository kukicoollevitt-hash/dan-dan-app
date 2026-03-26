const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world1_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_world1_01': ['고백하다'],
  'fit_world1_02': ['표류'],
  'fit_world1_03': ['간절함', '고귀하다', '황홀함', '용감하다'],
  'fit_world1_04': ['시험(試驗)', '사제(司祭)'],
  'fit_world1_05': ['길들이다', '유일하다', '외롭다'],
  'fit_world1_06': ['수상하다'],
  'fit_world1_28': ['피리 부는 사나이'],
  'fit_world1_29': ['장화 신은 고양이'],
  'fit_world1_31': ['구출']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world1_content.js", content);
console.log("\nvocab 제거 완료!");
