#!/usr/bin/env python3
"""
on_classic_content.js의 추가 explain 값을 점검하여 수정합니다.
<b>태그</b>를 건너뛰도록 수정합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 추가 수정할 explain 값 목록
fixes = [
    # on_classic_14
    ('on_classic_14', 'q2', '1문단: 운영은 젊은 선비 김진사를 만나게 되었어요. 두 사람은 첫눈에 서로를 사모하게 되었지만, 궁녀는 바깥 남자와 만나는 것이 금지되어 있었습니다.', '를 만나게 되었어요.'),

    # on_classic_16
    ('on_classic_16', 'q2', '1문단: 성진은 팔선녀를 만났어요. 아름다운 선녀들과 대화를 나누며 성진은 속세의 즐거움에 마음이 흔들렸습니다.', '를 만났어요.'),

    # on_classic_18
    ('on_classic_18', 'q1', '화진은 효성이 지극하여 계모의 미움에도 원망하지 않고 정성껏 공경했어요.', '이 지극하여 계모의 미움에도 원망하지 않고 정성껏'),
    ('on_classic_18', 'q3', '이 지극하여 계모의 미움에도 원망하지 않고 정성껏', '가 깊어 어머니의 나쁜 계략에 동조하지 않았어요.'),
    ('on_classic_18', 'q4', '두 형제는 효성과 우애로 가문의 위기를 극복하고 영광을 드높였어요.', '가 어려움을 이기는 힘이라는 교훈을 전합니다.'),

    # on_classic_19
    ('on_classic_19', 'q2', '나라가 위기에 처했을 때 백성들이 힘을 합쳐', '을 극복한 역사를 전하고 있어요.'),
]

# 수정 적용
modified_count = 0
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
        modified_count += 1
        print(f"✓ {unit_key} {q_field}: 수정됨")
    else:
        print(f"✗ {unit_key} {q_field}: 패턴 못찾음 또는 이미 수정됨")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {modified_count}개 수정됨")
