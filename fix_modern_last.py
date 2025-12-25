#!/usr/bin/env python3
"""
on_modern_content.js의 explain 값들을 passage의 정확한 텍스트로 수정합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_modern_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 정확한 수정 목록 (passage plain text 기준)
fixes = [
    # on_modern_11 q4: "온갖 구박을 받았고" (멸시와 학대 X)
    ('on_modern_11', 'q4', '온갖 구박을 받았고'),

    # on_modern_13 q4: "친일파로 활동하며 재산을 모은 인물이다"
    ('on_modern_13', 'q4', '친일파로 활동하며 재산을 모은 인물이다.'),

    # on_modern_18 q3: passage에서 정확한 텍스트
    ('on_modern_18', 'q3', '금홍이라는 기생을 만나게 된다.'),

    # on_modern_20 q4: passage 확인 필요
    ('on_modern_20', 'q4', '외삼촌은 국군으로 참전했고, 삼촌은 빨치산이 되었다.'),

    # on_modern_29 q2: passage 확인 필요
    ('on_modern_29', 'q2', '가족애를 보여준다.'),
]

# 정규식으로 수정
for unit_key, q_name, new_explain in fixes:
    pattern = rf"({unit_key}:.*?explain:\s*\{{[^}}]*?{q_name}:\s*['\"])([^'\"]+)(['\"])"

    def make_replacer(new_val):
        def replacer(match):
            return match.group(1) + new_val + match.group(3)
        return replacer

    new_content, count = re.subn(pattern, make_replacer(new_explain), content, flags=re.DOTALL)
    if count > 0:
        content = new_content
        print(f"✓ {unit_key} {q_name}: {new_explain[:40]}...")
    else:
        print(f"✗ {unit_key} {q_name} 못찾음")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n수정 완료")
