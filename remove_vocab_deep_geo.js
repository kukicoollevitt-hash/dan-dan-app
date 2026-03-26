const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_geo_content.js", "utf8");

// vocab과 vocabFill에서 제거할 항목들
const removals = {
  'deep_geo_08': ['도농격차', '의료취약지', '교육불평등', '귀농귀촌', '농촌융복합산업', '정주여건'],
  'deep_geo_09': ['지역개발', '지역불균형', '수도권집중', '성장거점개발', '균형개발', '지역상생발전', '스마트시티', '공공기관이전', '자족도시', '삶의질'],
  'deep_geo_10': ['자원의가변성', '화석연료', '에너지안보', '지구온난화', '고갈성자원', '원자력에너지', '에너지믹스', '에너지전환'],
  'deep_geo_11': ['국제무역', '경제적불평등', '문화획일화', '문화제국주의', '전염효과', '로컬푸드', '지리적표시제', '장소마케팅', '다국적기업', '자유무역협정'],
  'deep_geo_12': ['시간거리', '비용거리', '정보화사회', '원격근무', '공간의압축', '교통결절점'],
  'deep_geo_13': ['열대기후', '사바나기후', '건조기후', '사막기후', '스텝기후', '온대기후', '지중해성기후', '냉대기후', '한대기후', '영구동토층']
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_geo_content.js", content);
console.log("\nvocab 제거 완료!");
