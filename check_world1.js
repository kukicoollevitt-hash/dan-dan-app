const fs = require("fs");
const content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/world1_content.js", "utf8");

for (let i = 1; i <= 40; i++) {
  const unit = "world1_" + String(i).padStart(2, "0");

  const passageStart = content.indexOf(unit + ":");
  if (passageStart === -1) {
    console.log("=== " + unit + " === NOT FOUND");
    continue;
  }

  const nextUnit = "world1_" + String(i + 1).padStart(2, "0");
  let unitEnd = content.indexOf(nextUnit + ":", passageStart);
  if (unitEnd === -1) unitEnd = content.length;
  const unitContent = content.substring(passageStart, unitEnd);

  const passageIdx = unitContent.indexOf("passage:");
  const vocabIdx = unitContent.indexOf("vocab:");
  const vocabFillIdx = unitContent.indexOf("vocabFill:");

  if (passageIdx === -1 || vocabIdx === -1 || vocabFillIdx === -1) {
    console.log("=== " + unit + " === PARSE ERROR");
    continue;
  }

  const passageText = unitContent.substring(passageIdx, vocabIdx);
  const vocabText = unitContent.substring(vocabIdx, vocabFillIdx);

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

  // 비교
  const passageOnly = bTags.filter(t => !vocabs.includes(t));
  const vocabOnly = vocabs.filter(v => !bTags.includes(v));

  if (passageOnly.length > 0 || vocabOnly.length > 0) {
    console.log("=== " + unit + " === MISMATCH");
    if (passageOnly.length > 0) console.log("  passage에만: " + passageOnly.join(", "));
    if (vocabOnly.length > 0) console.log("  vocab에만: " + vocabOnly.join(", "));
  } else {
    console.log("=== " + unit + " === OK");
  }
}
