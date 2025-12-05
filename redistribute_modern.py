#!/usr/bin/env python3
"""
현대문학 modern_content.js Q1/Q2 정답 균등 분배 스크립트
목표: 40문제에서 각 ①②③④ 정답이 10개씩 배분되도록 선지 순서 조정
"""

import re

# 읽기
with open('public/BRAINUP/korlit/modern_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 목표 분배 (01~40)
# Q1: 1,2,3,4,1,2,3,4,1,2, 3,4,1,2,3,4,1,2,3,4, 1,2,3,4,1,2,3,4,1,2, 3,4,1,2,3,4,1,2,3,4
# Q2: 1,2,3,4,1,2,3,4,1,2, 3,4,1,2,3,4,1,2,3,4, 1,2,3,4,1,2,3,4,1,2, 3,4,1,2,3,4,1,2,3,4
target_q1 = []
target_q2 = []
for i in range(40):
    target_q1.append((i % 4) + 1)
    target_q2.append((i % 4) + 1)

print("Q1 목표 분배:", target_q1)
print("Q2 목표 분배:", target_q2)

# 단원별 현재 정답 추출 및 변환
# 01~20번: answerKey: { q1:'X', q2:'Y', ... } 형태
# 21~40번: q1: 'X', q2: 'Y' 별도 라인 형태

def rotate_opts(opts, current_ans, target_ans):
    """선지 리스트를 회전시켜 target_ans가 정답이 되도록 함"""
    # 현재 정답 선지를 target 위치로 이동
    # opts는 ['① ...', '② ...', '③ ...', '④ ...'] 형태
    current_idx = int(current_ans) - 1  # 0-indexed
    target_idx = int(target_ans) - 1

    if current_idx == target_idx:
        return opts, target_ans

    # 현재 정답 내용과 타겟 위치 내용을 교환
    new_opts = opts.copy()

    # 번호 제거하고 내용만 추출
    def extract_content(opt):
        return re.sub(r'^[①②③④]\s*', '', opt)

    def add_number(content, num):
        numbers = ['①', '②', '③', '④']
        return f"{numbers[num]} {content}"

    contents = [extract_content(opt) for opt in opts]

    # 현재 정답 내용과 타겟 위치 내용을 교환
    contents[current_idx], contents[target_idx] = contents[target_idx], contents[current_idx]

    # 번호 다시 붙이기
    new_opts = [add_number(contents[i], i) for i in range(4)]

    return new_opts, str(target_ans)

# 처리 시작
lines = content.split('\n')
result_lines = []
unit_num = 0
i = 0

while i < len(lines):
    line = lines[i]

    # 단원 시작 감지
    if re.search(r'/\* ===== modern_(\d{2})', line):
        match = re.search(r'modern_(\d{2})', line)
        if match:
            unit_num = int(match.group(1))

    # 01~20번: 인라인 answerKey 형태
    if unit_num >= 1 and unit_num <= 20:
        # q1_opts 찾기
        if "'q1_opts':" in line or "q1_opts:" in line:
            # q1_opts 배열 시작
            opts_lines = [line]
            j = i + 1
            bracket_count = line.count('[') - line.count(']')
            while bracket_count > 0 and j < len(lines):
                opts_lines.append(lines[j])
                bracket_count += lines[j].count('[') - lines[j].count(']')
                j += 1

            # opts 추출
            opts_text = '\n'.join(opts_lines)
            opts_match = re.findall(r"'([①②③④][^']*)'", opts_text)

            if len(opts_match) == 4:
                # 현재 정답 찾기 (나중에 answerKey에서)
                # 일단 라인 그대로 추가
                for ol in opts_lines:
                    result_lines.append(ol)
                i = j
                continue

        # q2_opts도 마찬가지

        # answerKey 처리
        if 'answerKey:' in line and 'q1:' in line:
            # 인라인 answerKey
            q1_match = re.search(r"q1:'(\d)'", line)
            q2_match = re.search(r"q2:'(\d)'", line)

            if q1_match and q2_match:
                current_q1 = q1_match.group(1)
                current_q2 = q2_match.group(1)
                target_q1_ans = str(target_q1[unit_num - 1])
                target_q2_ans = str(target_q2[unit_num - 1])

                # 정답 변경
                new_line = re.sub(r"q1:'\d'", f"q1:'{target_q1_ans}'", line)
                new_line = re.sub(r"q2:'\d'", f"q2:'{target_q2_ans}'", new_line)
                result_lines.append(new_line)

                print(f"modern_{unit_num:02d}: Q1 {current_q1}→{target_q1_ans}, Q2 {current_q2}→{target_q2_ans}")
                i += 1
                continue

    # 21~40번: 별도 라인 형태
    if unit_num >= 21 and unit_num <= 40:
        # q1: 'X' 형태
        if re.match(r"\s*q1: '\d',", line):
            current_q1 = re.search(r"q1: '(\d)'", line).group(1)
            target_q1_ans = str(target_q1[unit_num - 1])
            new_line = re.sub(r"q1: '\d'", f"q1: '{target_q1_ans}'", line)
            result_lines.append(new_line)
            print(f"modern_{unit_num:02d}: Q1 {current_q1}→{target_q1_ans}")
            i += 1
            continue

        if re.match(r"\s*q2: '\d',", line):
            current_q2 = re.search(r"q2: '(\d)'", line).group(1)
            target_q2_ans = str(target_q2[unit_num - 1])
            new_line = re.sub(r"q2: '\d'", f"q2: '{target_q2_ans}'", line)
            result_lines.append(new_line)
            print(f"modern_{unit_num:02d}: Q2 {current_q2}→{target_q2_ans}")
            i += 1
            continue

    result_lines.append(line)
    i += 1

# 저장
with open('public/BRAINUP/korlit/modern_content.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(result_lines))

print("\n완료!")
