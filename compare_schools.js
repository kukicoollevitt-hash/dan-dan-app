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

  // CSV 파싱 (쌍따옴표 처리)
  const matches = line.match(/"([^"]*)"/g);
  if (!matches || matches.length < 35) continue;

  const clean = (s) => s.replace(/"/g, '');
  const region = clean(matches[2]); // "서울특별시 강남구" 형태
  const schoolName = clean(matches[4]); // 학교명
  const totalStudents = parseInt(clean(matches[34])) || 0; // 학생수(계)

  // 지역에서 시군구 추출
  const regionParts = region.split(' ');
  const sido = regionParts[0]; // 서울특별시
  const sigungu = regionParts[1] || ''; // 강남구

  if (totalStudents >= 500) {
    csvSchools.push({
      sido,
      sigungu,
      name: schoolName,
      students: totalStudents
    });
  }
}

console.log(`\n📊 CSV 파일에서 500명 이상 학교: ${csvSchools.length}개\n`);

// 2. school_list.html에서 현재 서울 학교 목록 추출
const htmlPath = './public/school_list.html';
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// schoolData 배열에서 서울 학교 추출
const seoulSchoolRegex = /\{\s*sido:\s*"서울특별시",\s*sigungu:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*students:\s*(\d+)/g;
const existingSchools = new Set();
let match;
while ((match = seoulSchoolRegex.exec(htmlContent)) !== null) {
  const sigungu = match[1];
  const name = match[2];
  existingSchools.add(name);
}

console.log(`📋 현재 school_list.html의 서울 학교: ${existingSchools.size}개\n`);

// 3. 누락된 학교 찾기
const missingSchools = csvSchools.filter(school => !existingSchools.has(school.name));

console.log(`❌ 누락된 학교 (500명 이상): ${missingSchools.length}개\n`);
console.log('='.repeat(80));

// 시군구별로 정렬
missingSchools.sort((a, b) => {
  if (a.sigungu !== b.sigungu) return a.sigungu.localeCompare(b.sigungu);
  return b.students - a.students;
});

// 결과 출력
let currentSigungu = '';
for (const school of missingSchools) {
  if (school.sigungu !== currentSigungu) {
    currentSigungu = school.sigungu;
    console.log(`\n【${currentSigungu}】`);
  }
  console.log(`  { sido: "서울특별시", sigungu: "${school.sigungu}", name: "${school.name}", students: ${school.students}, competitor: "" },`);
}

console.log('\n' + '='.repeat(80));
console.log(`\n총 ${missingSchools.length}개 학교 추가 필요`);
