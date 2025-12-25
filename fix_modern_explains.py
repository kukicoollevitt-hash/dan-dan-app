#!/usr/bin/env python3
"""
on_modern_content.js의 explain 값들을 수정합니다.
- q3가 vocab 설명 형식(어휘 — 뜻)인 경우 본문에서 해당 어휘 뒤 텍스트로 수정
- 본문에 없는 explain을 본문에 있는 텍스트로 수정
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/korlit/on_modern_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 수정할 내용들 (q3 vocab 형식 -> 본문 텍스트)
# 각 단원의 q3 explain을 수정합니다.

# 먼저 모든 단원의 passage를 추출
units_passage = {}
for i in range(1, 41):
    unit_key = f'on_modern_{i:02d}'
    pattern = rf'{unit_key}:\s*\{{[^}}]*?passage:\s*\[(.*?)\]'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        passages = re.findall(r"'([^']*)'", match.group(1))
        passage_text = ' '.join(passages)
        passage_plain = re.sub(r'<[^>]+>', '', passage_text)
        units_passage[unit_key] = {
            'full': passage_text,
            'plain': passage_plain
        }

# q3가 "어휘 — 뜻" 형식인지 확인하고 수정할 목록 생성
fixes = []

# vocab 설명 형식 패턴: "단어 — 설명" 또는 "단어 — 설명 / 단어2 — 설명2"
vocab_pattern = re.compile(r'^.+\s*—\s*.+')

def find_word_context(word, passage_full, passage_plain):
    """passage에서 해당 어휘 뒤의 텍스트를 찾습니다."""
    # <b>word</b> 뒤의 텍스트를 찾음
    pattern = rf'<b>{re.escape(word)}</b>([^<]+)'
    match = re.search(pattern, passage_full)
    if match:
        after_text = match.group(1).strip()
        # 적절한 길이로 자름 (문장 끝까지 또는 20자 정도)
        if len(after_text) > 10:
            return after_text[:40].rstrip('.,!?') if len(after_text) > 40 else after_text

    # <b>태그 없이 단어가 있는 경우
    pattern2 = rf'{re.escape(word)}([가-힣\s]+)'
    match2 = re.search(pattern2, passage_plain)
    if match2:
        after_text = match2.group(1).strip()
        if len(after_text) > 10:
            return after_text[:40].rstrip('.,!?') if len(after_text) > 40 else after_text

    return None

# 각 단원 분석
for i in range(2, 41):  # 01은 이미 수정됨
    unit_key = f'on_modern_{i:02d}'

    if unit_key not in units_passage:
        continue

    passage = units_passage[unit_key]

    # explain 추출
    explain_pattern = rf'({unit_key}:\s*\{{.*?explain:\s*\{{[^}}]*q3:\s*[\'"])([^\'"]+)([\'"])'
    match = re.search(explain_pattern, content, re.DOTALL)

    if match:
        q3_value = match.group(2)

        # vocab 형식인지 확인
        if '—' in q3_value or vocab_pattern.match(q3_value):
            print(f"{unit_key}: q3 = '{q3_value[:50]}...' (vocab 형식)")

            # 첫 번째 어휘 추출
            first_word = q3_value.split('—')[0].strip()
            if '/' in first_word:
                first_word = first_word.split('/')[0].strip()

            # passage에서 해당 어휘 관련 텍스트 찾기
            # passage에서 <b>어휘</b> 다음에 오는 텍스트를 찾음
            b_pattern = rf'<b>[^<]*{re.escape(first_word)}[^<]*</b>([^<]+)'
            b_match = re.search(b_pattern, passage['full'])

            if b_match:
                new_text = b_match.group(1).strip()
                # 적절한 길이로 자름
                if '.' in new_text:
                    new_text = new_text.split('.')[0] + '.'
                elif len(new_text) > 40:
                    new_text = new_text[:40]

                fixes.append((unit_key, 'q3', q3_value, new_text))
                print(f"  -> 수정: '{new_text}'")
            else:
                print(f"  -> 본문에서 '{first_word}' 관련 텍스트 못찾음")

        # 본문에 없는 경우
        elif q3_value not in passage['plain']:
            print(f"{unit_key}: q3 본문에 없음 - '{q3_value[:50]}...'")

print(f"\n총 {len(fixes)}개 수정 예정")

# 실제 수정 적용
count = 0
for unit_key, q_name, old_val, new_val in fixes:
    # 정확한 문자열 치환
    old_pattern = f"q3: '{old_val}'"
    new_pattern = f"q3: '{new_val}'"

    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern, 1)
        count += 1
        print(f"✓ {unit_key} q3 수정완료")
    else:
        # 쌍따옴표로 시도
        old_pattern = f'q3: "{old_val}"'
        new_pattern = f'q3: "{new_val}"'
        if old_pattern in content:
            content = content.replace(old_pattern, new_pattern, 1)
            count += 1
            print(f"✓ {unit_key} q3 수정완료 (쌍따옴표)")
        else:
            print(f"✗ {unit_key} q3 수정실패")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n총 {count}개 수정 완료")
