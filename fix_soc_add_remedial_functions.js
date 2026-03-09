const fs = require('fs');
const path = require('path');

// soc_01~10 파일에 openRemedial, gradeRemedial, resetRemedial 함수 추가

const REMEDIAL_FUNCTIONS = `
    /* ======= 보완학습 함수 ======= */
    function openRemedial() {
      const needKeys = [];
      if (typeof reportState !== "undefined") {
        if (!reportState.q1ok) needKeys.push('literal');
        if (!reportState.q2ok) needKeys.push('structural');
        if (!reportState.q3ok) needKeys.push('lexical');
        if (!reportState.q4ok) needKeys.push('inferential');
        if (!reportState.q5ok) needKeys.push('critical');
      }

      const panel = document.getElementById('remedial-panel');
      const body = document.getElementById('remedial-panel-body');
      if (!panel || !body) return;

      if (needKeys.length === 0) {
        body.innerHTML = "<p>보완이 필요한 영역이 없습니다 👏</p>";
        panel.style.display = 'flex';
        return;
      }

      let html = "";
      needKeys.forEach(key => {
        const data = REMEDIAL_BANK[key];
        if (!data) return;
        html += \`<div style="margin-bottom:16px;">
          <h4 style="margin:4px 0 6px; color:#8b2f2f;">\${data.title}</h4>
          <ol style="padding-left:18px;">\`;
        (data.problems || []).forEach((p, idx) => {
          html += \`<li style="margin-bottom:6px;">\${p.q}<br>\`;
          p.options.forEach((opt, optIdx) => {
            html += \`<label style="display:block;font-weight:normal;"><input type="radio" name="\${key}-q\${idx}" value="\${optIdx}"> \${["①","②","③","④"][optIdx]} \${opt}</label>\`;
          });
          html += \`</li>\`;
        });
        html += \`</ol></div>\`;
      });

      body.innerHTML = html;
      panel.style.display = 'flex';
    }

    // 보완학습 채점/리셋
    function gradeRemedial() {
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
          inputs.forEach((inp, i) => { if (inp.checked) selected = parseInt(inp.value); });
          const li = inputs[0].closest('li');
          if (!li) return;
          const old = li.querySelector('.remed-result');
          if (old) old.remove();
          if (selected === p.answer) {
            li.insertAdjacentHTML('beforeend', '<div class="remed-result" style="margin-top:3px; color:#157347; font-size:12px;">정답입니다 ✅ <span style="color:#555;">| ' + (p.explanation || '') + '</span></div>');
          } else {
            const correctText = p.options[p.answer];
            li.insertAdjacentHTML('beforeend', \`<div class="remed-result" style="margin-top:3px; color:#b3261e; font-size:12px;">틀렸어요 ❌ 정답: \${correctText} <span style="color:#555;">| \${p.explanation || ''}</span></div>\`);
          }
        });
      }
    }
    function resetRemedial() {
      const body = document.getElementById('remedial-panel-body');
      if (!body) return;
      body.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      body.querySelectorAll('.remed-result').forEach(el => el.remove());
    }
`;

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `soc_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 이미 openRemedial 함수가 있는지 확인
  if (content.includes('function openRemedial()')) {
    console.log(`[SKIP] soc_${num} 이미 openRemedial 함수 있음`);
    continue;
  }

  // REMEDIAL_BANK 다음에 함수 추가
  // REMEDIAL_BANK 끝 }; 를 찾아서 그 다음에 추가
  const bankEndPattern = /(\n\s*\};)(\s*\n\s*\(function)/;

  if (bankEndPattern.test(content)) {
    content = content.replace(bankEndPattern, `$1${REMEDIAL_FUNCTIONS}$2`);
    console.log(`[OK] soc_${num} 보완학습 함수 추가 완료`);
  } else {
    // 다른 패턴 시도: </script> 전에 추가
    const altPattern = /(\n\s*\};)(\s*\n\s*<\/script>)/;
    if (altPattern.test(content)) {
      content = content.replace(altPattern, `$1${REMEDIAL_FUNCTIONS}$2`);
      console.log(`[OK] soc_${num} 보완학습 함수 추가 완료 (alt)`);
    } else {
      console.log(`[FAIL] soc_${num} 패턴 불일치`);
      continue;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ soc_01~10 보완학습 함수 추가 완료!');
