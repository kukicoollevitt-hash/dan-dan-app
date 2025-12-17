// 완료된 단원 확인
const mongoose = require('mongoose');
require('dotenv').config();

async function checkCompleted() {
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
    }).select('unitId');

    console.log('📋 완료된 학습 로그:', logs.length, '개\n');

    // 시리즈별로 분류
    const completed = { up: [], fit: [], deep: [] };
    for (const log of logs) {
      if (!log.unitId) continue;
      const match = log.unitId.match(/((?:fit_|deep_|on_)?[a-z]+\d?)_(\d+)/i);
      if (match) {
        const key = match[1].toLowerCase() + '_' + match[2];
        if (key.startsWith('fit_')) completed.fit.push(key);
        else if (key.startsWith('deep_')) completed.deep.push(key);
        else completed.up.push(key);
      }
    }

    console.log('🔹 BRAIN업 완료:', completed.up.length, '개');
    console.log('   ', completed.up.sort().join(', '));
    console.log('\n🔹 BRAIN핏 완료:', completed.fit.length, '개');
    console.log('   ', completed.fit.sort().join(', '));
    console.log('\n🔹 BRAIN딥 완료:', completed.deep.length, '개');
    console.log('   ', completed.deep.sort().join(', '));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

checkCompleted();
