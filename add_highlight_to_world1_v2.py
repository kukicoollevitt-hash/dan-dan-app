#!/usr/bin/env python3
"""
on_world1_02~40.html 파일에 하이라이트 구조를 추가합니다.
"""

import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit'

# CSS 스타일 블록
css_block = '''
/* === 정답 근거 하이라이트 스타일 === */
.evidence-highlight {
  padding: 2px 4px;
  border-radius: 4px;
  position: relative;
}
.evidence-q1 { background-color: rgba(233, 30, 99, 0.2); }
.evidence-q2 { background-color: rgba(33, 150, 243, 0.2); }
.evidence-q3 { background-color: rgba(76, 175, 80, 0.2); }
.evidence-q4 { background-color: rgba(255, 152, 0, 0.2); }
.evidence-q5 { background-color: rgba(156, 39, 176, 0.2); }

.evidence-tag {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: white;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.evidence-q1 .evidence-tag { background-color: #e91e63; }
.evidence-q2 .evidence-tag { background-color: #2196f3; }
.evidence-q3 .evidence-tag { background-color: #4caf50; }
.evidence-q4 .evidence-tag { background-color: #ff9800; }
.evidence-q5 .evidence-tag { background-color: #9c27b0; }
'''

# 하이라이트 함수 블록
highlight_functions = '''<!-- ★ 정답 근거 하이라이트 함수 -->
<script>
// 하이라이트 제거
function clearEvidenceHighlights() {
  const passage = document.querySelector('.passage-text');
  if (!passage) return;

  // evidence-highlight 스팬을 원래 텍스트로 복원
  passage.querySelectorAll('.evidence-highlight').forEach(el => {
    const text = el.textContent.replace(/\\d번$/, ''); // 태그 텍스트 제거
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
    const escapedChars = chars.map(c => c.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'));
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

# resetQuiz 추가 블록
reset_addition = '''

      // 정답 근거 하이라이트 제거
      if (typeof clearEvidenceHighlights === 'function') {
        clearEvidenceHighlights();
      }
    }

    // 본문 제출'''

# saveReadingProgress 추가 블록
save_addition = '''

        // 4-1) 정답 근거 하이라이트 표시
        if (typeof highlightEvidence === 'function') {
          highlightEvidence();
        }

        // 5) 정답·해설 표시'''

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. CSS 스타일이 없으면 추가
    if 'evidence-highlight' not in content:
        # </style> 바로 앞에 CSS 추가
        old_str = "}\n</style>"
        if old_str in content:
            content = content.replace(old_str, "}" + css_block + "</style>", 1)
            modified = True
            print(f"  ✓ CSS 스타일 추가됨")

    # 2. 하이라이트 함수가 없으면 추가
    if 'function clearEvidenceHighlights' not in content:
        # on_world1_content.js 로드 직전에 추가
        old_str = '<!-- 외부 JS: 단원 콘텐츠 로드'
        if old_str in content:
            content = content.replace(old_str, highlight_functions + old_str, 1)
            modified = True
            print(f"  ✓ 하이라이트 함수 추가됨")

    # 3. resetQuiz에 clearEvidenceHighlights 호출 추가
    if 'clearEvidenceHighlights();' not in content:
        old_str = '''    }

    // 본문 제출'''
        if old_str in content and 'drawRadarChart({ literal:0' in content:
            content = content.replace(old_str, reset_addition, 1)
            modified = True
            print(f"  ✓ resetQuiz에 clearEvidenceHighlights 추가됨")

    # 4. saveReadingProgress에 highlightEvidence 호출 추가
    if 'highlightEvidence();' not in content:
        old_str = '''

        // 5) 정답·해설 표시'''
        if old_str in content:
            content = content.replace(old_str, save_addition, 1)
            modified = True
            print(f"  ✓ saveReadingProgress에 highlightEvidence 추가됨")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# 02~40 파일 처리
total_modified = 0
for i in range(2, 41):
    filename = f'on_world1_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        print(f"\n[{filename}]")
        if process_file(filepath):
            total_modified += 1
        else:
            print(f"  - 이미 적용됨 또는 변경 없음")
    else:
        print(f"\n[{filename}] 파일 없음")

print(f"\n완료! 총 {total_modified}개 파일 수정됨")
