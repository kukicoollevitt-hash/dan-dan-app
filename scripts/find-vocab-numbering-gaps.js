/**
 * 모든 fit_*_content.js 파일에서 vocabFill items의 비순차적 번호를 찾아 출력
 */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (entry.isFile() && /^(fit|deep)_.*_content\.js$/.test(entry.name)) files.push(full);
  }
  return files;
}

const root = path.join(__dirname, '..', 'public', 'BRAINUP');
const files = walk(root);

console.log(`📁 검사 대상: ${files.length}개 (fit|deep)_*_content.js`);

for (const file of files) {
  const text = fs.readFileSync(file, 'utf-8');
  // 매우 단순한 파서: "fit_XXX_NN: {" 단위로 블록 분리
  const unitRegex = /^\s*((?:fit|deep)_[a-z0-9]+_\d+)\s*:\s*\{/gm;
  const unitStarts = [];
  let m;
  while ((m = unitRegex.exec(text))) unitStarts.push({ name: m[1], idx: m.index });

  for (let i = 0; i < unitStarts.length; i++) {
    const u = unitStarts[i];
    const next = unitStarts[i + 1];
    const block = text.substring(u.idx, next ? next.idx : text.length);

    // items: [ 시작 위치 찾고, 대괄호 균형으로 닫힘 위치 찾기 (aliases: [...] 안의 ]에 속지 않게)
    const itemsKeyMatch = block.match(/vocabFill\s*:\s*\{[\s\S]*?items\s*:\s*\[/);
    if (!itemsKeyMatch) continue;
    const itemsStart = itemsKeyMatch.index + itemsKeyMatch[0].length; // [ 바로 다음
    let depth = 1;
    let p = itemsStart;
    while (p < block.length && depth > 0) {
      const c = block[p];
      if (c === '[') depth++;
      else if (c === ']') depth--;
      p++;
    }
    const itemsBody = block.substring(itemsStart, p - 1);
    const noMatches = [...itemsBody.matchAll(/\bno\s*:\s*(\d+)/g)].map(x => parseInt(x[1]));
    if (noMatches.length === 0) continue;

    // 1, 2, 3, ... 연속인지 확인
    let isSequential = true;
    for (let k = 0; k < noMatches.length; k++) {
      if (noMatches[k] !== k + 1) { isSequential = false; break; }
    }
    if (!isSequential) {
      const expected = Array.from({ length: noMatches[noMatches.length - 1] }, (_, k) => k + 1);
      const missing = expected.filter(n => !noMatches.includes(n));
      console.log(`\n❌ ${path.relative(root, file)} :: ${u.name}`);
      console.log(`   현재 번호 : ${noMatches.join(', ')}`);
      console.log(`   누락 번호 : ${missing.join(', ') || '(연속이지만 시작 안 1)'} (총 ${noMatches.length}개 항목)`);
    }
  }
}
console.log('\n✅ 검사 완료');
