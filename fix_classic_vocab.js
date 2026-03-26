const fs = require("fs");
const content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/classic_content.js", "utf8");

// 각 유닛에서 vocab에만 있는 항목들 찾기
for (let i = 1; i <= 40; i++) {
  const unit = "classic_" + String(i).padStart(2, "0");

  const passageStart = content.indexOf(unit + ":");
  if (passageStart === -1) continue;

  const nextUnit = "classic_" + String(i + 1).padStart(2, "0");
  const unitEnd = content.indexOf(nextUnit + ":", passageStart);
  const unitContent = unitEnd === -1 ? content.substring(passageStart) : content.substring(passageStart, unitEnd);

  // passage 추출
  const passageIdx = unitContent.indexOf("passage:");
  const vocabIdx = unitContent.indexOf("vocab:");
  const vocabFillIdx = unitContent.indexOf("vocabFill:");

  if (passageIdx === -1 || vocabIdx === -1 || vocabFillIdx === -1) continue;

  const passageText = unitContent.substring(passageIdx, vocabIdx);
  const vocabText = unitContent.substring(vocabIdx, vocabFillIdx);
  const vocabFillText = unitContent.substring(vocabFillIdx);

  // passage에서 <b> 태그 추출
  const bTagRegex = /<b>([^<]+)<\/b>/g;
  const bTags = [];
  let bMatch;
  while ((bMatch = bTagRegex.exec(passageText)) !== null) {
    if (!bTags.includes(bMatch[1])) bTags.push(bMatch[1]);
  }

  // vocab에서 첫 번째 요소 추출
  const vocabRegex = /\['([^']+)',/g;
  const vocabs = [];
  let vMatch;
  while ((vMatch = vocabRegex.exec(vocabText)) !== null) {
    vocabs.push(vMatch[1]);
  }

  // vocab에만 있는 항목
  const vocabOnly = vocabs.filter(v => !bTags.includes(v));

  if (vocabOnly.length > 0) {
    console.log(`=== ${unit} ===`);
    vocabOnly.forEach(v => {
      // vocabFill에서 사용되는지 확인
      const usedInFill = vocabFillText.includes(`answer: '${v}'`) || vocabFillText.includes(`answer: "${v}"`);
      console.log(`  ${v}: ${usedInFill ? 'vocabFill에서 사용됨 -> passage에 태그 추가 필요' : 'vocabFill에서 미사용 -> vocab에서 제거 필요'}`);
    });
  }
}
