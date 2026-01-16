const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dandan').then(async () => {
  const taskSchema = new mongoose.Schema({
    userId: String,
    phone: String,
    areaKey: String,
    targetMockRound: Number,
    status: String
  }, { collection: 'mockexamrecommendtasks' });

  const Task = mongoose.model('TaskCleanup', taskSchema);

  // 선생님 사용자의 중복 과제 정리
  const userId = '6960b14412e76030d251b5af';
  const tasks = await Task.find({ userId }).lean();

  console.log('정리 전 과제 수:', tasks.length);

  // areaKey + targetMockRound 조합으로 그룹화하여 첫번째만 유지
  const seen = new Set();
  const toDelete = [];

  for (const task of tasks) {
    const round = task.targetMockRound || 'null';
    const key = task.areaKey + '_' + round;
    if (seen.has(key)) {
      toDelete.push(task._id);
    } else {
      seen.add(key);
    }
  }

  console.log('삭제할 중복 과제:', toDelete.length);

  if (toDelete.length > 0) {
    await Task.deleteMany({ _id: { $in: toDelete } });
    console.log('중복 과제 삭제 완료');
  }

  // 정리 후 확인
  const remaining = await Task.find({ userId }).lean();
  console.log('정리 후 과제 수:', remaining.length);
  remaining.forEach(t => console.log('  ', t.areaKey, 'round:', t.targetMockRound, 'status:', t.status));

  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
