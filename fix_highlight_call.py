#!/usr/bin/env python3
"""
on_modern_02~40 HTML 파일에 saveReadingProgress 함수 내 highlightEvidence() 호출을 추가합니다.
PDF 캡처 후에 호출되어야 합니다.
"""

import os
import re

korlit_dir = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit'

for i in range(2, 41):
    filename = f'on_modern_{i:02d}.html'
    filepath = os.path.join(korlit_dir, filename)

    if not os.path.exists(filepath):
        print(f"✗ {filename} 없음")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # saveReadingProgress 내에 highlightEvidence() 호출이 있는지 확인
    # 패턴: captureElementToPDF 호출 후에 highlightEvidence() 호출이 있어야 함
    pattern = r"(await captureElementToPDF\('capture-reading'[^)]+\);)\s*(// ★ PDF 캡처 후 하이라이트 적용\s*highlightEvidence\(\);)?"

    match = re.search(pattern, content)
    if match:
        if match.group(2):
            print(f"→ {filename}: 이미 있음")
        else:
            # highlightEvidence() 호출 추가
            old_text = match.group(1)
            new_text = old_text + "\n\n    // ★ PDF 캡처 후 하이라이트 적용\n    highlightEvidence();"
            content = content.replace(old_text, new_text, 1)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ {filename}: highlightEvidence() 호출 추가됨")
    else:
        print(f"✗ {filename}: captureElementToPDF 패턴 못찾음")
