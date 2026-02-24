const fs = require('fs');
const path = require('path');

const creativeBookDir = path.join(__dirname, '../public/creative-book');

const files = fs.readdirSync(creativeBookDir)
  .filter(f => f.endsWith('_season1_34.html'));

console.log(`총 ${files.length}개 파일 처리 시작...\n`);

files.forEach(file => {
  const filePath = path.join(creativeBookDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // .dialogue 클래스가 이미 있는지 확인
  if (content.includes('class="dialogue"')) {
    console.log(`✓ ${file} - 이미 dialogue 클래스 있음, 스킵`);
    return;
  }

  let changeCount = 0;

  // 큰따옴표로 된 대화를 찾아서 <span class="dialogue">로 감싸기
  // 패턴: "한글 대화문" (한글, 공백, 문장부호, 숫자 포함)
  // 단, HTML 속성의 따옴표는 제외해야 함 (class="...", src="..." 등)

  // story-card 내의 <p> 태그 내용만 처리
  content = content.replace(/<p>([^<]*?)<\/p>/g, (match, pContent) => {
    // p 태그 내용 중 "..."로 된 대화 찾기
    let processed = pContent.replace(/"([^"]+)"/g, (dialogueMatch, dialogueContent) => {
      // 대화 내용이 한글을 포함하면 대화로 처리
      if (/[가-힣]/.test(dialogueContent)) {
        changeCount++;
        return `<br><br><span class="dialogue">"${dialogueContent}"</span><br><br>`;
      }
      return dialogueMatch;
    });
    return `<p>${processed}</p>`;
  });

  // 문단 시작의 <p><br><br> 제거
  content = content.replace(/<p><br><br>/g, '<p>');

  // 문단 끝의 <br><br></p> 제거
  content = content.replace(/<br><br><\/p>/g, '</p>');

  // 중복 <br><br> 제거
  content = content.replace(/<br><br><br><br>/g, '<br><br>');

  if (changeCount > 0) {
    // dialogue CSS가 없으면 추가
    if (!content.includes('.dialogue')) {
      const styleEnd = content.indexOf('</style>');
      if (styleEnd > -1) {
        const dialogueCSS = `
    .dialogue {
      color: #1b4332;
      font-weight: 600;
    }
`;
        content = content.slice(0, styleEnd) + dialogueCSS + content.slice(styleEnd);
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${file} - ${changeCount}개 대화 태그 추가`);
  } else {
    console.log(`○ ${file} - 변경 없음`);
  }
});

console.log(`\n완료!`);
