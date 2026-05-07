/**
 * UserProgress.studyRoom.assignedTasks의 중복 제거
 * 동일 키(id 또는 unitId)로 두 개 이상 있으면 가장 최근(assignedAt) 항목만 유지
 *
 * 사용:
 *   node scripts/dedupe-study-room-tasks.js          # 전체 적용
 *   node scripts/dedupe-study-room-tasks.js --dry-run  # 미리보기
 *   node scripts/dedupe-study-room-tasks.js --user "초3 김윤슬"  # 특정 학생만
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const upSchema = new mongoose.Schema({}, { strict: false, collection: 'userprogresses' });
const UP = mongoose.model('UserProgress', upSchema);

(async () => {
  const dryRun = process.argv.includes('--dry-run');
  const userIdx = process.argv.indexOf('--user');
  const userFilter = userIdx >= 0 ? process.argv[userIdx + 1] : null;
  const filter = {};
  if (userFilter) {
    const m = userFilter.match(/^(\S+)\s+(.+)$/);
    if (m) { filter.grade = m[1]; filter.name = m[2]; }
  }
  console.log(dryRun ? '🧪 DRY RUN' : '✏️  실제 적용', userFilter ? `(필터: ${JSON.stringify(filter)})` : '(전체)');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB 연결\n');

  const docs = await UP.find({ ...filter, 'studyRoom.assignedTasks': { $exists: true, $ne: [] } });
  console.log(`📊 대상 사용자: ${docs.length}명\n`);

  let totalChanged = 0;
  let totalDuplicatesRemoved = 0;

  for (const d of docs) {
    const tasks = d.studyRoom && Array.isArray(d.studyRoom.assignedTasks) ? d.studyRoom.assignedTasks : [];
    if (tasks.length === 0) continue;

    // 일반 과제(isAI=false)만 중복 제거 — AI 과제는 그대로 보존
    const normalGroups = new Map(); // key -> [indices]
    tasks.forEach((t, i) => {
      if (!t || t.isAI) return;
      const key = t.id || t.unitId;
      if (!key) return;
      if (!normalGroups.has(key)) normalGroups.set(key, []);
      normalGroups.get(key).push(i);
    });
    const dropIdx = new Set();
    for (const [, idxs] of normalGroups) {
      if (idxs.length <= 1) continue;
      let bestIdx = idxs[0];
      let bestTime = new Date(tasks[bestIdx].assignedAt || 0).getTime();
      for (let k = 1; k < idxs.length; k++) {
        const idx = idxs[k];
        const t = new Date(tasks[idx].assignedAt || 0).getTime();
        if (t > bestTime || (t === bestTime && idx > bestIdx)) { bestIdx = idx; bestTime = t; }
      }
      for (const idx of idxs) if (idx !== bestIdx) dropIdx.add(idx);
    }
    if (dropIdx.size === 0) continue;

    const deduped = tasks.filter((_, i) => !dropIdx.has(i));
    const removed = tasks.length - deduped.length;
    totalChanged++;
    totalDuplicatesRemoved += removed;
    console.log(`👤 ${d.grade} ${d.name} : ${tasks.length} → ${deduped.length} (일반과제 ${removed}개 제거)`);

    if (!dryRun) {
      d.studyRoom.assignedTasks = deduped;
      d.markModified('studyRoom');
      await d.save();
    }
  }

  console.log(`\n📊 결과: ${totalChanged}명 정리, 총 ${totalDuplicatesRemoved}개 중복 항목 제거`);
  console.log(dryRun ? '🧪 dry-run — 변경 없음' : '✏️ 적용 완료');
  await mongoose.disconnect();
  process.exit(0);
})().catch(err => { console.error('❌ 오류:', err); process.exit(1); });
