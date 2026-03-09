const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/images/웹툰';

// 04부터 20까지 처리
for (let unit = 4; unit <= 20; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const oldFolderName = `세계문학(2) ${unitStr}`;
  const newFolderName = `세계문학2_${unitStr}`;

  const oldFolderPath = path.join(baseDir, oldFolderName);
  const newFolderPath = path.join(baseDir, newFolderName);

  // 폴더가 존재하는지 확인 (NFD/NFC 처리)
  let actualOldPath = null;
  const dirs = fs.readdirSync(baseDir);
  for (const dir of dirs) {
    if (dir.normalize('NFC') === oldFolderName.normalize('NFC') ||
        dir.normalize('NFD') === oldFolderName.normalize('NFD') ||
        dir.includes(`세계문학(2)`) && dir.includes(unitStr)) {
      actualOldPath = path.join(baseDir, dir);
      break;
    }
  }

  if (!actualOldPath || !fs.existsSync(actualOldPath)) {
    console.log(`❌ 폴더 없음: ${oldFolderName}`);
    continue;
  }

  console.log(`\n📁 처리 중: ${oldFolderName} → ${newFolderName}`);

  // 폴더 내 파일 목록
  const files = fs.readdirSync(actualOldPath);
  console.log(`   파일 수: ${files.length}`);

  // 각 PNG 파일을 JPG로 변환
  for (const file of files) {
    if (file.toLowerCase().endsWith('.png')) {
      const pngPath = path.join(actualOldPath, file);

      // 파일명에서 번호 추출 (예: 세계문학(2) 04_01.png → 01)
      const match = file.match(/_(\d+)\.png$/i);
      if (match) {
        const imgNum = match[1];
        const jpgFileName = `세계문학(2)_${imgNum}.jpg`;
        const jpgPath = path.join(actualOldPath, jpgFileName);

        try {
          // sips로 JPG 변환
          execSync(`sips -s format jpeg "${pngPath}" --out "${jpgPath}"`, { stdio: 'pipe' });
          // 원본 PNG 삭제
          fs.unlinkSync(pngPath);
          console.log(`   ✅ ${file} → ${jpgFileName}`);
        } catch (err) {
          console.log(`   ❌ 변환 실패: ${file} - ${err.message}`);
        }
      }
    }
  }

  // .DS_Store 삭제
  const dsStore = path.join(actualOldPath, '.DS_Store');
  if (fs.existsSync(dsStore)) {
    fs.unlinkSync(dsStore);
  }

  // 폴더명 변경
  if (!fs.existsSync(newFolderPath)) {
    fs.renameSync(actualOldPath, newFolderPath);
    console.log(`   📁 폴더 이름 변경 완료: ${newFolderName}`);
  } else {
    console.log(`   ⚠️ 대상 폴더가 이미 존재: ${newFolderName}`);
  }
}

console.log('\n✅ 모든 변환 완료!');
