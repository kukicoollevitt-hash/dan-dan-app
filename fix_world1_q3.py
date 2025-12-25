#!/usr/bin/env python3
"""
on_world1_content.js의 q3 explain 값을 수정합니다.
현재 어휘 단어만 있는 q3 값을 <b>태그</b> 뒤의 텍스트로 변경합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world1_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 각 유닛별로 q3 explain 값과 passage를 분석하여 수정

# 유닛 데이터를 추출하는 패턴
unit_pattern = re.compile(
    r"on_world1_(\d{2}):\s*\{[^}]*"
    r"passage:\s*\[(.*?)\].*?"
    r"explain:\s*\{[^}]*"
    r"q3:\s*'([^']+)'"
    , re.DOTALL
)

def get_text_after_bold(passage_text, vocab_word):
    """
    passage에서 <b>vocab_word</b> 뒤의 텍스트를 추출합니다.
    """
    # <b>vocab_word</b> 패턴 찾기
    pattern = re.compile(
        rf'<b>{re.escape(vocab_word)}</b>([^<\'\"]+)',
        re.IGNORECASE
    )

    match = pattern.search(passage_text)
    if match:
        after_text = match.group(1).strip()
        # 적절한 길이로 자르기 (문장 끝까지 또는 최대 50자)
        # 문장 종결 부호 찾기
        end_markers = ['.', '요.', '다.', '!', '?']

        # 최소 10자는 포함하고, 문장 종결부가 나오면 거기까지
        result = after_text

        # 너무 짧으면 그대로 사용
        if len(result) < 5:
            return None

        # 너무 길면 적절히 자르기 (40자 이내)
        if len(result) > 40:
            # 마침표나 쉼표 등에서 자르기
            for i, char in enumerate(result[15:40], 15):
                if char in '.요다!?':
                    result = result[:i+1]
                    break
            else:
                result = result[:35] + '...'

        return result
    return None

# 수정할 유닛들 (q3가 어휘 단어만 있는 경우)
# 파일을 다시 읽어서 각 유닛의 passage와 q3를 분석

# 먼저 explain 섹션의 q3 값들을 추출
explain_q3_pattern = re.compile(r"(on_world1_\d{2}:.*?explain:\s*\{[^}]*q3:\s*')([^']+)(')", re.DOTALL)

# 현재 모든 q3 값 확인
matches = list(explain_q3_pattern.finditer(content))
print(f"총 {len(matches)}개의 q3 explain 항목 발견\n")

# 각 유닛을 개별적으로 처리
# 유닛별 passage와 q3 explain을 매칭

changes_made = 0

for i in range(1, 41):
    unit_id = f"on_world1_{i:02d}"

    # 해당 유닛의 passage 추출
    unit_start = content.find(f"{unit_id}:")
    if unit_start == -1:
        continue

    # 다음 유닛 시작점 찾기
    next_unit = content.find(f"on_world1_{i+1:02d}:", unit_start)
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

    # q3가 짧은 어휘 단어인 경우만 처리 (5자 이하)
    # 또는 이미 올바른 형식이면 건너뛰기
    if len(current_q3) > 15:
        print(f"[{unit_id}] q3 이미 적절한 길이: '{current_q3[:30]}...'")
        continue

    # passage에서 해당 어휘 뒤의 텍스트 찾기
    new_q3 = get_text_after_bold(passage_text, current_q3)

    if new_q3:
        # 전역적으로 해당 유닛의 q3 값만 변경
        old_pattern = f"q3: '{current_q3}'"
        new_value = f"q3: '{new_q3}'"

        # explain 섹션 내의 q3만 변경 (detail이나 다른 곳 제외)
        # 해당 유닛 범위 내에서만 explain 섹션 찾아서 수정

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
            print(f"[{unit_id}] q3 변경: '{current_q3}' → '{new_q3}'")
            changes_made += 1
        else:
            print(f"[{unit_id}] 패턴 매칭 실패: '{current_q3}'")
    else:
        print(f"[{unit_id}] '<b>{current_q3}</b>' 뒤의 텍스트를 찾을 수 없음")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개의 q3 값 수정됨")
