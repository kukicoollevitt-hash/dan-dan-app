const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_law_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_law_01
  '약육강식', '사회 질서', '법 앞에 평등',
  // deep_law_02
  '헌법의 안정성', '기본 원리', '침략 전쟁',
  // deep_law_04
  '독재', '인사청문회', '불체포특권', '면책특권', '행정부', '행정각부', '법원', '선거관리위원회',
  // deep_law_05
  '보통 선거', '평등 선거', '직접 선거', '비밀 선거', '정강 정책', '선거 운동', '선거 관리 위원회',
  // deep_law_06
  '권리능력 평등의 원칙', '사적 자치의 원칙', '소유권 절대의 원칙', '과실책임의 원칙', '소유권 공공복리의 원칙',
  // deep_law_07
  '계약 자유의 원칙', '채무 불이행', '이행 지체', '이행 불능', '불완전 이행', '청약 철회권', '불공정약관', '신의성실의 원칙',
  // deep_law_09
  '친족법', '친자', '부양', '동거', '정조', '협의 이혼', '재판 이혼', '재산 분할', '친자 관계', '혼인 중의 자', '혼인 외의 자',
  // deep_law_10
  '사형', '금고', '자격상실', '자격정지', '벌금', '구류', '과료', '몰수', '교화', '사회복귀',
  // deep_law_11
  '손해', '정신적 손해', '일반불법행위', '적극적 손해', '소극적 손해', '소멸시효',
  // deep_law_12
  '소장', '처분권주의', '변론주의', '무죄추정의 원칙', '검사', '진술거부권', '기판력', '공개재판주의',
  // deep_law_13
  '대안적 분쟁 해결(ADR)',
  // deep_law_14
  '단결권', '단체교섭권', '단체행동권', '쟁의행위', '임금체불',
  // deep_law_15
  '법의 일반원칙', '세계은행', '국제노동기구',
  // deep_law_16
  '8대 소비자 권리', '수리', '취소',
  // deep_law_17
  '손해배상청구권', '파리협약', '베른협약',
  // deep_law_18
  '협력의원칙', '환경오염피해배상책임법',
  // deep_law_20
  '부동산', '임차권', '전세보증보험', '민법', '정보통신망법', '모욕', '방송통신심의위원회', '대한변호사협회'
];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()]/g, '\\$&')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  // deep_law_05
  { unit: 'deep_law_05', search: '유권자' },
  { unit: 'deep_law_05', search: '여당' },
  { unit: 'deep_law_05', search: '야당' },
  // deep_law_06
  { unit: 'deep_law_06', search: '법정대리인' },
  // deep_law_17
  { unit: 'deep_law_17', search: '특허심판원' },
  // deep_law_19
  { unit: 'deep_law_19', search: '친권자' }
];

let tagAddCount = 0;
addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) {
    console.log(`유닛 없음: ${item.unit}`);
    return;
  }

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) {
    console.log(`passage/vocab 없음: ${item.unit}`);
    return;
  }

  const passageSection = content.substring(passageStart, vocabStart);

  if (passageSection.includes(`<b>${item.search}</b>`)) {
    console.log(`이미 태그 있음: ${item.unit} - ${item.search}`);
    return;
  }

  if (passageSection.includes(item.search)) {
    const newPassage = passageSection.replace(item.search, `<b>${item.search}</b>`);
    content = content.substring(0, passageStart) + newPassage + content.substring(vocabStart);
    tagAddCount++;
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  } else {
    console.log(`단어 없음: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/social/deep_law_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);
