#!/usr/bin/env python3
"""
on_world2_content.js의 q3 explain 값을 수정합니다.
현재 "어휘A — 설명 / 어휘B — 설명" 형식을
본문에서 <b>어휘A</b> 뒤의 텍스트로 변경합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world2_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def get_text_after_bold(passage_text, vocab_word):
    """
    passage에서 <b>vocab_word</b> 뒤의 텍스트를 추출합니다.
    vocab_word가 정확히 일치하거나 포함된 경우도 처리합니다.
    """
    # 1. 정확한 매칭 시도
    pattern = re.compile(
        rf'<b>{re.escape(vocab_word)}</b>([^<\'"]+)',
        re.IGNORECASE
    )

    match = pattern.search(passage_text)
    if match:
        after_text = match.group(1).strip()
        if len(after_text) >= 3:
            # 적절한 길이로 자르기 (최대 40자)
            if len(after_text) > 40:
                for i, char in enumerate(after_text[15:40], 15):
                    if char in '.요다!?':
                        after_text = after_text[:i+1]
                        break
                else:
                    after_text = after_text[:35] + '...'
            return after_text

    # 2. 어휘가 <b> 태그 내에 포함된 경우 (예: "길들여" vs "길들이다")
    # <b>...vocab...</b> 형태 찾기
    pattern2 = re.compile(
        rf'<b>[^<]*{re.escape(vocab_word[:2])}[^<]*</b>([^<\'"]+)',
        re.IGNORECASE
    )

    match2 = pattern2.search(passage_text)
    if match2:
        after_text = match2.group(1).strip()
        if len(after_text) >= 3:
            if len(after_text) > 40:
                for i, char in enumerate(after_text[15:40], 15):
                    if char in '.요다!?':
                        after_text = after_text[:i+1]
                        break
                else:
                    after_text = after_text[:35] + '...'
            return after_text

    return None

# 수정할 유닛들 처리
changes_made = 0
failed_units = []

for i in range(1, 41):
    unit_id = f"on_world2_{i:02d}"

    # 해당 유닛의 passage 추출
    unit_start = content.find(f"{unit_id}:")
    if unit_start == -1:
        continue

    # 다음 유닛 시작점 찾기
    next_unit = content.find(f"on_world2_{i+1:02d}:", unit_start)
    if next_unit == -1:
        unit_content = content[unit_start:]
    else:
        unit_content = content[unit_start:next_unit]

    # passage 추출
    passage_match = re.search(r"passage:\s*\[(.*?)\]", unit_content, re.DOTALL)
    if not passage_match:
        continue
    passage_text = passage_match.group(1)

    # explain의 q3 추출
    explain_match = re.search(r"explain:\s*\{([^}]+)\}", unit_content, re.DOTALL)
    if not explain_match:
        continue
    explain_text = explain_match.group(1)

    q3_match = re.search(r"q3:\s*'([^']+)'", explain_text)
    if not q3_match:
        continue
    current_q3 = q3_match.group(1)

    # "어휘 — 설명 / 어휘 — 설명" 형식인지 확인
    if ' — ' not in current_q3:
        print(f"[{unit_id}] q3 이미 본문 형식: '{current_q3[:40]}...'")
        continue

    # 첫 번째 어휘 추출 (— 앞의 단어)
    first_vocab = current_q3.split(' — ')[0].strip()

    # passage에서 해당 어휘 뒤의 텍스트 찾기
    new_q3 = get_text_after_bold(passage_text, first_vocab)

    if new_q3:
        # explain 섹션 내의 q3만 변경
        explain_section_pattern = re.compile(
            rf"({unit_id}:.*?explain:\s*\{{[^}}]*?)q3:\s*'{re.escape(current_q3)}'",
            re.DOTALL
        )

        if explain_section_pattern.search(content):
            content = explain_section_pattern.sub(
                rf"\1q3: '{new_q3}'",
                content,
                count=1
            )
            print(f"[{unit_id}] q3 변경: '{first_vocab}' → '{new_q3}'")
            changes_made += 1
        else:
            print(f"[{unit_id}] 패턴 매칭 실패: '{first_vocab}'")
            failed_units.append((unit_id, first_vocab, current_q3))
    else:
        print(f"[{unit_id}] '<b>{first_vocab}</b>' 뒤의 텍스트를 찾을 수 없음")
        failed_units.append((unit_id, first_vocab, current_q3))

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개의 q3 값 수정됨")

if failed_units:
    print(f"\n수동 확인 필요한 유닛 ({len(failed_units)}개):")
    for unit_id, vocab, q3 in failed_units:
        print(f"  {unit_id}: '{vocab}' → 현재: '{q3[:50]}...'")
