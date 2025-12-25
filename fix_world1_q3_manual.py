#!/usr/bin/env python3
"""
on_world1_content.js의 수동 수정이 필요한 q3 explain 값을 수정합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world1_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 수동으로 확인하여 수정할 q3 값들
# 형식: (unit_id, old_q3, new_q3)
manual_fixes = [
    # on_world1_01: 이미 적절함 - '"라는 말을 해 주었습니다.'
    # on_world1_05: '길들이다' -> passage에서 '<b>길들여</b>' 뒤 텍스트
    ('on_world1_05', '길들이다', '줘"라고 부탁했습니다.'),

    # on_world1_15: '질투' -> passage에서 '질투에 눈이 먼'으로 되어 있음 (태그 없음)
    ('on_world1_15', '질투', '에 눈이 먼 왕비는 사냥꾼에게 공주를'),

    # on_world1_27: '황금' -> passage에서 '<b>황금 공</b>' 형태
    ('on_world1_27', '황금', '이었습니다. 공주는 매일 궁전 옆'),

    # on_world1_30: '엄지' -> passage에서 '엄지손가락만 한' 형태 (태그 없음)
    ('on_world1_30', '엄지', '손가락만 한 작은 소녀가 태어났습니다.'),

    # on_world1_31: '염소' -> passage에서 '<b>엄마 염소</b>' '<b>아기 염소</b>' 형태
    ('on_world1_31', '염소', '가 살았어요. 어느 날 엄마 염소가 먹을 것을'),

    # on_world1_32: '호두' -> passage에서 '<b>호두까기 인형</b>' 형태
    ('on_world1_32', '호두', '를 깨는 병정 모양의'),

    # on_world1_33: '구두' -> passage에서 '<b>빨간 구두</b>' 형태
    ('on_world1_33', '구두', '를 보았습니다. 반짝반짝 빛나는 구두가 너무 갖고 싶었어요.'),

    # on_world1_34: '정직' -> passage에서 '<b>정직</b>한' 형태
    ('on_world1_34', '정직', '한 나무꾼이 살았어요.'),

    # on_world1_35: '동상' -> passage에서 '동상이 서 있었어요' 형태 (태그 없음)
    ('on_world1_35', '동상', '이 서 있었어요. 동상은 온몸이'),

    # on_world1_36: '마법' -> passage에서 '<b>저주</b>'가 있고 마법은 태그 없음
    ('on_world1_36', '마법', '에 걸린 오빠들을 찾아 헤맸어요.'),

    # on_world1_37: '눈' -> passage에서 '<b>눈의 여왕</b>' 형태
    ('on_world1_37', '눈', '처럼 하얀'),
]

changes_made = 0

for unit_id, old_q3, new_q3 in manual_fixes:
    # explain 섹션 내의 q3만 변경
    # 패턴: unit_id:...explain:{...q3: 'old_q3'
    pattern = re.compile(
        rf"({unit_id}:.*?explain:\s*\{{[^}}]*?)q3:\s*'{re.escape(old_q3)}'",
        re.DOTALL
    )

    if pattern.search(content):
        content = pattern.sub(
            rf"\1q3: '{new_q3}'",
            content,
            count=1
        )
        print(f"[{unit_id}] q3 변경: '{old_q3}' → '{new_q3}'")
        changes_made += 1
    else:
        print(f"[{unit_id}] 패턴 매칭 실패: '{old_q3}'")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개의 q3 값 수정됨")
