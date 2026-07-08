#!/usr/bin/env node
/**
 * 브레인문해원_테스트 관리자에게 대치센터 별칭 세팅 (1회 실행)
 *
 * 결과:
 *   - Admin.academyName = "브레인문해원_테스트" (유지)
 *   - Admin.academyAliases = ["브레인문해력_대치센터"]
 *   - Admin.newRegistrationName = "브레인문해력_대치센터"
 *
 * 기존 학생 데이터(User)는 건드리지 않아요.
 * 앞으로 새 학생만 대치센터로 등록됩니다.
 */
const path = require('path');
const mongoose = require(path.join(__dirname, '..', 'node_modules', 'mongoose'));
require(path.join(__dirname, '..', 'node_modules', 'dotenv')).config({
  path: path.join(__dirname, '..', '.env')
});

const PRIMARY_NAME = "브레인문해원_테스트";
const NEW_NAME     = "브레인문해력_대치센터";

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('admins');

  const before = await col.findOne(
    { academyName: PRIMARY_NAME, userType: 'academy' },
    { projection: { _id: 1, academyName: 1, academyAliases: 1, newRegistrationName: 1 } }
  );
  if (!before) {
    console.log(`❌ ${PRIMARY_NAME} 관리자 없음 · 마이그레이션 스킵`);
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log('📋 마이그레이션 전:', {
    _id: before._id.toString(),
    academyName: before.academyName,
    academyAliases: before.academyAliases || [],
    newRegistrationName: before.newRegistrationName || ''
  });

  const result = await col.updateOne(
    { _id: before._id },
    {
      $set: {
        academyAliases: [NEW_NAME],
        newRegistrationName: NEW_NAME
      }
    }
  );
  console.log(`✅ updateOne 결과 · matched=${result.matchedCount} · modified=${result.modifiedCount}`);

  const after = await col.findOne(
    { _id: before._id },
    { projection: { _id: 1, academyName: 1, academyAliases: 1, newRegistrationName: 1 } }
  );
  console.log('📋 마이그레이션 후:', {
    _id: after._id.toString(),
    academyName: after.academyName,
    academyAliases: after.academyAliases || [],
    newRegistrationName: after.newRegistrationName || ''
  });

  // 검증 · 학생 조회 시 두 이름 모두 잡히는지
  const usersCol = mongoose.connection.db.collection('users');
  const testCount = await usersCol.countDocuments({ academyName: PRIMARY_NAME, userType: 'academy' });
  const newCount  = await usersCol.countDocuments({ academyName: NEW_NAME, userType: 'academy' });
  const bothCount = await usersCol.countDocuments({ academyName: { $in: [PRIMARY_NAME, NEW_NAME] }, userType: 'academy' });
  console.log('👥 학생 수:');
  console.log(`   · ${PRIMARY_NAME} · ${testCount}명 (그대로 유지)`);
  console.log(`   · ${NEW_NAME} · ${newCount}명 (신규 등록 대상)`);
  console.log(`   · 통합 조회 (기존 로직) · ${bothCount}명`);

  await mongoose.disconnect();
  console.log('✨ 완료 · 관리자는 대시보드에서 "브레인문해력_대치센터" 로 표시되고, 신규 등록은 이 이름으로 저장됩니다');
})().catch(err => {
  console.error('❌ 마이그레이션 실패:', err);
  process.exit(1);
});
