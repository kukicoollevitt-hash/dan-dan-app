#!/usr/bin/env python3
"""
bio_content.js의 bio_07~20을 새 콘텐츠로 교체하는 스크립트
"""

import re

# 새 bio_07~10 콘텐츠 읽기
with open('bio_new_content.js', 'r', encoding='utf-8') as f:
    content_07_10 = f.read()

# 새 bio_11~15 콘텐츠 읽기
with open('bio_new_content_2.js', 'r', encoding='utf-8') as f:
    content_11_15 = f.read()

# 새 bio_16~20 콘텐츠 읽기
with open('bio_new_content_3.js', 'r', encoding='utf-8') as f:
    content_16_20 = f.read()

# 각 파일에서 객체 내용만 추출하는 함수
def extract_units(content, prefix='bio_'):
    """bio_XX: { ... } 형태의 단원 객체들 추출"""
    units = {}
    # 각 단원 시작 위치 찾기
    pattern = rf'({prefix}\d{{2}}):\s*\{{'
    matches = list(re.finditer(pattern, content))

    for i, match in enumerate(matches):
        unit_name = match.group(1)
        start = match.start()

        # 중괄호 매칭으로 끝 위치 찾기
        brace_count = 0
        in_string = False
        string_char = None
        pos = match.end() - 1  # '{' 위치

        while pos < len(content):
            char = content[pos]

            # 문자열 처리
            if char in ['"', "'", '`'] and (pos == 0 or content[pos-1] != '\\'):
                if not in_string:
                    in_string = True
                    string_char = char
                elif char == string_char:
                    in_string = False

            # 중괄호 카운트 (문자열 밖에서만)
            if not in_string:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        # 단원 끝 찾음
                        units[unit_name] = content[start:pos+1]
                        break
            pos += 1

    return units

# 각 파일에서 단원 추출
units_07_10 = extract_units(content_07_10)
units_11_15 = extract_units(content_11_15)
units_16_20 = extract_units(content_16_20)

print("추출된 단원들:")
print(f"07~10: {list(units_07_10.keys())}")
print(f"11~15: {list(units_11_15.keys())}")
print(f"16~20: {list(units_16_20.keys())}")

# 원본 bio_content.js 읽기
with open('public/BRAINUP/science/bio_content.js', 'r', encoding='utf-8') as f:
    bio_content = f.read()

# bio_07부터 마지막 단원까지 제거하고 새 내용으로 교체
# bio_06의 끝 위치 찾기
bio_06_pattern = r'(bio_06:\s*\{)'
bio_06_match = re.search(bio_06_pattern, bio_content)

if bio_06_match:
    # bio_06 객체의 끝 찾기
    start = bio_06_match.start()
    brace_count = 0
    in_string = False
    string_char = None
    pos = bio_06_match.end() - 1  # '{' 위치

    while pos < len(bio_content):
        char = bio_content[pos]

        if char in ['"', "'", '`'] and (pos == 0 or bio_content[pos-1] != '\\'):
            if not in_string:
                in_string = True
                string_char = char
            elif char == string_char:
                in_string = False

        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    bio_06_end = pos + 1
                    break
        pos += 1

    print(f"\nbio_06 끝 위치: {bio_06_end}")

# bio_07 시작 위치 찾기
bio_07_match = re.search(r'/\*.*?bio_07.*?\*/\s*bio_07:\s*\{', bio_content, re.DOTALL)
if not bio_07_match:
    bio_07_match = re.search(r'bio_07:\s*\{', bio_content)

if bio_07_match:
    bio_07_start = bio_07_match.start()
    # 바로 앞의 쉼표 포함
    if bio_content[bio_07_start-1] == ',':
        bio_07_start -= 1
    elif bio_content[bio_07_start-2:bio_07_start] == ',\n':
        bio_07_start -= 2
    print(f"bio_07 시작 위치: {bio_07_start}")

# 파일의 끝 (}); 찾기
end_match = re.search(r'\}\);\s*$', bio_content)
if end_match:
    file_end = end_match.start()
    print(f"파일 끝 위치: {file_end}")

# 새 콘텐츠 생성
all_units = {**units_07_10, **units_11_15, **units_16_20}
new_units_text = ""

for i in range(7, 21):
    unit_key = f"bio_{i:02d}"
    if unit_key in all_units:
        new_units_text += ",\n\n  " + all_units[unit_key]

# bio_06 이후부터 파일 끝까지 교체
new_content = bio_content[:bio_06_end] + new_units_text + "\n" + bio_content[file_end:]

# 저장
with open('public/BRAINUP/science/bio_content.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n✅ bio_content.js 업데이트 완료!")

# 검증
with open('public/BRAINUP/science/bio_content.js', 'r', encoding='utf-8') as f:
    verify = f.read()

for i in range(1, 21):
    unit = f"bio_{i:02d}"
    if f"{unit}:" in verify:
        # 제목 찾기
        title_match = re.search(rf"{unit}:.*?title:\s*['\"]([^'\"]+)['\"]", verify, re.DOTALL)
        if title_match:
            print(f"  {unit}: {title_match.group(1)}")
        else:
            print(f"  {unit}: 제목 찾기 실패")
    else:
        print(f"  {unit}: 없음")
