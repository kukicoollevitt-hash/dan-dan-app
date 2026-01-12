const fs = require('fs');
const path = require('path');

const htmlDir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/worldlit';

// 04부터 20까지의 HTML 파일 업데이트
for (let unit = 4; unit <= 20; unit++) {
  const unitStr = unit.toString().padStart(2, '0');
  const htmlFile = `on_world2_${unitStr}.html`;
  const htmlPath = path.join(htmlDir, htmlFile);

  if (!fs.existsSync(htmlPath)) {
    console.log(`❌ HTML 파일 없음: ${htmlFile}`);
    continue;
  }

  console.log(`📄 처리 중: ${htmlFile}`);

  let content = fs.readFileSync(htmlPath, 'utf-8');

  // 기존 5개 이미지 패턴 찾기
  const oldPattern = new RegExp(
    `<img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_01\\.jpg" alt="웹툰힌트 1">\\s*` +
    `<img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_02\\.jpg" alt="웹툰힌트 2">\\s*` +
    `<img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_03\\.jpg" alt="웹툰힌트 3">\\s*` +
    `<img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_04\\.jpg" alt="웹툰힌트 4">\\s*` +
    `<img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_05\\.jpg" alt="웹툰힌트 5">`,
    'g'
  );

  // 새로운 9개 이미지
  const newImages = `<img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_01.jpg" alt="웹툰힌트 1">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_02.jpg" alt="웹툰힌트 2">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_03.jpg" alt="웹툰힌트 3">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_04.jpg" alt="웹툰힌트 4">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_05.jpg" alt="웹툰힌트 5">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_06.jpg" alt="웹툰힌트 6">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_07.jpg" alt="웹툰힌트 7">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_08.jpg" alt="웹툰힌트 8">
                <img data-src="/images/웹툰/세계문학2_${unitStr}/세계문학2_09.jpg" alt="웹툰힌트 9">`;

  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newImages);
    fs.writeFileSync(htmlPath, content, 'utf-8');
    console.log(`   ✅ 5개 → 9개 이미지로 업데이트 완료`);
  } else {
    console.log(`   ⚠️ 기존 5개 이미지 패턴을 찾을 수 없음, 수동 확인 필요`);
  }
}

console.log('\n✅ 모든 HTML 업데이트 완료!');
