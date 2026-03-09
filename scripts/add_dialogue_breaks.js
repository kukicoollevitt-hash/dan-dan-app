const fs = require('fs');
const path = require('path');

const creativeBookDir = path.join(__dirname, '../public/creative-book');

// 3,4학년 파일 패턴
const files = fs.readdirSync(creativeBookDir)
  .filter(f => f.endsWith('_season1_34.html'));

console.log(`총 ${files.length}개 파일 처리 시작...\n`);

let totalProcessed = 0;
let totalDialogues = 0;

files.forEach(file => {
  const filePath = path.join(creativeBookDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let dialogueCount = 0;

  // 이미 처리된 파일인지 확인 (br><br><span class="dialogue" 패턴이 있으면 스킵)
  if (content.includes('<br><br><span class="dialogue">')) {
    console.log(`✓ ${file} - 이미 처리됨, 스킵`);
    return;
  }

  // 패턴 1: 문장 중간의 대화 (앞에 텍스트가 있는 경우)
  // 예: 물었고, <span class="dialogue">"..."</span> 하고
  // => 물었고,<br><br><span class="dialogue">"..."</span><br><br>하고

  // 패턴 2: 문단 시작 대화
  // 예: <p><span class="dialogue">"..."</span> 하늘이
  // => <p><span class="dialogue">"..."</span><br><br>하늘이

  // 대화 태그를 찾아서 처리
  const dialogueRegex = /<span class="dialogue">"[^"]*"<\/span>/g;

  content = content.replace(dialogueRegex, (match) => {
    dialogueCount++;
    return match;
  });

  // 복잡한 패턴 처리를 위해 여러 단계로 나눔

  // Step 1: 문장 중간 대화 - 앞에 한글/문장부호가 있고, 뒤에 한글이 있는 경우
  // 앞: 공백 또는 텍스트 + <span class="dialogue">
  // 뒤: </span> + 텍스트
  content = content.replace(
    /([가-힣.,!?\s])(<span class="dialogue">"[^"]*"<\/span>)([가-힣])/g,
    '$1<br><br>$2<br><br>$3'
  );

  // Step 2: 대화 뒤에 텍스트가 있는 경우 (앞에 <br><br> 없을 때)
  content = content.replace(
    /([^>])(<span class="dialogue">"[^"]*"<\/span>)([가-힣])/g,
    (match, before, dialogue, after) => {
      // 이미 <br><br>가 앞에 있으면 스킵
      if (before.endsWith('<br>')) return match;
      return `${before}<br><br>${dialogue}<br><br>${after}`;
    }
  );

  // Step 3: <p> 바로 뒤의 대화 (뒤에 텍스트가 있는 경우)
  content = content.replace(
    /(<p>)(<span class="dialogue">"[^"]*"<\/span>)([가-힣\s])/g,
    (match, p, dialogue, after) => {
      if (after.trim() === '') return match;
      return `${p}${dialogue}<br><br>${after}`;
    }
  );

  // Step 4: 연속된 대화 사이 (</span><span class="dialogue">)
  content = content.replace(
    /(<\/span>)(\s*)(<span class="dialogue">)/g,
    '$1<br><br>$3'
  );

  // 중복 <br><br><br><br> 제거
  content = content.replace(/<br><br><br><br>/g, '<br><br>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${file} 처리 완료`);
  totalProcessed++;
});

console.log(`\n완료! ${totalProcessed}개 파일 처리됨`);
