const fs = require('fs');
const path = require('path');

// 원본 content.js 파일들에서 단어와 의미를 추출
const contentFiles = [
  // fit 시리즈 (BRAIN핏)
  'public/BRAINUP/science/fit_bio_content.js',
  'public/BRAINUP/science/fit_physics_content.js',
  'public/BRAINUP/science/fit_earth_content.js',
  'public/BRAINUP/science/fit_chem_content.js',
  'public/BRAINUP/social/fit_geo_content.js',
  'public/BRAINUP/social/fit_law_content.js',
  'public/BRAINUP/social/fit_pol_content.js',
  'public/BRAINUP/social/fit_soc_content.js',
  'public/BRAINUP/korlit/fit_classic_content.js',
  'public/BRAINUP/korlit/fit_modern_content.js',
  'public/BRAINUP/worldlit/fit_world1_content.js',
  'public/BRAINUP/worldlit/fit_world2_content.js',
  'public/BRAINUP/person/fit_people1_content.js',
  'public/BRAINUP/person/fit_people2_content.js',
  // on 시리즈 (BRAIN온)
  'public/BRAINUP/science/on_bio_content.js',
  'public/BRAINUP/science/on_physics_content.js',
  'public/BRAINUP/science/on_earth_content.js',
  'public/BRAINUP/science/on_chem_content.js',
  'public/BRAINUP/social/on_geo_content.js',
  'public/BRAINUP/social/on_law_content.js',
  'public/BRAINUP/social/on_pol_content.js',
  'public/BRAINUP/social/on_soc_content.js',
  'public/BRAINUP/korlit/on_classic_content.js',
  'public/BRAINUP/korlit/on_modern_content.js',
  'public/BRAINUP/worldlit/on_world1_content.js',
  'public/BRAINUP/worldlit/on_world2_content.js',
  'public/BRAINUP/person/on_people1_content.js',
  'public/BRAINUP/person/on_people2_content.js',
  // deep 시리즈 (BRAIN딥)
  'public/BRAINUP/science/deep_bio_content.js',
  'public/BRAINUP/science/deep_physics_content.js',
  'public/BRAINUP/science/deep_earth_content.js',
  'public/BRAINUP/science/deep_chem_content.js',
  'public/BRAINUP/social/deep_geo_content.js',
  'public/BRAINUP/social/deep_law_content.js',
  'public/BRAINUP/social/deep_pol_content.js',
  'public/BRAINUP/social/deep_soc_content.js',
  'public/BRAINUP/korlit/deep_classic_content.js',
  'public/BRAINUP/korlit/deep_modern_content.js',
  'public/BRAINUP/worldlit/deep_world1_content.js',
  'public/BRAINUP/worldlit/deep_world2_content.js',
  'public/BRAINUP/person/deep_people1_content.js',
  'public/BRAINUP/person/deep_people2_content.js',
  // 기본 시리즈 (BRAIN업)
  'public/BRAINUP/science/bio_content.js',
  'public/BRAINUP/science/physics_content.js',
  'public/BRAINUP/science/earth_content.js',
  'public/BRAINUP/science/chem_content.js',
  'public/BRAINUP/social/geo_content.js',
  'public/BRAINUP/social/law_content.js',
  'public/BRAINUP/social/pol_content.js',
  'public/BRAINUP/social/soc_content.js',
  'public/BRAINUP/korlit/classic_content.js',
  'public/BRAINUP/korlit/modern_content.js',
  'public/BRAINUP/worldlit/world1_content.js',
  'public/BRAINUP/worldlit/world2_content.js',
  'public/BRAINUP/person/people1_content.js',
  'public/BRAINUP/person/people2_content.js',
];

// 단어 -> 의미 매핑 (띄어쓰기 없는 버전 -> 실제 의미)
const wordMeanings = {};

