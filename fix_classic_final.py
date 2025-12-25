#!/usr/bin/env python3
"""
on_classic_content.js의 나머지 explain 값들을 수정합니다.
문단번호 접두사와 어휘 설명 형식을 제거합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_classic_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

fixes = [
    # on_classic_04 q2: "1문단: 조선 초기 송경 근처에는..." → 본문: "조선 초기, 송경 근처에는"
    ('on_classic_04', 'q2', "1문단: 조선 초기 송경 근처에는 전우치라는 선비가 살고 있었어요. 남쪽 지방에는 해적이 날뛰고 흉년까지 겹쳐 백성들의 삶이 더욱 어려워졌어요.", "조선 초기, 송경 근처에는"),

    # on_classic_06 q2: "3문단: 심청은 장사꾼을 찾아가..." → 본문: "심청은 망설임 끝에 장사꾼을 찾아가"
    ('on_classic_06', 'q2', "3문단: 심청은 장사꾼을 찾아가 자신을 공양미 삼백 석에 팔겠다고 말했습니다. 심청은 아버지의 눈을 열어 달라고 빈 뒤 푸른 바다로 몸을 던졌어요.", "심청은 망설임 끝에 장사꾼을 찾아가"),

    # on_classic_09 q1: 긴 요약 → 본문에서 찾기: "계모는 <b>흉계</b>를 꾸며 장화를 모함했어요"
    ('on_classic_09', 'q1', "계모는 흉계를 꾸며 장화를 모함했어요. 이를 믿은 아버지는 장화를 연못에 빠뜨려 죽게 했습니다. 홍련은 언니가 죽은 그 연못에 스스로 몸을 던졌어요.", "를 꾸며 장화를 모함했어요."),

    # on_classic_09 q2: "3문단: 두 자매는..." → 본문: "두 자매는 억울하게 죽어 <b>원혼</b>이 되었고"
    ('on_classic_09', 'q2', "3문단: 두 자매는 억울하게 죽어 원혼이 되었고, 그 후로 그 고을에 부임하는 사또마다 첫날밤에 죽는 괴이한 일이 계속되었습니다.", "두 자매는 억울하게 죽어"),

    # on_classic_27 q2: "4문단: 김영철전은..." → 본문에서 찾기
    ('on_classic_27', 'q2', "4문단: 김영철전은 참혹한 전쟁의 비극 속에서도 끝까지 살아남으려는 인간의 강인한 생명력과 의지를 보여줍니다.", "김영철전은 참혹한"),

    # on_classic_27 q3: "병자호란 — 1636년..." → 본문: "1636년 <b>병자호란</b>이 일어나"
    ('on_classic_27', 'q3', "병자호란 — 1636년 청나라가 조선을 침략한 전쟁, 포로로 잡혀감", "이 일어나 청나라 군대가 조선을 침략했습니다."),

    # on_classic_28 q2: "1문단: 길동은 서자라는..." → 본문: "그래서 길동은 <b>서자</b>라는 천한 신분이 되었어요"
    ('on_classic_28', 'q2', "1문단: 길동은 서자라는 천한 신분이 되었어요. 아버지를 아버지라 부르지 못하고, 형을 형이라 부르지 못했습니다.", "라는 천한 신분이 되었어요."),

    # on_classic_28 q3: "서자 — 양반 아버지와..." → 본문: "그래서 길동은 <b>서자</b>라는 천한 신분이 되었어요"
    ('on_classic_28', 'q3', "서자 — 양반 아버지와 종 어머니 사이에서 태어난 자녀, 차별을 받음", "라는 천한 신분이 되었어요."),

    # on_classic_29 q2: "1문단: 서동지는 부잣집..." → 본문에서 찾기
    ('on_classic_29', 'q2', "1문단: 서동지는 부잣집 딸에게 장가를 갔는데, 손님 대접을 엉뚱하게 해서 집안에 웃음이 끊이지 않았어요.", "서동지는 부잣집 딸에게 장가를 갔는데,"),

    # on_classic_29 q3: "순박하다 — 꾸밈없이..." → 본문: "그는 착하고 순박했지만"
    ('on_classic_29', 'q3', "순박하다 — 꾸밈없이 순수하고 착하다, 착한 마음이 복을 가져옴", "했지만 세상 물정을 전혀 모르는"),

    # on_classic_30 q2: "3문단: 장끼는 까투리의..." → 본문: "장끼는 걱정하며 <b>만류</b>하는 까투리의 말을 뿌리치고"
    ('on_classic_30', 'q2', "3문단: 장끼는 까투리의 말을 뿌리치고 콩을 먹으러 다가갔어요. 덫이 장끼의 다리를 꽉 물어버렸습니다.", "하는 까투리의 말을 뿌리치고 성큼성큼 콩을 먹으러 다가갔어요."),

    # on_classic_30 q3: "만류 — 하지 말라고 말림..." → 본문: "까투리가 급히 말렸습니다" or "걱정하며 <b>만류</b>하는"
    ('on_classic_30', 'q3', "만류 — 하지 말라고 말림, 까투리가 덫이라고 경고했지만 무시함", "하는 까투리의 말을 뿌리치고 성큼성큼"),
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
