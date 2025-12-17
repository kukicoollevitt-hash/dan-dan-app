// 모든 undefined 과제 강제 정리
const mongoose = require('mongoose');
require('dotenv').config();

async function cleanAllUndefined() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공\n');

    // 직접 컬렉션 접근
    const db = mongoose.connection.db;
    const collection = db.collection('userprogresses');

    // 6학년 브레인딥 학생 찾기
    const progress = await collection.findOne({
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

    // 유효한 과제만 필터링 (unitTitle과 seriesName이 있는 것만)
    const validTasks = tasks.filter(t =>
      t.unitTitle &&
      t.seriesName &&
      t.unitTitle !== 'undefined' &&
      t.seriesName !== 'undefined' &&
      !(t.unitId && t.unitId.includes('on_'))  // BRAIN온 과제도 제거
    );

    console.log(`✅ 유효한 과제: ${validTasks.length}개`);
    validTasks.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.unitTitle} | ${t.seriesName} | ${t.unitId}`);
    });

    // 직접 업데이트
    const result = await collection.updateOne(
      { grade: '6학년', name: '브레인딥' },
      { $set: { 'studyRoom.assignedTasks': validTasks } }
    );

    console.log(`\n📝 업데이트 결과:`, result);

    // 검증
    const updated = await collection.findOne({
      grade: '6학년',
      name: '브레인딥'
    });

    console.log(`\n📋 업데이트 후 과제 수: ${updated.studyRoom.assignedTasks.length}개`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

cleanAllUndefined();
