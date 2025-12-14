#!/usr/bin/env python3
import re

# Read the file
with open('public/BRAINUP/science/deep_bio_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all deep_bio sections
pattern = r'deep_bio_(\d+):.*?answerKey:\s*\{\s*q1:\'(\d)\',\s*q2:\'(\d)\',\s*q3:\'(\d)\',\s*q4:\'(\d)\'.*?explain:\s*\{(.*?)\n\s*\},\s*creative:'
matches = re.findall(pattern, content, re.DOTALL)

print("딥생물 Q3, Q4 정답 vs 해설 검증\n" + "="*60)

errors = []

for match in matches:
    bio_num = match[0]
    q3_answer = match[3]
    q4_answer = match[4]
    explain_block = match[5]

    # Extract q3 and q4 explanations
    q3_explain_match = re.search(r"q3:'([^']*)'", explain_block)
    q4_explain_match = re.search(r"q4:'([^']*)'", explain_block)

    if q3_explain_match:
        q3_explain = q3_explain_match.group(1)
        # Check if explanation mentions the correct answer
        if f"{q3_answer}번 선택지가 정답" not in q3_explain:
            errors.append(f"딥생물 {bio_num} Q3: 정답={q3_answer}번, 해설에 '{q3_answer}번 선택지가 정답' 없음")
            print(f"⚠️  딥생물 {bio_num} Q3: 정답={q3_answer}번")
            print(f"    해설: {q3_explain[:100]}...")
        else:
            print(f"✅ 딥생물 {bio_num} Q3: 정답={q3_answer}번 일치")

    if q4_explain_match:
        q4_explain = q4_explain_match.group(1)
        # Check if explanation mentions the correct answer
        if f"{q4_answer}번 선택지가 정답" not in q4_explain and f"{q4_answer}번 선택지" not in q4_explain[:50]:
            errors.append(f"딥생물 {bio_num} Q4: 정답={q4_answer}번, 해설에 '{q4_answer}번 선택지가 정답' 없음")
            print(f"⚠️  딥생물 {bio_num} Q4: 정답={q4_answer}번")
            print(f"    해설: {q4_explain[:100]}...")
        else:
            print(f"✅ 딥생물 {bio_num} Q4: 정답={q4_answer}번 일치")

print("\n" + "="*60)
if errors:
    print(f"\n발견된 오류: {len(errors)}개")
    for error in errors:
        print(f"  - {error}")
else:
    print("\n모든 Q3, Q4 정답과 해설이 일치합니다! ✅")
