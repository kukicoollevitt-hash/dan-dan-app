const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const MockExamRecommendTaskSchema = new mongoose.Schema({
    userId: String,
    phone: String,
    weekNumber: Number,
    areaKey: String,
    status: String,
    examNumber: Number,
    targetMockRound: Number
  }, { collection: 'mockexamrecommendtasks' });

  const MockExamRecommendTask = mongoose.model('MockExamRecommendTask', MockExamRecommendTaskSchema);

  // 김효린 과제 전체 조회
  const tasks = await MockExamRecommendTask.find({
    phone: '010-5345-5180'
  }).lean();

  console.log('=== 김효린 전체 과제 (' + tasks.length + '개) ===');
  tasks.forEach(t => {
    console.log('week ' + t.weekNumber + ' | targetMockRound: ' + (t.targetMockRound || 'N/A') + ' | ' + t.areaKey + ' | status: ' + t.status);
  });

  // targetMockRound별로 그룹핑
  const byRound = {};
  tasks.forEach(t => {
    const key = t.targetMockRound || 'none';
    if (!byRound[key]) byRound[key] = [];
    byRound[key].push(t.areaKey);
  });

  console.log('\n=== targetMockRound별 그룹 ===');
  Object.keys(byRound).sort().forEach(k => {
    console.log('round ' + k + ': ' + byRound[k].length + '개 - ' + byRound[k].join(', '));
  });

  // areaKey + targetMockRound 조합으로 unique 카운트
  const uniqueCombos = new Set();
  tasks.forEach(t => {
    uniqueCombos.add(t.areaKey + '_round' + (t.targetMockRound || 'none'));
  });
  console.log('\n=== unique areaKey + targetMockRound 조합 (' + uniqueCombos.size + '개) ===');
  [...uniqueCombos].sort().forEach(c => console.log('- ' + c));

  mongoose.disconnect();
}).catch(err => console.error(err));
