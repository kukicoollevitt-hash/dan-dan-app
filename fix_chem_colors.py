#!/usr/bin/env python3
import os

base_dir = "/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science"

old_css = """  /* === 정답 근거 하이라이트 스타일 === */
  .evidence-highlight {
    background: linear-gradient(180deg, transparent 60%, rgba(255, 220, 100, 0.5) 40%);
    padding: 2px 4px;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .evidence-highlight:hover {
    background: linear-gradient(180deg, transparent 40%, rgba(255, 200, 50, 0.7) 40%);
  }
  .evidence-highlight .evidence-tag {
    display: inline-block;
    font-size: 10px;
    font-weight: bold;
    color: white;
    background: #ff9800;
    padding: 1px 5px;
    border-radius: 8px;
    margin-left: 4px;
    vertical-align: middle;
  }"""

new_css = """  /* === 정답 근거 하이라이트 스타일 === */
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
  .evidence-q5 .evidence-tag { background: #9c27b0; }"""

for i in range(2, 21):
    filename = f"on_chem_{i:02d}.html"
    filepath = os.path.join(base_dir, filename)

    if not os.path.exists(filepath):
        print(f"파일 없음: {filename}")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if old_css in content:
        content = content.replace(old_css, new_css)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"CSS 색상 업데이트: {filename}")
    elif ".evidence-q1" in content:
        print(f"이미 적용됨: {filename}")
    else:
        print(f"패턴 미일치: {filename}")

print("\n=== 완료 ===")
