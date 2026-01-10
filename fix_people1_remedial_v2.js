const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'public', 'BRAINUP', 'person');

// 새로운 openRemedial 함수 - reportState가 없거나 채점 전이면 모든 영역 표시
const newOpenRemedial = `function openRemedial() {
      const needKeys = [];
      // reportState가 있고 채점이 완료된 경우에만 틀린 영역만 표시
      if (typeof reportState !== "undefined" && (reportState.q1ok || reportState.q2ok || reportState.q3ok || reportState.q4ok || reportState.q5ok)) {
        if (!reportState.q1ok) needKeys.push('literal');
        if (!reportState.q2ok) needKeys.push('structural');
        if (!reportState.q3ok) needKeys.push('lexical');
        if (!reportState.q4ok) needKeys.push('inferential');
        if (!reportState.q5ok) needKeys.push('critical');
      } else {
        // 채점 전이면 모든 영역 표시
        needKeys.push('literal', 'structural', 'lexical', 'inferential', 'critical');
      }

      const panel = document.getElementById('remedial-panel');
      const body = document.getElementById('remedial-panel-body');
      if (!panel || !body) return;

      if (needKeys.length === 0) {
        body.innerHTML = "<p>모든 영역을 맞혔습니다! 👏</p>";
        panel.style.display = 'flex';
        return;
      }

      let html = "";
      needKeys.forEach(key => {
        const data = REMEDIAL_BANK[key];
        if (!data) return;
        const p = data.problems[0];
        html += \`<div style="margin-bottom:18px; padding:14px; background:#faf6f0; border-radius:10px;">
          <h4 style="margin:0 0 10px; color:#8b2f2f; font-size:15px;">\${data.title}</h4>
          <p style="margin:0 0 10px; font-size:14px; color:#333;">\${p.q}</p>
          <div id="remedial-\${key}" style="display:flex; flex-direction:column; gap:6px;">\`;
        p.options.forEach((opt, idx) => {
          html += \`<label style="display:flex; align-items:center; font-size:13px; cursor:pointer;">
            <input type="radio" name="\${key}" value="\${idx}" style="margin-right:6px;">\${NUM_CIRCLE[idx]} \${opt}
          </label>\`;
        });
        html += \`</div><div id="result-\${key}" style="margin-top:8px;"></div></div>\`;
      });

      body.innerHTML = html;
      panel.style.display = 'flex';
    }`;

for (let i = 1; i <= 20; i++) {
  const no = String(i).padStart(2, '0');
  const filePath = path.join(DIR, `on_people1_${no}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 파일 없음: on_people1_${no}.html`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // openRemedial 함수 교체
  const openRemedialRegex = /function openRemedial\(\)\s*\{[\s\S]*?\n\s{4}\}/;
  if (openRemedialRegex.test(html)) {
    html = html.replace(openRemedialRegex, newOpenRemedial);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ 수정 완료: on_people1_${no}.html`);
  } else {
    console.log(`⚠️ openRemedial 함수를 찾을 수 없음: on_people1_${no}.html`);
  }
}

console.log('\n🎉 openRemedial 함수 수정 완료!');
console.log('- 채점 전: 모든 5개 영역 표시');
console.log('- 채점 후: 틀린 영역만 표시');
