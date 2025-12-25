#!/usr/bin/env python3
"""
on_modern_02~40.html 파일에 하이라이트 구조를 적용합니다.
1. CSS 스타일 추가
2. highlightEvidence(), clearEvidenceHighlights() 함수 추가
3. resetQuiz에 clearEvidenceHighlights() 추가
4. saveReadingProgress에 highlightEvidence() 추가
"""

import os
import re

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit'

# CSS 스타일
css_style = '''
<style>
  /* === 정답 근거 하이라이트 스타일 === */
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
  /* 1번 - 분홍 */
  .evidence-q1 { background: rgba(233, 30, 99, 0.15); border-bottom-color: #e91e63; }
  .evidence-q1 .evidence-tag { background: #e91e63; }
  /* 2번 - 하늘 */
  .evidence-q2 { background: rgba(33, 150, 243, 0.15); border-bottom-color: #2196f3; }
  .evidence-q2 .evidence-tag { background: #2196f3; }
  /* 3번 - 연두 */
  .evidence-q3 { background: rgba(76, 175, 80, 0.15); border-bottom-color: #4caf50; }
  .evidence-q3 .evidence-tag { background: #4caf50; }
  /* 4번 - 살구 */
  .evidence-q4 { background: rgba(255, 152, 0, 0.15); border-bottom-color: #ff9800; }
  .evidence-q4 .evidence-tag { background: #ff9800; }
  /* 5번 - 보라 */
  .evidence-q5 { background: rgba(156, 39, 176, 0.15); border-bottom-color: #9c27b0; }
  .evidence-q5 .evidence-tag { background: #9c27b0; }
</style>
'''

# 하이라이트 함수
highlight_script = r'''<!-- ★ 정답 근거 하이라이트 함수 -->
<script>
// 하이라이트 제거
function clearEvidenceHighlights() {
  const passage = document.querySelector('.passage-text');
  if (!passage) return;

  // evidence-highlight 스팬을 원래 텍스트로 복원
  passage.querySelectorAll('.evidence-highlight').forEach(el => {
    const text = el.textContent.replace(/\d번$/, ''); // 태그 텍스트 제거
    el.replaceWith(document.createTextNode(text));
  });

  // 노드 정규화 (인접 텍스트 노드 병합)
  passage.normalize();
}

// 정답 근거 하이라이트 적용
function highlightEvidence() {
  const pack = window.CONTENTS?.[window.CUR_UNIT];
  if (!pack || !pack.explain) return;

  const passage = document.querySelector('.passage-text');
  if (!passage) return;

  // 먼저 기존 하이라이트 제거
  clearEvidenceHighlights();

  const qLabels = ['1번', '2번', '3번', '4번', '5번'];
  const explains = [
    pack.explain.q1,
    pack.explain.q2,
    pack.explain.q3,
    pack.explain.q4,
    pack.explain.q5
  ].filter(Boolean);

  explains.forEach((text, idx) => {
    if (!text || text.length < 2) return;

    const qClass = `evidence-q${idx + 1}`;
    const label = qLabels[idx];

    // HTML 태그를 무시하고 텍스트만 매칭하는 정규식 생성
    const chars = Array.from(text);
    const escapedChars = chars.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const flexPattern = escapedChars.join('(?:<[^>]*>)*');

    let regex;
    try {
      regex = new RegExp(flexPattern, 'g');
    } catch (e) {
      console.warn('[highlightEvidence] regex error for q' + (idx+1) + ':', e.message);
      return;
    }

    const html = passage.innerHTML;
    const newHtml = html.replace(regex, (match) => {
      return `<span class="evidence-highlight ${qClass}">${match}<span class="evidence-tag">${label}</span></span>`;
    });

    if (newHtml !== html) {
      passage.innerHTML = newHtml;
    }
  });
}

// 전역 노출
window.highlightEvidence = highlightEvidence;
window.clearEvidenceHighlights = clearEvidenceHighlights;
</script>

'''

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. CSS 스타일 추가 (이미 있으면 스킵)
    if '.evidence-highlight' not in content:
        # <link rel="stylesheet" href="/assets/css/learning-common.css"> 뒤에 추가
        pattern = r'(<link rel="stylesheet" href="/assets/css/learning-common.css"[^>]*>)'
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1\n' + css_style, content)
            modified = True
            print("  ✓ CSS 스타일 추가")
        else:
            print("  ✗ CSS 삽입 위치 못찾음")
    else:
        print("  → CSS 이미 존재")

    # 2. 하이라이트 함수 추가 (이미 있으면 스킵)
    if 'function highlightEvidence' not in content:
        # on_modern_content.js 로드 직전에 추가
        pattern = r'<!-- 외부 JS: 단원 콘텐츠 로드[^>]*-->\s*<script src="./on_modern_content\.js[^"]*"[^>]*></script>'
        match = re.search(pattern, content)
        if match:
            content = content[:match.start()] + highlight_script + content[match.start():]
            modified = True
            print("  ✓ 하이라이트 함수 추가")
        else:
            print("  ✗ 함수 삽입 위치 못찾음")
    else:
        print("  → 함수 이미 존재")

    # 3. resetQuiz에 clearEvidenceHighlights() 추가
    if 'clearEvidenceHighlights()' not in content or 'resetQuiz' in content:
        # drawRadarChart 다음에 clearEvidenceHighlights 추가
        pattern = r'(drawRadarChart\(\{[^}]+\}\);)\s*(\n\s*\})\s*(\n\s*// 본문 제출)'
        match = re.search(pattern, content)
        if match:
            after_draw = content[match.end(1):match.start(3)]
            if 'clearEvidenceHighlights' not in after_draw:
                replacement = r'\1\n\n      // ★ 하이라이트 제거\n      clearEvidenceHighlights();\2\3'
                content = re.sub(pattern, replacement, content)
                modified = True
                print("  ✓ resetQuiz에 clearEvidenceHighlights() 추가")
            else:
                print("  → resetQuiz에 이미 존재")
        else:
            print("  ✗ resetQuiz 패턴 못찾음")

    # 4. saveReadingProgress에 highlightEvidence() 추가
    if 'highlightEvidence()' not in content:
        # captureElementToPDF 다음에 highlightEvidence 추가
        pattern = r"(await captureElementToPDF\('capture-reading'[^;]+;\s*)\n(\s*if \(typeof renderSolutions)"
        match = re.search(pattern, content)
        if match:
            replacement = r'\1\n\n    // ★ PDF 캡처 후 하이라이트 적용\n    highlightEvidence();\n\n\2'
            content = re.sub(pattern, replacement, content)
            modified = True
            print("  ✓ saveReadingProgress에 highlightEvidence() 추가")
        else:
            print("  ✗ saveReadingProgress 패턴 못찾음")
    else:
        print("  → saveReadingProgress에 이미 존재")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# 메인 실행
modified_count = 0
for i in range(2, 41):
    filename = f'on_modern_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        print(f"\n=== {filename} ===")
        if process_file(filepath):
            modified_count += 1
    else:
        print(f"\n=== {filename} 파일 없음 ===")

print(f"\n\n=== 총 {modified_count}개 파일 수정 완료 ===")
