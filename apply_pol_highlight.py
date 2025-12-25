#!/usr/bin/env python3
"""
on_pol_02~20.html 파일에 하이라이트 구조를 추가합니다.
1. CSS 스타일 추가 (head 내)
2. highlightEvidence, clearEvidenceHighlights 함수 추가
3. resetQuiz에 clearEvidenceHighlights() 호출 추가
4. saveReadingProgress에 highlightEvidence() 호출 추가
"""

import os
import re

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social'

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

# 하이라이트 함수 - raw string 사용
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
    // 각 문자를 개별적으로 이스케이프 처리
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

    # 1. CSS 스타일 추가 (learning-common.css 다음에)
    if '.evidence-highlight' not in content:
        pattern = r'(<link rel="stylesheet" href="/assets/css/learning-common\.css[^"]*">)'
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1\n' + css_style, content)
            modified = True
            print(f"  ✓ CSS 스타일 추가")

    # 2. 하이라이트 함수 추가 (외부 JS 로드 전에)
    if 'function clearEvidenceHighlights()' not in content:
        # 여러 패턴 시도
        markers = [
            '<!-- 외부 JS: 단원 콘텐츠 로드',
            '<script src="./on_pol_content.js'
        ]
        for marker in markers:
            if marker in content:
                content = content.replace(marker, highlight_script + marker)
                modified = True
                print(f"  ✓ 하이라이트 함수 추가")
                break

    # 3. resetQuiz에 clearEvidenceHighlights() 추가
    if 'clearEvidenceHighlights();' not in content:
        # drawRadarChart({ literal:0, ... }) 다음 줄에 추가
        pattern = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)"
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1\n\n      // ★ 하이라이트 제거\n      clearEvidenceHighlights();', content)
            modified = True
            print(f"  ✓ resetQuiz에 clearEvidenceHighlights() 추가")

    # 4. saveReadingProgress에 highlightEvidence() 추가
    if "highlightEvidence();" not in content:
        # PDF 캡처 후에 추가 - 여러 패턴 시도
        patterns = [
            r"(await captureElementToPDF\('capture-reading', '단단국어_본문학습\.pdf', \{ withStudentInfo: true \}\);)",
            r"(await captureElementToPDF\('capture-reading', '단단국어_본문학습\.pdf'[^)]*\);)"
        ]
        for pattern in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, r"\1\n\n    // ★ PDF 캡처 후 하이라이트 적용\n    highlightEvidence();", content)
                modified = True
                print(f"  ✓ saveReadingProgress에 highlightEvidence() 추가")
                break

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# 메인 실행
for i in range(2, 21):
    filename = f'on_pol_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        print(f"\n=== {filename} 처리 중 ===")
        if process_file(filepath):
            print(f"  → 완료!")
        else:
            print(f"  → 변경 없음 (이미 적용됨)")
    else:
        print(f"\n=== {filename} 파일 없음 ===")

print("\n\n=== 모든 파일 처리 완료 ===")
