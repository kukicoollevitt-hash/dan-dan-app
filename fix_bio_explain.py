#!/usr/bin/env python3
"""
bio_content.js의 explain 값을 수정합니다.
- 따옴표 제거
- "N문단 : ..." 형식을 본문 텍스트로 변경
- <b>태그</b> 뒤의 텍스트로 시작하도록 수정
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science/bio_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def get_text_after_b_tag(passage_text, keyword):
    """<b>keyword</b> 뒤의 텍스트 찾기"""
    pattern = rf'<b>{re.escape(keyword)}</b>([^<]{{5,60}})'
    match = re.search(pattern, passage_text)
    if match:
        text = match.group(1).strip()
        if text.startswith('이'):
            text = text[1:].strip()
        if len(text) > 50:
            text = text[:45]
        return text
    return None

def get_paragraph_text(passages, para_num, start_offset=0, length=50):
    """N번째 문단에서 텍스트 추출"""
    if len(passages) < para_num:
        return None
    p = passages[para_num - 1]
    # 태그 제거
    clean = re.sub(r'<[^>]+>', '', p)
    text = clean[start_offset:start_offset+length].strip()
    return text

def extract_quote_content(explain_value):
    """따옴표로 감싸진 내용 추출"""
    if explain_value.startswith('"') and explain_value.endswith('"'):
        return explain_value[1:-1]
    return explain_value

changes_made = 0

# bio_02~20 처리
for i in range(2, 21):
    unit_id = f"bio_{i:02d}"

    # 해당 유닛 찾기
    unit_start = content.find(f"{unit_id}:")
    if unit_start == -1:
        continue

    # 다음 유닛 시작점 찾기
    next_unit = content.find(f"bio_{i+1:02d}:", unit_start)
    if next_unit == -1:
        unit_content = content[unit_start:]
    else:
        unit_content = content[unit_start:next_unit]

    # passage 추출
    passage_match = re.search(r"passage:\s*\[([\s\S]*?)\]", unit_content)
    if not passage_match:
        continue
    passage_text = passage_match.group(1)

    # 각 문단 추출
    paragraphs = re.findall(r"'([^']+)'", passage_text)
    if not paragraphs:
        continue

    # explain 섹션 추출
    explain_match = re.search(r"explain:\s*\{([\s\S]*?)\}", unit_content)
    if not explain_match:
        continue
    explain_text = explain_match.group(1)

    # q1~q4 처리
    for q in ['q1', 'q2', 'q3', 'q4']:
        q_match = re.search(rf"{q}:\s*'([^']+)'", explain_text)
        if not q_match:
            q_match = re.search(rf'{q}:\s*"([^"]+)"', explain_text)
        if not q_match:
            continue

        current_val = q_match.group(1)

        # 따옴표로 시작하는 경우 제거
        if current_val.startswith('"') and current_val.endswith('"'):
            new_val = current_val[1:-1]
            # "N문단 :" 형식 체크
            if '문단 :' in new_val or '문단:' in new_val:
                # 해당 문단 번호 추출
                para_match = re.search(r'(\d)문단', new_val)
                if para_match:
                    para_num = int(para_match.group(1))
                    para_text = get_paragraph_text(paragraphs, para_num, 0, 40)
                    if para_text:
                        new_val = para_text

            # 변경이 필요한 경우
            if new_val != current_val:
                old_pattern = f"{q}:'{current_val}'"
                new_pattern = f"{q}:'{new_val}'"
                if old_pattern in content:
                    content = content.replace(old_pattern, new_pattern, 1)
                    print(f"[{unit_id}] {q} 수정: '{current_val[:30]}...' → '{new_val[:30]}...'")
                    changes_made += 1
                else:
                    # 다른 형식 시도
                    old_pattern2 = f'{q}:"{current_val}"'
                    new_pattern2 = f"{q}:'{new_val}'"
                    if old_pattern2 in content:
                        content = content.replace(old_pattern2, new_pattern2, 1)
                        print(f"[{unit_id}] {q} 수정: '{current_val[:30]}...' → '{new_val[:30]}...'")
                        changes_made += 1

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개 수정됨")
