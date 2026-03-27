const fs = require("fs");
const content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people2_content.js", "utf8");

let okCount = 0;
let errorCount = 0;

for (let i = 1; i <= 40; i++) {
  const unit = `deep_people2_${String(i).padStart(2, '0')}`;
  const unitStart = content.indexOf(unit + ':');
  if (unitStart === -1) {
    console.log(`${unit}: NOT FOUND`);
    errorCount++;
    continue;
  }

  const nextUnitNum = i + 1;
  const nextUnit = `deep_people2_${String(nextUnitNum).padStart(2, '0')}`;
  const nextUnitStart = content.indexOf(nextUnit + ':', unitStart + 1);
  const unitEnd = nextUnitStart !== -1 ? nextUnitStart : content.length;
  const unitContent = content.substring(unitStart, unitEnd);

  // Extract passage tags
  const passageMatch = unitContent.match(/passage:\s*\[([\s\S]*?)\],\s*vocab:/);
  const passageTags = [];
  if (passageMatch) {
    const tagMatches = passageMatch[1].matchAll(/<b>([^<]+)<\/b>/g);
    for (const m of tagMatches) {
      passageTags.push(m[1]);
    }
  }

  // Extract vocab words
  const vocabMatch = unitContent.match(/vocab:\s*\[([\s\S]*?)\],\s*vocabFill:/);
  const vocabWords = [];
  if (vocabMatch) {
    const wordMatches = vocabMatch[1].matchAll(/\['([^']+)',/g);
    for (const m of wordMatches) {
      vocabWords.push(m[1]);
    }
  }

  // Compare
  const passageSet = new Set(passageTags);
  const vocabSet = new Set(vocabWords);

  const passageOnly = passageTags.filter(t => !vocabSet.has(t));
  const vocabOnly = vocabWords.filter(w => !passageSet.has(w));

  const uniquePassageOnly = [...new Set(passageOnly)];
  const uniqueVocabOnly = [...new Set(vocabOnly)];

  if (uniquePassageOnly.length === 0 && uniqueVocabOnly.length === 0) {
    console.log(`${unit}: OK (vocab=${vocabWords.length}, tags=${passageTags.length})`);
    okCount++;
  } else {
    console.log(`${unit}: MISMATCH - vocabOnly: [${uniqueVocabOnly.join(', ')}], passageOnly: [${uniquePassageOnly.join(', ')}]`);
    errorCount++;
  }
}

console.log(`\n=== 결과: ${okCount}개 OK, ${errorCount}개 오류 ===`);
