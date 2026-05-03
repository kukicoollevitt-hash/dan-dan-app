/**
 * 학원 계약시작일 시드 스크립트
 *
 * 사용법:
 *   1) 아래 ACADEMY_DATES 객체에 학원명 → 계약시작일(YYYY-MM-DD) 매핑 작성
 *   2) node scripts/seed-contract-start-dates.js
 *      (옵션) --dry-run : 변경 없이 미리보기만
 *
 * 정책:
 *   - 계약시작일은 슈퍼관리자만 설정 (브랜치 관리자 UI 없음)
 *   - 월말 cron이 이 값을 읽어 사이클(365일)·시작월 건너뜀(Q6)·누적/초과 산정
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// ===== 여기에 학원명 → 계약시작일 매핑 입력 =====
// 예시:
//   "브레인문해원_테스트": "2026-05-15",
//   "학원A": "2026-04-01",
const ACADEMY_DATES = {
  // 비어 있으면 아무 학원도 변경 안 함
};
// ================================================

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('❌ MONGODB_URI 환경변수가 없습니다 (.env 확인)');
  process.exit(1);
}

const adminSchema = new mongoose.Schema({
  academyName: String,
  contractStartDate: Date,
  userType: String,
  deleted: Boolean,
}, { collection: 'admins', strict: false });

const Admin = mongoose.model('Admin', adminSchema);

(async () => {
  const dryRun = process.argv.includes('--dry-run');
  console.log(dryRun ? '🧪 DRY RUN — DB 변경 없음' : '✏️  실제 DB 갱신');

  if (Object.keys(ACADEMY_DATES).length === 0) {
    console.log('⚠️  ACADEMY_DATES가 비어 있습니다. 스크립트 상단에 매핑을 추가하세요.');
    process.exit(0);
  }

  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB 연결 완료');

  let updated = 0;
  let notFound = 0;

  for (const [academyName, dateStr] of Object.entries(ACADEMY_DATES)) {
    const startDate = new Date(dateStr + 'T00:00:00+09:00'); // KST 자정 기준
    if (isNaN(startDate.getTime())) {
      console.error(`❌ "${academyName}": 잘못된 날짜 형식 "${dateStr}" (YYYY-MM-DD 필요)`);
      continue;
    }

    const admin = await Admin.findOne({ academyName, userType: 'academy', deleted: { $ne: true } });
    if (!admin) {
      console.warn(`⚠️  "${academyName}": 학원 not found (Admin 컬렉션)`);
      notFound++;
      continue;
    }

    const before = admin.contractStartDate ? admin.contractStartDate.toISOString().slice(0, 10) : '(없음)';
    console.log(`📌 "${academyName}": ${before} → ${dateStr}`);

    if (!dryRun) {
      admin.contractStartDate = startDate;
      // 계약종료일도 설정 (선택)
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      admin.contractEndDate = endDate;
      await admin.save();
      updated++;
    }
  }

  console.log(`\n📊 결과: ${updated}건 갱신, ${notFound}건 미발견 (dryRun=${dryRun})`);
  await mongoose.disconnect();
  process.exit(0);
})().catch(err => {
  console.error('❌ 시드 오류:', err);
  process.exit(1);
});
