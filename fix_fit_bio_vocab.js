const fs = require("fs");
const content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/fit_bio_content.js", "utf8");

for (let i = 1; i <= 20; i++) {
  const unit = "fit_bio_" + String(i).padStart(2, "0");

  const passageStart = content.indexOf(unit + ":");
  if (passageStart === -1) continue;

  const nextUnit = "fit_bio_" + String(i + 1).padStart(2, "0");
  const unitEnd = content.indexOf(nextUnit + ":", passageStart);
  const unitContent = unitEnd === -1 ? content.substring(passageStart) : content.substring(passageStart, unitEnd);

  const passageIdx = unitContent.indexOf("passage:");
  const vocabIdx = unitContent.indexOf("vocab:");
  const vocabFillIdx = unitContent.indexOf("vocabFill:");

  if (passageIdx === -1 || vocabIdx === -1 || vocabFillIdx === -1) continue;

  const passageText = unitContent.substring(passageIdx, vocabIdx);
  const vocabText = unitContent.substring(vocabIdx, vocabFillIdx);
  const vocabFillText = unitContent.substring(vocabFillIdx);

  const bTagRegex = /<b>([^<]+)<\/b>/g;
  const bTags = [];
  let bMatch;
  while ((bMatch = bTagRegex.exec(passageText)) !== null) {
    if (!bTags.includes(bMatch[1])) bTags.push(bMatch[1]);
  }

  const vocabRegex = /\['([^']+)',/g;
  const vocabs = [];
  let vMatch;
  while ((vMatch = vocabRegex.exec(vocabText)) !== null) {
    vocabs.push(vMatch[1]);
  }

  const vocabOnly = vocabs.filter(v => !bTags.includes(v));
  const passageOnly = bTags.filter(t => !vocabs.includes(t));

  if (vocabOnly.length > 0 || passageOnly.length > 0) {
    console.log(`=== ${unit} ===`);
    vocabOnly.forEach(v => {
      const usedInFill = vocabFillText.includes(`answer:'${v}'`) ||
                         vocabFillText.includes(`answer: '${v}'`) ||
                         vocabFillText.includes(`answer:"${v}"`) ||
                         vocabFillText.includes(`answer: "${v}"`);
      const existsInPassage = passageText.includes(v);

      if (usedInFill) {
        if (existsInPassage) {
          console.log(`  vocab: ${v} -> passage에 있음, 태그 추가`);
        } else {
          console.log(`  vocab: ${v} -> passage에 없음, 제거 필요`);
        }
      } else {
        console.log(`  vocab: ${v} -> vocabFill 미사용, 제거`);
      }
    });
    passageOnly.forEach(p => {
      console.log(`  passage: <b>${p}</b> -> vocab에 없음, 태그 제거`);
    });
  }
}
