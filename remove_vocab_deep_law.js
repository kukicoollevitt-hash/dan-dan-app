const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_law_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'deep_law_01': ['법 앞의 평등'],
  'deep_law_05': ['보통선거', '평등선거', '직접선거', '비밀선거', '정강정책', '선거운동', '선거관리위원회'],
  'deep_law_06': ['사적자치의원칙', '소유권절대의원칙', '과실책임의원칙', '권리능력평등의원칙'],
  'deep_law_07': ['계약자유의원칙', '채무불이행', '이행지체', '청약철회권', '신의성실의원칙'],
  'deep_law_09': ['협의이혼', '재판이혼', '재산분할', '친자관계', '부양의무'],
  'deep_law_11': ['적극적손해', '소극적손해'],
  'deep_law_12': ['무죄추정의원칙'],
  'deep_law_13': ['대안적분쟁해결'],
  'deep_law_15': ['경제제재'],
  'deep_law_16': ['8대소비자권리']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_law_content.js", content);
console.log("\nvocab 제거 완료!");
