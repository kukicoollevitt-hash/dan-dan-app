const fs = require("fs");
const content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people2_content.js", "utf8");

let removeTagsList = [];  // passage에서 태그 제거할 것들
let addTagsList = [];     // passage에 태그 추가할 것들
let removeVocabList = []; // vocab에서 제거할 것들

for (let i = 1; i <= 40; i++) {
  const unit = `deep_people2_${String(i).padStart(2, '0')}`;
  const unitStart = content.indexOf(unit + ':');
  if (unitStart === -1) continue;

  const nextUnitNum = i + 1;
  const nextUnit = `deep_people2_${String(nextUnitNum).padStart(2, '0')}`;
  const nextUnitStart = content.indexOf(nextUnit + ':', unitStart + 1);
  const unitEnd = nextUnitStart !== -1 ? nextUnitStart : content.length;
  const unitContent = content.substring(unitStart, unitEnd);

  // Extract passage section
  const passageMatch = unitContent.match(/passage:\s*\[([\s\S]*?)\],\s*vocab:/);
  const passageSection = passageMatch ? passageMatch[1] : '';

  // Extract passage tags
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

  // Extract vocabFill answers
  const vocabFillMatch = unitContent.match(/vocabFill:\s*\{[\s\S]*?items:\s*\[([\s\S]*?)\]\s*\}/);
  const vocabFillAnswers = [];
  if (vocabFillMatch) {
    const answerMatches = vocabFillMatch[1].matchAll(/answer:\s*'([^']+)'/g);
    for (const m of answerMatches) {
      vocabFillAnswers.push(m[1]);
    }
  }

  const passageSet = new Set(passageTags);
  const vocabSet = new Set(vocabWords);
  const vocabFillSet = new Set(vocabFillAnswers);

  // passageOnly: 태그는 있는데 vocab에 없음 -> 태그 제거
  const passageOnly = [...new Set(passageTags.filter(t => !vocabSet.has(t)))];
  passageOnly.forEach(tag => {
    removeTagsList.push({ unit, tag });
  });

  // vocabOnly: vocab에 있는데 태그 없음
  const vocabOnly = [...new Set(vocabWords.filter(w => !passageSet.has(w)))];
  vocabOnly.forEach(word => {
    // vocabFill에서 사용되는지 확인
    const usedInFill = vocabFillAnswers.some(ans => ans === word || ans.includes(word) || word.includes(ans));

    // passage 텍스트에 단어가 존재하는지 확인
    const existsInPassage = passageSection.includes(word);

    if (existsInPassage) {
      addTagsList.push({ unit, word });
    } else if (!usedInFill) {
      removeVocabList.push({ unit, word, reason: 'not in passage, not in vocabFill' });
    } else {
      removeVocabList.push({ unit, word, reason: 'not in passage but used in vocabFill - KEEP or fix passage' });
    }
  });
}

console.log('=== 태그 제거 (passageOnly) ===');
removeTagsList.forEach(item => console.log(`  ${item.unit}: ${item.tag}`));
console.log(`\n총 ${removeTagsList.length}개 태그 제거 필요\n`);

console.log('=== 태그 추가 (vocabOnly, passage에 존재) ===');
addTagsList.forEach(item => console.log(`  ${item.unit}: ${item.word}`));
console.log(`\n총 ${addTagsList.length}개 태그 추가 필요\n`);

console.log('=== vocab 제거 검토 ===');
removeVocabList.forEach(item => console.log(`  ${item.unit}: ${item.word} (${item.reason})`));
console.log(`\n총 ${removeVocabList.length}개 vocab 검토 필요`);
