const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_pol_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'deep_pol_08': ['완전경쟁시장', '가격수용자', '독점시장', '가격설정자', '자연독점', '과점시장', '독점적경쟁시장', '제품차별화', '진입장벽', '규모의경제', '시장지배력', '소비자후생', '시장구조'],
  'deep_pol_09': ['시장실패', '외부효과', '부정적외부효과', '긍정적외부효과', '정보의비대칭성', '도덕적해이', '정부실패'],
  'deep_pol_10': ['이중계산', '1인당GDP', '경제성장', '경제성장률', '기술혁신', '소득불평등', '지속가능한발전', '행복지수', '생활수준', '최종재'],
  'deep_pol_11': ['수요견인인플레이션', '비용인상인플레이션', '화폐의구매력', '실질소득', '통화정책', '물가상승률'],
  'deep_pol_12': ['경제활동인구', '마찰적실업', '구조적실업', '경기적실업', '자연실업률', '청년실업', '실업급여', '취업률', '완전고용'],
  'deep_pol_15': ['원화 강세', '원화 약세'],
  'deep_pol_17': ['예금'],
  'deep_pol_19': ['효율성']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_pol_content.js", content);
console.log("\nvocab 제거 완료!");
