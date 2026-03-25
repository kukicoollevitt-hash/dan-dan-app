const fs = require('fs');
const path = require('path');

// 영어/약어로만 되어 있는 meaning을 한글 정의로 수정
// content.js의 vocab 배열에서 실제 정의를 가져옴

const vocabDataPath = path.join(__dirname, '..', 'public/brainfit-vocab-data.js');
let vocabData = fs.readFileSync(vocabDataPath, 'utf-8');

// content.js 파일들에서 단어-의미 추출
const contentDirs = [
  'science',
  'social',
  'korlit',
  'worldlit',
  'person'
];

const wordMeanings = {};

contentDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', 'public/BRAINUP', dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('_content.js'));

  files.forEach(file => {
    const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');

    // vocab 배열에서 추출: ['단어', '의미']
    const vocabRegex = /\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]/g;
    let match;
    while ((match = vocabRegex.exec(content)) !== null) {
      let word = match[1];
      const meaning = match[2];

      // 괄호 제거: 축척(scale) -> 축척
      word = word.replace(/\([^)]+\)/g, '').trim();

      if (word && meaning && meaning.length > 3) {
        // 더 긴 정의를 우선
        if (!wordMeanings[word] || meaning.length > wordMeanings[word].length) {
          wordMeanings[word] = meaning;
        }
      }
    }
  });
});

console.log(`총 ${Object.keys(wordMeanings).length}개의 단어-의미 추출됨`);

// 영어/약어만 있는 항목들을 수정
const englishMeanings = [
  // 단어: 현재 영어 meaning
  { word: '크리스퍼', oldMeaning: 'CRISPR' },
  { word: '중력', oldMeaning: 'gravity' },
  { word: '지각', oldMeaning: 'crust' },
  { word: '궤도', oldMeaning: 'orbit' },
  { word: '질량', oldMeaning: 'mass' },
  { word: '무게', oldMeaning: 'weight' },
  { word: '힘', oldMeaning: 'force' },
  { word: '암페어', oldMeaning: 'A' },
  { word: '볼트', oldMeaning: 'V' },
  { word: '인공지능', oldMeaning: 'AI' },
  { word: '축척', oldMeaning: 'scale' },
  { word: '등고선', oldMeaning: 'contour line' },
  { word: '방위표', oldMeaning: 'compass rose' },
  { word: '위성위치확인시스템', oldMeaning: 'gps' },
  { word: '지리정보시스템', oldMeaning: 'gis' },
  { word: '유엔', oldMeaning: 'UN' },
  { word: '국제사법재판소', oldMeaning: 'ICJ' },
  { word: '대체적분쟁해결', oldMeaning: 'ADR' },
  { word: '세계무역기구', oldMeaning: 'WTO' },
  { word: '세계보건기구', oldMeaning: 'WHO' },
  { word: '공적개발원조', oldMeaning: 'ODA' },
  { word: '유네스코', oldMeaning: 'UNESCO' },
  { word: '지속가능발전목표', oldMeaning: 'SDGs' },
  { word: 'OTT', oldMeaning: 'ott' },
  { word: '사물인터넷', oldMeaning: 'IoT' },
  { word: '기압', oldMeaning: 'atm' },
  { word: '압력', oldMeaning: 'Pa' },
];

// 수동으로 정의 추가 (content.js에 없는 것들)
const manualMeanings = {
  '크리스퍼': '유전자 가위라고 불리는 유전자 편집 기술',
  '중력': '지구가 물체를 중심으로 끌어당기는 힘',
  '지각': '지구의 가장 바깥쪽을 이루는 암석층',
  '궤도': '천체가 다른 천체 주위를 도는 길',
  '질량': '물체가 가진 물질의 양',
  '무게': '물체에 작용하는 중력의 크기',
  '힘': '물체의 모양이나 움직임을 바꾸는 작용',
  '암페어': '전류의 세기를 나타내는 단위',
  '볼트': '전압의 크기를 나타내는 단위',
  '인공지능': '인간의 지능을 모방한 컴퓨터 기술',
  '축척': '실제 거리와 지도 거리의 비율',
  '등고선': '같은 높이를 잇는 선',
  '방위표': '지도의 방향을 알려주는 기준',
  '위성위치확인시스템': '인공위성을 이용해 위치를 알아내는 기술',
  '지리정보시스템': '지리 정보를 수집·분석하는 컴퓨터 시스템',
  '유엔': '국제 평화와 협력을 위한 국제기구',
  '국제사법재판소': '국가 간 분쟁을 해결하는 국제 법원',
  '대체적분쟁해결': '소송 외의 분쟁 해결 방법',
  '세계무역기구': '국제 무역 규칙을 정하는 국제기구',
  '세계보건기구': '국제 보건 문제를 다루는 국제기구',
  '공적개발원조': '선진국이 개발도상국에 지원하는 원조',
  '유네스코': '교육·과학·문화 분야의 국제 협력 기구',
  '지속가능발전목표': '지속 가능한 발전을 위한 국제 목표',
  'OTT': '인터넷으로 영상 콘텐츠를 제공하는 서비스',
  '사물인터넷': '사물에 센서를 달아 인터넷으로 연결하는 기술',
  '기압': '대기가 누르는 압력',
  '압력': '단위 면적당 작용하는 힘',
};

let updatedCount = 0;
const updates = [];

englishMeanings.forEach(({ word, oldMeaning }) => {
  // content.js에서 찾은 의미 또는 수동 정의 사용
  const newMeaning = wordMeanings[word] || manualMeanings[word];

  if (!newMeaning) {
    console.log(`[경고] ${word}: 정의를 찾을 수 없음`);
    return;
  }

  // meaning 필드 수정
  const meaningRegex = new RegExp(
    `("word":\\s*"${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*"meaning":\\s*)"${oldMeaning.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
    'g'
  );

  let matchCount = 0;
  vocabData = vocabData.replace(meaningRegex, (match, prefix) => {
    matchCount++;
    return `${prefix}"${newMeaning}"`;
  });

  if (matchCount > 0) {
    updatedCount += matchCount;
    updates.push({ word, old: oldMeaning, new: newMeaning, count: matchCount });

    // explanation 필드도 수정
    const explainRegex = new RegExp(
      `("word":\\s*"${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*"explanation":\\s*)"[^"]*${oldMeaning.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"`,
      'g'
    );

    vocabData = vocabData.replace(explainRegex, (match, prefix) => {
      return `${prefix}"\\"${word}\\"은(는) ${newMeaning}을(를) 의미합니다."`;
    });
  }
});

console.log(`\n업데이트된 단어: ${updatedCount}개`);
console.log('\n업데이트 내역:');
updates.forEach(({ word, old, new: newMeaning, count }) => {
  console.log(`  ${word}: "${old}" -> "${newMeaning}" (${count}건)`);
});

// 파일 저장
fs.writeFileSync(vocabDataPath, vocabData, 'utf-8');
console.log(`\n파일 저장 완료: ${vocabDataPath}`);
