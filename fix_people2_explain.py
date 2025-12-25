#!/usr/bin/env python3
"""
on_people2_content.js의 q2, q3 explain 값을 수정합니다.
- q2: "1문단: ... / 2문단: ..." 형식을 passage에서 찾을 수 있는 텍스트로 변경
- q3: "어휘 — 설명" 형식을 passage에서 </b> 뒤 텍스트로 변경
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/person/on_people2_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def get_paragraph_start(passages, para_num):
    """N번째 문단의 시작 텍스트 추출 (</b> 뒤 텍스트)"""
    if len(passages) < para_num:
        return None
    p = passages[para_num - 1]
    # </b> 뒤의 텍스트 찾기
    match = re.search(r'</b>([^<]{10,60})', p)
    if match:
        text = match.group(1).strip()
        if len(text) > 50:
            text = text[:45]
        return text
    # </b> 없으면 문단 시작 부분 (태그 제외)
    clean = re.sub(r'<[^>]+>', '', p)
    text = clean[:45].strip()
    return text

def get_vocab_context(passages, vocab_word):
    """passage에서 vocab 단어 뒤의 텍스트 찾기"""
    for p in passages:
        # <b>vocab_word</b> 뒤의 텍스트 찾기
        pattern = rf'<b>{re.escape(vocab_word)}</b>([^<]{{5,60}})'
        match = re.search(pattern, p)
        if match:
            text = match.group(1).strip()
            if len(text) > 50:
                text = text[:45]
            return text
    return None

changes_made = 0

for i in range(2, 41):
    unit_id = f"on_people2_{i:02d}"

    # 해당 유닛 찾기
    unit_start = content.find(f"{unit_id}:")
    if unit_start == -1:
        continue

    # 다음 유닛 시작점 찾기
    next_unit = content.find(f"on_people2_{i+1:02d}:", unit_start)
    if next_unit == -1:
        unit_content = content[unit_start:]
    else:
        unit_content = content[unit_start:next_unit]

    # passage 추출
    passage_match = re.search(r"passage:\s*\[(.*?)\]", unit_content, re.DOTALL)
    if not passage_match:
        continue
    passage_text = passage_match.group(1)

    # 각 문단 추출
    paragraphs = re.findall(r"'([^']+)'", passage_text)
    if not paragraphs:
        continue

    # vocab 추출 (첫 번째 vocab 단어)
    vocab_match = re.search(r"vocab:\s*\[\s*\['([^']+)'", unit_content)
    first_vocab = vocab_match.group(1) if vocab_match else None

    # explain 섹션 추출
    explain_match = re.search(r"explain:\s*\{([^}]+)\}", unit_content, re.DOTALL)
    if not explain_match:
        continue
    explain_text = explain_match.group(1)

    # q2 처리: "문단:" 형식인 경우
    q2_match = re.search(r"q2:\s*'([^']+)'", explain_text)
    if q2_match:
        current_q2 = q2_match.group(1)
        if '문단:' in current_q2 or '문단 :' in current_q2:
            # 2번째 문단에서 텍스트 찾기
            new_q2 = get_paragraph_start(paragraphs, 2)
            if new_q2:
                # explain 섹션 내의 q2만 변경
                pattern = re.compile(
                    rf"({unit_id}:.*?explain:\s*\{{[^}}]*?)q2:\s*'{re.escape(current_q2)}'",
                    re.DOTALL
                )
                if pattern.search(content):
                    content = pattern.sub(
                        rf"\1q2: '{new_q2}'",
                        content,
                        count=1
                    )
                    print(f"[{unit_id}] q2 변경: '{current_q2[:30]}...' → '{new_q2}'")
                    changes_made += 1

    # q3 처리: "어휘 —" 형식인 경우
    q3_match = re.search(r"q3:\s*'([^']+)'", explain_text)
    if q3_match:
        current_q3 = q3_match.group(1)
        if ' — ' in current_q3 or '—' in current_q3:
            # 어휘 단어 추출
            vocab_word = current_q3.split('—')[0].strip().split(' ')[0]
            new_q3 = get_vocab_context(paragraphs, vocab_word)
            if new_q3:
                pattern = re.compile(
                    rf"({unit_id}:.*?explain:\s*\{{[^}}]*?)q3:\s*'{re.escape(current_q3)}'",
                    re.DOTALL
                )
                if pattern.search(content):
                    content = pattern.sub(
                        rf"\1q3: '{new_q3}'",
                        content,
                        count=1
                    )
                    print(f"[{unit_id}] q3 변경: '{current_q3[:30]}...' → '{new_q3}'")
                    changes_made += 1
            else:
                print(f"[{unit_id}] q3 수동 확인 필요: '{vocab_word}' 컨텍스트 못 찾음")

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개 수정됨")
