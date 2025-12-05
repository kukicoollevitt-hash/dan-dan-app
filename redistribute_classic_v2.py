#!/usr/bin/env python3
"""
고전문학 classic_content.js Q1/Q2 정답 균등 분배
선지 순서를 변경하여 정답 내용 유지
"""

import re
import json

with open('public/BRAINUP/korlit/classic_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 새로운 정답 배치 (각 10개씩, 섞어서)
# 01-10: ①②③④①②③④①②
# 11-20: ③④①②③④①②③④
# 21-30: ①②③④①②③④①②
# 31-40: ③④①②③④①②③④

q1_new = [1,2,3,4,1,2,3,4,1,2,  3,4,1,2,3,4,1,2,3,4,  1,2,3,4,1,2,3,4,1,2,  3,4,1,2,3,4,1,2,3,4]
q2_new = [2,3,4,1,2,3,4,1,2,3,  4,1,2,3,4,1,2,3,4,1,  2,3,4,1,2,3,4,1,2,3,  4,1,2,3,4,1,2,3,4,1]

# 각 단원별로 처리
for unit in range(1, 41):
    unit_str = f"{unit:02d}"
    target_q1 = q1_new[unit-1]
    target_q2 = q2_new[unit-1]

    # classic_XX 블록 찾기
    block_pattern = rf"(classic_{unit_str}:\s*\{{[\s\S]*?)(q1_opts:\s*\[)([\s\S]*?)(\],\s*q2_text)"
    block_match = re.search(block_pattern, content)

    if block_match:
        # Q1 선지 추출
        q1_opts_str = block_match.group(3)
        q1_opts = re.findall(r"'([^']*)'", q1_opts_str)

        if len(q1_opts) == 4:
            # 현재 정답 찾기
            answer_pattern = rf"classic_{unit_str}:[\s\S]*?answerKey:\s*\{{\s*q1:\s*['\"](\d)['\"]"
            answer_match = re.search(answer_pattern, content)
            if answer_match:
                current_q1 = int(answer_match.group(1))
                correct_answer_text = q1_opts[current_q1 - 1]

                # 새로운 순서로 재배치 (정답이 target_q1 위치로)
                new_opts = q1_opts.copy()
                # 현재 정답 위치에서 제거
                new_opts.pop(current_q1 - 1)
                # 타겟 위치에 삽입
                new_opts.insert(target_q1 - 1, correct_answer_text)

                # 번호 다시 매기기
                for i in range(4):
                    num = ['①', '②', '③', '④'][i]
                    # 기존 번호 제거하고 새 번호 추가
                    new_opts[i] = re.sub(r'^[①②③④]\s*', f'{num} ', new_opts[i])

                # 새 선지 문자열
                new_q1_opts_str = ",\n        ".join([f"'{opt}'" for opt in new_opts])

                # 교체
                old_full = block_match.group(2) + block_match.group(3) + block_match.group(4)
                new_full = block_match.group(2) + "\n        " + new_q1_opts_str + "\n      " + block_match.group(4)
                content = content.replace(old_full, new_full)

    # Q2도 동일하게 처리
    block_pattern2 = rf"(classic_{unit_str}:[\s\S]*?)(q2_opts:\s*\[)([\s\S]*?)(\],\s*q3_1_ph)"
    block_match2 = re.search(block_pattern2, content)

    if block_match2:
        q2_opts_str = block_match2.group(3)
        q2_opts = re.findall(r"'([^']*)'", q2_opts_str)

        if len(q2_opts) == 4:
            answer_pattern2 = rf"classic_{unit_str}:[\s\S]*?answerKey:\s*\{{\s*q1:\s*['\"](\d)['\"],\s*q2:\s*['\"](\d)['\"]"
            answer_match2 = re.search(answer_pattern2, content)
            if answer_match2:
                current_q2 = int(answer_match2.group(2))
                correct_answer_text2 = q2_opts[current_q2 - 1]

                new_opts2 = q2_opts.copy()
                new_opts2.pop(current_q2 - 1)
                new_opts2.insert(target_q2 - 1, correct_answer_text2)

                for i in range(4):
                    num = ['①', '②', '③', '④'][i]
                    new_opts2[i] = re.sub(r'^[①②③④]\s*', f'{num} ', new_opts2[i])

                new_q2_opts_str = ",\n        ".join([f"'{opt}'" for opt in new_opts2])

                old_full2 = block_match2.group(2) + block_match2.group(3) + block_match2.group(4)
                new_full2 = block_match2.group(2) + "\n        " + new_q2_opts_str + "\n      " + block_match2.group(4)
                content = content.replace(old_full2, new_full2)

    # answerKey 업데이트
    answer_update_pattern = rf"(classic_{unit_str}:[\s\S]*?answerKey:\s*\{{\s*)q1:\s*['\"](\d)['\"],\s*q2:\s*['\"](\d)['\"]"
    content = re.sub(answer_update_pattern, rf"\g<1>q1:'{target_q1}', q2:'{target_q2}'", content)

    print(f"classic_{unit_str}: Q1={target_q1}, Q2={target_q2}")

with open('public/BRAINUP/korlit/classic_content.js', 'w', encoding='utf-8') as f:
    f.write(content)

# 검증
print("\n=== 검증 ===")
with open('public/BRAINUP/korlit/classic_content.js', 'r', encoding='utf-8') as f:
    verify_content = f.read()

pattern = r"answerKey:\s*\{\s*q1:\s*['\"](\d)['\"],\s*q2:\s*['\"](\d)['\"]"
matches = re.findall(pattern, verify_content)

q1_dist = {1: 0, 2: 0, 3: 0, 4: 0}
q2_dist = {1: 0, 2: 0, 3: 0, 4: 0}

for q1, q2 in matches:
    q1_dist[int(q1)] += 1
    q2_dist[int(q2)] += 1

print(f"Q1 분포: ①={q1_dist[1]}, ②={q1_dist[2]}, ③={q1_dist[3]}, ④={q1_dist[4]}")
print(f"Q2 분포: ①={q2_dist[1]}, ②={q2_dist[2]}, ③={q2_dist[3]}, ④={q2_dist[4]}")
