const mongoose = require('mongoose');
require('dotenv').config();

const autoTaskSettingsSchema = new mongoose.Schema({
  grade: String,
  name: String,
  series: [String],
  days: [String],
  taskCount: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
});

const AutoTaskSettings = mongoose.model('AutoTaskSettings', autoTaskSettingsSchema);

async function checkAutoTaskSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공\n');

    const settings = await AutoTaskSettings.find({});

    if (settings.length === 0) {
      console.log('❌ 저장된 자동과제부여 설정이 없습니다.');
      console.log('💡 학생 계정으로 로그인해서 자동과제부여를 설정해보세요!\n');
    } else {
      console.log(`📊 자동과제부여 설정 ${settings.length}개 발견:\n`);
      settings.forEach((s, i) => {
        console.log(`${i + 1}. ${s.grade} ${s.name}`);
        console.log(`   시리즈: ${s.series.join(', ')}`);
        console.log(`   요일: ${s.days.join(', ')}`);
        console.log(`   과제 수: ${s.taskCount}개`);
        console.log(`   상태: ${s.status}`);
        console.log(`   최종 업데이트: ${s.updatedAt}\n`);
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

checkAutoTaskSettings();
