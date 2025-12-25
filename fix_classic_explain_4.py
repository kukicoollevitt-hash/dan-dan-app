#!/usr/bin/env python3
"""
on_classic_content.js의 나머지 explain 값들을 수정합니다 (26~40).
문단번호 접두사와 어휘 설명 형식을 제거합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

fixes = [
    # on_classic_31 (구렁덩덩신선비)
    ('on_classic_31', 'q2', '4문단: 셋째 딸은 철 신발을 신고 남편을 찾아 떠났어요. 마침내 하늘나라에서 남편을 다시 만났습니다.', '셋째 딸은 철 신발을 신고 남편을 찾아 떠났어요.'),
    ('on_classic_31', 'q3', '부모님 말씀 — 셋째 딸은 부모님 말씀을 믿고 따랐습니다', '을 믿고 따랐습니다.'),

    # on_classic_32 (바리데기)
    ('on_classic_32', 'q2', '1문단: 임금은 일곱째 공주가 태어나자 크게 실망하여 갓난아기를 바다에 버렸습니다.', '임금은 아들을 원했기에 일곱째 공주가 태어나자 크게'),

    # on_classic_33 (금방울전)
    ('on_classic_33', 'q2', '1문단: 김 장군은 억울한 누명을 쓰고 귀양을 갔습니다. 귀양지에서 아들 금방울을 낳았어요.', '김 장군은 억울한 누명을 쓰고'),
    ('on_classic_33', 'q3', '도술 — 신비한 요술이나 재주, 하늘을 날고 땅속을 다니며 재주를 부림', '을 익혀 하늘을 날고 땅속을 다니며 온갖 재주를 부릴 수 있게 되었어요.'),

    # on_classic_34 (유충렬전)
    ('on_classic_34', 'q2', '1문단: 유심은 간신의 잘못을 상소했다가 모함을 당해 귀양을 갔어요. 귀양지에서 유충렬을 낳았습니다.', '유심은 간신의 잘못을'),
    ('on_classic_34', 'q3', '충성 — 나라나 윗사람에게 정성을 다함, 충렬은 정의를 바로 세웠습니다', '을 다했습니다.'),

    # on_classic_35 (조웅전)
    ('on_classic_35', 'q2', '4문단: 임금은 조웅의 큰 공을 인정하여 높은 벼슬을 내리고, 충신 조정인의 명예를 회복시켰습니다.', '임금은 조웅의 큰 공을 인정하여 높은'),
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
