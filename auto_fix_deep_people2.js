const fs = require("fs");
let content = fs.readFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people2_content.js", "utf8");

// 1. passage에서 태그 제거 (passageOnly 단어들)
const passageOnlyTags = [
  // deep_people2_01
  '공증인', '재능', '풍경', '경험', '수력학', '광학', '학자', '생명력', '스푸마토', '벽화', '긴장감', '걸작', '교훈', '유산', '영감', '탐구심', '영향', '상징',
  // deep_people2_02
  '르네상스', '예술가', '행정관', '열망', '공방', '프레스코화', '후원', '조각', '조각상', '걸작', '성당', '천장화', '비계', '고난', '이미지', '해부학', '인내', '열정', '혼신', '완성', '돔', '업적',
  // deep_people2_03
  '스트랫퍼드', '황금기', '문법학교', '라틴어', '극작가', '구조', '무대', '붐', '관객', '관찰', '연극', '기술', '대본', '공연', '환호', '글로브', '감동', '비극', '희곡', '명언', '불멸',
  // deep_people2_04
  '의뢰', '관습', '자유', '대담', '생계', '지위', '계층', '평등', '특권', '존엄성', '오락', '메시지', '도전', '선율', '걸작', '유산', '영향', '교재',
  // deep_people2_05
  '암기', '자율', '기하학', '학습', '발견', '서류', '탐구', '열정', '효과', '운동', '충격', '주목', '개념', '속도', '우주론', '토대', '기여', '인도주의자', '위험성', '업적', '롤모델', '유산', '초석', '진보',
  // deep_people2_06
  '바르샤바', '지배', '우수', '소르본', '실력', '무시', '조력자', '광석', '탐색', '정제', '열악', '충격', '사고', '교수', '재생불량성빈혈', '판테온', '롤모델',
  // deep_people2_07
  '구자라트', '영감',
  // deep_people2_08
  '오하이오주', '순간', '졸업장',
  // deep_people2_09
  '앨라배마주', '졸업', '장애인', '평등', '희망', '용기', '장애', '영감',
  // deep_people2_10
  '네덜란드', '화랑', '신학', '고통', '붓터치', '표현적', '아를', '연작', '공동체', '아이리스', '후기인상파', '표현주의',
  // deep_people2_11
  '이탈리아', '반대', '야전병원', '치료', '다이어그램', '정책',
  // deep_people2_12
  '추장', '투표권', '변호사', '예의', '처벌', '인내',
  // deep_people2_13
  '캘리포니아', '기계', '수업', '충돌', '터치스크린', '예술', '췌장암',
  // deep_people2_14
  '오스만 제국', '신앙심', '고아원', '기부', '겸허', '가르침', '영감',
  // deep_people2_15
  '말라가', '물감', '각도', '가면', '흑백', '충격적', '혁신', '실험',
  // deep_people2_16
  '시카고', '테마파크', '순례지', '마법', '기록', '도전', '창의력',
  // deep_people2_17
  '무두장이', '탄저병', '기적', '인류', '지식',
  // deep_people2_18
  '농가', '트라코마', '비위생', '냉대', '슬픔', '노력', '단절', '뒤엎고', '규칙', '손가락', '좌절', '철자', '의지', '진학', '운동가',
  // deep_people2_19
  '알코올', '구걸', '외로움', '품위', '표정', '위로', '용기', '집념', '메시지', '영감',
  // deep_people2_20
  '경찰', '노력', '지지', '고고학자', '국립공원', '기록',
  // deep_people2_21
  '스타일', '성분', '광물', '완성', '시도', '비싼', '낙찰', '연주자', '재단', '귀감',
  // deep_people2_22
  '피아노', '청력', '진동', '대화', '의지', '합창', '가수', '추모', '교훈',
  // deep_people2_23
  '세례', '스푸마토', '루브르', '식당', '벽화', '공학자', '낙하산', '과학적', '공식', '임종', '천재', '영향',
  // deep_people2_24
  '혁명',
  // deep_people2_28
  '영광', '명예',
  // deep_people2_29
  '무사', '가르침', '책임감', '근면', '도',
  // deep_people2_30
  '애정', '중심지',
  // deep_people2_31
  '정세', '통치자', '패권', '개선식', '파라오', '정치력', '번영',
  // deep_people2_32
  '복합궁', '지휘', '관용', '역참', '상업',
  // deep_people2_33
  '인구론', '논쟁',
  // deep_people2_34
  '상복', '필수품', '실용성', '복귀', '아이콘',
  // deep_people2_35
  '농업', '백신', '억만장자', '기후변화', '기업가', '사회공헌가',
  // deep_people2_36
  '광고', '상업적', '열풍', '훈장', '유산', '챔피언',
  // deep_people2_37
  '적', '시합', '인정', '고통', '비문',
  // deep_people2_38
  '장군', '테베', '전차', '극치', '상징',
  // deep_people2_39
  '이탈리아', '의학', '수학', '목성', '코페르니쿠스', '교회', '일화', '연금', '역학', '과학', '수학적 증명',
  // deep_people2_40
  '크로아티아', '코일', '워든클리프 타워', '발명가'
];

let tagRemoveCount = 0;
passageOnlyTags.forEach(tag => {
  const regex = new RegExp(`<b>${tag.replace(/[()]/g, '\\$&')}</b>`, 'g');
  const before = content;
  content = content.replace(regex, tag);
  if (before !== content) {
    tagRemoveCount++;
  }
});

console.log(`태그 제거: ${tagRemoveCount}개`);

// 2. passage에 태그 추가
const addTags = [
  { unit: 'deep_people2_25', search: '암살' },
  { unit: 'deep_people2_25', search: '독학' },
  { unit: 'deep_people2_25', search: '연설' },
  { unit: 'deep_people2_25', search: '애도' },
  { unit: 'deep_people2_26', search: '법전' },
  { unit: 'deep_people2_26', search: '봉건제도' },
  { unit: 'deep_people2_26', search: '퇴위' },
  { unit: 'deep_people2_27', search: '저항' },
  { unit: 'deep_people2_27', search: '연설' },
  { unit: 'deep_people2_27', search: '정의' },
  { unit: 'deep_people2_27', search: '헌신' }
];

let tagAddCount = 0;
addTags.forEach(item => {
  const unitStart = content.indexOf(item.unit + ':');
  if (unitStart === -1) return;

  const nextUnitNum = parseInt(item.unit.split('_')[2]) + 1;
  const nextUnit = 'deep_people2_' + String(nextUnitNum).padStart(2, '0');
  const nextUnitStart = content.indexOf(nextUnit + ':', unitStart);

  const passageStart = content.indexOf('passage:', unitStart);
  const vocabStart = content.indexOf('vocab:', passageStart);

  if (passageStart === -1 || vocabStart === -1) return;

  const effectiveVocabStart = (nextUnitStart !== -1 && vocabStart > nextUnitStart) ? nextUnitStart : vocabStart;
  const passageSection = content.substring(passageStart, effectiveVocabStart);

  if (passageSection.includes(`<b>${item.search}</b>`)) return;

  if (passageSection.includes(item.search)) {
    const newPassage = passageSection.replace(item.search, `<b>${item.search}</b>`);
    content = content.substring(0, passageStart) + newPassage + content.substring(effectiveVocabStart);
    tagAddCount++;
    console.log(`태그 추가: ${item.unit} - ${item.search}`);
  }
});

fs.writeFileSync("/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/person/deep_people2_content.js", content);
console.log(`\n태그 제거: ${tagRemoveCount}개, 태그 추가: ${tagAddCount}개 완료!`);
