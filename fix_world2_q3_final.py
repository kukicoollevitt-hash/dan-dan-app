#!/usr/bin/env python3
"""
on_world2_content.js의 q3 explain 값을 수정합니다.
passage에 없는 q3 값들을 첫 번째 vocab 뒤의 텍스트로 변경합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world2_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 수동으로 확인하여 수정할 q3 값들
# 형식: (unit_id, old_q3_partial, new_q3)
# new_q3는 </b> 뒤의 텍스트
manual_fixes = [
    # on_world2_10: <b>빈민가</b> 뒤
    ('on_world2_10', '놀랍게도 두 사람은 쌍둥이처럼', '에서 거지로요. 왕자'),

    # on_world2_11: <b>개구쟁이</b> 뒤
    ('on_world2_11', '톰은 호기심 많고 장난기 넘치는', '소년이 살았어요. 톰은 폴리 이모 밑에서 자랐는데,'),

    # on_world2_15: <b>회오리바람</b> 뒤
    ('on_world2_15', '노란 벽돌 길을 따라가면', '에 집째로 휩쓸려 신비한 오즈의 나라에 도착했어요.'),

    # on_world2_17: <b>검소</b> 뒤
    ('on_world2_17', '가정 형편이 넉넉하지 않았지만', '하지만 행복하게 살았습니다.'),

    # on_world2_18: <b>황무지</b> 뒤
    ('on_world2_18', '거친 황무지 위에 서 있는', '위에 \"폭풍의 언덕\"이라 불리는 집이 있었어요.'),

    # on_world2_21: <b>표류</b> 뒤
    ('on_world2_21', '에 홀로 남겨졌습니다.', '하게 되었습니다. 섬에는 아무도 없었고,'),

    # on_world2_26: <b>대문호</b> 뒤
    ('on_world2_26', '가 나타났어요. 악마는 파우스트', '괴테가 쓴 이 작품의 주인공 파우스트 박사는'),

    # on_world2_27: <b>전과자</b> 뒤
    ('on_world2_27', '마저 훔쳐 도망쳤습니다', '인 그를 받아주지 않았습니다. 추위에 떨며 헤매던'),

    # on_world2_28: <b>공허함</b> 뒤
    ('on_world2_28', '을 피할 수 없었습니다. 오이디푸스', '을 느끼고 있었어요. 그러던 중 젊은 장교 브론스키를 만나게 됩니다.'),

    # on_world2_29: <b>오만</b> 뒤
    ('on_world2_29', '의 가책에 시달렸어요', '한 생각을 품고 있었습니다.'),

    # on_world2_30: <b>외판원</b> 뒤
    ('on_world2_30', '로 변해 있었어요. 처음에 가족들', '으로 열심히 일하며 가족을'),

    # on_world2_31: <b>호기심</b> 뒤
    ('on_world2_31', '에 도착했어요. 그곳에서 앨리스', '이 생긴 앨리스는 토끼를 따라 토끼굴로 뛰어들었어요.'),

    # on_world2_32: <b>포경선</b> 뒤
    ('on_world2_32', '모비 딕을 찾아 나섰습니다', '에 올라탔어요. 그가 탄 배 피쿼드호의 선장은'),

    # on_world2_34: <b>환멸</b> 뒤
    ('on_world2_34', '에서 뛰어노는 어린아이들', '을 느끼고 적응하지 못했어요.'),

    # on_world2_35: <b>불굴</b> 뒤 - 텍스트가 짧아서 다른 vocab 찾기
    # <b>청새치</b> 뒤 사용
    ('on_world2_35', '산티아고라는 늙은 어부가', '를 낚아올렸지만 상어들이 몰려와 살점을 뜯어갔습니다.'),

    # on_world2_36: <b>혁명</b> 뒤
    ('on_world2_36', '을 차지하고 스스로 운영하기', '을 일으켜야 한다고요. 메이저가 죽은 후 동물들은'),

    # on_world2_37: <b>신비로운</b> 뒤 - 텍스트가 없어서 다른 vocab 찾기
    # <b>허영</b> 뒤 사용
    ('on_world2_37', '부자가 되어 데이지를 되찾고', '으로 가득 찬 시대에 닉이라는 청년이 뉴욕에 왔어요.'),

    # on_world2_38: <b>인종차별</b> 뒤
    ('on_world2_38', '롭고 용감한 변호사였어요', '이 심했습니다. 백인들은 흑인을 무조건 범죄자 취급했고,'),
]

changes_made = 0

for unit_id, old_q3_partial, new_q3 in manual_fixes:
    # 현재 q3 값 찾기
    unit_start = content.find(f'{unit_id}:')
    if unit_start == -1:
        print(f"[{unit_id}] 유닛 못 찾음")
        continue

    next_unit = content.find(f'on_world2_{int(unit_id.split("_")[2])+1:02d}:', unit_start)
    if next_unit == -1:
        unit_content = content[unit_start:]
    else:
        unit_content = content[unit_start:next_unit]

    # explain 섹션에서 q3 찾기
    explain_match = re.search(r"explain:\s*\{([^}]+)\}", unit_content, re.DOTALL)
    if not explain_match:
        print(f"[{unit_id}] explain 못 찾음")
        continue

    q3_match = re.search(r"q3:\s*'([^']+)'", explain_match.group(1))
    if not q3_match:
        print(f"[{unit_id}] q3 못 찾음")
        continue

    current_q3 = q3_match.group(1)

    # old_q3_partial이 현재 q3에 포함되어 있는지 확인
    if old_q3_partial not in current_q3:
        print(f"[{unit_id}] q3 이미 변경됨 또는 불일치: '{current_q3[:40]}...'")
        continue

    # 변경
    pattern = re.compile(
        rf"({unit_id}:.*?explain:\s*\{{[^}}]*?)q3:\s*'{re.escape(current_q3)}'",
        re.DOTALL
    )

    if pattern.search(content):
        content = pattern.sub(
            rf"\1q3: '{new_q3}'",
            content,
            count=1
        )
        print(f"[{unit_id}] q3 변경: '{current_q3[:30]}...' → '{new_q3[:40]}...'")
        changes_made += 1
    else:
        print(f"[{unit_id}] 패턴 매칭 실패")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개의 q3 값 수정됨")
