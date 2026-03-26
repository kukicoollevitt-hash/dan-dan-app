const fs = require("fs");
const content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/korlit/classic_content.js", "utf8");

for (let i = 1; i <= 40; i++) {
  const unit = "classic_" + String(i).padStart(2, "0");

  // 해당 unit의 passage와 vocab 부분 찾기
  const passageStart = content.indexOf(unit + ":");
  if (passageStart === -1) {
    console.log("=== " + unit + " === NOT FOUND");
    continue;
  }

  // passage 배열 찾기
  const passageIdx = content.indexOf("passage:", passageStart);
  const vocabIdx = content.indexOf("vocab:", passageIdx);
  const vocabFillIdx = content.indexOf("vocabFill:", vocabIdx);

  if (passageIdx === -1 || vocabIdx === -1 || vocabFillIdx === -1) {
    console.log("=== " + unit + " === PARSE ERROR");
    continue;
  }

  const passageText = content.substring(passageIdx, vocabIdx);
  const vocabText = content.substring(vocabIdx, vocabFillIdx);

  // passage에서 <b> 태그 추출
  const bTagRegex = /<b>([^<]+)<\/b>/g;
  const bTags = [];
  let bMatch;
  while ((bMatch = bTagRegex.exec(passageText)) !== null) {
    if (!bTags.includes(bMatch[1])) {
      bTags.push(bMatch[1]);
    }
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
