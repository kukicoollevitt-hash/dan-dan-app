#!/usr/bin/env python3
"""
on_classic_content.js의 모든 explain 값을 점검하여
<b>태그</b>를 건너뛰도록 수정합니다.
슬래시(/)가 포함된 explain도 수정합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 수정할 explain 값 목록
# (unit_key, q_field, old_val, new_val)
fixes = [
    # on_classic_01
    ('on_classic_01', 'q2', '몽룡의 아버지가 다른 곳으로 부임하게 되어 몽룡은 한양으로 떠나야 했어요.', '되어 몽룡은 한양으로 떠나야 했어요.'),

    # on_classic_04
    ('on_classic_04', 'q1', '그리고 그 황금을 곤궁한 백성들에게 나누어 주었습니다.', '한 백성들에게 나누어 주었습니다.'),

    # on_classic_05
    ('on_classic_05', 'q1', '바로 그 거북이 나타나 등을 내어 주며 그의 목숨을 구출해 주었습니다.', '해 주었습니다.'),

    # on_classic_06
    ('on_classic_06', 'q3', '삼백 석에 팔겠다고 말했습니다.', '삼백 석에 팔겠다고 말했습니다.'),  # 이미 OK

    # on_classic_08 - 슬래시 제거
    ('on_classic_08', 'q1', '순진한 토끼는 자라의 달콤한 말에 혹하여 그 등에 올라탔고 / 절체절명의 위기에서 토끼는 빠르게 기지를 발휘했습니다.', '순진한 토끼는 자라의 달콤한 말에 혹하여 그 등에 올라탔고,'),
    ('on_classic_08', 'q2', '1문단: 용왕은 병이 들어 시름시름 앓게 되었는데 / 자라가 나서서 자신이 육지에 가서 토끼를 데려오겠다고 자청했어요.', '이 살고 있었습니다.'),
    ('on_classic_08', 'q4', '절체절명의 위기에서 토끼는 빠르게 기지를 발휘했습니다. / 토끼는 위기 상황에서 재치와 지혜로 목숨을 구했습니다.', '를 발휘했습니다.'),

    # on_classic_09 - 슬래시 제거
    ('on_classic_09', 'q4', '두 자매는 억울하게 죽어 원혼이 되었고 / 사또는 두려워하지 않고 끝까지 그들의 말을 들었어요.', '이 되었고, 그 후로 그 고을에 부임하는'),

    # on_classic_10
    ('on_classic_10', 'q1', '두꺼비가 나타나 밑 빠진 독을 막아 주고, 참새들이 날아와 베를 짜 주었어요. 선녀가 내려와 아름다운 옷과 꽃신을 주었습니다. 원님은 콩쥐를 찾아 혼인하게 되었습니다.', '가 나타나 밑 빠진 독을 막아 주고,'),
    ('on_classic_10', 'q2', '1문단: 콩쥐라는 착한 소녀가 살았습니다. 계모는 콩쥐만 미워하며 온갖 궂은일을 시켰어요.', '라는 착한 소녀가 살았습니다.'),

    # on_classic_11
    ('on_classic_11', 'q1', '배 비장은 절대 마음이 흔들리지 않겠다고 큰소리쳤어요. 그러나 결국 애랑에게 푹 빠져들었어요. 벌거벗은 배 비장이 나타나 모든 사람들의 웃음거리가 되었어요.', '이라는 관리가 있었습니다.'),
    ('on_classic_11', 'q2', '4문단: 벌거벗은 배 비장이 나타나 모든 사람들의 웃음거리가 되었어요. 자신의 위선과 허풍이 만천하에 드러나 크게 망신을 당한 것입니다.', '가 되었어요.'),
    ('on_classic_11', 'q3', '은 스스로를 정숙한 군자라 여겼어요.', '하고 여색에 흔들리지 않는 굳은 의지를 가졌는지 자랑하기를 좋아했어요.'),

    # on_classic_13
    ('on_classic_13', 'q2', '4문단: 박씨의 활약으로 조선은 완전한 패배를 면할 수 있었습니다. 인조 임금은 박씨의 공을 높이 치하하고 정렬부인이라는 칭호를 내렸어요.', '를 면할 수 있었습니다.'),
    ('on_classic_13', 'q4', '박씨는 남편의 냉대를 묵묵히 견디며 집안 살림을 도왔어요. 박씨는 도술을 부려 적의 장수를 무찌르고 조선군을 도왔어요.', '를 묵묵히 견디며 집안 살림을 도왔어요.'),
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
