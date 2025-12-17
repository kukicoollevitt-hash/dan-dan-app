// 완료된 단원 확인 (상세)
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
    }).select('unitId').limit(10);

    console.log('📋 완료된 학습 로그 샘플 (처음 10개):');
    logs.forEach((log, i) => {
      console.log(`  ${i + 1}. unitId: "${log.unitId}"`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

checkCompleted();
