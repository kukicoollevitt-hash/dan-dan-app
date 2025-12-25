#!/usr/bin/env python3
"""
on_classic_content.js의 나머지 explain 값들을 수정합니다 (18~40).
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

fixes = [
    # on_classic_18: q2 문단번호 제거, q3 어휘설명 → 본문
    ('on_classic_18', 'q2', '2문단: 화춘은 형 화진에게 우애가 깊어 어머니의 나쁜 계략에 동조하지 않았어요. 심씨의 음모는 실패했어요.', '화춘은 형 화진에게 우애가 깊어 어머니의 나쁜 계략에 동조하지 않았어요.'),
    ('on_classic_18', 'q3', '효성 — 부모를 공경하는 마음, 우애 — 형제 사이의 사랑', '이 지극하여 계모의 미움에도 원망하지 않고 정성껏'),

    # on_classic_19: q2 문단번호 제거, q3 어휘설명 → 본문
    ('on_classic_19', 'q2', '4문단: 나라가 위기에 처했을 때 백성들이 힘을 합쳐 국난을 극복한 역사를 전하고 있어요.', '나라가 위기에 처했을 때 백성들이 힘을 합쳐'),
    ('on_classic_19', 'q3', '거북선 — 이순신 장군이 만든 철갑 전투선', '을 이끌고 왜군을 크게 무찔렀습니다.'),

    # on_classic_20: q2 문단번호 제거, q3 어휘설명 → 본문
    ('on_classic_20', 'q2', '1문단: 허생은 글만 읽고 가난하게 살았습니다. 변씨에게 만 냥을 빌렸어요.', '허생은 글만 읽고 가난하게 살았습니다.'),
    ('on_classic_20', 'q3', '매점매석 — 물건을 싹쓸이해서 값을 올리는 행위', '이에요. 물건을 싹쓸이해서 값을 올리는 방법으로'),

    # on_classic_21: q2 문단번호 제거, q3 어휘설명 → 본문
    ('on_classic_21', 'q2', '3문단: 부자는 이 긴 목록을 읽다가 점점 얼굴이 굳어졌습니다. 결국 거래를 취소해 버렸어요.', '부자는 이 긴 목록을 읽다가 점점 얼굴이 굳어졌습니다.'),
    ('on_classic_21', 'q3', '신분 제도 — 사람을 계층으로 나눈 제도, 위선 — 겉과 속이 다르게 꾸밈', '의 허울과 양반 계층의'),

    # on_classic_22: q2 문단번호 제거, q3 어휘설명 → 본문
    ('on_classic_22', 'q2', '2문단: 어느 어두운 밤, 북곽 선생이 숲속에서 호랑이를 마주쳤습니다. 호랑이가 북곽 선생을 꾸짖었어요.', '어느 어두운 밤, 북곽 선생이 평소처럼 과부 집에서 몰래 빠져나오다가'),
    ('on_classic_22', 'q3', '북곽 선생 — 낮에는 점잖은 척하면서 밤마다 이중적인 삶을 산 위선자', '이라는 선비가 살았어요.'),
]

# 수정 적용
for unit_key, q_field, old_val, new_val in fixes:
    # explain 블록 내에서 해당 필드 찾기
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
        print(f"✗ {unit_key} {q_field}: 패턴 못찾음 또는 이미 수정됨")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n완료!")
