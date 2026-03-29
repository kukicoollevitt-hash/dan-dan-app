const fs = require('fs');
const path = require('path');

const dir = '/Users/dandan/Desktop/brainmoon_academy0326/public/creative-book';

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

  results.push({
    file: file.replace('_season1_34.html', ''),
    chapters: chapterLengths.length,
    chapterLengths,
    total: totalLength,
    avg: chapterLengths.length > 0 ? Math.round(totalLength / chapterLengths.length) : 0
  });
});

// 정렬 (총 글자수 기준 내림차순)
results.sort((a, b) => b.total - a.total);

// worldperson01 찾기
const target = results.find(r => r.file === 'worldperson01');
const targetIdx = results.findIndex(r => r.file === 'worldperson01');

console.log('=== 세계인물01 (레오나르도) 글자수 ===');
if (target) {
  console.log(`총 글자수: ${target.total.toLocaleString()}자`);
  console.log(`장 수: ${target.chapters}장`);
  console.log(`장당 평균: ${target.avg.toLocaleString()}자`);
  console.log(`각 장별: ${target.chapterLengths.join(', ')}`);
  console.log(`순위: ${targetIdx + 1}위 / ${results.length}개 (글자수 많은 순)`);
}

console.log('\n=== 전체 _34 도서 글자수 TOP 15 ===');
results.slice(0, 15).forEach((r, i) => {
  const marker = r.file === 'worldperson01' ? ' ⭐' : '';
  console.log(`${i + 1}. ${r.file}: ${r.total.toLocaleString()}자 (${r.chapters}장, 평균 ${r.avg}자)${marker}`);
});

// 유효한 결과만
const validResults = results.filter(r => r.total > 0);

console.log('\n=== 전체 _34 도서 글자수 BOTTOM 10 ===');
validResults.slice(-10).forEach((r, i) => {
  const idx = validResults.length - 10 + i;
  console.log(`${idx + 1}. ${r.file}: ${r.total.toLocaleString()}자 (${r.chapters}장, 평균 ${r.avg}자)`);
});

// 유효한 결과만으로 평균 계산
const avgTotal = Math.round(validResults.reduce((sum, r) => sum + r.total, 0) / validResults.length);
const avgChapter = Math.round(validResults.reduce((sum, r) => sum + r.avg, 0) / validResults.length);

console.log('\n=== 전체 평균 (유효 도서 기준) ===');
console.log(`분석된 도서: ${validResults.length}개`);
console.log(`전체 평균 글자수: ${avgTotal.toLocaleString()}자`);
console.log(`장당 평균 글자수: ${avgChapter.toLocaleString()}자`);

if (target && target.total > 0) {
  const diffTotal = target.total - avgTotal;
  const diffPercent = Math.round((diffTotal / avgTotal) * 100);
  console.log(`\n📊 세계인물01 vs 평균:`);
  console.log(`   차이: ${diffTotal > 0 ? '+' : ''}${diffTotal.toLocaleString()}자 (${diffPercent > 0 ? '+' : ''}${diffPercent}%)`);

  if (diffPercent > 20) {
    console.log(`   ⚠️ 평균보다 ${diffPercent}% 깁니다!`);
  } else if (diffPercent < -20) {
    console.log(`   ⚠️ 평균보다 ${Math.abs(diffPercent)}% 짧습니다!`);
  } else {
    console.log(`   ✅ 평균 범위 내입니다.`);
  }
}
