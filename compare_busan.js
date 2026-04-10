const fs = require('fs');

// 1. CSV 파일에서 부산 초등학교 데이터 읽기
const csvPath = './public/images/2025년도_학년별·학급별 학생수(초)_부산광역시교육청.csv';
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

console.log(`\n📊 부산 CSV에서 500명 이상 학교: ${csvSchools.length}개\n`);

// 2. school_list.html에서 현재 부산 학교 목록 추출
const htmlPath = './public/school_list.html';
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const busanRegex = /\{\s*sido:\s*"부산광역시",\s*sigungu:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*students:\s*(\d+)/g;
const existingSchools = new Set();
let match;
while ((match = busanRegex.exec(htmlContent)) !== null) {
  existingSchools.add(match[2]);
}

console.log(`📋 현재 school_list.html의 부산 학교: ${existingSchools.size}개\n`);

// 3. 누락된 학교 찾기
const missingSchools = csvSchools.filter(school => !existingSchools.has(school.name));

console.log(`❌ 누락된 학교 (500명 이상): ${missingSchools.length}개\n`);

if (missingSchools.length > 0) {
  // 시군구별로 그룹화
  const bySigungu = {};
  for (const school of missingSchools) {
    if (!bySigungu[school.sigungu]) bySigungu[school.sigungu] = [];
    bySigungu[school.sigungu].push(school);
  }

  // 시군구별로 정렬해서 출력
  const sigunguOrder = Object.keys(bySigungu).sort();
  for (const sigungu of sigunguOrder) {
    const schools = bySigungu[sigungu];
    schools.sort((a, b) => b.students - a.students);
    console.log(`\n【${sigungu}】 - ${schools.length}개 누락`);
    for (const s of schools) {
      console.log(`  { sido: "부산광역시", sigungu: "${s.sigungu}", name: "${s.name}", students: ${s.students}, competitor: "" },`);
    }
  }
}

console.log('\n' + '='.repeat(60));
console.log(`총 ${missingSchools.length}개 학교 추가 필요`);
