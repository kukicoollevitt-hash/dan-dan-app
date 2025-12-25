#!/usr/bin/env python3
"""
on_world2_content.js의 q1, q4 explain 값을 자동으로 수정합니다.
passage에 없는 explain 값들을 passage에서 찾을 수 있는 텍스트로 변경합니다.

전략:
1. 현재 explain 값에서 핵심 키워드 추출
2. passage에서 해당 키워드를 포함하는 문장 찾기
3. <b>태그</b> 바로 뒤의 텍스트 우선 선택
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world2_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def extract_keywords(text, min_len=2):
    """텍스트에서 핵심 키워드 추출 (명사, 동사 등)"""
    # 불용어 제거
    stopwords = ['것', '수', '등', '이', '그', '저', '때', '더', '안', '못', '또', '및',
                 '하다', '되다', '있다', '없다', '이다', '아니다', '같다', '보다', '때문',
                 '그리고', '하지만', '그런데', '그래서', '그러나', '또한', '왜냐하면']

    # 한글 단어 추출 (2글자 이상)
    words = re.findall(r'[가-힣]{2,}', text)
    keywords = [w for w in words if w not in stopwords and len(w) >= min_len]
    return keywords[:5]  # 상위 5개만

def find_sentence_with_keyword(passage, keyword):
    """passage에서 키워드를 포함하는 문장/구절 찾기"""
    # passage를 문장 단위로 분리 (마침표, 물음표, 느낌표 기준)
    sentences = re.split(r'[.!?]', passage)

    for sentence in sentences:
        if keyword in sentence:
            # <b>태그</b> 제거한 텍스트에서 찾기
            clean_sentence = re.sub(r'<b>([^<]+)</b>', r'\1', sentence)
            clean_sentence = clean_sentence.strip()

            if len(clean_sentence) >= 15:
                # 적절한 길이로 자르기
                if len(clean_sentence) > 60:
                    # 키워드 주변 텍스트 추출
                    idx = clean_sentence.find(keyword)
                    start = max(0, idx - 15)
                    end = min(len(clean_sentence), idx + len(keyword) + 45)
                    clean_sentence = clean_sentence[start:end].strip()

                # passage 원본에서 이 텍스트가 있는지 확인
                if clean_sentence in passage:
                    return clean_sentence

    return None

def find_text_after_bold(passage, keyword):
    """<b>keyword</b> 뒤의 텍스트 찾기"""
    pattern = re.compile(rf'<b>[^<]*{re.escape(keyword[:2])}[^<]*</b>([^<]+)', re.IGNORECASE)
    match = pattern.search(passage)
    if match:
        after = match.group(1).strip()
        if len(after) >= 10 and after in passage:
            if len(after) > 50:
                after = after[:50]
            return after
    return None

changes_made = 0
failed_units = []

for i in range(1, 41):
    unit_id = f'on_world2_{i:02d}'

    unit_start = content.find(f'{unit_id}:')
    if unit_start == -1:
        continue

    next_unit = content.find(f'on_world2_{i+1:02d}:', unit_start)
    if next_unit == -1:
        unit_content = content[unit_start:]
    else:
        unit_content = content[unit_start:next_unit]

    # passage 추출
    passage_match = re.search(r'passage:\s*\[(.*?)\]', unit_content, re.DOTALL)
    if not passage_match:
        continue
    passage = passage_match.group(1)

    # explain 섹션 추출
    explain_match = re.search(r'explain:\s*\{([^}]+)\}', unit_content, re.DOTALL)
    if not explain_match:
        continue
    explain_text = explain_match.group(1)

    # q1, q4 처리
    for q in ['q1', 'q4']:
        q_match = re.search(rf"{q}:\s*'([^']+)'", explain_text)
        if not q_match:
            continue
        current_val = q_match.group(1)

        if current_val in passage:
            continue  # 이미 passage에 있음

        # 키워드 추출 및 새 텍스트 찾기
        keywords = extract_keywords(current_val)
        new_val = None

        for keyword in keywords:
            # 1. <b>태그</b> 뒤 텍스트 찾기
            new_val = find_text_after_bold(passage, keyword)
            if new_val and new_val in passage:
                break

            # 2. 키워드 포함 문장 찾기
            new_val = find_sentence_with_keyword(passage, keyword)
            if new_val and new_val in passage:
                break

        if new_val and new_val in passage and new_val != current_val:
            # 변경 적용
            pattern = re.compile(
                rf"({unit_id}:.*?explain:\s*\{{[^}}]*?){q}:\s*'{re.escape(current_val)}'",
                re.DOTALL
            )

            if pattern.search(content):
                content = pattern.sub(
                    rf"\g<1>{q}: '{new_val}'",
                    content,
                    count=1
                )
                print(f"[{unit_id}] {q} 변경: '{current_val[:30]}...' → '{new_val[:40]}...'")
                changes_made += 1
            else:
                failed_units.append((unit_id, q, current_val[:40]))
        else:
            failed_units.append((unit_id, q, current_val[:40]))

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n완료! 총 {changes_made}개 수정됨")

if failed_units:
    print(f"\n수동 확인 필요 ({len(failed_units)}개):")
    for unit_id, q, val in failed_units:
        print(f"  {unit_id} {q}: {val}...")
