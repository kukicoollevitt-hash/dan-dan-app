#!/usr/bin/env python3
"""
on_pol_content.js의 모든 단원 explain 값을 상세 출력합니다.
"""

import re

with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social/on_pol_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

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

        # <b>태그</b> 추출
        b_tags = re.findall(r'<b>([^<]+)</b>', passage_text)
    else:
        passage_plain = ''
        b_tags = []

    # explain 추출
    explain_pattern = rf'{unit_key}:[^\}}]*?explain:\s*\{{([^\}}]*)\}}'
    explain_match = re.search(explain_pattern, content, re.DOTALL)

    print(f"\n{'='*60}")
    print(f"{unit_key}")
    print(f"{'='*60}")
    print(f"<b>태그들: {b_tags[:5]}...")

    if explain_match:
        explain_raw = explain_match.group(1)
        for q in ['q1', 'q2', 'q3', 'q4']:
            q_match = re.search(rf"{q}:\s*['\"](.+?)['\"]", explain_raw)
            if q_match:
                explain = q_match.group(1).replace("\\'", "'")

                # 본문 존재 여부
                in_passage = "✓" if explain in passage_plain else "✗"

                # <b> 충돌 여부
                b_conflict = ""
                for b_text in b_tags:
                    if b_text in explain:
                        b_conflict = f" ⚠<b>{b_text}</b>"
                        break

                print(f"  {q}: [{in_passage}]{b_conflict} '{explain[:60]}...'")
