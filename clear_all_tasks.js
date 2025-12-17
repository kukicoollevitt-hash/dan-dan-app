// 모든 과제 삭제 (테스트용)
const mongoose = require('mongoose');
require('dotenv').config();

async function clearAllTasks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공\n');

    const db = mongoose.connection.db;
    const collection = db.collection('userprogresses');

    // 6학년 브레인딥 학생의 과제 모두 삭제
    const result = await collection.updateOne(
      { grade: '6학년', name: '브레인딥' },
      { $set: { 'studyRoom.assignedTasks': [] } }
    );

    console.log('📝 업데이트 결과:', result);
    console.log('✅ 모든 과제 삭제 완료!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

clearAllTasks();
