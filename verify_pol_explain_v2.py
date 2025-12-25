#!/usr/bin/env python3
"""
on_pol_content.js의 모든 단원 explain 값을 검증합니다.
1. explain 값이 passage에 존재하는지 확인
2. <b>태그</b> 충돌 여부 확인
3. q1~q4 간 중복 여부 확인
"""

import re

# on_pol_content.js 읽기
with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social/on_pol_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 각 단원 데이터 추출
units = {}
for i in range(1, 21):
    unit_key = f'on_pol_{i:02d}'

    # passage 추출
    passage_pattern = rf'{unit_key}:[^\}}]*?passage:\s*\[(.*?)\]'
    passage_match = re.search(passage_pattern, content, re.DOTALL)
    if passage_match:
        passage_raw = passage_match.group(1)
        passages = re.findall(r"'([^']*)'", passage_raw)
        passage_text = ' '.join(passages)
        passage_plain = re.sub(r'<[^>]+>', '', passage_text)
    else:
        passage_text = ''
        passage_plain = ''

    # explain 추출
    explain_pattern = rf'{unit_key}:[^\}}]*?explain:\s*\{{([^\}}]*)\}}'
    explain_match = re.search(explain_pattern, content, re.DOTALL)
    if explain_match:
        explain_raw = explain_match.group(1)
        explains = {}
        for q in ['q1', 'q2', 'q3', 'q4']:
            q_match = re.search(rf"{q}:\s*['\"](.+?)['\"]", explain_raw)
            if q_match:
                explains[q] = q_match.group(1).replace("\\'", "'")
    else:
        explains = {}

    units[unit_key] = {
        'passage': passage_text,
        'passage_plain': passage_plain,
        'explains': explains
    }

# 검증
print("=" * 70)
print("on_pol explain 검증 결과 (q1~q4)")
print("=" * 70)

issues = []

for unit_key in sorted(units.keys()):
    data = units[unit_key]
    unit_issues = []

    explain_values = []
    for q in ['q1', 'q2', 'q3', 'q4']:
        if q not in data['explains']:
            continue

        explain = data['explains'][q]
        explain_values.append((q, explain))

        # 1. passage_plain에 존재하는지 확인
        if explain not in data['passage_plain']:
            unit_issues.append(f"  {q}: ✗ 본문에 없음 - '{explain[:50]}...'")

        # 2. <b>태그</b> 충돌 확인
        if '<b>' in data['passage']:
            b_texts = re.findall(r'<b>([^<]+)</b>', data['passage'])
            for b_text in b_texts:
                if b_text in explain:
                    unit_issues.append(f"  {q}: ⚠ <b>{b_text}</b> 충돌 - '{explain[:40]}...'")

    # 3. q1~q4 간 중복 확인 (한 explain이 다른 explain을 포함하는지)
    for i, (q1, exp1) in enumerate(explain_values):
        for j, (q2, exp2) in enumerate(explain_values):
            if i < j:
                if exp1 in exp2 or exp2 in exp1:
                    unit_issues.append(f"  {q1}/{q2}: ⚠ 중복 - '{exp1[:30]}...' vs '{exp2[:30]}...'")

    if unit_issues:
        print(f"\n{unit_key}:")
        for issue in unit_issues:
            print(issue)
        issues.extend(unit_issues)
    else:
        print(f"{unit_key}: ✓ OK")

print("\n" + "=" * 70)
print(f"총 {len(issues)}개 이슈 발견")
print("=" * 70)
