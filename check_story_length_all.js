const fs = require('fs');
const path = require('path');

const dir = '/Users/dandan/Desktop/brainmoon_academy0329/public/creative-book';

// _34 파일들 찾기
const files = fs.readdirSync(dir).filter(f => f.endsWith('_season1_34.html'));

const results = [];

files.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // story-card 내의 p 태그들 찾기
  const cardMatches = [...content.matchAll(/<div[^>]*class="[^"]*story-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/section>/gi)];

  let chapterLengths = [];
  let totalLength = 0;

  cardMatches.forEach((card, idx) => {
    const cardContent = card[1];
    // p 태그들 추출
    const pMatches = [...cardContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];

    let chapterText = '';
    pMatches.forEach(p => {
      // HTML 태그 제거
      let text = p[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      // 메타 정보 제외 (중심 문장 라벨 등)
      if (!text.startsWith('📌')) {
        chapterText += text + ' ';
      }
    });

    if (chapterText.trim().length > 50) {
      const len = chapterText.trim().length;
      chapterLengths.push(len);
      totalLength += len;
    }
  });

  // 카테고리 분류
  let category = '기타';
  const fname = file.toLowerCase();
  if (fname.startsWith('bio')) category = '생물';
  else if (fname.startsWith('chem')) category = '화학';
  else if (fname.startsWith('physics')) category = '물리';
  else if (fname.startsWith('earth')) category = '지구과학';
  else if (fname.startsWith('law')) category = '법';
  else if (fname.startsWith('geo')) category = '지리';
  else if (fname.startsWith('social')) category = '사회';
  else if (fname.startsWith('classic')) category = '고전문학';
  else if (fname.startsWith('worldlit')) category = '세계문학';
  else if (fname.startsWith('korperson')) category = '한국인물';
  else if (fname.startsWith('worldperson')) category = '세계인물';
  else if (fname.startsWith('politic') || fname.startsWith('pol')) category = '정치';

  results.push({
    file: file.replace('_season1_34.html', ''),
    category,
    chapters: chapterLengths.length,
    chapterLengths,
    total: totalLength,
    avg: chapterLengths.length > 0 ? Math.round(totalLength / chapterLengths.length) : 0
  });
});

// 카테고리별로 정렬, 같은 카테고리 내에서는 파일명 순
results.sort((a, b) => {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category);
  }
  return a.file.localeCompare(b.file);
});

// 유효한 결과만
const validResults = results.filter(r => r.total > 0);

console.log('================================================================');
console.log('       📚 3-4학년 창작도서 전체 글자수 리스트');
console.log('================================================================\n');

// 카테고리별로 출력
const categoryOrder = ['생물', '화학', '물리', '지구과학', '법', '지리', '사회', '정치', '고전문학', '세계문학', '한국인물', '세계인물'];

categoryOrder.forEach(cat => {
  const catResults = validResults.filter(r => r.category === cat);
  if (catResults.length === 0) return;

  console.log(`\n【 ${cat} 】 (${catResults.length}개)`);
  console.log('─'.repeat(60));
  console.log('도서명               | 총글자수 | 1장  | 2장  | 3장  | 4장  | 5장  | 6장  | 7장  | 8장  | 9장  | 10장');
  console.log('─'.repeat(60));

  catResults.forEach(r => {
    const name = r.file.padEnd(20);
    const total = r.total.toLocaleString().padStart(6);
    const chapters = r.chapterLengths.map(c => String(c).padStart(4)).join(' | ');
    console.log(`${name} | ${total}자 | ${chapters}`);
  });

  // 카테고리 합계
  const catTotal = catResults.reduce((sum, r) => sum + r.total, 0);
  const catAvg = Math.round(catTotal / catResults.length);
  console.log('─'.repeat(60));
  console.log(`소계: ${catTotal.toLocaleString()}자 (평균: ${catAvg.toLocaleString()}자)`);
});

// 전체 통계
const grandTotal = validResults.reduce((sum, r) => sum + r.total, 0);
const avgTotal = Math.round(grandTotal / validResults.length);

console.log('\n\n================================================================');
console.log('                      📊 전체 통계');
console.log('================================================================\n');
console.log(`총 도서 수: ${validResults.length}개`);
console.log(`총 글자수: ${grandTotal.toLocaleString()}자`);
console.log(`평균 글자수: ${avgTotal.toLocaleString()}자`);

// 글자수 순위 TOP/BOTTOM
const sortedByTotal = [...validResults].sort((a, b) => b.total - a.total);

console.log('\n【 글자수 TOP 10 】');
sortedByTotal.slice(0, 10).forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.file} (${r.category}): ${r.total.toLocaleString()}자`);
});

console.log('\n【 글자수 BOTTOM 10 】');
sortedByTotal.slice(-10).reverse().forEach((r, i) => {
  const rank = sortedByTotal.length - i;
  console.log(`  ${rank}. ${r.file} (${r.category}): ${r.total.toLocaleString()}자`);
});
