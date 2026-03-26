const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_chem_content.js", "utf8");

// fit_chem_14에서 반비례 vocab/vocabFill 제거
const vocabRegex = /\s*\['반비례',\s*'[^']*'\],?\n?/g;
let before = content;
content = content.replace(vocabRegex, '');
if (before !== content) {
  console.log(`vocab 제거: fit_chem_14 - 반비례`);
}

const vocabFillRegex = /\s*\{\s*no:\s*\d+,\s*text:\s*'[^']*',\s*answer:\s*'반비례'[^}]*\},?\n?/g;
before = content;
content = content.replace(vocabFillRegex, '');
if (before !== content) {
  console.log(`vocabFill 제거: fit_chem_14 - 반비례`);
}

// fit_chem_15에서 촉매 태그 추가
const unitStart = content.indexOf('fit_chem_15:');
if (unitStart !== -1) {
  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart !== -1 && vocabStart !== -1) {
    const passageSection = content.substring(passageStart, vocabStart);

    if (!passageSection.includes('<b>촉매</b>') && passageSection.includes('촉매')) {
      const newPassage = passageSection.replace('촉매', '<b>촉매</b>');
      content = content.substring(0, passageStart) + newPassage + content.substring(vocabStart);
      console.log(`태그 추가: fit_chem_15 - 촉매`);
    }
  }
}

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_chem_content.js", content);
console.log("\n완료!");
