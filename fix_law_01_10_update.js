const fs = require('fs');
const path = require('path');

// law_01~10 REMEDIAL_BANK 데이터 (본문 내용과 일치하도록 업데이트)
const REMEDIAL_DATA = {
  law_01: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "인권이란?", options: ["부자만 가지는 권리", "사람이라면 누구나 태어날 때부터 가지는 권리", "법으로 주어지는 권리", "국가가 선별적으로 주는 권리"], answer: 1, explanation: "인권은 사람이라면 누구나 태어날 때부터 가지는 권리입니다." },
        { q: "인권의 특징으로 알맞은 것은?", options: ["양도 가능", "보편성, 천부성, 불가침성", "국가마다 다름", "특정인만 해당"], answer: 1, explanation: "인권은 보편성, 천부성, 불가침성의 특징을 가집니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "인권이 보장되어야 하는 이유는?", options: ["법에 써 있어서", "인간의 존엄성을 지키기 위해", "정부가 원해서", "전통이라서"], answer: 1, explanation: "인권은 인간의 존엄성을 지키기 위해 보장되어야 합니다." },
        { q: "인권 보장의 주체로 알맞은 것은?", options: ["개인만", "국가만", "국가와 사회, 개인 모두", "기업만"], answer: 2, explanation: "인권 보장은 국가, 사회, 개인 모두의 책임입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'천부인권'이란?", options: ["하늘이 내린 천재", "사람이 태어날 때부터 가지는 권리", "법으로 만든 권리", "국가가 준 권리"], answer: 1, explanation: "천부인권은 사람이 태어날 때부터 하늘로부터 부여받은 권리라는 의미입니다." },
        { q: "'존엄성'이란?", options: ["높은 지위", "인간으로서 마땅히 존중받아야 할 가치", "재산", "권력"], answer: 1, explanation: "존엄성은 인간으로서 마땅히 존중받아야 할 가치입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "인권이 침해되면 어떤 일이 생길까요?", options: ["아무 일 없음", "인간 존엄성 훼손과 사회 갈등 발생", "경제 성장", "평화 증진"], answer: 1, explanation: "인권이 침해되면 인간 존엄성이 훼손되고 사회 갈등이 발생합니다." },
        { q: "인권이 중요해진 역사적 배경은?", options: ["우연", "전쟁과 차별의 비극을 경험한 후 인권의 소중함을 깨달음", "경제 발전", "기술 발전"], answer: 1, explanation: "전쟁과 차별의 비극을 경험한 후 인권의 소중함을 깨달았습니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "인권을 지키기 위해 개인이 할 수 있는 일은?", options: ["무관심", "타인의 인권 존중, 차별과 폭력에 반대", "자신만 생각", "권리만 주장"], answer: 1, explanation: "타인의 인권을 존중하고 차별과 폭력에 반대하는 것이 중요합니다." },
        { q: "인권과 의무의 관계로 알맞은 것은?", options: ["관계없음", "권리를 누리면서 타인의 권리도 존중할 의무가 있음", "의무만 있음", "권리만 있음"], answer: 1, explanation: "권리를 누리면서 타인의 권리도 존중할 의무가 있습니다." }
      ]
    }
  },
  law_02: {
    literal: {
      title: "사실적 이해",
      problems: [
        { q: "평등권이란?", options: ["모두 똑같아지는 것", "합리적 이유 없이 차별받지 않을 권리", "부자가 되는 권리", "특별 대우받는 권리"], answer: 1, explanation: "평등권은 합리적 이유 없이 차별받지 않을 권리입니다." },
        { q: "차별의 예로 알맞은 것은?", options: ["능력에 따른 평가", "성별, 인종, 장애 등을 이유로 불이익을 주는 것", "노력에 따른 보상", "법에 따른 처벌"], answer: 1, explanation: "성별, 인종, 장애 등을 이유로 불이익을 주는 것이 차별입니다." }
      ]
    },
    structural: {
      title: "구조적 이해",
      problems: [
        { q: "평등의 의미 변화로 알맞은 것은?", options: ["변화 없음", "형식적 평등에서 실질적 평등으로 발전", "실질적 평등에서 형식적 평등으로", "평등 포기"], answer: 1, explanation: "평등의 개념은 형식적 평등에서 실질적 평등으로 발전했습니다." },
        { q: "실질적 평등을 위한 정책의 예는?", options: ["모두 똑같이 대우", "사회적 약자를 위한 적극적 우대 조치", "차별 유지", "경쟁만 강조"], answer: 1, explanation: "사회적 약자를 위한 적극적 우대 조치가 실질적 평등을 위한 정책입니다." }
      ]
    },
    lexical: {
      title: "어휘적 이해",
      problems: [
        { q: "'형식적 평등'이란?", options: ["실제로 평등", "법 앞에 모든 사람을 같게 대우하는 것", "차별하는 것", "특별 대우"], answer: 1, explanation: "형식적 평등은 법 앞에 모든 사람을 같게 대우하는 것입니다." },
        { q: "'적극적 우대 조치'란?", options: ["역차별", "차별받아 온 집단에 기회를 더 주어 실질적 평등을 이루려는 정책", "차별 강화", "평등 포기"], answer: 1, explanation: "적극적 우대 조치는 차별받아 온 집단에 기회를 더 주는 정책입니다." }
      ]
    },
    inferential: {
      title: "추론적 이해",
      problems: [
        { q: "형식적 평등만으로 부족한 이유는?", options: ["충분함", "출발선이 다른 사람들에게는 실질적 불평등이 생기기 때문", "형식이 중요해서", "법만 중요해서"], answer: 1, explanation: "출발선이 다른 사람들에게는 형식적 평등만으로 실질적 불평등이 생깁니다." },
        { q: "장애인 주차 구역을 따로 마련하는 이유는?", options: ["차별", "장애인의 이동권 보장을 위한 실질적 평등 실현", "특혜", "분리"], answer: 1, explanation: "장애인 주차 구역은 이동권 보장을 위한 실질적 평등 실현입니다." }
      ]
    },
    critical: {
      title: "비판적 이해",
      problems: [
        { q: "적극적 우대 조치에 대한 논쟁이 있는 이유는?", options: ["논쟁 없음", "역차별 우려와 실질적 평등의 필요성 사이 의견 차이", "모두 찬성", "모두 반대"], answer: 1, explanation: "역차별 우려와 실질적 평등 필요성 사이에 의견 차이가 있습니다." },
        { q: "평등한 사회를 위해 필요한 자세는?", options: ["무관심", "차별에 민감하게 반응하고 다양성을 존중", "차별 방관", "자신만 생각"], answer: 1, explanation: "차별에 민감하게 반응하고 다양성을 존중하는 자세가 필요합니다." }
      ]
    }
  }
};

// 버튼 활성화
for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, 'public', 'BRAINUP', 'social', `law_${num}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filePath} 파일 없음`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 버튼 활성화
  const oldPattern1 = '<button class="report-btn-remedial" onclick="openRemedial && openRemedial()" style="display:none;">';
  const newPattern1 = '<button class="report-btn-remedial" onclick="openRemedial()">';

  if (content.includes(oldPattern1)) {
    content = content.replace(oldPattern1, newPattern1);
    console.log(`[OK] law_${num} 보완학습 버튼 활성화`);
    modified = true;
  }

  // 다른 패턴도 시도
  if (!modified && content.includes('report-btn-remedial') && content.includes('style="display:none;"')) {
    content = content.replace(
      /(<button class="report-btn-remedial"[^>]*) style="display:none;"/g,
      '$1'
    );
    console.log(`[OK] law_${num} 보완학습 버튼 display:none 제거`);
    modified = true;
  }

  if (!modified) {
    console.log(`[SKIP] law_${num} 버튼 이미 활성화되어 있음`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n✅ law_01~10 버튼 활성화 완료!');
