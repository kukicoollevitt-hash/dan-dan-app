#!/usr/bin/env python3
import re

subjects = {
    'modern': ('딥현대문학', 'korlit'),
    'classic': ('딥고전문학', 'korlit'),
    'world1': ('딥세계문학1', 'worldlit'),
    'world2': ('딥세계문학2', 'worldlit'),
    'people1': ('딥한국인물', 'person'),
    'people2': ('딥세계인물', 'person')
}

for subject_id, (name, domain) in subjects.items():
    print(f"\n{'='*100}")
    print(f"{name} 제목 추출")
    print('='*100)

    with open(f'public/BRAINUP/{domain}/deep_{subject_id}_content.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # deep_XX: { ... title: '제목' ... } 패턴 찾기
    pattern = rf"deep_{subject_id}_(\d+):\s*\{{[^}}]*?title:\s*'([^']+)'"
    matches = re.findall(pattern, content, re.DOTALL)

    print(f'      overrides["BRAINDEEP.{domain}.{subject_id}"] = [')
    for num, title in matches:
        print(f'        "{title}",')
    print('      ];')
