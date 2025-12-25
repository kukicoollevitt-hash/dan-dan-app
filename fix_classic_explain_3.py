#!/usr/bin/env python3
"""
on_classic_content.js의 나머지 explain 값들을 수정합니다 (23~40).
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

fixes = [
    # on_classic_23
    ('on_classic_23', 'q2', '4문단: 이춘풍전은 현명하고 능력 있는 아내와 어리석고 방탕한 남편을 대비시켜, 여성의 뛰어난 지혜와 능력을 보여주는 작품입니다.', '이춘풍전은 현명하고 능력 있는 아내와 어리석고 방탕한 남편을 대비시켜'),
    ('on_classic_23', 'q3', '기생 — 노래와 춤으로 손님을 접대하던 여자, 추월에게 홀딱 반해 재산을 탕진', '추월을 만났어요.'),

    # on_classic_24
    ('on_classic_24', 'q2', '1문단: 이혁은 집안이 몰락하여 가난해졌습니다. 평양에서 기생 옥단춘을 만났어요.', '이혁은 원래 명문가 출신이었지만 집안이 갑자기'),
    ('on_classic_24', 'q3', '고난 — 이혁이 급제 후 옥단춘을 잊어버렸지만, 옥단춘이 한양까지 찾아감', '을 잊어버렸어요.'),

    # on_classic_25
    ('on_classic_25', 'q2', '2문단: 둘은 서로를 알아보고 사랑하게 되었어요. 하지만 간악한 인물의 모함으로 억울한 누명을 썼습니다.', '둘은 전생의 인연으로 서로를 알아보았고'),
    ('on_classic_25', 'q3', '연꽃을 망가뜨리는 죄 — 옥황상제가 아끼던 연꽃을 실수로 망가뜨림', '을 망가뜨리는 죄를 지어'),
]

# 수정 적용
for unit_key, q_field, old_val, new_val in fixes:
    pattern = rf"({unit_key}:[\s\S]*?explain:\s*\{{[\s\S]*?{q_field}:\s*')([^']+)(')"

    def make_replacer(old, new):
        def replacer(match):
            prefix = match.group(1)
            current = match.group(2)
            suffix = match.group(3)
            if current == old:
                return prefix + new + suffix
            return match.group(0)
        return replacer

    new_content = re.sub(pattern, make_replacer(old_val, new_val), content, count=1)
    if new_content != content:
        content = new_content
        print(f"✓ {unit_key} {q_field}: 수정됨")
    else:
        print(f"✗ {unit_key} {q_field}: 패턴 못찾음")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n완료!")
