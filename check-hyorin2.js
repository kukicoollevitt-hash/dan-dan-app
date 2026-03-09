const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const MockExamRecommendTaskSchema = new mongoose.Schema({
    userId: String,
    phone: String,
    weekNumber: Number,
    areaKey: String,
    status: String,
    examNumber: Number
  }, { collection: 'mockexamrecommendtasks' });

  const MockExamRecommendTask = mongoose.model('MockExamRecommendTask', MockExamRecommendTaskSchema);

  // 김효린 과제 전체 조회
  const tasks = await MockExamRecommendTask.find({
    phone: '010-5345-5180'
  }).lean();

  console.log('=== 김효린 전체 과제 (' + tasks.length + '개) ===');
  tasks.forEach(t => {
    console.log('week ' + t.weekNumber + ' | examNumber: ' + (t.examNumber || 'N/A') + ' | ' + t.areaKey + ' | status: ' + t.status);
  });

  // examNumber별로 그룹핑
  const byExamNumber = {};
  tasks.forEach(t => {
    const key = t.examNumber || 'none';
    if (!byExamNumber[key]) byExamNumber[key] = [];
    byExamNumber[key].push(t.areaKey);
  });

  console.log('\n=== examNumber별 그룹 ===');
  Object.keys(byExamNumber).sort().forEach(k => {
    console.log('examNumber ' + k + ': ' + byExamNumber[k].length + '개 - ' + byExamNumber[k].join(', '));
  });

  // unique areaKey 확인
  const uniqueAreaKeys = [...new Set(tasks.map(t => t.areaKey))];
  console.log('\n=== unique areaKey (' + uniqueAreaKeys.length + '개) ===');
  console.log(uniqueAreaKeys.join(', '));

  mongoose.disconnect();
}).catch(err => console.error(err));
