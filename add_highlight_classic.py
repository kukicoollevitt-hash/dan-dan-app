#!/usr/bin/env python3
"""
on_classic_02~40 HTML 파일에 하이라이트 구조를 추가합니다.
1. CSS 스타일 추가
2. resetQuiz에 clearEvidenceHighlights 호출 추가
3. saveReadingProgress에 highlightEvidence 호출 추가
4. 함수 정의 추가
"""

import os
import re

korlit_dir = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit'

# CSS 스타일
css_style = '''
  <!-- 정답 근거 하이라이트 스타일 -->
  <style>
    .evidence-highlight {
      padding: 2px 4px;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 2px solid;
    }
    .evidence-highlight .evidence-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: bold;
      color: white;
      padding: 1px 5px;
      border-radius: 8px;
      margin-left: 4px;
      vertical-align: middle;
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
  </style>

  <!-- 파비콘 404 방지 -->'''

# 함수 정의
func_script = '''

<!-- ★ 정답 근거 하이라이트 함수 -->
<script>
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
    try { regex = new RegExp(flexPattern, 'g'); } catch (e) { return; }
    const html = passage.innerHTML;
    const newHtml = html.replace(regex, (match) => {
      return `<span class="evidence-highlight ${qClass}">${match}<span class="evidence-tag">${label}</span></span>`;
    });
    if (newHtml !== html) passage.innerHTML = newHtml;
  });
}

window.highlightEvidence = highlightEvidence;
window.clearEvidenceHighlights = clearEvidenceHighlights;
</script>

<!-- 외부 JS'''

for i in range(3, 41):
    filename = f'on_classic_{i:02d}.html'
    filepath = os.path.join(korlit_dir, filename)

    if not os.path.exists(filepath):
        print(f"✗ {filename} 없음")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. CSS 스타일 추가 (이미 있는지 확인)
    if 'evidence-highlight' not in content:
        # learning-common.css 다음에 추가
        old_pattern = '  <link rel="stylesheet" href="/assets/css/learning-common.css">\n\n  <!-- 파비콘 404 방지 -->'
        if old_pattern in content:
            content = content.replace(old_pattern, '  <link rel="stylesheet" href="/assets/css/learning-common.css">\n' + css_style)
            modified = True
            print(f"  ✓ {filename}: CSS 추가")
        else:
            print(f"  ? {filename}: CSS 위치 못찾음")

    # 2. resetQuiz에 clearEvidenceHighlights 호출 추가
    if 'clearEvidenceHighlights' not in content:
        pattern = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)\n    \}"
        replacement = r"\1\n\n      // ★ 하이라이트 제거\n      if (typeof clearEvidenceHighlights === 'function') clearEvidenceHighlights();\n    }"
        new_content = re.sub(pattern, replacement, content, count=1)
        if new_content != content:
            content = new_content
            modified = True
            print(f"  ✓ {filename}: resetQuiz 수정")

    # 3. saveReadingProgress에 highlightEvidence 호출 추가
    if "// ★ PDF 캡처 후 하이라이트 적용" not in content:
        pattern = r"(await captureElementToPDF\('capture-reading', '단단국어_본문학습\.pdf', \{ withStudentInfo: true \}\);)\n\n        // 5\) 정답"
        replacement = r"\1\n\n        // ★ PDF 캡처 후 하이라이트 적용\n        highlightEvidence();\n\n        // 5) 정답"
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            modified = True
            print(f"  ✓ {filename}: saveReadingProgress 수정")

    # 4. 함수 정의 추가
    if 'window.highlightEvidence' not in content:
        pattern = r"</script>\n\n\n<!-- 외부 JS: 단원 콘텐츠 로드 \(classic_\d+\.html과 같은 폴더\) -->\n<script src=\"\./on_classic_content\.js"
        match = re.search(pattern, content)
        if match:
            old_text = match.group(0)
            new_text = '</script>\n' + func_script + ': 단원 콘텐츠 로드 (classic_' + f'{i:02d}' + '.html과 같은 폴더) -->\n<script src="./on_classic_content.js'
            content = content.replace(old_text, new_text)
            modified = True
            print(f"  ✓ {filename}: 함수 추가")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {filename} 저장 완료")
    else:
        print(f"→ {filename}: 이미 적용됨 또는 변경 없음")

print("\n완료!")
