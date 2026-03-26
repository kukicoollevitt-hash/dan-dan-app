const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_physics_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_physics_01
  '수치', '단위', '국제단위계(SI)', '미터(m)', '킬로그램(kg)', '초(s)', '암페어(A)', '켈빈(K)', '몰(mol)', '칸델라(cd)', '평균값',
  // deep_physics_02
  '속도', '가속도', '힘', '운동량', '덧셈', '뺄셈', '곱셈',
  // deep_physics_03
  '위치', '등가속도 직선 운동', '나중 속도', '가속도-시간 그래프',
  // deep_physics_04
  '뉴턴의 제1법칙', '뉴턴의 제2법칙', '뉴턴의 제3법칙', '다른 두 물체',
  // deep_physics_05
  '독립적', '사격',
  // deep_physics_06
  '관성', '정지 궤도 위성', '원심 펌프', '원심 주조', '경사 도로',
  // deep_physics_07
  '줄(J)', '음의 일', '에너지', '역학적 에너지 보존 법칙', '마찰력', '공기 저항', '와트(W)',
  // deep_physics_08
  '기본 보존 법칙',
  // deep_physics_09
  '등온 과정', '단열 과정', '등압 과정', '등적 과정', '냉동기',
  // deep_physics_10
  '간섭', '반사', '굴절', '적색 편이',
  // deep_physics_11
  '매질', '수신기', '높낮이', '크기', '음색', '초저주파', '회절', '소닉붐',
  // deep_physics_12
  '입자설', '파동설', '이중 슬릿 실험', '오목 거울', '볼록 거울', '임계각', '렌즈', '수정체', '망막', '근시', '원시', '산란', '전자기 스펙트럼',
  // deep_physics_13
  '양성자', '전자', '전하 보존 법칙', '접촉 대전', '척력', '인력', '전위차',
  // deep_physics_14
  '전류의 방향', '기전력', '내부 저항', '유동 속력', '초전도체', '키르히호프의 법칙', '전류 법칙', '전압 법칙', '회로 소자', '저항기', '가변 저항', '트랜지스터', '퓨즈', '차단기',
  // deep_physics_15
  '자기', 'N극', 'S극', '자기홀극', '지구 자기장', '외르스테드', '자기력', '사이클로트론', '패러데이', '교류',
  // deep_physics_16
  '동시성의 상대성', 'E = mc²', '질량 결손', '시공간의 곡률',
  // deep_physics_17
  '흑체 복사', '양자', '진동수', '행렬역학', '파동역학',
  // deep_physics_18
  '원자', '핵자', '원자 번호', '질량수', '방사선', '감마 붕괴', '방사성 탄소 연대 측정법', '플라스마',
  // deep_physics_19
  '도체', '부도체', '원자가띠', '전도띠', '다수 운반자', '순방향 바이어스', '역방향 바이어스', '발광 다이오드', '광다이오드', '제너 다이오드', '바이폴라 접합 트랜지스터', '금속 산화물 반도체 전계 효과 트랜지스터', '무어의 법칙',
  // deep_physics_20
  '반도체', '전반사', '상대성 이론', 'CT', '방사선 치료', '양성자 치료', '광전 효과', '다중 접합', '페로브스카이트', 'OLED', '중첩', '얽힘', '양자 암호', '핵융합'
];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()²]/g, '\\$&')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  { unit: 'deep_physics_01', search: '국제단위계' },
  { unit: 'deep_physics_01', search: '플랑크 상수' },
  { unit: 'deep_physics_01', search: '아보가드로 상수' },
  { unit: 'deep_physics_01', search: '보정' },
  { unit: 'deep_physics_02', search: '합벡터' },
  { unit: 'deep_physics_02', search: '피타고라스 정리' },
  { unit: 'deep_physics_03', search: '등가속도 운동' },
  { unit: 'deep_physics_03', search: '운동 방정식' },
  { unit: 'deep_physics_03', search: '운동학' },
  { unit: 'deep_physics_04', search: '관성 기준계' },
  { unit: 'deep_physics_04', search: '정지 마찰력' },
  { unit: 'deep_physics_04', search: '운동 마찰력' },
  { unit: 'deep_physics_04', search: '마찰 계수' },
  { unit: 'deep_physics_04', search: '프린키피아' },
  { unit: 'deep_physics_05', search: '체공 시간' },
  { unit: 'deep_physics_05', search: '최고점' },
  { unit: 'deep_physics_05', search: '발사 각도' },
  { unit: 'deep_physics_05', search: '타원 궤도' },
  { unit: 'deep_physics_05', search: '쌍곡선 궤도' },
  { unit: 'deep_physics_05', search: '성분' },
  { unit: 'deep_physics_05', search: '보각' },
  { unit: 'deep_physics_06', search: '선속도' },
  { unit: 'deep_physics_06', search: '정지 궤도' },
  { unit: 'deep_physics_06', search: '뱅킹' },
  { unit: 'deep_physics_06', search: '원심분리기' },
  { unit: 'deep_physics_06', search: '비관성 기준계' },
  { unit: 'deep_physics_07', search: '줄' },
  { unit: 'deep_physics_07', search: '역학적 에너지' },
  { unit: 'deep_physics_07', search: '역학적 에너지 보존' },
  { unit: 'deep_physics_07', search: '보존력' },
  { unit: 'deep_physics_07', search: '와트' },
  { unit: 'deep_physics_08', search: '충돌' },
  { unit: 'deep_physics_08', search: '폭발' },
  { unit: 'deep_physics_08', search: '평균 힘' },
  { unit: 'deep_physics_08', search: '에어백' },
  { unit: 'deep_physics_09', search: '열효율' },
  { unit: 'deep_physics_19', search: 'LED' },
  { unit: 'deep_physics_19', search: 'MOSFET' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_physics_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);
