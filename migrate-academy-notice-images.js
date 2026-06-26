/**
 * 학원 소식 본문에 박혀있는 /uploads/academy-notice/* 경로를
 * MongoDB(AcademyNoticeImage) 도큐먼트로 마이그레이션하고
 * 본문의 URL을 새 /api/academy-notice-image/:id 로 치환한다.
 *
 * - 로컬 디스크에 파일이 존재하는 경우에만 이전한다.
 * - 디스크에 없는 참조는 그대로 두고 콘솔에 로그만 출력한다 (수동 복구 대상).
 * - 본 스크립트는 멱등 — 이미 신규 URL 형식인 줄은 건드리지 않는다.
 *
 * 사용:
 *   node migrate-academy-notice-images.js          # dry-run (변경 없이 출력만)
 *   node migrate-academy-notice-images.js --apply  # 실제 반영
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const mongoose = require('mongoose');
const AcademyNotice = require('./models/AcademyNotice');
const AcademyNoticeImage = require('./models/AcademyNoticeImage');

const APPLY = process.argv.includes('--apply');
const relImgRe = /^\/(uploads|temp-uploads)\/\S+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;

function guessMime(filePath) {
  const m = mime.lookup(filePath);
  if (m) return m;
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' };
  return map[ext] || 'application/octet-stream';
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(APPLY ? '🚀 APPLY mode — DB에 반영합니다.' : '🔍 DRY-RUN — 변경하지 않습니다. (--apply 로 실제 반영)');

  const notices = await AcademyNotice.find({ deleted: { $ne: true } }).sort({ createdAt: -1 });
  let totalRefs = 0, migrated = 0, missing = 0, alreadyApi = 0, updatedNotices = 0;

  for (const n of notices) {
    const lines = String(n.content || '').split(/\r?\n/);
    let changed = false;
    const newLines = [];
    for (const line of lines) {
      const t = line.trim();
      if (!relImgRe.test(t)) {
        newLines.push(line);
        continue;
      }
      totalRefs++;
      const diskPath = path.join(__dirname, 'public', t);
      if (!fs.existsSync(diskPath)) {
        missing++;
        console.log(`  ❌ MISSING (skip): ${t}  in "${n.title}"`);
        newLines.push(line);
        continue;
      }
      const buf = fs.readFileSync(diskPath);
      const mimeType = guessMime(diskPath);
      if (APPLY) {
        const doc = await AcademyNoticeImage.create({
          data: buf,
          mimeType,
          size: buf.length,
          originalName: path.basename(diskPath),
          uploadedBy: 'migration'
        });
        const newUrl = `/api/academy-notice-image/${doc._id}`;
        newLines.push(line.replace(t, newUrl));
        console.log(`  ✅ migrated: ${t}  ->  ${newUrl}`);
      } else {
        console.log(`  ✅ would migrate: ${t}  (${(buf.length/1024).toFixed(1)} KB, ${mimeType})`);
        newLines.push(line);
      }
      migrated++;
      changed = true;
    }
    if (changed && APPLY) {
      n.content = newLines.join('\n');
      await n.save();
      updatedNotices++;
      console.log(`  💾 notice 업데이트: "${n.title}"`);
    }
  }

  console.log('\n=== 요약 ===');
  console.log('대상 이미지 참조 수:', totalRefs);
  console.log('마이그레이션 성공:', migrated);
  console.log('디스크 누락 (스킵):', missing);
  console.log('이미 신규 URL:', alreadyApi);
  console.log('업데이트된 notice:', updatedNotices);

  await mongoose.disconnect();
})().catch(err => { console.error(err); process.exit(1); });
