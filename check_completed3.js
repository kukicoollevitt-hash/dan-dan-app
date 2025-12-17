// 완료된 단원 확인 (전체 필드)
const mongoose = require('mongoose');
require('dotenv').config();

async function checkCompleted() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공\n');

    const LearningLog = mongoose.model('LearningLog', new mongoose.Schema({}, { strict: false }));

    // 완료된 학습 기록 조회 (전체 필드)
    const logs = await LearningLog.find({
      grade: '6학년',
      name: '브레인딥',
      completed: true,
      deleted: { $ne: true }
    }).limit(5);

    console.log('📋 완료된 학습 로그 샘플 (처음 5개 전체 필드):');
    logs.forEach((log, i) => {
      console.log(`\n${i + 1}. 전체 데이터:`);
      console.log(JSON.stringify(log.toObject(), null, 2));
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

checkCompleted();
