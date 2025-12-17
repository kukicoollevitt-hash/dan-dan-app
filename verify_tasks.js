// 저장된 과제 확인
const mongoose = require('mongoose');
require('dotenv').config();

const userProgressSchema = new mongoose.Schema({
  grade: String,
  name: String,
  studyRoom: mongoose.Schema.Types.Mixed
}, { strict: false });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

async function verifyTasks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공\n');

    const progress = await UserProgress.findOne({
      grade: '6학년',
      name: '브레인딥'
    });

    if (!progress || !progress.studyRoom || !progress.studyRoom.assignedTasks) {
      console.log('❌ 학습실 데이터가 없습니다.');
      await mongoose.disconnect();
      return;
    }

    const tasks = progress.studyRoom.assignedTasks;
    console.log(`📋 현재 과제 수: ${tasks.length}개\n`);

    console.log('📝 현재 과제 목록:');
    tasks.forEach((t, i) => {
      console.log(`\n${i + 1}. ${t.unitTitle || 'undefined'}`);
      console.log(`   시리즈: ${t.seriesName || 'undefined'}`);
      console.log(`   분야: ${t.fieldName || 'undefined'}`);
      console.log(`   과목: ${t.subjectName || 'undefined'}`);
      console.log(`   경로: ${t.unitId || 'undefined'}`);
      console.log(`   자동부여: ${t.isAutoAssigned || false}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

verifyTasks();
