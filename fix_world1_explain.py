#!/usr/bin/env python3
"""
on_world1_content.js의 explain 값들을 수정합니다.
1. "문단:" 접두사 제거
2. "어휘 — 설명" 형식 제거 (본문 텍스트로 대체)
"""

import re

filepath = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit/on_world1_content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 패턴 1: "N문단:" 접두사 제거
# q2: '1문단: 텍스트' -> q2: '텍스트' (첫 단어부터)
def remove_paragraph_prefix(match):
    prefix = match.group(1)  # q2: '
    text = match.group(2)    # N문단: ...
    suffix = match.group(3)  # '

    # "N문단: " 제거
    cleaned = re.sub(r'^\d문단:\s*', '', text)
    return prefix + cleaned + suffix

content = re.sub(
    r"(q2:\s*')(\d문단:\s*[^']+)(')",
    remove_paragraph_prefix,
    content
)

# 패턴 2: q3의 "어휘 — 설명" 형식을 간단한 텍스트로 변경
# 이 형식은 본문에 없으므로, 본문의 <b>태그</b> 뒤 텍스트로 수정해야 함
# 일단 슬래시(/)가 있는 경우 첫 번째 어휘만 남기기
def simplify_vocab_explain(match):
    prefix = match.group(1)  # q3: '
    text = match.group(2)    # 어휘 — 설명 / 어휘2 — 설명2
    suffix = match.group(3)  # '

    # "어휘 — 설명" 형식이면 어휘만 추출
    if ' — ' in text:
        # 첫 번째 어휘만 추출
        first_part = text.split(' / ')[0] if ' / ' in text else text
        vocab_word = first_part.split(' — ')[0].strip()
        # 본문에서 이 어휘 뒤의 텍스트를 찾을 수 없으므로 임시로 짧은 형태 사용
        return prefix + vocab_word + suffix

    return match.group(0)

content = re.sub(
    r"(q3:\s*')([^']+)(')",
    simplify_vocab_explain,
    content
)

# 저장
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("완료! q2에서 '문단:' 접두사 제거, q3에서 어휘 형식 간소화")
