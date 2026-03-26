const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_earth_content.js", "utf8");

// 1. passage에서 태그 제거
const passageOnlyTags = [
  // deep_earth_01
  '원시 태양', '중력 섭동', '미행성 강착', '과두성장', '테이아', '핵', '맨틀', '원시 지각',
  // deep_earth_02
  '화산 폭발 지수(VEI)', '이산화황',
  // deep_earth_03
  '화성암', '퇴적암', '변성암', '유리질', '쇄설성', '화학적', '유기적', '증발암', '층리', '화석', '변성도', '변성 계열', '편리', '지질 온도계', '지질 압력계',
  // deep_earth_04
  '열 팽창 수축', '산화 작용', '킬레이트화', '생물교란', '토양', '기후', '모재', '지형', '생물', '시간',
  // deep_earth_05
  '흄의 제곱 법칙', '유역', '유역 분지', '상류', '폭포', '폭호', '하식애', '협곡', '중류', '범람원', '측방 침식', '포인트바', '곡류 절단', '망류 하천', '하류', '전적층', '사면층', '정적층', '새발형', '첨단형', '부채형',
  // deep_earth_06
  '판 경계', '규모(M)', '지진파', '실체파', '러브파', '레일리파', '수렴 경계', '지진해일(쓰나미)', '변환 경계', '발산 경계', '지진 조기 경보 시스템', '지진계', '기초 격리', '제진 장치',
  // deep_earth_07
  '맨틀 대류', '섭입판 견인력', '해령 밀어내기', '대륙 이동설', '해저 확장설', '히말라야 산맥', '충돌대 조산대', '안데스형 조산대', '단층', '해저 지형', '대륙 주변부', '대양저', '대륙사면', '심해 평원', '기요', '해산', '용승 마그마',
  // deep_earth_08
  '수평 퇴적의 법칙', '지각 변동', '측방 연속의 법칙', '대비', '퇴적 구조', '저탁류', '사구', '고수류 방향', '암상 대비', '생물층서 대비', '퇴적상', '표준 화석', '경사 부정합', '평행 부정합', '방사성 동위원소',
  // deep_earth_09
  '고생물학', '주형 화석', '압축 화석', '이언', '대', '기', '세', '선캄브리아 시대', '대산화 사건', '에디아카라 동물군', '고생대', '완족류', '필석', '양치식물', '중생대', '공룡', '신생대', '포유류', '유제류', '제4기',
  // deep_earth_10
  '쌍극자', '자북극', '자남극', '열대류', '자기 유도', '태양풍', '자기권계면', '자기권 꼬리', '자기 폭풍', '코로나 질량 방출', '퀴리 온도', '자철석', '적철석', '강자성 광물', '퇴적잔류자기', '지자기 시대', '지자기 사건', '브룬 정자극기', '마츠야마 역자극기', '하라미요 사건', '올두바이 사건', '판구조론',
  // deep_earth_11
  '페렐 순환', '극순환', '열대 수렴대', '아열대 고압대', '코리올리 효과', '대륙성 기단', '해양성 기단', '한대 기단', '열대 기단', '오호츠크해 기단', '양쯔강 기단', '기단 변질', '대류 불안정', '적란운', '층운형 구름', '폐색 전선', '저기압', '종관 기상학', '지상 일기도', '고층 일기도', '등압선', '노르웨이 학파', '잠열',
  // deep_earth_12
  '구름', '승화', '클라우드 응결핵', '건조 단열 감률', '습윤 단열 감률', '구름 분류', '적운형', '층운형', '층운', '층적운', '난층운', '권운', '권층운', '권적운', '고층운', '고적운', '강수', '포화 수증기압', '눈송이', '거대핵', '강수 유형', '소나기', '풍상 측', '풍하 측', '우량계',
  // deep_earth_13
  '심층 순환', '탁월풍', '무역풍', '적도 해류', '편서풍', '난류', '한류', '남극 저층수', '연안 용승', '적도 용승', '엘니뇨-남방 진동', '해양', '비열', '식물성 플랑크톤',
  // deep_earth_14
  '대륙성 기후', '온실효과', '온실가스', '지구 온난화', '수증기 피드백', '구름 피드백', '해수면 상승', '극한 기상 현상',
  // deep_earth_15
  '태양계', '태양', '가스 거대 행성', '얼음 거대 행성', '생명 가능 행성', '판구조 활동', '자기장', '태양계 소천체', '소행성대', '혜성', '오우무아무아',
  // deep_earth_16
  '자원', '화석 연료', '비재생 자원', '석유', '배사 구조', '석탄', '무연탄', '광물 자원', '정마그마 광상', '열수 광상', '퇴적 광상', '편재성', '리튬', '재생에너지', '태양광 발전', '풍력 발전', '지열 에너지', '조력 발전', '파력 발전', '스마트 그리드', '자원 효율성', '지구 시스템 경계',
  // deep_earth_17
  '조석', '지형 효과', '갯벌', '조석 해일', '해양파', '풍파', '시화호 조력발전소',
  // deep_earth_18
  '지질 연대', '지층 누중의 법칙', '동물군 천이의 법칙', '방사성 연대 측정법', '호상 철광층', '눈덩이 지구', '삼엽충', '파충류', '대규모 화산 분출', '속씨식물',
  // deep_earth_19
  '우주 탐사', '로켓 추진', '인공위성', '중궤도 위성', '화성 탐사', '엔셀라두스', '유인 화성 탐사', '소행성 자원 채굴', '우주 거주지 건설', '다누리',
  // deep_earth_20
  '자연재해', '기상학적 재해', '화산 폭발', '분출성 분화', '폭발성 분화', '태풍', '사피어-심프슨 등급', '방재 과학', '지진 조기경보 시스템', '내진 설계', '강진 보강', '수치 기상 예보', '재해 경감', '방조제', '사방댐', '유수지', '재해 위험도 평가', '재해 지도'
];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()]/g, '\\$&').replace(/-/g, '\\-')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
    console.log(`태그 제거: <b>${tag}</b> -> ${tag}`);
  }
});

// 2. passage에 태그 추가
const addTags = [
  { unit: 'deep_earth_02', search: '화산 폭발 지수' },
  { unit: 'deep_earth_03', search: '쇄설성 퇴적암' },
  { unit: 'deep_earth_04', search: '토양 형성 인자' },
  { unit: 'deep_earth_06', search: '규모' },
  { unit: 'deep_earth_06', search: '지진해일' },
  { unit: 'deep_earth_06', search: '지진 조기 경보' },
  { unit: 'deep_earth_09', search: '적응 방산' },
  { unit: 'deep_earth_14', search: '기후 변화 적응' },
  { unit: 'deep_earth_20', search: '지진 조기경보' },
  { unit: 'deep_earth_20', search: '재해 위험도' },
  { unit: 'deep_earth_20', search: '자연 기반 해법' }
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

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/science/deep_earth_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);
