#!/usr/bin/env python3
"""
classic_02~40.html 파일에 하이라이트 구조를 일괄 적용합니다.
"""

import re
import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit'

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
highlight_functions = '''
// === 정답 근거 하이라이트 함수 ===
function clearEvidenceHighlights() {
  const areas = [document.querySelector('.passage-text'), document.getElementById('vocab-result')];
  areas.forEach(area => {
    if (!area) return;
    const highlights = Array.from(area.querySelectorAll('.evidence-highlight'));
    highlights.forEach(el => {
      const text = el.textContent.replace(/\\d번$/, '');
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
    const escapedChars = chars.map(c => c.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'));
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

for i in range(2, 41):
    filename = f'classic_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if not os.path.exists(filepath):
        print(f"[{filename}] 파일 없음")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. CSS 추가 확인 및 추가
    if 'evidence-highlight' not in content:
        if '</style>' in content:
            content = content.replace('</style>', css_to_add + '</style>', 1)
            modified = True
            print(f"[{filename}] CSS 추가됨")
        else:
            print(f"[{filename}] </style> 태그 없음")
    else:
        print(f"[{filename}] CSS 이미 있음")

    # 2. resetQuiz에 clearEvidenceHighlights 추가
    if 'clearEvidenceHighlights' not in content:
        # drawRadarChart({ literal:0... 패턴 찾기
        pattern = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)\s*\n(\s*\})\s*\n\s*(// 퀴즈 입력 활성화|function enableQuizInputs)"
        if re.search(pattern, content):
            def repl_reset(m):
                return f'''{m.group(1)}

      // ★ 정답 근거 하이라이트 제거
      if (typeof clearEvidenceHighlights === 'function') {{
        clearEvidenceHighlights();
      }}
{m.group(2)}

    {m.group(3)}'''
            content = re.sub(pattern, repl_reset, content, count=1)
            modified = True
            print(f"[{filename}] resetQuiz에 clearEvidenceHighlights 추가됨")
        else:
            print(f"[{filename}] resetQuiz 패턴 불일치")

    # 3. saveReadingProgress에 highlightEvidence 추가
    if 'highlightEvidence' not in content:
        # renderSolutions 호출 후 패턴 찾기
        pattern = r"(if \(content\) renderSolutions\(content\);)\s*\n(\s*\})\s*\n(\s*// showSubmitSuccess|        document\.getElementById\('save-progress-btn'\))"
        if re.search(pattern, content):
            def repl_save(m):
                return f'''{m.group(1)}
{m.group(2)}

        // ★ 정답 근거 하이라이트 표시
        if (typeof highlightEvidence === 'function') {{
          highlightEvidence();
        }}

        {m.group(3)}'''
            content = re.sub(pattern, repl_save, content, count=1)
            modified = True
            print(f"[{filename}] saveReadingProgress에 highlightEvidence 추가됨")
        else:
            print(f"[{filename}] saveReadingProgress 패턴 불일치")

    # 4. 하이라이트 함수 정의 추가
    if 'function clearEvidenceHighlights' not in content:
        # </script> 앞에 추가 (classic_content.js 로드 전)
        pattern = r'(</script>\s*\n+\s*<!-- 외부 JS: 단원 콘텐츠 로드)'
        if re.search(pattern, content):
            def repl_fn(m):
                return highlight_functions + '\n' + m.group(1)
            content = re.sub(pattern, repl_fn, content, count=1)
            modified = True
            print(f"[{filename}] 하이라이트 함수 정의 추가됨")
        else:
            # 다른 패턴 시도
            pattern2 = r"(\}\s*\n\s*\}\s*\n</script>)\s*\n+\s*(<!-- 외부 JS)"
            if re.search(pattern2, content):
                def repl_fn2(m):
                    return m.group(1).rstrip('</script>').rstrip() + highlight_functions + '\n</script>\n\n' + m.group(2)
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
