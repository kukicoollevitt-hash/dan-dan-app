const fs = require('fs');

// 1. CSV 파일에서 서울 초등학교 데이터 읽기
const csvPath = './public/images/2025년도_학년별·학급별 학생수(초)_서울특별시교육청.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const csvLines = csvContent.split('\n');

// CSV 파싱 (첫 줄은 헤더)
const csvSchools = [];
for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i];
  if (!line.trim()) continue;

  const matches = line.match(/"([^"]*)"/g);
  if (!matches || matches.length < 35) continue;

  const clean = (s) => s.replace(/"/g, '');
  const region = clean(matches[2]);
  const schoolName = clean(matches[4]);
  const totalStudents = parseInt(clean(matches[34])) || 0;

  const regionParts = region.split(' ');
  const sido = regionParts[0];
  const sigungu = regionParts[1] || '';

  if (totalStudents >= 500) {
    csvSchools.push({
      sido,
      sigungu,
      name: schoolName,
      students: totalStudents
    });
  }
}

// 2. school_list.html에서 현재 서울 학교 목록 추출
const htmlPath = './public/school_list.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const seoulSchoolRegex = /\{\s*sido:\s*"서울특별시",\s*sigungu:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*students:\s*(\d+)/g;
const existingSchools = new Set();
let match;
while ((match = seoulSchoolRegex.exec(htmlContent)) !== null) {
  existingSchools.add(match[2]);
}

// 3. 누락된 학교 찾기
const missingSchools = csvSchools.filter(school => !existingSchools.has(school.name));

console.log(`누락된 학교: ${missingSchools.length}개`);

// 4. 학생수 기준으로 정렬 (오름차순)
missingSchools.sort((a, b) => a.students - b.students);

// 5. HTML 파일에 학교 추가
// 서울특별시 데이터 끝 부분 찾기 (세종특별자치시 시작 전)
const insertPoint = htmlContent.indexOf('// 세종특별자치시');

if (insertPoint === -1) {
  console.error('삽입 위치를 찾을 수 없습니다.');
  process.exit(1);
}

// 누락된 학교들을 문자열로 변환
const newSchoolsStr = missingSchools.map(s =>
  `      { sido: "서울특별시", sigungu: "${s.sigungu}", name: "${s.name}", students: ${s.students}, competitor: "" },`
).join('\n');

// 삽입
const newContent = htmlContent.slice(0, insertPoint) + newSchoolsStr + '\n      ' + htmlContent.slice(insertPoint);

// 파일 저장
fs.writeFileSync(htmlPath, newContent, 'utf-8');

console.log(`${missingSchools.length}개 학교 추가 완료!`);
