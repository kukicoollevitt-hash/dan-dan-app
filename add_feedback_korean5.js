const fs = require('fs');

// 파일 읽기
let content = fs.readFileSync('./public/mock_exam_feedback.html', 'utf8');

// korean_mock_1 피드백 데이터 추출 (679번 라인부터)
const start = content.indexOf("'korean_mock_1': {");
const searchStart = content.indexOf("'korean_mock_2': {");
const mock1End = content.lastIndexOf('},', searchStart);

// korean_mock_1 전체 블록 추출
let mock1Block = content.substring(start, mock1End + 2);

// korean_mock_5용으로 변형
let mock5Block = mock1Block.replace("'korean_mock_1':", "'korean_mock_5':");

// 피드백 내용도 살짝 변형 (동의어 치환)
const feedbackTransforms = {
    '이 문항은': '본 문항은',
    '파악하는 문제입니다': '분석하는 문제입니다',
    '판단하는 문제입니다': '평가하는 문제입니다',
    '구분하는 문제입니다': '분류하는 문제입니다',
    '오답에 빠지기 쉽습니다': '오답을 선택하기 쉽습니다',
    '오답이 됩니다': '오답으로 이어집니다',
    '오답에 이르기 쉽습니다': '오답을 선택하게 됩니다',
    '주의해야 합니다': '유의해야 합니다',
    '기억하세요': '명심하세요',
    '확인하세요': '점검하세요',
    '연습을 하세요': '훈련을 하세요',
    '체크하세요': '확인하세요',
    '정확히 정리하세요': '명확히 정리하세요',
    '반드시': '꼭',
    '먼저': '우선',
    '핵심입니다': '요체입니다',
    '중요합니다': '중요시됩니다',
    '판단함': '간주함',
    '구분하지 못함': '분별하지 못함'
};

for (const [original, replacement] of Object.entries(feedbackTransforms)) {
    mock5Block = mock5Block.split(original).join(replacement);
}

// korean_mock_4 다음에 korean_mock_5 추가
// korean_mock_4 블록 끝 위치 찾기
const mock4Start = content.indexOf("'korean_mock_4': {");
const insertPoint = content.indexOf('};', mock4Start);

// korean_mock_5 블록 삽입
const beforeInsert = content.substring(0, insertPoint);
const afterInsert = content.substring(insertPoint);

// 들여쓰기 맞추기
const formattedMock5 = '\n            ' + mock5Block;
content = beforeInsert + formattedMock5 + afterInsert;

// areaQuestionsByExam에도 korean_mock_5 추가
// korean_mock_4의 영역별 문제 설정 찾기
const areaStart = content.indexOf("'korean_mock_4': {", content.indexOf("areaQuestionsByExam"));
const areaEnd = content.indexOf('}', areaStart) + 1;

// korean_mock_1의 영역별 문제 설정 복사
const area1Start = content.indexOf("'korean_mock_1': {", content.indexOf("areaQuestionsByExam"));
const area1End = content.indexOf('}', area1Start) + 1;
const area1Block = content.substring(area1Start, area1End);
const area5Block = area1Block.replace("'korean_mock_1':", "'korean_mock_5':");

// korean_mock_4 다음에 삽입
const insertArea = content.indexOf('},', areaEnd - 1) + 2;
content = content.substring(0, insertArea) + '\n            ' + area5Block + ',' + content.substring(insertArea);

// 파일 저장
fs.writeFileSync('./public/mock_exam_feedback.html', content, 'utf8');

console.log('korean_mock_5 피드백 데이터 추가 완료!');
