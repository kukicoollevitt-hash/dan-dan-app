#!/usr/bin/env python3
"""
고전문학 HTML 파일의 Q1/Q2 선지를 content.js와 동기화
"""

import re
import os

# content.js에서 각 단원의 선지 추출
with open('public/BRAINUP/korlit/classic_content.js', 'r', encoding='utf-8') as f:
    content_js = f.read()

def get_unit_options(unit_str):
    """단원별 q1_opts, q2_opts 추출"""
    # q1_opts 찾기
    q1_pattern = rf"classic_{unit_str}:[\s\S]*?q1_opts:\s*\[([\s\S]*?)\],\s*q2_text"
    q1_match = re.search(q1_pattern, content_js)

    q1_opts = []
    if q1_match:
        opts_str = q1_match.group(1)
        q1_opts = re.findall(r"'([^']*)'", opts_str)

    # q2_opts 찾기
    q2_pattern = rf"classic_{unit_str}:[\s\S]*?q2_opts:\s*\[([\s\S]*?)\],\s*q3_1_ph"
    q2_match = re.search(q2_pattern, content_js)

    q2_opts = []
    if q2_match:
        opts_str = q2_match.group(1)
        q2_opts = re.findall(r"'([^']*)'", opts_str)

    return q1_opts, q2_opts

def update_html_options(filepath, q1_opts, q2_opts):
    """HTML 파일의 선지 업데이트"""
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    original = html

    # Q1 선지 업데이트 (name="q1" 라디오 버튼들)
    if len(q1_opts) == 4:
        for i, opt in enumerate(q1_opts, 1):
            # 패턴: <input type="radio" name="q1" value="1"><span>① ...</span>
            pattern = rf'(<input type="radio" name="q1" value="{i}"><span>)[^<]*(</span>)'
            replacement = rf'\g<1>{opt}\g<2>'
            html = re.sub(pattern, replacement, html)

    # Q2 선지 업데이트 (name="q2" 라디오 버튼들)
    if len(q2_opts) == 4:
        for i, opt in enumerate(q2_opts, 1):
            pattern = rf'(<input type="radio" name="q2" value="{i}"><span>)[^<]*(</span>)'
            replacement = rf'\g<1>{opt}\g<2>'
            html = re.sub(pattern, replacement, html)

    if html != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False

# 40개 파일 처리
modified_count = 0
for unit in range(1, 41):
    unit_str = f"{unit:02d}"
    filepath = f"public/BRAINUP/korlit/classic_{unit_str}.html"

    if not os.path.exists(filepath):
        print(f"SKIP: {filepath} (파일 없음)")
        continue

    q1_opts, q2_opts = get_unit_options(unit_str)

    if len(q1_opts) != 4 or len(q2_opts) != 4:
        print(f"WARNING: classic_{unit_str} - 선지 개수 불일치 (q1={len(q1_opts)}, q2={len(q2_opts)})")
        continue

    if update_html_options(filepath, q1_opts, q2_opts):
        print(f"MODIFIED: classic_{unit_str}.html")
        modified_count += 1
    else:
        print(f"NO CHANGE: classic_{unit_str}.html")

print(f"\n=== 완료 ===")
print(f"수정된 파일: {modified_count}개")
