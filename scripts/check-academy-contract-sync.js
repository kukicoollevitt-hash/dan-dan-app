/**
 * 학원 계약시작일 동기화 상태 점검
 * 사용법: node scripts/check-academy-contract-sync.js [학원명]
 *   학원명 생략 시 모든 학원 점검
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const adminSchema = new mongoose.Schema({}, { strict: false, collection: 'admins' });
const ccSchema = new mongoose.Schema({}, { strict: false, collection: 'centercontracts' });
const snapSchema = new mongoose.Schema({}, { strict: false, collection: 'monthlystudentsnapshots' });

const Admin = mongoose.model('Admin', adminSchema);
const CenterContract = mongoose.model('CenterContract', ccSchema);
const MonthlyStudentSnapshot = mongoose.model('MonthlyStudentSnapshot', snapSchema);

(async () => {
  const targetName = process.argv[2];
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB 연결\n');

  const adminQuery = { userType: 'academy', deleted: { $ne: true } };
  if (targetName) adminQuery.academyName = targetName;
  const admins = await Admin.find(adminQuery).lean();

  if (admins.length === 0) {
    console.log(`⚠️  학원 없음 (query: ${JSON.stringify(adminQuery)})`);
    process.exit(0);
  }

  for (const a of admins) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 학원: ${a.academyName} (id=${a._id})`);
    console.log(`   contractStartDate    : ${a.contractStartDate}`);
    console.log(`   contractEndDate      : ${a.contractEndDate}`);
    console.log(`   cumulativeStudentCount: ${a.cumulativeStudentCount || 0}`);
    console.log(`   overStudentCount      : ${a.overStudentCount || 0}`);
    console.log(`   currentCycleNumber    : ${a.currentCycleNumber || 0}`);
    console.log(`   lastSnapshotYearMonth: ${a.lastSnapshotYearMonth || '(none)'}`);

    const cc = await CenterContract.findOne({ academyName: a.academyName }).lean();
    if (cc) {
      console.log(`   📄 CenterContract:`);
      console.log(`      schoolId               : ${cc.schoolId}`);
      console.log(`      contractData.startDate : ${cc.contractData ? cc.contractData.contractStartDate : '(none)'}`);
      console.log(`      academyName 필드        : ${cc.academyName}`);
      console.log(`      updatedAt              : ${cc.updatedAt}`);
    } else {
      console.log(`   📄 CenterContract: 없음 (academyName 매핑 안 된 상태일 수 있음)`);
    }

    const snaps = await MonthlyStudentSnapshot.find({ academyName: a.academyName }).sort({ yearMonth: 1 }).lean();
    console.log(`   📸 MonthlyStudentSnapshot: ${snaps.length}건`);
    snaps.forEach(s => {
      console.log(`      ${s.yearMonth} | cycle=${s.cycleNumber} | monthEnd=${s.monthEndCount} | cumAfter=${s.cumulativeAfter} | over=${s.overThisMonth}`);
    });

    // 진단
    const ccStartStr = cc && cc.contractData ? cc.contractData.contractStartDate : null;
    // KST 기준 YYYY-MM-DD (Admin.contractStartDate는 KST 자정으로 저장됨)
    const adminStartStr = a.contractStartDate
      ? new Date(a.contractStartDate.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10)
      : null;
    if (ccStartStr && adminStartStr) {
      if (ccStartStr === adminStartStr) {
        console.log(`   ✅ 동기화 OK: ${ccStartStr}`);
      } else {
        console.log(`   ⚠️  불일치: CenterContract=${ccStartStr}, Admin=${adminStartStr}`);
      }
    } else if (ccStartStr && !adminStartStr) {
      console.log(`   ⚠️  CenterContract에는 ${ccStartStr} 있지만 Admin에는 없음`);
    } else if (!ccStartStr && adminStartStr) {
      console.log(`   ℹ️  Admin에만 있고 CenterContract에는 없음 (수정 모달 저장 전?)`);
    } else {
      console.log(`   ℹ️  계약시작일 미설정`);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await mongoose.disconnect();
  process.exit(0);
})().catch(err => {
  console.error('❌ 오류:', err);
  process.exit(1);
});
