#!/usr/bin/env python3
"""
bio_02~40.html 파일에 하이라이트 구조를 일괄 적용합니다.
"""

import re
import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science'

# CSS 추가 내용
css_to_add = '''
/* === 정답 근거 하이라이트 스타일 === */
.evidence-highlight {
  padding: 2px 4px;
  border-radius: 4px;
  position: relative;
  display: inline;
  margin: 0 2px;
  border-bottom: 2px solid;
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
.evidence-q1 { background: rgba(233, 30, 99, 0.15); border-bottom-color: #e91e63; }
.evidence-q1 .evidence-tag { background: #e91e63; }
.evidence-q2 { background: rgba(33, 150, 243, 0.15); border-bottom-color: #2196f3; }
.evidence-q2 .evidence-tag { background: #2196f3; }
.evidence-q3 { background: rgba(76, 175, 80, 0.15); border-bottom-color: #4caf50; }
.evidence-q3 .evidence-tag { background: #4caf50; }
.evidence-q4 { background: rgba(255, 152, 0, 0.15); border-bottom-color: #ff9800; }
.evidence-q4 .evidence-tag { background: #ff9800; }
.evidence-q5 { background: rgba(156, 39, 176, 0.15); border-bottom-color: #9c27b0; }
.evidence-q5 .evidence-tag { background: #9c27b0; }
'''

# 하이라이트 함수 정의
highlight_functions = """
// === 정답 근거 하이라이트 함수 ===
function clearEvidenceHighlights() {
  const passage = document.querySelector('.passage-text');
  if (!passage) return;
  passage.querySelectorAll('.evidence-highlight').forEach(el => {
    const text = el.textContent.replace(/\\d번$/, '');
    el.replaceWith(document.createTextNode(text));
  });
  passage.normalize();
}

function highlightEvidence() {
  const pack = window.CONTENTS?.[window.CUR_UNIT];
  if (!pack || !pack.explain) return;
  const passage = document.querySelector('.passage-text');
  if (!passage) return;
  clearEvidenceHighlights();
  const qLabels = ['1번', '2번', '3번', '4번', '5번'];
  const explains = [pack.explain.q1, pack.explain.q2, pack.explain.q3, pack.explain.q4, pack.explain.q5].filter(Boolean);
  explains.forEach((text, idx) => {
    if (!text || text.length < 2) return;
    const qClass = `evidence-q${idx + 1}`;
    const label = qLabels[idx];
    const chars = Array.from(text);
    const escapedChars = chars.map(c => c.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'));
    const flexPattern = escapedChars.join('(?:<[^>]*>)*');
    let regex;
    try { regex = new RegExp(flexPattern, 'g'); }
    catch (e) { return; }
    const html = passage.innerHTML;
    const newHtml = html.replace(regex, (match) => {
      return `<span class="evidence-highlight ${qClass}">${match}<span class="evidence-tag">${label}</span></span>`;
    });
    if (newHtml !== html) { passage.innerHTML = newHtml; }
  });
}
window.highlightEvidence = highlightEvidence;
window.clearEvidenceHighlights = clearEvidenceHighlights;
"""

for i in range(2, 41):
    filename = f'bio_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if not os.path.exists(filepath):
        print(f"[{filename}] 파일 없음")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. CSS 추가 확인 및 추가
    if 'evidence-highlight' not in content:
        # </style> 바로 앞에 CSS 추가 (body 스타일 다음)
        pattern = r'(body\s*\{[^}]+\})\s*(</style>)'
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1' + css_to_add + r'\2', content, count=1)
            modified = True
            print(f"[{filename}] CSS 추가됨")
        else:
            print(f"[{filename}] CSS 패턴 불일치")
    else:
        print(f"[{filename}] CSS 이미 있음")

    # 2. resetQuiz에 clearEvidenceHighlights 호출 추가
    if 'clearEvidenceHighlights' not in content:
        pattern = r'(function resetQuiz\(\)\s*\{)\s*(\n\s*document\.querySelectorAll)'
        replacement = r'''\1
      // 정답 근거 하이라이트 제거
      if (typeof clearEvidenceHighlights === 'function') {
        clearEvidenceHighlights();
      }\2'''
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            modified = True
            print(f"[{filename}] resetQuiz에 clearEvidenceHighlights 추가됨")
        else:
            print(f"[{filename}] resetQuiz 패턴 불일치")

    # 3. saveReadingProgress에 highlightEvidence 호출 추가
    if 'highlightEvidence' not in content:
        pattern = r"(if\s*\(typeof\s+renderSolutions\s*===\s*'function'\)\s*\{[^}]+\})\s*(\n\s*//\s*showSubmitSuccess)"
        replacement = r'''\1
    // 정답 근거 하이라이트 표시
    if (typeof highlightEvidence === 'function') {
      highlightEvidence();
    }\2'''
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            modified = True
            print(f"[{filename}] saveReadingProgress에 highlightEvidence 추가됨")
        else:
            print(f"[{filename}] saveReadingProgress 패턴 불일치")

    # 4. 하이라이트 함수 정의 추가
    if 'function clearEvidenceHighlights' not in content:
        # </script> 앞에 추가
        old_str = "alert('저장 실패: ' + err.message);\n  }\n}\n</script>"
        new_str = "alert('저장 실패: ' + err.message);\n  }\n}" + highlight_functions + "</script>"
        if old_str in content:
            content = content.replace(old_str, new_str, 1)
            modified = True
            print(f"[{filename}] 하이라이트 함수 정의 추가됨")
        else:
            print(f"[{filename}] 함수 정의 패턴 불일치")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filename}] 저장 완료")
    else:
        print(f"[{filename}] 변경 없음")

print("\n완료!")
