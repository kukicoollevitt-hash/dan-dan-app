// 완료 현황 및 우선순위 확인
const mongoose = require('mongoose');
require('dotenv').config();

// 과목 우선순위 (사용자 요청)
// 생물 > 지구과학 > 물리 > 화학 > 사회문화 > 지리 > 법 > 정치경제 > 현대문학 > 고전문학 > 세계문학1 > 세계문학2 > 한국인물 > 세계인물
const SUBJECT_PRIORITY = [
  'bio',      // 생물
  'earth',    // 지구과학
  'physics',  // 물리
  'chem',     // 화학
  'soc',      // 사회문화
  'geo',      // 지리
  'law',      // 법
  'pol',      // 정치경제
  'modern',   // 현대문학
  'classic',  // 고전문학
  'world1',   // 세계문학1
  'world2',   // 세계문학2
  'people1',  // 한국인물
  'people2'   // 세계인물
];

async function checkPriority() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공\n');

    const LearningLog = mongoose.model('LearningLog', new mongoose.Schema({}, { strict: false }));

    // 완료된 학습 기록 조회
    const logs = await LearningLog.find({
      grade: '6학년',
      name: '브레인딥',
      completed: true,
      deleted: { $ne: true }
    });

    // 시리즈별 완료 현황
    const completed = { up: new Set(), fit: new Set(), deep: new Set() };

    for (const log of logs) {
      const unit = log.unit;
      if (!unit || unit === 'undefined') continue;

      if (unit.startsWith('fit_')) {
        completed.fit.add(unit);
      } else if (unit.startsWith('deep_')) {
        completed.deep.add(unit);
      } else {
        completed.up.add(unit);
      }
    }

    console.log('=== 완료 현황 ===\n');
    console.log('🔹 BRAIN업 완료:', completed.up.size, '개');
    console.log('   ', [...completed.up].sort().join(', ') || '(없음)');
    console.log('\n🔹 BRAIN핏 완료:', completed.fit.size, '개');
    console.log('   ', [...completed.fit].sort().join(', ') || '(없음)');
    console.log('\n🔹 BRAIN딥 완료:', completed.deep.size, '개');
    console.log('   ', [...completed.deep].sort().join(', ') || '(없음)');

    // 각 시리즈별로 첫 번째 미완료 단원 찾기
    console.log('\n\n=== 시리즈별 첫 번째 미완료 단원 (우선순위순) ===\n');

    const maxUnits = {
      bio: 20, earth: 20, physics: 20, chem: 20,
      soc: 20, geo: 20, law: 20, pol: 20,
      modern: 30, classic: 30, world1: 20, world2: 20,
      people1: 20, people2: 20
    };

    for (const [seriesKey, seriesName, prefix] of [['up', 'BRAIN업', ''], ['fit', 'BRAIN핏', 'fit_'], ['deep', 'BRAIN딥', 'deep_']]) {
      console.log(`📌 ${seriesName}:`);
      let found = false;

      // 단원번호 01부터 순서대로
      for (let unitNum = 1; unitNum <= 30 && !found; unitNum++) {
        const unitNo = String(unitNum).padStart(2, '0');

        // 과목 우선순위 순서대로
        for (const subject of SUBJECT_PRIORITY) {
          const max = maxUnits[subject] || 20;
          if (unitNum > max) continue;

          const unitKey = `${prefix}${subject}_${unitNo}`;

          if (!completed[seriesKey].has(unitKey)) {
            console.log(`   ✅ 첫 번째 미완료: ${unitKey}`);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        console.log('   (모두 완료)');
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

checkPriority();
