#!/usr/bin/env python3
"""
on_classic_content.js의 나머지 explain 값들을 수정합니다 (36~40).
문단번호 접두사와 어휘 설명 형식을 제거합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

fixes = [
    # on_classic_36 (소대성전)
    # q2: "1문단: 소대성은 태어나자마자..." → 문단 접두사 제거
    ('on_classic_36', 'q2', '1문단: 소대성은 태어나자마자 부모를 잃고 고아가 되었습니다. 거리를 떠돌며 구걸하는 비참한 어린 시절을 보냈어요.', '소대성은 태어나자마자 부모를 잃고'),
    # q3: "고아 — 부모를 잃은 아이..." → 본문: "그는 태어나자마자 부모를 잃고 <b>고아</b>가 되었습니다"
    ('on_classic_36', 'q3', '고아 — 부모를 잃은 아이, 소대성은 태어나자마자 부모를 잃었어요', '가 되었습니다.'),

    # on_classic_37 (임경업전)
    # q2: "1문단: 임경업은 과거에 급제하여..." → 문단 접두사 제거
    ('on_classic_37', 'q2', '1문단: 임경업은 과거에 급제하여 무관이 되었고, 병자호란에서 큰 전공을 세웠어요.', '임경업은 과거에 급제하여'),
    # q3: "병자호란 — 1636년 청나라의 조선 침략..." → 본문: "1636년 <b>병자호란</b>이 일어나"
    ('on_classic_37', 'q3', '병자호란 — 1636년 청나라의 조선 침략, 임경업은 청나라와 싸웠어요', '이 일어나 청나라가 조선을 침략했습니다.'),

    # on_classic_38 (적성의전)
    # q2: "1문단: 적성의의 아버지가..." → 문단 접두사 제거
    ('on_classic_38', 'q2', '1문단: 적성의의 아버지가 간신의 모함으로 죽고, 적성의는 노비로 전락했어요.', '적성의의 아버지는 나라의'),

    # on_classic_39 (월영낭자전)
    # q2: "4문단: 그의 진심이..." → 문단 접두사 제거
    ('on_classic_39', 'q2', '4문단: 그의 진심이 하늘에 닿았는지, 결국 둘은 은하수에서 일 년에 한 번 만날 수 있게 되었어요. 진정한 사랑은 어떤 장벽도 넘을 수 있다는 희망을 전해줘요.', '결국 둘은 은하수에서 일 년에 한 번 만날 수 있게 되었어요.'),

    # on_classic_40 (이생규장전)
    # q2: "1문단: 담장 너머로..." → 문단 접두사 제거
    ('on_classic_40', 'q2', '1문단: 담장 너머로 아름다운 최랑을 보고 첫눈에 반했습니다. 부모님의 허락을 받아 둘은 혼인했습니다.', '담장 너머로 아름다운'),
    # q3: "이생규장전은 김시습의 금오신화에 실린 작품 — 우리나라 최초의 한문소설집" → 본문 텍스트로 (금오신화 뒤에 태그 있음)
    ('on_classic_40', 'q3', '이생규장전은 김시습의 금오신화에 실린 작품 — 우리나라 최초의 한문소설집', '에 실린 작품으로, 죽음도 갈라놓지 못한'),
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
