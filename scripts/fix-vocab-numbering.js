/**
 * fit_*_content.js 파일의 vocabFill.items에서 비순차 no를 연속 번호로 재정렬
 * 사용:
 *   node scripts/fix-vocab-numbering.js          # 실제 적용
 *   node scripts/fix-vocab-numbering.js --dry-run  # 미리보기만
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

const dryRun = process.argv.includes('--dry-run');
const root = path.join(__dirname, '..', 'public', 'BRAINUP');
const files = walk(root);

console.log(`📁 ${files.length}개 파일 검사 (${dryRun ? 'dry-run' : '실제 적용'})\n`);

let totalUnits = 0;
let fixedUnits = 0;
let totalReplacements = 0;

for (const file of files) {
  let text = fs.readFileSync(file, 'utf-8');
  const original = text;
  const unitRegex = /^\s*((?:fit|deep)_[a-z0-9]+_\d+)\s*:\s*\{/gm;
  // 모든 단원 위치 추출
  const unitStarts = [];
  let m;
  while ((m = unitRegex.exec(text))) unitStarts.push({ name: m[1], idx: m.index });

  // 끝에서부터 처리하면 인덱스가 안 밀림
  for (let i = unitStarts.length - 1; i >= 0; i--) {
    const u = unitStarts[i];
    const next = unitStarts[i + 1];
    const blockStart = u.idx;
    const blockEnd = next ? next.idx : text.length;
    const block = text.substring(blockStart, blockEnd);

    const itemsKeyMatch = block.match(/vocabFill\s*:\s*\{[\s\S]*?items\s*:\s*\[/);
    if (!itemsKeyMatch) continue;
    const itemsStart = itemsKeyMatch.index + itemsKeyMatch[0].length; // [ 바로 뒤
    let depth = 1, p = itemsStart;
    while (p < block.length && depth > 0) {
      const c = block[p];
      if (c === '[') depth++;
      else if (c === ']') depth--;
      p++;
    }
    const itemsBodyStart = itemsStart;
    const itemsBodyEnd = p - 1;
    const itemsBody = block.substring(itemsBodyStart, itemsBodyEnd);

    // 번호 추출
    const noRegex = /\bno\s*:\s*(\d+)/g;
    const matches = [];
    let nm;
    while ((nm = noRegex.exec(itemsBody))) matches.push({ idx: nm.index, len: nm[0].length, val: parseInt(nm[1]) });
    if (matches.length === 0) continue;
    totalUnits++;

    // 이미 1..N 연속이면 스킵
    let isSeq = true;
    for (let k = 0; k < matches.length; k++) {
      if (matches[k].val !== k + 1) { isSeq = false; break; }
    }
    if (isSeq) continue;

    // 번호 재정렬: 끝에서부터 치환
    let newItemsBody = itemsBody;
    for (let k = matches.length - 1; k >= 0; k--) {
      const beforeNo = newItemsBody.substring(0, matches[k].idx);
      const afterNo = newItemsBody.substring(matches[k].idx + matches[k].len);
      newItemsBody = beforeNo + `no: ${k + 1}` + afterNo;
    }

    const newBlock = block.substring(0, itemsBodyStart) + newItemsBody + block.substring(itemsBodyEnd);
    text = text.substring(0, blockStart) + newBlock + text.substring(blockEnd);

    fixedUnits++;
    totalReplacements += matches.length;
    const oldNos = matches.map(m => m.val).join(', ');
    const newNos = matches.map((_, k) => k + 1).join(', ');
    console.log(`✅ ${path.relative(root, file)} :: ${u.name}`);
    console.log(`   ${oldNos}  →  ${newNos}`);
  }

  if (text !== original && !dryRun) {
    fs.writeFileSync(file, text, 'utf-8');
  }
}

console.log(`\n📊 결과: ${fixedUnits}/${totalUnits}개 단원 재정렬 (${totalReplacements}개 항목 번호 갱신)`);
console.log(dryRun ? '🧪 dry-run — 파일 변경 없음' : '✏️ 적용 완료');
