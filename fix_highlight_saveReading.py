#!/usr/bin/env python3
"""
on_modern_02~40 HTML 파일의 saveReadingProgress 함수에
highlightEvidence() 호출이 있는지 확인하고 없으면 추가합니다.

saveReadingProgress 함수 내에서 captureElementToPDF('capture-reading'...) 호출 후에
highlightEvidence()가 호출되어야 합니다.
"""

import os
import re

korlit_dir = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit'

for i in range(1, 41):
    filename = f'on_modern_{i:02d}.html'
    filepath = os.path.join(korlit_dir, filename)

    if not os.path.exists(filepath):
        print(f"✗ {filename} 없음")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # saveReadingProgress 함수 찾기
    save_func_pattern = r'(async function saveReadingProgress\(\)[\s\S]*?captureElementToPDF\([\'"]capture-reading[\'"],[^\)]+\);)([\s\S]*?)(if \(typeof renderSolutions)'

    match = re.search(save_func_pattern, content)
    if match:
        capture_part = match.group(1)
        middle_part = match.group(2)
        render_part = match.group(3)

        # 이미 highlightEvidence()가 있는지 확인
        if 'highlightEvidence();' in middle_part or 'highlightEvidence()' in middle_part:
            print(f"→ {filename}: saveReadingProgress에 이미 있음")
        else:
            # highlightEvidence() 호출 추가
            new_middle = "\n\n    // ★ PDF 캡처 후 하이라이트 적용\n    highlightEvidence();\n\n    "
            old_text = capture_part + middle_part + render_part
            new_text = capture_part + new_middle + render_part
            content = content.replace(old_text, new_text, 1)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ {filename}: saveReadingProgress에 highlightEvidence() 추가됨")
    else:
        print(f"? {filename}: saveReadingProgress 패턴 못찾음")
