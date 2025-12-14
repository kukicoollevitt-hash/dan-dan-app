#!/usr/bin/env python3
import re
import json

# content.js 파일 읽기
with open('/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_earth_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# deep_earth_03부터 deep_earth_10까지 추출
for num in range(3, 11):
    unit_name = f'deep_earth_{num:02d}'
    print(f"\n{'='*60}")
    print(f"{unit_name}")
    print('='*60)

    # 해당 섹션 찾기
    pattern = rf'{unit_name}:\s*\{{.*?quiz:\s*\{{(.*?)\}}.*?answerKey:'
    match = re.search(pattern, content, re.DOTALL)

    if match:
        quiz_section = match.group(1)

        # q3_text 추출
        q3_text_match = re.search(r"q3_text:\s*'([^']+)'", quiz_section)
        if q3_text_match:
            print(f"\nQ3 문제: {q3_text_match.group(1)}")

        # q3_opts 추출
        q3_opts_match = re.search(r"q3_opts:\s*\[(.*?)\]", quiz_section, re.DOTALL)
        if q3_opts_match:
            opts = q3_opts_match.group(1)
            # 각 옵션 추출
            options = re.findall(r"'(①[^']+)'", opts, re.DOTALL)
            options += re.findall(r"'(②[^']+)'", opts, re.DOTALL)
            options += re.findall(r"'(③[^']+)'", opts, re.DOTALL)
            options += re.findall(r"'(④[^']+)'", opts, re.DOTALL)
            print("Q3 선택지:")
            for opt in options:
                print(f"  {opt}")

        # q4_text 추출
        q4_text_match = re.search(r"q4_text:\s*'([^']+)'", quiz_section)
        if q4_text_match:
            print(f"\nQ4 문제: {q4_text_match.group(1)}")

        # q4_opts 추출
        q4_opts_match = re.search(r"q4_opts:\s*\[(.*?)\]", quiz_section, re.DOTALL)
        if q4_opts_match:
            opts = q4_opts_match.group(1)
            # 각 옵션 추출
            options = re.findall(r"'(①[^']+)'", opts, re.DOTALL)
            options += re.findall(r"'(②[^']+)'", opts, re.DOTALL)
            options += re.findall(r"'(③[^']+)'", opts, re.DOTALL)
            options += re.findall(r"'(④[^']+)'", opts, re.DOTALL)
            print("Q4 선택지:")
            for opt in options:
                print(f"  {opt}")
