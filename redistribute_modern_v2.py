#!/usr/bin/env python3
"""
현대문학 modern_content.js Q1/Q2 정답 균등 분배 스크립트 v2
선지 순서를 바꿔서 정답이 새 위치로 이동하도록 함
"""

import re
import json

# 목표 분배 (01~40): 1,2,3,4 반복
target_answers = [(i % 4) + 1 for i in range(40)]
print("목표 Q1/Q2 분배:", target_answers[:10], "...")

# 파일 읽기
with open('public/BRAINUP/korlit/modern_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

def swap_options(opts_text, current_ans, target_ans):
    """선지 텍스트에서 현재 정답과 타겟 위치를 교환"""
    if current_ans == target_ans:
        return opts_text

    # 선지 추출
    opts = re.findall(r"'([①②③④][^']*)'", opts_text)
    if len(opts) != 4:
        return opts_text

    numbers = ['①', '②', '③', '④']
    current_idx = int(current_ans) - 1
    target_idx = int(target_ans) - 1

    # 내용만 추출 (번호 제거)
    contents = [re.sub(r'^[①②③④]\s*', '', opt) for opt in opts]

    # 현재 정답 내용과 타겟 위치 내용을 교환
    contents[current_idx], contents[target_idx] = contents[target_idx], contents[current_idx]

    # 새 선지 생성
    new_opts = [f"{numbers[i]} {contents[i]}" for i in range(4)]

    # 원본 텍스트에서 선지 교체
    result = opts_text
    for i, (old, new) in enumerate(zip(opts, new_opts)):
        result = result.replace(f"'{old}'", f"'{new}'")

    return result

# 단원별 처리
for unit in range(1, 41):
    unit_str = f"modern_{unit:02d}"
    target_q1 = target_answers[unit - 1]
    target_q2 = target_answers[unit - 1]

    # 해당 단원 블록 찾기
    pattern = rf"(/\* ===== {unit_str}.*?)((?=/\* ===== modern_)|$)"
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        print(f"{unit_str}: 블록을 찾을 수 없음")
        continue

    block = match.group(1)
    original_block = block

    # 현재 Q1, Q2 정답 찾기
    # 01~20: answerKey: { q1:'X', q2:'Y', ... }
    # 21~40: q1: 'X', q2: 'Y'

    if unit <= 20:
        q1_match = re.search(r"q1:'(\d)'", block)
        q2_match = re.search(r"q2:'(\d)'", block)
    else:
        q1_match = re.search(r"q1: '(\d)'", block)
        q2_match = re.search(r"q2: '(\d)'", block)

    if not q1_match or not q2_match:
        print(f"{unit_str}: 정답을 찾을 수 없음")
        continue

    current_q1 = int(q1_match.group(1))
    current_q2 = int(q2_match.group(1))

    # Q1 선지 교환
    if current_q1 != target_q1:
        q1_opts_match = re.search(r"(q1_opts:\s*\[.*?\])", block, re.DOTALL)
        if q1_opts_match:
            old_opts = q1_opts_match.group(1)
            new_opts = swap_options(old_opts, current_q1, target_q1)
            block = block.replace(old_opts, new_opts)

    # Q2 선지 교환
    if current_q2 != target_q2:
        q2_opts_match = re.search(r"(q2_opts:\s*\[.*?\])", block, re.DOTALL)
        if q2_opts_match:
            old_opts = q2_opts_match.group(1)
            new_opts = swap_options(old_opts, current_q2, target_q2)
            block = block.replace(old_opts, new_opts)

    # 정답 업데이트
    if unit <= 20:
        block = re.sub(r"q1:'\d'", f"q1:'{target_q1}'", block)
        block = re.sub(r"q2:'\d'", f"q2:'{target_q2}'", block)
    else:
        block = re.sub(r"q1: '\d'", f"q1: '{target_q1}'", block)
        block = re.sub(r"q2: '\d'", f"q2: '{target_q2}'", block)

    # 해설도 업데이트 필요하면 여기서 처리

    # 블록 교체
    content = content.replace(original_block, block)

    print(f"{unit_str}: Q1 {current_q1}→{target_q1}, Q2 {current_q2}→{target_q2}")

# 저장
with open('public/BRAINUP/korlit/modern_content.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n=== 완료 ===")
print("검증을 위해 다시 분포 확인 필요")
