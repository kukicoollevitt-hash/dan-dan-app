const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_classic_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들 (vocabFill 미사용 또는 passage에 없음)
const removals = {
  'deep_classic_03': ['귀하다', '영특하다'],
  'deep_classic_05': ['기이하다', '비범하다'],
  'deep_classic_07': ['헤아리다'],
  'deep_classic_08': ['꾀다'],
  'deep_classic_10': ['성실'],
  'deep_classic_14': ['사모하다', '절절하다', '옹호하다'],
  'deep_classic_16': ['덧없다', '꾸짖다'],
  'deep_classic_17': ['쫓겨나다'],
  'deep_classic_18': ['뉘우치다'],
  'deep_classic_21': ['점잖다'],
  'deep_classic_22': ['꾸짖다'],
  'deep_classic_23': ['뉘우치다'],
  'deep_classic_25': ['간악하다', '흠모하다'],
  'deep_classic_27': ['강인하다', '험난하다'],
  'deep_classic_28': ['결연하다'],
  'deep_classic_29': ['어수룩하다', '엉뚱하다', '순박하다'],
  'deep_classic_32': ['가르치다'],
  'deep_classic_33': ['무찌르다'],
  'deep_classic_34': ['뉘우치다'],
  'deep_classic_36': ['정통하다', '미천하다'],
  'deep_classic_37': ['의지하다'],
  'deep_classic_38': ['비천하다'],
  'deep_classic_39': ['신비롭다', '그리워하다']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/deep_classic_content.js", content);
console.log("\nvocab 제거 완료!");
