#!/usr/bin/env python3
"""
on_world1 HTML 파일들의 하이라이트 스타일을 on_classic과 동일하게 수정합니다.
- 배경색 + 밑줄 + 번호 태그 뒤쪽에
"""

import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit'

# 기존 CSS 스타일 (절대위치 태그)
old_css = '''/* === 정답 근거 하이라이트 스타일 === */
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
.evidence-q5 .evidence-tag { background-color: #9c27b0; }'''

# 새로운 CSS 스타일 (on_classic과 동일: 배경 + 밑줄 + 인라인 태그)
new_css = '''/* === 정답 근거 하이라이트 스타일 === */
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
  .evidence-q5 .evidence-tag { background: #9c27b0; }'''

# 02~40 파일 처리
total_modified = 0
for i in range(2, 41):
    filename = f'on_world1_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if old_css in content:
            content = content.replace(old_css, new_css)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[{filename}] ✓ CSS 스타일 수정됨")
            total_modified += 1
        else:
            print(f"[{filename}] - 이미 적용됨 또는 패턴 없음")
    else:
        print(f"[{filename}] 파일 없음")

print(f"\n완료! 총 {total_modified}개 파일 수정됨")
