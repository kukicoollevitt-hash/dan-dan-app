// undefined 과제 정리
const mongoose = require('mongoose');
require('dotenv').config();

const userProgressSchema = new mongoose.Schema({
  grade: String,
  name: String,
  studyRoom: mongoose.Schema.Types.Mixed
}, { strict: false });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

async function cleanUndefinedTasks() {
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

    const tasks = progress.studyRoom.assignedTasks;
    console.log(`📋 현재 과제 수: ${tasks.length}개\n`);

    // 모든 과제 출력
    console.log('📝 현재 과제 목록:');
    tasks.forEach((t, i) => {
      const title = t.unitTitle || 'undefined';
      const series = t.seriesName || 'undefined';
      const subject = t.subjectName || 'undefined';
      const field = t.fieldName || 'undefined';
      console.log(`  ${i + 1}. ${title} | ${series} > ${field} > ${subject} | ${t.unitId}`);
    });

    // undefined가 포함된 과제 찾기
    const badTasks = tasks.filter(t =>
      !t.unitTitle ||
      !t.seriesName ||
      t.unitTitle === 'undefined' ||
      t.seriesName === 'undefined' ||
      (t.unitId && t.unitId.includes('on_'))  // BRAIN온 과제도 제거
    );

    console.log(`\n🗑️ 삭제할 과제: ${badTasks.length}개`);
    badTasks.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.unitId}`);
    });

    if (badTasks.length > 0) {
      // 잘못된 과제 제거
      progress.studyRoom.assignedTasks = tasks.filter(t =>
        t.unitTitle &&
        t.seriesName &&
        t.unitTitle !== 'undefined' &&
        t.seriesName !== 'undefined' &&
        !(t.unitId && t.unitId.includes('on_'))
      );

      await progress.save();
      console.log(`\n✅ ${badTasks.length}개 과제 삭제 완료!`);
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

cleanUndefinedTasks();
