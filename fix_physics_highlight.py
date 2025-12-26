#!/usr/bin/env python3
"""
physics_02~20.html 파일에 하이라이트 구조를 일괄 적용합니다.
"""

import re
import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science'

# CSS 추가 내용
css_to_add = '''
/* === 정답 근거 하이라이트 스타일 === */
.evidence-highlight {
  padding: 1px 2px;
  border-radius: 3px;
  position: relative;
  display: inline;
  margin: 0 1px;
}
.evidence-highlight:hover {
  filter: brightness(0.95);
}
.evidence-highlight .evidence-tag {
  display: inline-block;
  font-size: 10px;
  color: white;
  padding: 1px 4px;
  border-radius: 3px;
  margin-left: 2px;
  vertical-align: super;
  font-weight: bold;
}

.evidence-q1 { background: linear-gradient(180deg, transparent 60%, rgba(255, 182, 193, 0.6) 40%); }
.evidence-q1:hover { background: linear-gradient(180deg, transparent 40%, rgba(255, 150, 170, 0.8) 40%); }
.evidence-q1 .evidence-tag { background: #e91e63; }

.evidence-q2 { background: linear-gradient(180deg, transparent 60%, rgba(173, 216, 230, 0.6) 40%); }
.evidence-q2:hover { background: linear-gradient(180deg, transparent 40%, rgba(140, 190, 220, 0.8) 40%); }
.evidence-q2 .evidence-tag { background: #2196f3; }

.evidence-q3 { background: linear-gradient(180deg, transparent 60%, rgba(144, 238, 144, 0.6) 40%); }
.evidence-q3:hover { background: linear-gradient(180deg, transparent 40%, rgba(100, 210, 100, 0.8) 40%); }
.evidence-q3 .evidence-tag { background: #4caf50; }

.evidence-q4 { background: linear-gradient(180deg, transparent 60%, rgba(255, 218, 185, 0.6) 40%); }
.evidence-q4:hover { background: linear-gradient(180deg, transparent 40%, rgba(255, 190, 140, 0.8) 40%); }
.evidence-q4 .evidence-tag { background: #ff9800; }

.evidence-q5 { background: linear-gradient(180deg, transparent 60%, rgba(221, 160, 221, 0.6) 40%); }
.evidence-q5:hover { background: linear-gradient(180deg, transparent 40%, rgba(200, 130, 200, 0.8) 40%); }
.evidence-q5 .evidence-tag { background: #9c27b0; }
'''

# 하이라이트 함수 정의
highlight_functions = r'''
// === 정답 근거 하이라이트 함수 ===
function clearEvidenceHighlights() {
  const areas = [document.querySelector('.passage-text'), document.getElementById('vocab-result')];
  areas.forEach(area => {
    if (!area) return;
    const highlights = Array.from(area.querySelectorAll('.evidence-highlight'));
    highlights.forEach(el => {
      const text = el.textContent.replace(/\d번$/, '');
      el.replaceWith(document.createTextNode(text));
    });
    area.normalize();
  });
}

function highlightEvidence() {
  const pack = window.CONTENTS?.[window.CUR_UNIT];
  if (!pack || !pack.explain) return;
  clearEvidenceHighlights();
  const qLabels = { q1: '1번', q2: '2번', q3: '3번', q4: '4번', q5: '5번' };
  const areas = [document.querySelector('.passage-text'), document.getElementById('vocab-result')];

  ['q1', 'q2', 'q3', 'q4'].forEach(qKey => {
    const evidenceText = pack.explain[qKey];
    if (!evidenceText || evidenceText.length < 2) return;

    const chars = Array.from(evidenceText);
    const escapedChars = chars.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const flexPattern = escapedChars.join('(?:<[^>]*>)*');

    areas.forEach(area => {
      if (!area) return;
      try {
        const regex = new RegExp(`(${flexPattern})`, 'g');
        const html = area.innerHTML;
        const newHtml = html.replace(regex,
          `<span class="evidence-highlight evidence-${qKey}">$1<span class="evidence-tag">${qLabels[qKey]}</span></span>`);
        if (newHtml !== html) {
          area.innerHTML = newHtml;
        }
      } catch (e) {
        console.warn(`[highlightEvidence] ${qKey} 패턴 오류:`, e);
      }
    });
  });
}
window.highlightEvidence = highlightEvidence;
window.clearEvidenceHighlights = clearEvidenceHighlights;
'''

for i in range(2, 21):
    filename = f'physics_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if not os.path.exists(filepath):
        print(f"[{filename}] 파일 없음")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. CSS 추가 확인 및 추가
    if 'evidence-highlight' not in content:
        # </style> 바로 앞에 CSS 추가
        if '</style>' in content:
            content = content.replace('</style>', css_to_add + '</style>', 1)
            modified = True
            print(f"[{filename}] CSS 추가됨")
        else:
            print(f"[{filename}] </style> 태그 없음")
    else:
        print(f"[{filename}] CSS 이미 있음")

    # 2. highlightEvidence 호출 추가 (saveReadingProgress 내부)
    if 'highlightEvidence' not in content:
        # renderSolutions 호출 후에 추가
        pattern = r"(if\s*\(pack\s*&&\s*typeof\s+renderSolutions\s*===\s*'function'\)\s*\{\s*renderSolutions\(pack\);\s*\})"
        replacement = r'''\1

      // ★ 정답 근거 하이라이트 표시
      if (typeof highlightEvidence === 'function') {
        highlightEvidence();
      }'''
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            modified = True
            print(f"[{filename}] highlightEvidence 호출 추가됨")
        else:
            print(f"[{filename}] renderSolutions 패턴 불일치")

    # 3. 하이라이트 함수 정의 추가
    if 'function clearEvidenceHighlights' not in content:
        # </script> 앞에 추가 (마지막 saveReadingProgress 함수 정의 다음)
        # physics_content.js 로드 전에 추가
        pattern = r'(</script>\s*\n+\s*<!-- 외부 JS: 단원 콘텐츠 로드)'
        if re.search(pattern, content):
            def repl_fn(m):
                return highlight_functions + '\n' + m.group(1)
            content = re.sub(pattern, repl_fn, content, count=1)
            modified = True
            print(f"[{filename}] 하이라이트 함수 정의 추가됨")
        else:
            # 다른 패턴 시도 - 마지막 </script> 태그 찾기
            # saveReadingProgress 함수 닫힌 후 </script> 찾기
            pattern2 = r"(alert\(['\"]저장 실패: ['\"].*?err\.message\);?\s*\n\s*\}\s*\n\s*\}\s*\n)(</script>)"
            if re.search(pattern2, content, re.DOTALL):
                def repl_fn2(m):
                    return m.group(1) + highlight_functions + '\n' + m.group(2)
                content = re.sub(pattern2, repl_fn2, content, count=1)
                modified = True
                print(f"[{filename}] 하이라이트 함수 정의 추가됨 (패턴2)")
            else:
                print(f"[{filename}] 함수 정의 패턴 불일치")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filename}] 저장 완료\n")
    else:
        print(f"[{filename}] 변경 없음\n")

print("\n완료!")
