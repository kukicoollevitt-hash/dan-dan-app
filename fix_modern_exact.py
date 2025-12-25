#!/usr/bin/env python3
"""
on_modern_content.js의 explain 값들을 passage의 정확한 텍스트로 수정합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_modern_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 각 단원의 passage에서 정확한 텍스트 추출
def extract_passage_text(unit_key):
    """해당 단원의 passage plain text를 추출"""
    pattern = rf'{unit_key}:\s*\{{.*?passage:\s*\[(.*?)\]'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        passages = re.findall(r"'([^']*)'", match.group(1))
        passage_text = ' '.join(passages)
        return passage_text  # 태그 포함
    return ''

# 수정이 필요한 explain들 - passage에서 직접 확인한 정확한 텍스트
fixes = [
    # on_modern_06 q4: "갑자기 눈물을 글썽이다"
    ('on_modern_06', 'q4', '갑자기 눈물을 글썽이다'),

    # on_modern_07 q1: "순박한 시골 처녀였다"
    ('on_modern_07', 'q1', '순박한 시골 처녀였다.'),

    # on_modern_08 q1: "의심하기 시작했다" - passage 확인
    ('on_modern_08', 'q1', '형은 아우와 아내의 사이를 의심하기 시작했다.'),

    # on_modern_09 q4: passage에서 확인
    ('on_modern_09', 'q4', '바느질품을 팔아 생활비를 벌고 있다.'),

    # on_modern_10 q2: passage 확인
    ('on_modern_10', 'q2', '어디서도 그를 받아 주지 않았다.'),

    # on_modern_11 q2: passage 확인
    ('on_modern_11', 'q2', '초봉을 약제사 고태수에게 시집보냈다.'),

    # on_modern_11 q4: passage 확인
    ('on_modern_11', 'q4', '시집에서 온갖 멸시와 학대를 받는다.'),

    # on_modern_13 q4: passage 확인
    ('on_modern_13', 'q4', '일본에 아부하여 부를 축적한 친일파 지주이다.'),

    # on_modern_18 q3: passage 확인
    ('on_modern_18', 'q3', '금홍과의 만남과 결별 과정을 담담하게 기록한다.'),

    # on_modern_20 q4: passage 확인
    ('on_modern_20', 'q4', '외삼촌은 국군으로, 삼촌은 빨치산으로 참전했다.'),

    # on_modern_21 q2: passage 확인
    ('on_modern_21', 'q2', '깊은 허무에 빠진다.'),

    # on_modern_25 q4: passage 확인
    ('on_modern_25', 'q4', '"역마살"이 끼어 있다는 말을 듣는다.'),

    # on_modern_28 q2: passage 확인
    ('on_modern_28', 'q2', '주어진 삶을 담담하게 받아들인다.'),

    # on_modern_29 q2: passage 확인
    ('on_modern_29', 'q2', '가난 속에서도 지켜지는 가족애를 보여준다.'),

    # on_modern_30 q2: passage 확인
    ('on_modern_30', 'q2', '엄마는 포기하지 않고 삶을 이어간다.'),
]

# 정규식으로 수정
for unit_key, q_name, new_explain in fixes:
    pattern = rf"({unit_key}:.*?explain:\s*\{{[^}}]*?{q_name}:\s*['\"])([^'\"]+)(['\"])"

    def make_replacer(new_val):
        def replacer(match):
            return match.group(1) + new_val + match.group(3)
        return replacer

    new_content, count = re.subn(pattern, make_replacer(new_explain), content, flags=re.DOTALL)
    if count > 0:
        content = new_content
        print(f"✓ {unit_key} {q_name}: {new_explain[:40]}...")
    else:
        print(f"✗ {unit_key} {q_name} 못찾음")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n수정 완료")
