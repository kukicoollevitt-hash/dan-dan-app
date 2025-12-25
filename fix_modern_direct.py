#!/usr/bin/env python3
"""
on_modern_content.js의 explain 값들을 passage에서 직접 추출하여 수정합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_modern_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 각 단원의 passage를 추출하고, explain이 본문에 있는지 확인
def get_passage_plain(unit_key):
    """해당 단원의 passage plain text를 추출"""
    pattern = rf'{unit_key}:\s*\{{.*?passage:\s*\[(.*?)\]'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        passages = re.findall(r"'([^']*)'", match.group(1))
        passage_text = ' '.join(passages)
        passage_plain = re.sub(r'<[^>]+>', '', passage_text)
        return passage_plain
    return ''

# 수정할 단원과 q들
# format: (unit_key, q_name, new_explain_from_passage)

# 직접 수정이 필요한 목록
direct_fixes = {
    # on_modern_04 q2 - passage 확인 후 수정
    ('on_modern_04', 'q2'): '그래서 김 첨지는 선술집에 들러 막걸리를 마시며 불안한 마음을 달래려 했다.',

    # on_modern_06 q4
    ('on_modern_06', 'q4'): '눈물을 글썽이시는 어머니를 보며 어린 마음에도',

    # on_modern_08 q1
    ('on_modern_08', 'q1'): '어느 날부터 형은 아우와 아내 사이를 의심하기 시작했다.',

    # on_modern_08 q2
    ('on_modern_08', 'q2'): '형은 아우를 배에 태워 강 한가운데로 데려갔다.',

    # on_modern_09 q4
    ('on_modern_09', 'q4'): '아내는 바느질품을 팔아 생활비를 보탠다.',

    # on_modern_10 q2
    ('on_modern_10', 'q2'): '백방으로 취직 자리를 알아보았지만 어디서도 받아 주지 않았다.',

    # on_modern_11 q2
    ('on_modern_11', 'q2'): '초봉은 약제사 고태수에게 시집을 가지만',

    # on_modern_11 q4
    ('on_modern_11', 'q4'): '온갖 멸시와 학대를 받는다.',

    # on_modern_13 q4
    ('on_modern_13', 'q4'): '일본에 아부하여 부를 쌓은 친일파 지주이다.',

    # on_modern_14 q1
    ('on_modern_14', 'q1'): '50여 명의 인물이 등장하여 각자의 이야기를 펼친다.',

    # on_modern_14 q2
    ('on_modern_14', 'q2'): '세태소설의 대표작으로 꼽힌다.',

    # on_modern_18 q3
    ('on_modern_18', 'q3'): '금홍과의 만남부터 결별까지를 담담하게 기록한다.',

    # on_modern_20 q4
    ('on_modern_20', 'q4'): '외삼촌은 국군으로 참전했고, 삼촌은 빨치산이 되었다.',

    # on_modern_21 q2
    ('on_modern_21', 'q2'): '중립국으로 가는 배 위에서 깊은 허무에 빠진다.',

    # on_modern_25 q4
    ('on_modern_25', 'q4'): '역마살이 끼어 있다는 말을 듣는다.',

    # on_modern_28 q2
    ('on_modern_28', 'q2'): '황만근은 주어진 삶을 담담하게 받아들인다.',

    # on_modern_29 q2
    ('on_modern_29', 'q2'): '가난 속에서도 가족애를 보여준다.',

    # on_modern_30 q2
    ('on_modern_30', 'q2'): '아들의 죽음 이후에도 포기하지 않고 삶을 이어간다.',

    # on_modern_31 q4
    ('on_modern_31', 'q4'): '그 공은 하늘 높이 올라가지 못하고 떨어지고 만다.',

    # on_modern_35 q2
    ('on_modern_35', 'q2'): '오랜만에 만난 남매는 함께 소리를 한다.',
}

# 각 단원에서 explain 블록을 찾아 수정
for (unit_key, q_name), new_explain in direct_fixes.items():
    # 해당 단원의 explain 블록 찾기
    # 패턴: q_name: 'old_value', 또는 q_name: "old_value",
    pattern = rf"({unit_key}:.*?explain:\s*\{{[^}}]*?{q_name}:\s*['\"])([^'\"]+)(['\"])"

    def replacer(match):
        return match.group(1) + new_explain + match.group(3)

    new_content, count = re.subn(pattern, replacer, content, flags=re.DOTALL)
    if count > 0:
        content = new_content
        print(f"✓ {unit_key} {q_name} 수정완료: {new_explain[:40]}...")
    else:
        print(f"✗ {unit_key} {q_name} 못찾음")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n수정 완료")
