#!/usr/bin/env python3
import re

# on_chem_content.js 파일 읽기
with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science/on_chem_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 각 유닛별로 passage와 explain 추출
units = re.findall(r'on_chem_(\d{2}):\s*\{([^}]+labelNo[^}]+)\}', content, re.DOTALL)

for unit_match in re.finditer(r'on_chem_(\d{2}):\s*\{', content):
    unit_num = unit_match.group(1)
    start_pos = unit_match.end()

    # passage 찾기
    passage_match = re.search(r"passage:\s*\[(.*?)\],\s*vocab:", content[start_pos:start_pos+5000], re.DOTALL)
    if not passage_match:
        continue

    passage_raw = passage_match.group(1)
    # <b> 태그 제거하여 plain text로 변환
    passage_plain = re.sub(r'</?b>', '', passage_raw)

    # explain 찾기
    explain_match = re.search(r"explain:\s*\{([^}]+)\}", content[start_pos:start_pos+10000], re.DOTALL)
    if not explain_match:
        continue

    explain_block = explain_match.group(1)

    print(f"\n=== on_chem_{unit_num} ===")

    # q1~q4 explain 확인
    for q in ['q1', 'q2', 'q3', 'q4']:
        q_match = re.search(rf"{q}:\s*'([^']*)'", explain_block)
        if not q_match:
            continue
        explain_text = q_match.group(1)

        # passage_plain에서 explain_text가 있는지 확인
        if explain_text in passage_plain:
            print(f"  {q}: OK")
        else:
            print(f"  {q}: NOT FOUND - '{explain_text[:50]}...'")

print("\n=== 완료 ===")
