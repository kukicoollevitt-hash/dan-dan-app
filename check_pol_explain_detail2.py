#!/usr/bin/env python3
"""
on_pol_content.js의 모든 단원 explain 값을 상세 출력합니다.
"""

import re

with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social/on_pol_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

for i in range(1, 21):
    unit_key = f'on_pol_{i:02d}'

    # 해당 단원 블록 찾기
    unit_start = content.find(f'{unit_key}:')
    if unit_start == -1:
        continue

    # 다음 단원 또는 끝까지
    next_unit = f'on_pol_{i+1:02d}:'
    unit_end = content.find(next_unit, unit_start)
    if unit_end == -1:
        unit_end = len(content)

    unit_content = content[unit_start:unit_end]

    # passage 추출
    passage_match = re.search(r'passage:\s*\[(.*?)\]', unit_content, re.DOTALL)
    if passage_match:
        passage_raw = passage_match.group(1)
        passages = re.findall(r"'([^']*)'", passage_raw)
        passage_text = ' '.join(passages)
        passage_plain = re.sub(r'<[^>]+>', '', passage_text)
        b_tags = re.findall(r'<b>([^<]+)</b>', passage_text)
    else:
        passage_plain = ''
        b_tags = []

    # explain 추출 - 더 유연한 패턴
    explain_match = re.search(r'explain:\s*\{([\s\S]*?)\n\s*\}', unit_content)

    print(f"\n{'='*70}")
    print(f"{unit_key}")
    print(f"{'='*70}")

    if explain_match:
        explain_raw = explain_match.group(1)
        for q in ['q1', 'q2', 'q3', 'q4']:
            # 여러 패턴 시도
            q_match = re.search(rf"{q}:\s*['\"](.+?)['\"]", explain_raw)
            if not q_match:
                q_match = re.search(rf'{q}:\s*["\'](.+?)["\']', explain_raw)

            if q_match:
                explain = q_match.group(1).replace("\\'", "'").replace('\\"', '"')

                # 본문 존재 여부
                in_passage = "✓" if explain in passage_plain else "✗"

                # <b> 충돌 여부
                b_conflict = ""
                for b_text in b_tags:
                    if b_text in explain:
                        b_conflict = f" ⚠<b>{b_text}</b>"
                        break

                status = f"[{in_passage}]{b_conflict}"
                print(f"  {q}: {status:20} '{explain[:55]}...'")
            else:
                print(f"  {q}: [없음]")
    else:
        print("  explain 블록 없음")

print(f"\n{'='*70}")
print("검증 완료")
print(f"{'='*70}")
