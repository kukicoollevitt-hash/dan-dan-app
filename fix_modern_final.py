#!/usr/bin/env python3
"""
on_modern_content.js의 본문에 없는 explain 값들을 passage에서 직접 찾아 수정합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_modern_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 각 단원의 passage와 explain 추출
def get_unit_data(unit_key):
    """해당 단원의 passage와 explain을 추출"""
    # 단원 블록 찾기
    pattern = rf'{unit_key}:\s*\{{.*?explain:\s*\{{(.*?)\n\s*\}}.*?(?=\n\s*on_modern_|\Z)'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return None, None

    unit_block = match.group(0)

    # passage 추출
    passage_match = re.search(r'passage:\s*\[(.*?)\]', unit_block, re.DOTALL)
    if passage_match:
        passages = re.findall(r"'([^']*)'", passage_match.group(1))
        passage_text = ' '.join(passages)
        passage_plain = re.sub(r'<[^>]+>', '', passage_text)
    else:
        passage_plain = ''

    # explain 추출
    explain_match = re.search(r'explain:\s*\{([\s\S]*?)\n\s*\}', unit_block)
    if explain_match:
        explain_raw = explain_match.group(1)
    else:
        explain_raw = ''

    return passage_plain, explain_raw

# 수정 목록 (직접 확인한 값들)
fixes = []

# on_modern_04 q2 - passage에서 확인
# "김 첨지는 선술집에 들러 막걸리를 마시며 불안한 마음을 달래려 했다."
# 실제: "그래서 김 첨지는 선술집에 들러 막걸리를 마시며 불안한 마음을 달래려 했다."
fixes.append((
    "q2: '김 첨지는 선술집에 들러 막걸리를 마시며 불안한 마음을 달래려 했다. 결국 김 첨지는 막걸리 잔을 내려놓고 갑자기 집으로 달려가기 시작했다.',",
    "q2: '그래서 김 첨지는 선술집에 들러 막걸리를 마시며 불안한 마음을 달래려 했다.',",
))

# on_modern_06 q4
fixes.append((
    "q4: '어머니는 눈물을 글썽이셨다.',",
    "q4: '눈물을 글썽이시는 어머니를 보며',",
))

# on_modern_07 q1
fixes.append((
    "q1: '복녀는 가난한 농가에서 태어난 순박한 시골 처녀였다. 복녀는 처음에는 강하게 거부했으나, 결국 중국인 왕 서방에게 팔려간다.',",
    "q1: '복녀는 가난한 농가에서 자란 순박한 시골 처녀였다.',",
))

# on_modern_08 q1
fixes.append((
    "q1: '어느 날부터 형은 아우와 아내의 사이를 의심하다 시작했다. 아내는 아우와 아무 일도 없었다고 말하지만 형은 믿지 않았다.',",
    "q1: '어느 날부터 형은 아우와 아내 사이를 의심하기 시작했다.',",
))

# on_modern_08 q2
fixes.append((
    "q2: '형은 아우를 배에 태워 강 한가운데로 데려갔다. 그리고 아우를 물에 밀어 넣었다. 아우는 결국 물에 빠져 죽었다.',",
    "q2: '형은 아우를 배에 태워 강 한가운데로 데려갔다.',",
))

# on_modern_09 q4
fixes.append((
    "q4: '아내는 불평 한마디 없이 바느질품을 팔아 생활비를 보탠다. 아내는 그런 나를 묵묵히 내조하며 기다려 준다.',",
    "q4: '아내는 바느질품을 팔아 생활비를 보탠다.',",
))

# on_modern_10 q2
fixes.append((
    "q2: '백방으로 취직 자리를 알아보았지만, 어디서도 그를 받아 주지 않았다. 고등 교육을 받은 지식인이 인력거를 끌게 되는 현실이 당시 사회의 모순을 보여준다.',",
    "q2: '백방으로 취직 자리를 알아보았지만 어디서도 받아 주지 않았다.',",
))

# on_modern_11 q2
fixes.append((
    "q2: '가난에 쪼들린 정 주사는 초봉을 약제사 고태수에게 시집보냈다. 결혼 후 초봉은 시집에서 온갖 멸시와 학대를 받는다.',",
    "q2: '초봉은 약제사 고태수에게 시집을 가지만',",
))

# on_modern_11 q4
fixes.append((
    "q4: '가난한 친정을 위해 견딘 결혼이었지만, 행복과는 거리가 멀었다. 초봉의 삶은 개인의 잘못이 아니라 사회의 구조적 문제임을 보여준다.',",
    "q4: '온갖 멸시와 학대를 받는다.',",
))

# on_modern_13 q4
fixes.append((
    "q4: '일본에 아부하며 부를 쌓은 친일파 지주이다.',",
    "q4: '일본에 아부하여 부를 쌓은 친일파 지주이다.',",
))

# on_modern_14 q1
fixes.append((
    "q1: '50여 명의 인물이 등장하여 각자의 이야기를 펼친다. 이들의 이야기는 서로 느슨하게 연결되어 하나의 큰 그림을 만들어 낸다.',",
    "q1: '50여 명의 인물이 등장하여 각자의 이야기를 펼친다.',",
))

# on_modern_14 q2
fixes.append((
    "q2: '「천변풍경」은 세태소설의 대표작으로 꼽힌다. 작가는 어떤 인물을 선하다거나 악하다고 판단하지 않고, 그들의 삶을 있는 그대로 보여준다.',",
    "q2: '세태소설의 대표작으로 꼽힌다.',",
))

# on_modern_18 q3
fixes.append((
    "q3: '금홍과의 만남과 결별 과정을 담담하게 서술한다.',",
    "q3: '금홍과의 만남부터 결별까지를 담담하게 기록한다.',",
))

# on_modern_20 q4
fixes.append((
    "q4: '외삼촌은 국군으로 참전했고, 삼촌은 빨치산이 되었다. 같은 지붕 아래 사는 두 할머니는 서로의 아들을 원망하며 갈등했다.',",
    "q4: '외삼촌은 국군으로 참전했고, 삼촌은 빨치산이 되었다.',",
))

# on_modern_21 q2
fixes.append((
    "q2: '중립국으로 가는 배 위에서 북에서 만났던 연인 은혜를 떠올리며 깊은 허무에 빠진다. 결국 명준은 갈매기를 보며 바다에 몸을 던진다.',",
    "q2: '중립국으로 가는 배 위에서 깊은 허무에 빠진다.',",
))

# on_modern_25 q4
fixes.append((
    "q4: '인간의 의지로는 어쩔 수 없는 숙명의 힘을 보여준다.',",
    "q4: '숙명적인 삶을 그리고 있다.',",
))

# on_modern_28 q2
fixes.append((
    "q2: '그러나 황만근은 불평하지 않고 주어진 삶을 담담하게 받아들인다. 소설의 결말에서 황만근은 홀로 남아 묵묵히 일상을 살아간다.',",
    "q2: '황만근은 주어진 삶을 담담하게 받아들인다.',",
))

# on_modern_29 q2
fixes.append((
    "q2: '작품은 당시 급격한 산업화 과정에서 소외된 도시 빈민들의 고통을 사실적으로 묘사한다. 소설은 권씨 가족의 삶을 통해 가난 속에서도 지켜지는 가족애를 보여준다.',",
    "q2: '가난 속에서도 가족애를 보여준다.',",
))

# on_modern_30 q2
fixes.append((
    "q2: '아들의 죽음 이후에도 엄마는 포기하지 않고 삶을 이어간다. 역사의 소용돌이 속에서 가족을 지키고자 하는 어머니의 강인함이 드러난다.',",
    "q2: '아들의 죽음 이후에도 포기하지 않고 삶을 이어간다.',",
))

# on_modern_31 q4
fixes.append((
    "q4: '그러나 그 공은 하늘 높이 올라가지 못하고 떨어지고 만다. 산업화의 그늘에서 고통받는 서민들의 좌절된 꿈을 상징한다.',",
    "q4: '그 공은 하늘 높이 올라가지 못하고 떨어지고 만다.',",
))

# on_modern_35 q2
fixes.append((
    "q2: '오랜만에 만난 남매는 함께 소리를 한다. 작품은 예술을 위해 인간적인 것을 희생해야 하는가라는 물음을 던진다.',",
    "q2: '오랜만에 만난 남매는 함께 소리를 한다.',",
))

count = 0
for old, new in fixes:
    if old in content:
        content = content.replace(old, new, 1)
        count += 1
        print(f"✓ 수정: {old[:50]}...")
    else:
        print(f"✗ 못찾음: {old[:50]}...")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n총 {count}개 수정")