// 각 content.js에서 vocabFill 데이터 추출
contentFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`파일 없음: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  // vocabFill 배열에서 { text: '...', answer: '...' } 패턴 추출
  // 패턴: { no: N, text: '...를 (   )라고 한다.', answer: '답', ... }
  const regex = /\{\s*no:\s*\d+,\s*text:\s*['"`]([^'"`]+)['"`],\s*answer:\s*['"`]([^'"`]+)['"`]/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1];
    const answer = match[2];

    // answer에서 띄어쓰기 제거한 버전을 키로 사용
    const wordKey = answer.replace(/\s+/g, '');

    // text에서 의미 추출 (괄호 앞부분이 의미)
    // 예: "가격이 너무 내려가지 못하게 정한 제도를 (        )라고 해요."
    // -> "가격이 너무 내려가지 못하게 정한 제도"
    let meaning = text
      .replace(/\s*\([^)]*\)\s*(라고|이라고|를|을|은|는|라|이라).*$/, '')
      .replace(/\s*\([^)]*\).*$/, '')
      .trim();

    // 끝에 "을", "를" 제거 (explanation에서 조사 중복 방지)
    meaning = meaning.replace(/[을를]$/, '');

    // 의미가 너무 짧거나 단순 띄어쓰기면 스킵
    if (meaning.length < 3) return;
    if (meaning === answer || meaning === wordKey) return;

    // 이미 있는 경우 더 긴 설명을 사용
    if (!wordMeanings[wordKey] || meaning.length > wordMeanings[wordKey].length) {
      wordMeanings[wordKey] = meaning;
    }
  }
});

console.log(`총 ${Object.keys(wordMeanings).length}개의 단어-의미 추출됨`);

// 샘플 출력
console.log('\n샘플 (처음 20개):');
Object.entries(wordMeanings).slice(0, 20).forEach(([word, meaning]) => {
  console.log(`  ${word}: ${meaning}`);
});

// brainfit-vocab-data.js 파일 업데이트 (텍스트 치환 방식)
const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

let updatedCount = 0;
const updatedWords = [];

// 단순 띄어쓰기 의미를 가진 항목들을 찾아서 치환
// 패턴: "meaning": "띄어쓰기만 된 단어"
Object.entries(wordMeanings).forEach(([wordKey, realMeaning]) => {
  // 단어의 띄어쓰기 버전 생성 (예: 가격하한제 -> 가격 하한제)
  // 2글자씩 띄어쓰기 패턴
  const spacedWord = wordKey.replace(/([가-힣]{2})([가-힣])/g, '$1 $2');

  // 여러 패턴 시도
  const patterns = [
    spacedWord,
    wordKey.replace(/([가-힣])([가-힣])/g, '$1 $2'), // 1글자씩
    wordKey.replace(/([가-힣]{3})([가-힣])/g, '$1 $2'), // 3글자씩
  ];

  patterns.forEach(pattern => {
    // "meaning": "패턴" 을 찾아서 치환
    const searchRegex = new RegExp(
      `("word":\\s*"${wordKey}"[^}]*"meaning":\\s*)"${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
      'g'
    );

    const newVocabData = vocabData.replace(searchRegex, (match, prefix) => {
      updatedCount++;
      updatedWords.push({ word: wordKey, old: pattern, new: realMeaning });
      return `${prefix}"${realMeaning}"`;
    });

    if (newVocabData !== vocabData) {
      vocabData = newVocabData;
    }
  });
});

console.log(`\n업데이트된 단어: ${updatedCount}개`);

// 업데이트된 단어 샘플 출력
console.log('\n업데이트된 단어 샘플 (처음 30개):');
updatedWords.slice(0, 30).forEach(({ word, old, new: newMeaning }) => {
  console.log(`  ${word}: "${old}" -> "${newMeaning}"`);
});

// 파일에 저장
fs.writeFileSync(vocabDataPath, vocabData, 'utf-8');
console.log(`\n파일 저장 완료: ${vocabDataPath}`);
