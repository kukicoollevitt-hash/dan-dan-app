const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world2_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들 (unit별)
const removals = {
  'world2_02': ['은신처', '독립 선언', '위험 인물'],
  'world2_03': ['환대'],
  'world2_04': ['연회(宴會)'],
  'world2_05': ['비참하다', '부당하다'],
  'world2_07': ['까다롭다', '메마르다'],
  'world2_08': ['침착하다'],
  'world2_09': ['경이롭다', '갈망하다'],
  'world2_10': ['공정하다'],
  'world2_11': ['목격하다'],
  'world2_13': ['용감하다', '자유롭다', '거부하다', '존중하다'],
  'world2_14': ['용감하다'],
  'world2_17': ['온화하다'],
  'world2_18': ['쓸쓸하다'],
  'world2_28': ['불륜']
};

Object.entries(removals).forEach(([unit, words]) => {
  words.forEach(word => {
    // vocab 배열에서 제거: ['word', 'definition'],
    const vocabRegex = new RegExp(`\\s*\\['${word.replace(/[()]/g, '\\$&')}',\\s*'[^']*'\\],?\\n?`, 'g');
    const before = content;
    content = content.replace(vocabRegex, '');
    if (before !== content) {
      console.log(`vocab 제거: ${unit} - ${word}`);
    }

    // vocabFill에서 제거: { no: N, text: '...', answer: 'word', ... },
    // answer가 word인 항목 전체 제거
    const vocabFillRegex = new RegExp(`\\s*\\{\\s*no:\\s*\\d+,\\s*text:\\s*'[^']*',\\s*answer:\\s*'${word.replace(/[()]/g, '\\$&')}'[^}]*\\},?\\n?`, 'g');
    const before2 = content;
    content = content.replace(vocabFillRegex, '');
    if (before2 !== content) {
      console.log(`vocabFill 제거: ${unit} - ${word}`);
    }
  });
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world2_content.js", content);
console.log("\n완료!");
