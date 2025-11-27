// migrate-folder-names.js
// MongoDB에 저장된 학습 기록의 폴더명을 새 이름으로 업데이트

const mongoose = require('mongoose');
require('dotenv').config();

// StudyProgress 모델
const StudyProgressSchema = new mongoose.Schema({
  studentKey: { type: String, required: true, index: true },
  unitKey: { type: String, required: true },
  pageKey: { type: String, required: true },
  kind: { type: String, required: true },
  completed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const StudyProgress = mongoose.model("StudyProgress", StudyProgressSchema);

// 폴더명 매핑
const folderMapping = {
  'sejong': 'BRAINON',
  'jeongjo': 'BRAINUP',
  'yeongjo': 'BRAINFIT',
  'munjong': 'BRAINDEEP',
  'seonggyungwan': 'BRAINM',
  'gukjagam': 'BRAINH'
};

async function migrateData() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // 모든 학습 기록 가져오기
    const allRecords = await StudyProgress.find({});
    console.log(`📊 총 ${allRecords.length}개의 학습 기록 발견`);

    let updatedCount = 0;

    // 각 레코드 업데이트
    for (const record of allRecords) {
      let updated = false;
      let newPageKey = record.pageKey;
      let newUnitKey = record.unitKey;

      // pageKey 업데이트 (예: ./jeongjo/social/geo_01.html → ./BRAINUP/social/geo_01.html)
      for (const [oldName, newName] of Object.entries(folderMapping)) {
        if (record.pageKey.includes(oldName)) {
          newPageKey = record.pageKey.replace(new RegExp(oldName, 'g'), newName);
          updated = true;
        }
        if (record.unitKey.includes(oldName)) {
          newUnitKey = record.unitKey.replace(new RegExp(oldName, 'g'), newName);
          updated = true;
        }
      }

      // 변경사항이 있으면 업데이트
      if (updated) {
        await StudyProgress.updateOne(
          { _id: record._id },
          {
            $set: {
              pageKey: newPageKey,
              unitKey: newUnitKey
            }
          }
        );
        updatedCount++;
        console.log(`✏️  업데이트: ${record.pageKey} → ${newPageKey}`);
      }
    }

    console.log(`\n✅ 완료! ${updatedCount}개의 학습 기록이 업데이트되었습니다.`);

    // 연결 종료
    await mongoose.connection.close();
    console.log('🔌 MongoDB 연결 종료');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

// 실행
migrateData();
