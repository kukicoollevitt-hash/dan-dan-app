const fs = require('fs');

// 1. CSV 파일에서 부산 초등학교 데이터 읽기
const csvPath = './public/images/2025년도_학년별·학급별 학생수(초)_부산광역시교육청.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const csvLines = csvContent.split('\n');

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
  const sigungu = regionParts[1] || '';

  if (totalStudents >= 500) {
    csvSchools.push({
      sido: '부산광역시',
      sigungu,
      name: schoolName,
      students: totalStudents
    });
  }
}

// 2. school_list.html에서 현재 부산 학교 목록 추출
const htmlPath = './public/school_list.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const busanRegex = /\{\s*sido:\s*"부산광역시",\s*sigungu:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*students:\s*(\d+)/g;
const existingSchools = new Set();
let match;
while ((match = busanRegex.exec(htmlContent)) !== null) {
  existingSchools.add(match[2]);
}

// 3. 누락된 학교 찾기
const missingSchools = csvSchools.filter(school => !existingSchools.has(school.name));

if (missingSchools.length === 0) {
  console.log('누락된 학교 없음');
  process.exit(0);
}

console.log(`누락된 학교: ${missingSchools.length}개`);

// 학생수 오름차순 정렬
missingSchools.sort((a, b) => a.students - b.students);

// 부산광역시 마지막 항목 찾기
const busanPattern = /\{\s*sido:\s*"부산광역시",\s*sigungu:\s*"[^"]+",\s*name:\s*"[^"]+",\s*students:\s*\d+,\s*competitor:\s*""?\s*\},?/g;

let lastMatch = null;
let m;
while ((m = busanPattern.exec(htmlContent)) !== null) {
  lastMatch = m;
}

if (lastMatch) {
  const insertPos = lastMatch.index + lastMatch[0].length;
  const newSchoolsStr = '\n' + missingSchools.map(s =>
    `      { sido: "${s.sido}", sigungu: "${s.sigungu}", name: "${s.name}", students: ${s.students}, competitor: "" },`
  ).join('\n');

  htmlContent = htmlContent.slice(0, insertPos) + newSchoolsStr + htmlContent.slice(insertPos);
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log(`${missingSchools.length}개 학교 추가 완료!`);
} else {
  console.log('삽입 위치를 찾을 수 없음');
}
