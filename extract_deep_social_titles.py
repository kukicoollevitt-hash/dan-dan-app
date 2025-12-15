#!/usr/bin/env python3
import re

subjects = ['soc', 'geo', 'law', 'pol']
subject_names = {
    'soc': '딥사회문화',
    'geo': '딥지리',
    'law': '딥법',
    'pol': '딥정치경제'
}

for subject in subjects:
    print(f"\n{'='*100}")
    print(f"{subject_names[subject]} 제목 추출")
    print('='*100)

    with open(f'public/BRAINUP/social/deep_{subject}_content.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # deep_XX: { ... title: '제목' ... } 패턴 찾기
    pattern = rf"deep_{subject}_(\d+):\s*\{{[^}}]*?title:\s*'([^']+)'"
    matches = re.findall(pattern, content, re.DOTALL)

    print(f'      overrides["BRAINDEEP.social.{subject}"] = [')
    for num, title in matches:
        print(f'        "{title}",')
    print('      ];')
