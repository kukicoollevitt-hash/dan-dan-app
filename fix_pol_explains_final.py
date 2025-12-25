#!/usr/bin/env python3
"""
on_pol_content.js의 남은 문제 explain 값들을 수정합니다.
"""

import re

with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social/on_pol_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 수정 목록
fixes = [
    # on_pol_08 q3 - passage: 4대 의무는 납세의 의무, 국방의 의무, 교육의 의무, 근로의 의무예요.
    ("q3: '이란 국가에 세금을 내는 것, 나라를 지키는 것, 자녀에게 교육을 받게 하는 것, 일을 하는 것이에요.',",
     "q3: '는 납세의 의무, 국방의 의무, 교육의 의무, 근로의 의무예요.',"),

    # on_pol_09 q2 - passage: 세계 무역 질서를 조정하는 <b>세계무역기구(WTO)</b>
    ("q2: '는 나라 사이의 무역 규칙을 정하고,',",
     "q2: ', 보건 문제를 다루는',"),

    # on_pol_09 q3 - passage: <b>공적개발원조(ODA)</b>를 통해 다른 나라를 돕고 있어요. -> 수정필요
    # 실제 passage: 대한민국은 공적개발원조(ODA)를 제공하고 있어요.
    ("q3: '를 통해 다른 나라를 돕고 있어요.',",
     "q3: '를 제공하고 있어요.',"),

    # on_pol_12 q2 - passage: <b>시장</b>에서 물건이나 서비스를 사고팔아요
    ("q2: '에서 물건이나 서비스를 사고팔아요. 우리 주변에는 다양한 시장이 있어요.',",
     "q2: '에서 물건이나 서비스를 사고팔아요.',"),

    # on_pol_14 q3 - passage: 금융 기관이 있어서 사람들이 돈을 투자하거나
    ("q3: '기관이 있어서 사람들이 돈을 투자하거나 미래에 대비할 수 있어요.',",
     "q3: '기관이 있어서 사람들이 돈을 투자하거나',"),

    # on_pol_16 q3 - passage: 이윤을 얻는 조직이에요. 기업가는
    ("q3: '을 얻는 조직이에요. 기업가는 새로운 사업 기회를 찾아 도전하고,',",
     "q3: '을 얻는 조직이에요.',"),

    # on_pol_17 q4 - passage: <b>금리</b>를 조절해서 경제를 관리해요
    ("q4: '를 조절해서 경제를 관리해요. 경기가 나쁠 때는 금리를 낮춰',",
     "q4: '를 조절해서 경제를 관리해요.',"),

    # on_pol_18 q3 - passage: <b>소득세</b>는 돈을 벌 때 내는 세금이고
    ("q3: '는 돈을 벌었을 때 내고,',",
     "q3: '는 돈을 벌 때 내는 세금이고,',"),

    # on_pol_19 q2 - passage: 우리나라는 무역 의존도가 높은 나라예요
    ("q2: '의존도가 높은 나라예요. 상호 의존하는 세계에서 협력하는 자세가 중요해요.',",
     "q2: '의존도가 높은 나라예요.',"),

    # on_pol_19 q3 - passage: <b>수출</b>, 외국에서 물건을 사오는 것을 <b>수입</b>이라고 하지요
    ("q3: '은 우리나라에서 만든 물건을 외국에 파는 것이고,',",
     "q3: ', 외국에서 물건을 사오는 것을',"),

    # on_pol_19 q4 - passage: <b>관세</b>를 낮추거나 없애서
    ("q4: '란 외국에서 들어오는 물건에 붙는 세금이에요.',",
     "q4: '를 낮추거나 없애서 물건을 더 싸게 사고팔 수 있게 해요.',"),
]

count = 0
for old, new in fixes:
    if old in content:
        content = content.replace(old, new)
        count += 1
        print(f"✓ 수정: {old[:40]}...")
    else:
        print(f"✗ 못찾음: {old[:40]}...")

with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social/on_pol_content.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n총 {count}개 수정")
