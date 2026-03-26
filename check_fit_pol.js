const fs = require("fs");
const content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/fit_pol_content.js", "utf8");

for (let i = 1; i <= 20; i++) {
  const unit = "fit_pol_" + String(i).padStart(2, "0");

  const passageStart = content.indexOf(unit + ":");
  if (passageStart === -1) continue;

  const nextUnit = "fit_pol_" + String(i + 1).padStart(2, "0");
  const unitEnd = content.indexOf(nextUnit + ":", passageStart);
  const unitContent = unitEnd === -1 ? content.substring(passageStart) : content.substring(passageStart, unitEnd);

  const passageIdx = unitContent.indexOf("passage:");
  const vocabIdx = unitContent.indexOf("vocab:");
  const vocabFillIdx = unitContent.indexOf("vocabFill:");

  if (passageIdx === -1 || vocabIdx === -1 || vocabFillIdx === -1) continue;

  const passageText = unitContent.substring(passageIdx, vocabIdx);
  const vocabText = unitContent.substring(vocabIdx, vocabFillIdx);

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
    console.log(`=== ${unit} === MISMATCH`);
    if (vocabOnly.length > 0) console.log(`  vocab에만: ${vocabOnly.join(', ')}`);
    if (passageOnly.length > 0) console.log(`  passage에만: ${passageOnly.join(', ')}`);
  } else {
    console.log(`=== ${unit} === OK`);
  }
}
