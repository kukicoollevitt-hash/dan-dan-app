const fs = require('fs');

const tasks = [
  { src: 'worldlit/world1_content.js', dest: 'worldlit/on_world1_content.js', prefix: 'world1', onPrefix: 'on_world1', start: 2, end: 40 },
  { src: 'worldlit/world2_content.js', dest: 'worldlit/on_world2_content.js', prefix: 'world2', onPrefix: 'on_world2', start: 1, end: 40 },
  { src: 'person/people1_content.js', dest: 'person/on_people1_content.js', prefix: 'people1', onPrefix: 'on_people1', start: 2, end: 40 },
  { src: 'person/people2_content.js', dest: 'person/on_people2_content.js', prefix: 'people2', onPrefix: 'on_people2', start: 2, end: 40 },
];

const basePath = '/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/';

tasks.forEach(task => {
  console.log(`\n=== ${task.prefix} → ${task.onPrefix} ===`);

  let srcContent = fs.readFileSync(basePath + task.src, 'utf8');
  let destContent = fs.readFileSync(basePath + task.dest, 'utf8');
  let changed = 0;

  for (let i = task.start; i <= task.end; i++) {
    const num = i.toString().padStart(2, '0');

    // 소스에서 passage 배열 추출
    const srcRegex = new RegExp(`${task.prefix}_${num}:\\s*\\{[\\s\\S]*?passage:\\s*(\\[[\\s\\S]*?\\]),\\s*vocab:`);
    const srcMatch = srcContent.match(srcRegex);

    if (!srcMatch) {
      console.log(`  ${task.prefix}_${num}: 소스에서 passage 없음`);
      continue;
    }

    // 대상에서 passage 교체
    const destRegex = new RegExp(`(${task.onPrefix}_${num}:\\s*\\{[\\s\\S]*?passage:\\s*)\\[[\\s\\S]*?\\](,\\s*vocab:)`);
    const newDestContent = destContent.replace(destRegex, `$1${srcMatch[1]}$2`);

    if (newDestContent !== destContent) {
      destContent = newDestContent;
      changed++;
      console.log(`  ${task.onPrefix}_${num}: 복사 완료`);
    }
  }

  fs.writeFileSync(basePath + task.dest, destContent, 'utf8');
  console.log(`  총 ${changed}개 복사됨`);
});

console.log('\n모든 작업 완료!');
