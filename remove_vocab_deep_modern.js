const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_modern_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들 (vocabFill 미사용 또는 passage에 없음)
const removals = {
  'deep_modern_01': ['순박하다', '왁자지껄하다', '은은하다', '아른거리다', '쫓겨나다', '헛디디다', '허우적거리다', '머뭇거리다'],
  'deep_modern_02': ['수줍다', '여리다', '창백하다', '유일하다'],
  'deep_modern_03': ['해맑다', '야무지다', '앙큼하다', '얼얼하다', '통쾌하다'],
  'deep_modern_04': ['불길하다', '싸늘하다', '울부짖다'],
  'deep_modern_05': ['품을 팔다', '얄밉다', '두리번거리다', '발그레하다'],
  'deep_modern_06': ['재미나다', '보송보송하다', '날카롭다', '흐느끼다', '온화하다'],
  'deep_modern_07': ['순박하다', '성실하다', '헐벗다', '적나라하다'],
  'deep_modern_08': ['감돌다'],
  'deep_modern_11': ['얼굴이 곱다', '방탕하다', '쫓겨나다', '암울하다'],
  'deep_modern_12': ['기생하다', '방황하다'],
  'deep_modern_13': ['축내다', '대변하다'],
  'deep_modern_17': ['생각하지 않다'],
  'deep_modern_18': ['헤어지다'],
  'deep_modern_19': ['지치다', '사라지다']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_modern_content.js", content);
console.log("\nvocab 제거 완료!");
