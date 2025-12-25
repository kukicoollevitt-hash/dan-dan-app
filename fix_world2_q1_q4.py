#!/usr/bin/env python3
"""
on_world2_content.js의 q1, q4 explain 값을 수정합니다.
passage에 없는 explain 값들을 passage에서 찾을 수 있는 텍스트로 변경합니다.
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world2_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def find_text_in_passage(passage, search_terms, min_length=15, max_length=60):
    """
    passage에서 search_terms 중 하나를 포함하는 텍스트를 찾습니다.
    """
    for term in search_terms:
        # passage에서 term을 포함하는 부분 찾기
        pattern = re.compile(rf'[^<>]*{re.escape(term)}[^<>]*', re.IGNORECASE)
        matches = pattern.findall(passage)
        for match in matches:
            match = match.strip()
            if min_length <= len(match) <= max_length:
                return match
            elif len(match) > max_length:
                # 적절한 길이로 자르기
                # term 위치 찾기
                term_idx = match.lower().find(term.lower())
                if term_idx >= 0:
                    start = max(0, term_idx - 10)
                    end = min(len(match), term_idx + len(term) + 40)
                    return match[start:end].strip()
    return None

# 각 유닛 처리
changes_made = 0
failed_units = []

for i in range(1, 41):
    unit_id = f'on_world2_{i:02d}'

    unit_start = content.find(f'{unit_id}:')
    if unit_start == -1:
        continue

    next_unit = content.find(f'on_world2_{i+1:02d}:', unit_start)
    if next_unit == -1:
        unit_content = content[unit_start:]
    else:
        unit_content = content[unit_start:next_unit]

    # passage 추출
    passage_match = re.search(r'passage:\s*\[(.*?)\]', unit_content, re.DOTALL)
    if not passage_match:
        continue
    passage = passage_match.group(1)

    # explain 섹션 추출
    explain_match = re.search(r'explain:\s*\{([^}]+)\}', unit_content, re.DOTALL)
    if not explain_match:
        continue
    explain_text = explain_match.group(1)

    # q1, q4 처리
    for q in ['q1', 'q4']:
        q_match = re.search(rf"{q}:\s*'([^']+)'", explain_text)
        if not q_match:
            continue
        q_val = q_match.group(1)

        if q_val in passage:
            continue  # 이미 passage에 있음

        # 없으면 출력만
        failed_units.append((unit_id, q, q_val[:60]))

# 결과 출력
print(f"수정 필요한 유닛 ({len(failed_units)}개):")
for unit_id, q, val in failed_units:
    print(f"  {unit_id} {q}: {val}...")
