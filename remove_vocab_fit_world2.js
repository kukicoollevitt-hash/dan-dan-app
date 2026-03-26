const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world2_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'fit_world2_01': ['얕잡아 보다', '미천하다', '지그시 바라보다'],
  'fit_world2_04': ['연회(宴會)'],
  'fit_world2_05': ['비참하다', '부당하다', '억울하다'],
  'fit_world2_07': ['까다롭다', '메마르다', '무성하다'],
  'fit_world2_08': ['침착하다'],
  'fit_world2_09': ['경이롭다', '갈망하다'],
  'fit_world2_10': ['공정하다'],
  'fit_world2_11': ['목격하다'],
  'fit_world2_13': ['용감하다', '자유롭다', '거부하다', '존중하다'],
  'fit_world2_14': ['용감하다', '항해'],
  'fit_world2_17': ['온화하다'],
  'fit_world2_18': ['쓸쓸하다'],
  'fit_world2_20': ['치밀하다'],
  'fit_world2_27': ['구원'],
  'fit_world2_28': ['갈등'],
  'fit_world2_30': ['변신']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/fit_world2_content.js", content);
console.log("\nvocab 제거 완료!");
