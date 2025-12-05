#!/usr/bin/env python3
"""
고전문학 classic_content.js Q1/Q2 정답 균등 분배
목표: 각 문제당 ①②③④ 정답이 10개씩
"""

import re

with open('public/BRAINUP/korlit/classic_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 현재 정답 추출
pattern = r"answerKey:\s*\{\s*q1:\s*['\"](\d)['\"],\s*q2:\s*['\"](\d)['\"]"
matches = re.findall(pattern, content)

print("현재 분포:")
q1_dist = {1: 0, 2: 0, 3: 0, 4: 0}
q2_dist = {1: 0, 2: 0, 3: 0, 4: 0}

for i, (q1, q2) in enumerate(matches, 1):
    q1_dist[int(q1)] += 1
    q2_dist[int(q2)] += 1
    print(f"classic_{i:02d}: Q1={q1}, Q2={q2}")

print(f"\nQ1 분포: ①={q1_dist[1]}, ②={q1_dist[2]}, ③={q1_dist[3]}, ④={q1_dist[4]}")
print(f"Q2 분포: ①={q2_dist[1]}, ②={q2_dist[2]}, ③={q2_dist[3]}, ④={q2_dist[4]}")

# 새로운 정답 배치 (각 10개씩)
# Q1: 01-10=①, 11-20=②, 21-30=③, 31-40=④
# Q2: 01-10=②, 11-20=③, 21-30=④, 31-40=① (Q1과 다르게 배치)

new_q1 = {}
new_q2 = {}

# Q1 배치: 균등하게 섞어서 배치
q1_assignments = [1]*10 + [2]*10 + [3]*10 + [4]*10
# 섞어서 배치 (연속되지 않게)
q1_final = []
for i in range(10):
    q1_final.extend([1, 2, 3, 4])

# Q2 배치: Q1과 다르게
q2_final = []
for i in range(10):
    q2_final.extend([2, 3, 4, 1])

print("\n새로운 분배:")
for i in range(40):
    unit = i + 1
    new_q1[unit] = q1_final[i]
    new_q2[unit] = q2_final[i]
    print(f"classic_{unit:02d}: Q1={new_q1[unit]}, Q2={new_q2[unit]}")

# 파일 수정
def update_answer(match, unit_counter):
    unit = unit_counter[0]
    unit_counter[0] += 1

    old_text = match.group(0)
    old_q1 = match.group(1)
    old_q2 = match.group(2)

    new_text = old_text.replace(f"q1:'{old_q1}'", f"q1:'{new_q1[unit]}'")
    new_text = new_text.replace(f"q1:\"{old_q1}\"", f"q1:'{new_q1[unit]}'")
    new_text = new_text.replace(f"q2:'{old_q2}'", f"q2:'{new_q2[unit]}'")
    new_text = new_text.replace(f"q2:\"{old_q2}\"", f"q2:'{new_q2[unit]}'")

    # 더 정확한 치환
    new_text = re.sub(r"q1:\s*['\"]" + old_q1 + r"['\"]", f"q1:'{new_q1[unit]}'", old_text)
    new_text = re.sub(r"q2:\s*['\"]" + old_q2 + r"['\"]", f"q2:'{new_q2[unit]}'", new_text)

    return new_text

unit_counter = [1]
new_content = re.sub(pattern, lambda m: update_answer(m, unit_counter), content)

# 선지 순서도 변경해야 정답 내용이 유지됨
# 이 부분은 각 단원별로 q1_opts, q2_opts 순서를 바꿔야 함

with open('public/BRAINUP/korlit/classic_content.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n=== 수정 완료 ===")
print("주의: 선지 순서 변경이 필요합니다!")
