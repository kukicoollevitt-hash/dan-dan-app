const fs = require('fs');
const path = require('path');

const creativeBookDir = path.join(__dirname, '../public/creative-book');

const files = fs.readdirSync(creativeBookDir)
  .filter(f => f.endsWith('_season1_34.html'));

console.log(`총 ${files.length}개 파일 처리 시작...\n`);

let totalProcessed = 0;

files.forEach(file => {
  const filePath = path.join(creativeBookDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;

  // 대화 패턴: <span class="dialogue">"..."</span>
  // 목표: 대화 앞뒤에 <br><br> 추가 (문장 중간일 때)

  // 1. 먼저 모든 대화를 플레이스홀더로 치환
  const dialogues = [];
  content = content.replace(/<span class="dialogue">"[^"]*"<\/span>/g, (match) => {
    dialogues.push(match);
    return `__DIALOGUE_${dialogues.length - 1}__`;
  });

  // 2. 플레이스홀더 기준으로 <br><br> 추가
  dialogues.forEach((dialogue, index) => {
    const placeholder = `__DIALOGUE_${index}__`;

    // 패턴별 처리
    // Case 1: 한글 + 플레이스홀더 + 한글 (문장 중간)
    // Case 2: <p> + 플레이스홀더 + 한글 (문단 시작, 뒤에 텍스트)
    // Case 3: 플레이스홀더 + </p> (문단 끝) - 변경 없음
    // Case 4: 플레이스홀더 + 플레이스홀더 (연속 대화)

    // 이미 <br><br>가 있는지 확인
    const beforePattern = new RegExp(`<br><br>${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    const afterPattern = new RegExp(`${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<br><br>`);

    const hasBrBefore = beforePattern.test(content);
    const hasBrAfter = afterPattern.test(content);

    // Case 1: 한글 + 대화 + 한글
    if (!hasBrBefore) {
      content = content.replace(
        new RegExp(`([가-힣.,!?\\s:])${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        (match, before) => {
          if (before === ' ' || /[가-힣.,!?:]/.test(before)) {
            changeCount++;
            return `${before}<br><br>${placeholder}`;
          }
          return match;
        }
      );
    }

    if (!hasBrAfter) {
      content = content.replace(
        new RegExp(`${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([가-힣])`, 'g'),
        (match, after) => {
          changeCount++;
          return `${placeholder}<br><br>${after}`;
        }
      );
    }
  });

  // 3. 연속 대화 처리: __DIALOGUE_X____DIALOGUE_Y__ -> __DIALOGUE_X__<br><br>__DIALOGUE_Y__
  content = content.replace(/__DIALOGUE_(\d+)____DIALOGUE_(\d+)__/g, (match, a, b) => {
    changeCount++;
    return `__DIALOGUE_${a}__<br><br>__DIALOGUE_${b}__`;
  });

  // 4. 플레이스홀더를 원래 대화로 복원
  dialogues.forEach((dialogue, index) => {
    content = content.replace(`__DIALOGUE_${index}__`, dialogue);
  });

  // 5. 중복 <br><br> 제거
  content = content.replace(/<br><br><br><br>/g, '<br><br>');

  // 6. <p><br><br> 패턴 수정 (문단 시작에 불필요한 br 제거)
  content = content.replace(/<p><br><br>/g, '<p>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${file} - ${changeCount}개 변경`);
  totalProcessed++;
});

console.log(`\n완료! ${totalProcessed}개 파일 처리됨`);
