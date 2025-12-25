#!/usr/bin/env python3
"""
on_modern_content.js의 explain 값들을 passage의 정확한 텍스트로 수정합니다.
passage에서 태그를 제거한 후의 텍스트와 일치하도록 합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_modern_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 정확한 수정 목록 (passage plain text 기준)
# passage: "아우와 아내의 사이를 <b>의심하다</b> 시작했다" -> plain: "아우와 아내의 사이를 의심하다 시작했다"
fixes = [
    # on_modern_08 q1: passage는 "의심하다 시작했다"
    ('on_modern_08', 'q1', '아우와 아내의 사이를 의심하다 시작했다.'),

    # on_modern_09 q4: passage 확인 필요
    ('on_modern_09', 'q4', '바느질품을 팔아 생활비를 보탠다.'),

    # on_modern_11 q4: passage 확인
    ('on_modern_11', 'q4', '시집에서 온갖 멸시와 학대를 받는다.'),

    # on_modern_13 q4: passage 확인 - "일본에 아부하여 부를 쌓은 친일파 지주이다"
    ('on_modern_13', 'q4', '일본에 아부하여 부를 쌓은 친일파 지주이다.'),

    # on_modern_18 q3: passage 확인
    ('on_modern_18', 'q3', '금홍과의 만남부터 결별까지를 담담하게 기록한다.'),

    # on_modern_20 q4: passage 확인
    ('on_modern_20', 'q4', '외삼촌은 국군으로 참전했고, 삼촌은 빨치산이 되었다.'),

    # on_modern_29 q2: passage 확인
    ('on_modern_29', 'q2', '가난 속에서도 가족애를 보여준다.'),
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
