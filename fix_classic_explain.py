#!/usr/bin/env python3
"""
on_classic_content.js의 explain 값들을 점검하고 수정합니다.
- '어휘 — 뜻' 형식을 본문 텍스트로 변경
- '문단번호:' 접두사 제거
- <b>태그</b> 뒤부터 시작하도록 수정
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 수정 목록: (unit_key, field, old_pattern_or_value, new_value)
# 어휘 설명 형식 → 본문 텍스트로 변경

fixes = [
    # on_classic_04: q3 '가장 — 사실과...' → '<b>가장</b>' 뒤 텍스트
    ('on_classic_04', 'q3', '가장 — 사실과 다르게 꾸미거나 속이는 행동', '해 궁궐에 나타났어요.'),

    # on_classic_05: q2 '3문단: ...' → 문단번호 제거, q3 슬래시 제거
    ('on_classic_05', 'q2', '3문단: 용궁에서 온 용녀가 나타나 숙향을 건져냈어요. 불길 속에서 화덕의 신에게 구출되기도 했고, 천태산의 마고할미가 나타나 그녀를 데려갔습니다.', '용궁에서 온 용녀가 나타나 숙향을 건져냈어요.'),
    ('on_classic_05', 'q3', '길을 헤매던 숙향 / 억울한 누명을 쓰고 쫓겨나', '길을 헤매던 숙향은 신비로운 사슴의 안내로'),
    ('on_classic_05', 'q4', '숙향은 여러 차례 위기에 처했는데 / 포기하지 않고 바느질 솜씨를 익혔고', '숙향은 할미와 지내며 바느질 솜씨를 익혔고'),

    # on_classic_06: q3 어휘 설명 → 본문
    ('on_classic_06', 'q3', '공양미 — 부처님께 바치는 쌀', '삼백 석에 팔겠다고 말했습니다.'),

    # on_classic_07: q3 skip (본문 텍스트로 되어 있음)

    # on_classic_08: q3 어휘 설명 → 본문
    ('on_classic_08', 'q3', '용궁 — 용왕이 사는 바다 속 궁전', '에 용왕이 살고 있었습니다.'),

    # on_classic_09: q3 어휘 설명 → 본문
    ('on_classic_09', 'q3', '계모 — 아버지의 새 아내, 새어머니', '허 씨를 새어머니로 맞이하면서 불행이 시작되었어요.'),

    # on_classic_10: q3 어휘 설명 → 본문
    ('on_classic_10', 'q3', '계모 — 아버지의 새 아내 / 팥쥐 — 계모가 데려온 못된 딸', '는 콩쥐만 미워하며 온갖 궂은일을 시켰어요.'),

    # on_classic_11: q3 어휘 설명 → 본문
    ('on_classic_11', 'q3', '배 비장 — 위선적인 관리 / 정숙 — 행실이 바르고 조신함', '은 스스로를 정숙한 군자라 여겼어요.'),

    # on_classic_12: q3 어휘 설명 → 본문
    ('on_classic_12', 'q3', '고집 — 자기 생각만 내세우며 굽히지 않음 / 인색 — 재물을 아끼고 나누지 않음', '이 세고 인색하기로 유명했어요.'),

    # on_classic_13: q3 어휘 설명 → 본문
    ('on_classic_13', 'q3', '허물 — 벗겨지는 껍질, 또는 잘못', '을 벗고 빼어난 미인으로 변했어요.'),

    # on_classic_14: q3 어휘 설명 → 본문
    ('on_classic_14', 'q3', '밀회 — 남몰래 만남', '를 가졌습니다.'),

    # on_classic_15: q3 어휘 설명 → 본문
    ('on_classic_15', 'q3', '신분 차이 — 사회적 계급의 다름 / 양반과 기생의 신분 차이는 둘의 사랑을 가로막는 큰 벽이었어요.', '는 둘의 사랑을 가로막는 큰 벽이었어요.'),

    # on_classic_16: q3 어휘 설명 → 본문
    ('on_classic_16', 'q3', '부귀영화 — 재물이 많고 지위가 높은 영광 / 덧없다 — 오래가지 못하고 허무하다', '는 꿈처럼 덧없는 것이구나'),

    # on_classic_17: q3 어휘 설명 → 본문
    ('on_classic_17', 'q3', '모함 — 없는 죄를 꾸며서 씌움', '을 당해 처형될 위기에 처했지만'),
]

# 수정 적용
for unit_key, q_field, old_val, new_val in fixes:
    # explain 블록 내에서 해당 필드 찾기
    pattern = rf"({unit_key}:[\s\S]*?explain:\s*\{{[\s\S]*?{q_field}:\s*')([^']+)(')"

    def replacer(match):
        prefix = match.group(1)
        current = match.group(2)
        suffix = match.group(3)
        if current == old_val:
            return prefix + new_val + suffix
        return match.group(0)

    new_content = re.sub(pattern, replacer, content, count=1)
    if new_content != content:
        content = new_content
        print(f"✓ {unit_key} {q_field}: '{old_val[:30]}...' → '{new_val[:30]}...'")
    else:
        print(f"✗ {unit_key} {q_field}: 패턴 못찾음")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n완료!")
