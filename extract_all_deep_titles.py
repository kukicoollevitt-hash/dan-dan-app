#!/usr/bin/env python3
import re

subjects = ['physics', 'chem']

for subject in subjects:
    print(f"\n{'='*100}")
    print(f"딥{subject} 제목 추출")
    print('='*100)

    with open(f'public/BRAINUP/science/deep_{subject}_content.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # deep_XX: { ... title: '제목' ... } 패턴 찾기
    pattern = rf"deep_{subject}_(\d+):\s*\{{[^}}]*?title:\s*'([^']+)'"
    matches = re.findall(pattern, content, re.DOTALL)

    print(f'      overrides["BRAINDEEP.science.{subject}"] = [')
    for num, title in matches:
        print(f'        "{title}",')
    print('      ];')
