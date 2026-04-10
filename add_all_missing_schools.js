const fs = require('fs');

// 1. CSV 파일에서 전국 초등학교 데이터 읽기
const csvPath = './public/images/2025년도_학년별·학급별 학생수(초)_전체.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const csvLines = csvContent.split('\n');

// CSV 파싱
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
  let sido = regionParts[0];
  let sigungu = regionParts[1] || '';

  // 시도 이름 정규화
  if (sido.includes('강원')) sido = '강원특별자치도';
  if (sido.includes('전북') || sido.includes('전라북도')) sido = '전북특별자치도';
  if (sido.includes('제주')) sido = '제주특별자치도';
  if (sido.includes('세종')) {
    sido = '세종특별자치시';
    sigungu = '세종시';
  }

  // 빈 시도 건너뛰기
  if (!sido || sido.trim() === '') continue;

  if (totalStudents >= 500) {
    csvSchools.push({
      sido,
      sigungu,
      name: schoolName,
      students: totalStudents
    });
  }
}

console.log(`CSV 파일에서 500명 이상 학교: ${csvSchools.length}개`);

// 2. school_list.html에서 현재 학교 목록 추출
const htmlPath = './public/school_list.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const schoolRegex = /\{\s*sido:\s*"([^"]+)",\s*sigungu:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*students:\s*(\d+)/g;
const existingSchools = new Set();
let match;
while ((match = schoolRegex.exec(htmlContent)) !== null) {
  existingSchools.add(match[3]);
}

console.log(`현재 school_list.html의 학교: ${existingSchools.size}개`);

// 3. 누락된 학교 찾기
const missingSchools = csvSchools.filter(school => !existingSchools.has(school.name));

console.log(`누락된 학교: ${missingSchools.length}개`);

// 시도별로 그룹화
const bySido = {};
for (const school of missingSchools) {
  if (!bySido[school.sido]) bySido[school.sido] = [];
  bySido[school.sido].push(school);
}

// 4. 각 시도별로 적절한 위치에 삽입
// 시도 순서 (school_list.html의 순서)
const sidoOrder = [
  '강원특별자치도',
  '경기도',
  '경상남도',
  '경상북도',
  '광주광역시',
  '대구광역시',
  '대전광역시',
  '부산광역시',
  '서울특별시',
  '세종특별자치시',
  '울산광역시',
  '인천광역시',
  '전라남도',
  '전북특별자치도',
  '제주특별자치도',
  '충청남도',
  '충청북도'
];

let addedCount = 0;

for (const sido of sidoOrder) {
  if (!bySido[sido] || bySido[sido].length === 0) continue;

  const schools = bySido[sido];
  schools.sort((a, b) => a.students - b.students); // 학생수 오름차순

  // 해당 시도의 마지막 항목 찾기
  const sidoPattern = new RegExp(`\\{\\s*sido:\\s*"${sido.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",\\s*sigungu:\\s*"[^"]+",\\s*name:\\s*"[^"]+",\\s*students:\\s*\\d+,\\s*competitor:\\s*""\\s*\\},?`, 'g');

  let lastMatch = null;
  let m;
  while ((m = sidoPattern.exec(htmlContent)) !== null) {
    lastMatch = m;
  }

  if (lastMatch) {
    // 마지막 항목 뒤에 삽입
    const insertPos = lastMatch.index + lastMatch[0].length;
    const newSchoolsStr = '\n' + schools.map(s =>
      `      { sido: "${s.sido}", sigungu: "${s.sigungu}", name: "${s.name}", students: ${s.students}, competitor: "" },`
    ).join('\n');

    htmlContent = htmlContent.slice(0, insertPos) + newSchoolsStr + htmlContent.slice(insertPos);
    addedCount += schools.length;
    console.log(`${sido}: ${schools.length}개 추가`);
  } else {
    console.log(`${sido}: 삽입 위치를 찾을 수 없음`);
  }
}

// 파일 저장
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

console.log(`\n총 ${addedCount}개 학교 추가 완료!`);
