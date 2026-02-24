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

  // 대화 뒤에 바로 한글이 오는 경우 <br><br> 추가
  // 예: </span> 오울은 -> </span><br><br>오울은
  content = content.replace(
    /(<\/span>)(\s?)([가-힣])/g,
    (match, closingTag, space, korean) => {
      // 이미 <br><br>가 있으면 스킵
      if (space === '') {
        changeCount++;
        return `${closingTag}<br><br>${korean}`;
      }
      // 공백만 있는 경우
      changeCount++;
      return `${closingTag}<br><br>${korean}`;
    }
  );

  // 이미 있는 경우 중복 방지
  content = content.replace(/<br><br><br><br>/g, '<br><br>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${file} - ${changeCount}개 변경`);
  totalProcessed++;
});

console.log(`\n완료! ${totalProcessed}개 파일 처리됨`);
