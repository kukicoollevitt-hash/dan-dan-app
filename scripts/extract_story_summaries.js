/**
 * 창작도서 10파트 중심내용 추출 스크립트
 * 100개 이야기 × 10파트 = 1,000개 파트의 중심내용을 JSON으로 추출
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const CREATIVE_BOOK_DIR = path.join(__dirname, '../public/creative-book');
const OUTPUT_FILE = path.join(__dirname, '../public/data/story_summaries.json');

// 파일 목록 가져오기 (3,4학년용 _34.html)
function getStoryFiles() {
  const files = fs.readdirSync(CREATIVE_BOOK_DIR);
  return files
    .filter(f => f.endsWith('_34.html'))
    .sort();
}

// HTML에서 스토리 정보 추출
function extractStoryData(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  // 파일명에서 시리즈 정보 추출
  const fileName = path.basename(filePath, '_season1_34.html');

  // 제목 추출
  const mainTitle = $('title').text().trim() ||
                   $('.intro-content h1').text().trim() ||
                   $('.hero-title').text().trim() ||
                   $('.book-title').text().trim() ||
                   $('h1').first().text().trim();

  // 부제목/설명 추출
  const subtitle = $('.intro-content .subtitle').text().trim() ||
                   $('.hero-subtitle').text().trim() ||
                   $('.book-subtitle').text().trim() || '';

  // 등장인물 추출
  const characters = [];
  $('.intro-content .characters p').each((i, el) => {
    characters.push($(el).text().trim());
  });
  // 다른 구조의 등장인물
  $('.intro-box p, .character-item').each((i, el) => {
    const text = $(el).text().trim();
    if (text && !characters.includes(text)) {
      characters.push(text);
    }
  });

  // 10개 파트 추출 - 다양한 구조 지원
  const parts = [];

  // 1. story-section 구조
  // 2. chapter-section 구조
  // 3. scroll-section 구조
  const sectionSelectors = [
    '.story-section',
    '.chapter-section',
    '.scroll-section',
    'section[data-bg]'
  ];

  let sections = [];
  for (const selector of sectionSelectors) {
    const found = $(selector);
    if (found.length > 0) {
      found.each((i, el) => sections.push(el));
      break;
    }
  }

  sections.forEach((section, i) => {
    const $section = $(section);

    // 다양한 카드 구조 지원
    const $card = $section.find('.story-card, .chapter-container, .chapter-card, .content-card').first();

    if ($card.length === 0) return;

    const chapter = $card.find('.chapter, .chapter-number, .part-number').text().trim() ||
                    $section.find('.chapter-badge').text().trim() ||
                    `제${i + 1}화`;
    const theme = $card.find('.theme, .chapter-theme, .part-theme').text().trim() || '';
    const title = $card.find('h2, h3, .chapter-title, .part-title').first().text().trim();

    // 본문 텍스트 추출 (HTML 태그 제거, 줄바꿈 정리)
    let content = '';
    $card.find('p, .chapter-content, .part-content').each((j, p) => {
      content += $(p).text().trim() + ' ';
    });
    content = content.trim();

    // 하이라이트(핵심 개념) 추출
    const highlights = [];
    $card.find('.highlight, .keyword, .concept').each((j, hl) => {
      const text = $(hl).text().trim();
      if (text && !highlights.includes(text)) {
        highlights.push(text);
      }
    });

    // 대화 추출
    const dialogues = [];
    $card.find('.dialogue, .quote').each((j, dl) => {
      const text = $(dl).text().trim();
      if (text) dialogues.push(text);
    });

    // 배경 이미지
    const bgImage = $section.attr('data-bg') || '';

    parts.push({
      partNumber: i + 1,
      chapter,
      theme,
      title,
      content,
      highlights,
      dialogues,
      bgImage
    });
  });

  return {
    id: fileName,
    title: mainTitle,
    subtitle,
    characters,
    totalParts: parts.length,
    parts
  };
}

// 메인 실행
async function main() {
  console.log('📚 창작도서 중심내용 추출 시작...\n');

  const storyFiles = getStoryFiles();
  console.log(`총 ${storyFiles.length}개 이야기 발견\n`);

  const allStories = [];
  const categories = {
    bio: { name: '생물', count: 0, stories: [] },
    chem: { name: '화학', count: 0, stories: [] },
    physics: { name: '물리', count: 0, stories: [] },
    earth: { name: '지구과학', count: 0, stories: [] },
    geo: { name: '지리', count: 0, stories: [] },
    law: { name: '법', count: 0, stories: [] },
    pol: { name: '정치', count: 0, stories: [] },
    politic: { name: '정치', count: 0, stories: [] },
    politics: { name: '정치', count: 0, stories: [] },
    social: { name: '사회', count: 0, stories: [] },
    classic: { name: '고전문학', count: 0, stories: [] },
    worldlit: { name: '세계문학', count: 0, stories: [] },
    korperson: { name: '한국인물', count: 0, stories: [] },
    worldperson: { name: '세계인물', count: 0, stories: [] }
  };

  for (const file of storyFiles) {
    const filePath = path.join(CREATIVE_BOOK_DIR, file);

    try {
      const storyData = extractStoryData(filePath);
      allStories.push(storyData);

      // 카테고리별 분류
      const categoryKey = storyData.id.replace(/\d+$/, '');
      if (categories[categoryKey]) {
        categories[categoryKey].count++;
        categories[categoryKey].stories.push(storyData.id);
      }

      console.log(`✅ ${storyData.id}: "${storyData.title}" (${storyData.totalParts}파트)`);
    } catch (err) {
      console.error(`❌ ${file}: 추출 실패 - ${err.message}`);
    }
  }

  // 통계 출력
  console.log('\n📊 카테고리별 통계:');
  let totalParts = 0;
  for (const [key, cat] of Object.entries(categories)) {
    if (cat.count > 0) {
      console.log(`  ${cat.name}: ${cat.count}개 이야기`);
    }
  }

  allStories.forEach(s => totalParts += s.totalParts);
  console.log(`\n📈 총계: ${allStories.length}개 이야기, ${totalParts}개 파트\n`);

  // JSON 파일 저장
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputData = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    totalStories: allStories.length,
    totalParts,
    categories: Object.fromEntries(
      Object.entries(categories).filter(([k, v]) => v.count > 0)
    ),
    stories: allStories
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf-8');
  console.log(`💾 저장 완료: ${OUTPUT_FILE}`);
}

main().catch(console.error);
