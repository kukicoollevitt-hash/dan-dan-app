#!/usr/bin/env python3
"""
on_law_content.js의 explain 값을 수정합니다.
<b>태그</b> 이후의 텍스트를 사용하여 하이라이트가 정상 작동하도록 합니다.
"""

import re

with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social/on_law_content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 수정할 explain 값들 (본문에 존재하는 텍스트만 사용)
# <b>태그</b> 바로 뒤의 텍스트를 사용
fixes = {
    'on_law_02': {
        'q3': '에 따라 삶의 모습이 크게 달랐어요.',  # <b>신분</b>에 따라
        'q4': '까지 심하게 훼손되었어요.'  # <b>존엄성</b>까지
    },
    'on_law_03': {
        'q2': '을 지키기 위해 힘쓴 사람들이 많아요.',  # <b>인권</b>을 지키기 위해
        'q3': '의 문제를 보여줘요.'  # <b>차별</b>의 문제를
    },
    'on_law_04': {
        'q1': '과 차별에서 비롯된 학교 폭력이라고 합니다.',  # <b>편견</b>과 <b>차별</b>에서
        'q2': '침해도 여전히 존재합니다.',  # 인권 침해도
        'q3': '에서 비롯된 학교 폭력이라고 합니다.'  # <b>차별</b>에서
    },
    'on_law_05': {
        'q3': ', 임금이 행차할 때 징이나 꽹과리를 쳐'  # <b>상언</b>, 임금이...
    },
    'on_law_06': {
        'q3': '이에요. 헌법은 나라를 운영하는 기본 원칙과'  # <b>헌법</b>이에요
    },
    'on_law_07': {
        'q2': '이라고 해요.',  # 입법 과정<이라고 해요>
        'q3': '예요. 국회는 국민이 직접 뽑은',  # <b>국회</b>예요
        'q4': '의 핵심이에요.'  # 대의 민주주의<의 핵심>
    },
    'on_law_08': {
        'q3': '입니다. 법원은 법에 따라 분쟁을 해결하고'  # <b>법원</b>입니다
    },
    'on_law_09': {
        'q1': '의 목적이 있어요.',  # 응보<의 목적>
        'q3': '가 되고, 범죄를 저지른 사람은 법에 따라'  # <b>범죄</b>가 되고
    },
    'on_law_10': {
        'q2': '에 가거나 보호 처분을 받게 되어요.',  # <b>소년원</b>에 가거나
        'q3': '은 청소년에게 해로운 환경으로부터 보호하기 위한 법이에요.'  # <b>청소년 보호법</b>은
    },
    'on_law_11': {
        'q3': '와 의무를 약속하는 것을 말합니다.',  # <b>권리</b>와 <b>의무</b>를
        'q4': '으로 소비자의 권리를 보호합니다.'  # <b>소비자기본법</b>으로
    },
    'on_law_12': {
        'q1': '라고 합니다.',  # 불법 행위<라고 합니다>
        'q3': '을 해야 해요.'  # <b>손해 배상</b>을 해야
    },
    'on_law_13': {
        'q3': '할 의무가 있어요.',  # <b>부양</b>할 의무가
        'q4': '이라고 해요.'  # <b>친권</b>이라고 해요
    },
    'on_law_14': {
        'q2': '은 근로자를 위한 최소한의 기준을 정하고 있어요.',  # <b>근로기준법</b>은
        'q3': '을 받아요.'  # <b>임금</b>을 받아요
    },
    'on_law_15': {
        'q3': '이라고 합니다.'  # 국제법<이라고 합니다>
    },
    'on_law_16': {
        'q3': '이 심각해졌어요.'  # <b>환경 오염</b>이 심각해
    },
    'on_law_17': {
        'q3': '이라고 합니다.'  # 지식재산권<이라고 합니다>
    },
    'on_law_18': {
        'q3': '되면 보이스피싱이나'  # <b>유출</b>되면
    },
    'on_law_19': {
        'q3': '은 중립적인 제3자가 양측의 의견을 듣고'  # <b>조정</b>은
    },
    'on_law_20': {
        'q3': '란 개인의 마음대로가 아니라 법에 따라'  # <b>법치주의</b>란
    }
}

# 각 단원별로 수정
modified_count = 0

for unit_key, unit_fixes in fixes.items():
    # passage 추출하여 검증
    pattern = rf"{unit_key}:[^}}]*?passage:\s*\[([\s\S]*?)\]"
    match = re.search(pattern, content)
    if not match:
        print(f"{unit_key}: passage 없음")
        continue

    passage_raw = match.group(1)
    passages = re.findall(r"'([^']*?)'", passage_raw)
    passage_text = ' '.join(passages)
    passage_plain = re.sub(r'<[^>]+>', '', passage_text)

    for q, new_val in unit_fixes.items():
        # 본문에 존재하는지 확인
        if new_val not in passage_plain:
            print(f"{unit_key} {q}: ✗ 본문에 없음: '{new_val[:40]}...'")
            continue

        # explain 블록에서 해당 q 값 교체
        # 패턴: on_law_XX: { ... explain: { ... qN: '...' ... } }
        explain_pattern = rf"({unit_key}:[\s\S]*?explain:\s*\{{[\s\S]*?{q}:\s*['\"])([^'\"]+)(['\"])"

        def replace_explain(m):
            return m.group(1) + new_val + m.group(3)

        new_content = re.sub(explain_pattern, replace_explain, content, count=1)

        if new_content != content:
            content = new_content
            modified_count += 1
            print(f"{unit_key} {q}: ✓ 수정 완료 → '{new_val[:30]}...'")
        else:
            print(f"{unit_key} {q}: 패턴 매칭 실패")

# 파일 저장
with open('/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social/on_law_content.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n총 {modified_count}개 수정 완료")
