const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

// gradeRemedial 함수에 해설 표시 추가
const oldGradeRemedial = `    function gradeRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      for (const key in REMEDIAL_BANK) {
        const data = REMEDIAL_BANK[key];
        if (!data) continue;
        (data.problems || []).forEach((p, idx) => {
          const name = key + '-q' + idx;
          const inputs = body.querySelectorAll(\`input[name="\${name}"]\`);
          if (!inputs.length) return;
          let selected = -1;
          inputs.forEach((inp, i) => { if (inp.checked) selected = i; });
          const li = inputs[0].closest('li');
          if (!li) return;
          const old = li.querySelector('.remed-result');
          if (old) old.remove();
          if (selected === p.answer) {
            li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅</div>');
          } else {
            const correctText = p.options[p.answer];
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: \${correctText}</div>\`);
          }
        });
      }
    }`;

const newGradeRemedial = `    function gradeRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      for (const key in REMEDIAL_BANK) {
        const data = REMEDIAL_BANK[key];
        if (!data) continue;
        (data.problems || []).forEach((p, idx) => {
          const name = key + '-q' + idx;
          const inputs = body.querySelectorAll(\`input[name="\${name}"]\`);
          if (!inputs.length) return;
          let selected = -1;
          inputs.forEach((inp, i) => { if (inp.checked) selected = i; });
          const li = inputs[0].closest('li');
          if (!li) return;
          const old = li.querySelector('.remed-result');
          if (old) old.remove();
          const explanation = p.explanation ? \`<div style="margin-top:4px; color:#555; font-size:11px; background:#f9f6f0; padding:6px 8px; border-radius:4px;">📝 \${p.explanation}</div>\` : '';
          if (selected === p.answer) {
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅\${explanation}</div>\`);
          } else {
            const correctText = p.options[p.answer];
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: \${correctText}\${explanation}</div>\`);
          }
        });
      }
    }`;

let successCount = 0;
let failCount = 0;

for (let i = 21; i <= 40; i++) {
  const unit = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people2_${unit}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people2_${unit}.html`);
    failCount++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes(oldGradeRemedial)) {
    html = html.replace(oldGradeRemedial, newGradeRemedial);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ gradeRemedial 수정 완료: on_people2_${unit}.html`);
    successCount++;
  } else {
    console.log(`⚠️ gradeRemedial 패턴을 찾을 수 없음: on_people2_${unit}.html`);
    failCount++;
  }
}

console.log(`\n🎉 gradeRemedial 함수 수정 완료!`);
console.log(`   성공: ${successCount}개, 실패: ${failCount}개`);
