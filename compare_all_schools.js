const fs = require('fs');

// 1. CSV 파일에서 전국 초등학교 데이터 읽기
const csvPath = './public/images/2025년도_학년별·학급별 학생수(초)_전체.csv';
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
  const sidoEdu = clean(matches[0]); // 시도교육청
  const region = clean(matches[2]); // "서울특별시 강남구" 형태
  const schoolName = clean(matches[4]); // 학교명
  const totalStudents = parseInt(clean(matches[34])) || 0; // 학생수(계)

  // 지역에서 시도, 시군구 추출
  const regionParts = region.split(' ');
  let sido = regionParts[0]; // 서울특별시
  let sigungu = regionParts[1] || ''; // 강남구

  // 시도 이름 정규화
  if (sido.includes('강원')) sido = '강원특별자치도';
  if (sido.includes('전북') || sido.includes('전라북도')) sido = '전북특별자치도';
  if (sido.includes('제주')) sido = '제주특별자치도';
  if (sido.includes('세종')) {
    sido = '세종특별자치시';
    sigungu = '세종시';
  }

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

// 2. school_list.html에서 현재 학교 목록 추출
const htmlPath = './public/school_list.html';
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const schoolRegex = /\{\s*sido:\s*"([^"]+)",\s*sigungu:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*students:\s*(\d+)/g;
const existingSchools = new Map();
let match;
while ((match = schoolRegex.exec(htmlContent)) !== null) {
  const key = match[3]; // 학교명
  existingSchools.set(key, {
    sido: match[1],
    sigungu: match[2],
    students: parseInt(match[4])
  });
}

console.log(`📋 현재 school_list.html의 학교: ${existingSchools.size}개\n`);

// 3. 누락된 학교 찾기
const missingSchools = csvSchools.filter(school => !existingSchools.has(school.name));

console.log(`❌ 누락된 학교 (500명 이상): ${missingSchools.length}개\n`);

// 시도별로 그룹화
const bySido = {};
for (const school of missingSchools) {
  if (!bySido[school.sido]) bySido[school.sido] = [];
  bySido[school.sido].push(school);
}

// 시도별로 정렬해서 출력
const sidoOrder = Object.keys(bySido).sort();
for (const sido of sidoOrder) {
  const schools = bySido[sido];
  schools.sort((a, b) => b.students - a.students);
  console.log(`\n【${sido}】 - ${schools.length}개 누락`);
  for (const s of schools.slice(0, 5)) { // 상위 5개만 출력
    console.log(`  ${s.sigungu} ${s.name}: ${s.students}명`);
  }
  if (schools.length > 5) {
    console.log(`  ... 외 ${schools.length - 5}개`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`총 ${missingSchools.length}개 학교 추가 필요`);
