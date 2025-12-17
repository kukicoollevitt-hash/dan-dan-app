// 자동과제부여로 추가된 잘못된 과제들 정리
const mongoose = require('mongoose');
require('dotenv').config();

const userProgressSchema = new mongoose.Schema({
  grade: String,
  name: String,
  studyRoom: {
    assignedTasks: [{
      unitId: String,
      unitTitle: String,
      seriesName: String,
      fieldName: String,
      subjectName: String,
      assignedAt: Date,
      isAutoAssigned: Boolean
    }]
  }
}, { strict: false });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

async function cleanAutoTasks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공\n');

    // 6학년 브레인딥 학생의 학습실 조회
    const progress = await UserProgress.findOne({
      grade: '6학년',
      name: '브레인딥'
    });

    if (!progress || !progress.studyRoom || !progress.studyRoom.assignedTasks) {
      console.log('❌ 학습실 데이터가 없습니다.');
      await mongoose.disconnect();
      return;
    }

    console.log(`📋 현재 과제 수: ${progress.studyRoom.assignedTasks.length}개\n`);

    // 자동부여된 과제 확인
    const autoTasks = progress.studyRoom.assignedTasks.filter(t => t.isAutoAssigned);
    console.log(`🤖 자동부여 과제: ${autoTasks.length}개`);
    autoTasks.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.unitTitle || 'undefined'} (${t.seriesName || 'undefined'}) - ${t.unitId}`);
    });

    // 자동부여된 과제 중 seriesName이 undefined인 것만 삭제
    const tasksToRemove = progress.studyRoom.assignedTasks.filter(t =>
      t.isAutoAssigned && (!t.seriesName || !t.unitTitle || t.unitTitle === 'undefined')
    );

    console.log(`\n🗑️ 삭제할 과제: ${tasksToRemove.length}개`);
    tasksToRemove.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.unitId}`);
    });

    if (tasksToRemove.length > 0) {
      // 잘못된 과제 제거
      progress.studyRoom.assignedTasks = progress.studyRoom.assignedTasks.filter(t =>
        !(t.isAutoAssigned && (!t.seriesName || !t.unitTitle || t.unitTitle === 'undefined'))
      );

      await progress.save();
      console.log(`\n✅ ${tasksToRemove.length}개 과제 삭제 완료!`);
      console.log(`📋 남은 과제 수: ${progress.studyRoom.assignedTasks.length}개`);
    } else {
      console.log('\n✅ 삭제할 과제가 없습니다.');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

cleanAutoTasks();
