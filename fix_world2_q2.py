#!/usr/bin/env python3
"""
on_world2_content.js의 q2 explain 값을 수정합니다.
현재 "1문단: ... / 2문단: ..." 형식을
본문의 2번째 passage에서 찾을 수 있는 텍스트로 변경합니다.
(2문단 순서 문제이므로 2문단의 시작 부분을 하이라이트)
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world2_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def get_paragraph2_text(passage_list_str):
    """
    passage 리스트에서 2번째 문단의 시작 텍스트를 추출합니다.
    <b>태그</b> 뒤의 텍스트를 반환합니다.
    """
    # passage 배열에서 두 번째 요소 찾기
    # 패턴: '첫번째 문단', '두번째 문단', ...
    paragraphs = re.findall(r"'([^']+)'", passage_list_str)

    if len(paragraphs) >= 2:
        p2 = paragraphs[1]

        # <b>태그</b> 뒤의 텍스트 찾기
        match = re.search(r'</b>([^<]{10,50})', p2)
        if match:
            text = match.group(1).strip()
            # 적절한 길이로 자르기
            if len(text) > 40:
                for i, char in enumerate(text[15:40], 15):
                    if char in '.요다!?':
                        text = text[:i+1]
                        break
                else:
                    text = text[:35]
            return text

        # <b> 태그가 없으면 문단 시작 부분 사용
        text = p2[:50].strip()
        if len(text) > 40:
            text = text[:35]
        return text

    return None

changes_made = 0
failed_units = []

for i in range(1, 41):
    unit_id = f"on_world2_{i:02d}"

    # 해당 유닛 찾기
    unit_start = content.find(f"{unit_id}:")
    if unit_start == -1:
        continue

    # 다음 유닛 시작점 찾기
    next_unit = content.find(f"on_world2_{i+1:02d}:", unit_start)
    if next_unit == -1:
        unit_content = content[unit_start:]
    else:
        unit_content = content[unit_start:next_unit]

    # explain의 q2 추출
    explain_match = re.search(r"explain:\s*\{([^}]+)\}", unit_content, re.DOTALL)
    if not explain_match:
        continue
    explain_text = explain_match.group(1)

    q2_match = re.search(r"q2:\s*'([^']+)'", explain_text)
    if not q2_match:
        continue
    current_q2 = q2_match.group(1)

    # "문단:" 형식인지 확인
    if '문단:' not in current_q2:
        print(f"[{unit_id}] q2 이미 본문 형식: '{current_q2[:40]}...'")
        continue

    # passage 추출
    passage_match = re.search(r"passage:\s*\[(.*?)\]", unit_content, re.DOTALL)
    if not passage_match:
        failed_units.append((unit_id, current_q2))
        continue

    passage_text = passage_match.group(1)

    # 2번째 문단에서 하이라이트 텍스트 추출
    new_q2 = get_paragraph2_text(passage_text)

    if new_q2:
        # explain 섹션 내의 q2만 변경
        pattern = re.compile(
            rf"({unit_id}:.*?explain:\s*\{{[^}}]*?)q2:\s*'{re.escape(current_q2)}'",
            re.DOTALL
        )

        if pattern.search(content):
            content = pattern.sub(
                rf"\1q2: '{new_q2}'",
                content,
                count=1
            )
            print(f"[{unit_id}] q2 변경: '{current_q2[:30]}...' → '{new_q2}'")
            changes_made += 1
        else:
            print(f"[{unit_id}] 패턴 매칭 실패")
            failed_units.append((unit_id, current_q2))
    else:
        print(f"[{unit_id}] 2문단 텍스트를 찾을 수 없음")
        failed_units.append((unit_id, current_q2))

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개의 q2 값 수정됨")

if failed_units:
    print(f"\n수동 확인 필요한 유닛 ({len(failed_units)}개):")
    for unit_id, q2 in failed_units:
        print(f"  {unit_id}: '{q2[:50]}...'")
