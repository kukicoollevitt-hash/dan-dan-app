#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
딥생물(deep_bio) 01~20번의 정답 분포 재배치 스크립트
"""

import re
import sys

# 새로운 정답 분포
NEW_ANSWERS = {
    'deep_bio_01': {'q1': '4', 'q2': '3', 'q3': '2', 'q4': '3'},
    'deep_bio_02': {'q1': '2', 'q2': '2', 'q3': '1', 'q4': '1'},
    'deep_bio_03': {'q1': '3', 'q2': '1', 'q3': '4', 'q4': '3'},
    'deep_bio_04': {'q1': '1', 'q2': '3', 'q3': '1', 'q4': '2'},
    'deep_bio_05': {'q1': '2', 'q2': '3', 'q3': '3', 'q4': '3'},
    'deep_bio_06': {'q1': '3', 'q2': '4', 'q3': '2', 'q4': '3'},
    'deep_bio_07': {'q1': '4', 'q2': '1', 'q3': '3', 'q4': '4'},
    'deep_bio_08': {'q1': '4', 'q2': '3', 'q3': '1', 'q4': '4'},
    'deep_bio_09': {'q1': '2', 'q2': '2', 'q3': '3', 'q4': '2'},
    'deep_bio_10': {'q1': '3', 'q2': '4', 'q3': '3', 'q4': '4'},
    'deep_bio_11': {'q1': '4', 'q2': '1', 'q3': '2', 'q4': '1'},
    'deep_bio_12': {'q1': '3', 'q2': '1', 'q3': '4', 'q4': '2'},
    'deep_bio_13': {'q1': '1', 'q2': '1', 'q3': '4', 'q4': '4'},
    'deep_bio_14': {'q1': '3', 'q2': '2', 'q3': '2', 'q4': '1'},
    'deep_bio_15': {'q1': '1', 'q2': '4', 'q3': '4', 'q4': '3'},
    'deep_bio_16': {'q1': '4', 'q2': '2', 'q3': '1', 'q4': '4'},
    'deep_bio_17': {'q1': '2', 'q2': '3', 'q3': '2', 'q4': '2'},
    'deep_bio_18': {'q1': '2', 'q2': '4', 'q3': '4', 'q4': '2'},
    'deep_bio_19': {'q1': '1', 'q2': '2', 'q3': '3', 'q4': '1'},
    'deep_bio_20': {'q1': '1', 'q2': '4', 'q3': '1', 'q4': '1'},
}

def extract_options(opts_text):
    """선지 텍스트를 파싱하여 리스트로 반환"""
    # q1_opts: [ 형태의 선지 추출
    opts = []
    lines = opts_text.strip().split('\n')
    current_opt = ''

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # 새로운 선지 시작 (① ~ ④로 시작)
        if re.match(r"^'[①②③④]", line):
            if current_opt:
                opts.append(current_opt)
            current_opt = line
        else:
            # 이전 선지에 이어지는 내용
            if current_opt:
                current_opt += '\n' + line

    # 마지막 선지 추가
    if current_opt:
        opts.append(current_opt)

    return opts

def rearrange_options(opts, old_answer, new_answer):
    """선지 순서를 재배치"""
    # 번호 매핑 (문자열 '1'~'4' -> 인덱스 0~3)
    old_idx = int(old_answer) - 1
    new_idx = int(new_answer) - 1

    if old_idx == new_idx:
        # 정답이 같으면 변경 없음
        return opts

    # 현재 정답인 선지를 찾아서 새 위치로 이동
    correct_opt = opts[old_idx]

    # 새로운 순서 생성
    new_opts = opts.copy()
    new_opts.pop(old_idx)  # 기존 정답 위치에서 제거
    new_opts.insert(new_idx, correct_opt)  # 새 정답 위치에 삽입

    # 번호 업데이트 (①②③④)
    markers = ['①', '②', '③', '④']
    for i, opt in enumerate(new_opts):
        # 기존 번호 제거하고 새 번호로 교체
        opt_text = re.sub(r"^'[①②③④]\s*", '', opt)
        new_opts[i] = f"'{markers[i]} {opt_text[1:]}" if opt_text.startswith("'") else f"'{markers[i]} " + opt_text

    return new_opts

def process_file(file_path):
    """파일을 읽어서 정답과 선지를 재배치"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 각 deep_bio 섹션 처리
    for unit_name, new_ans in NEW_ANSWERS.items():
        print(f"\n처리 중: {unit_name}")

        # 해당 유닛의 quiz 섹션 찾기
        pattern = rf"({unit_name}:.*?quiz:\s*\{{)(.*?)(answerKey:.*?\}})"
        match = re.search(pattern, content, re.DOTALL)

        if not match:
            print(f"  ⚠️  {unit_name}을 찾을 수 없습니다.")
            continue

        quiz_section = match.group(2)
        answer_section = match.group(3)

        # 현재 answerKey 추출
        curr_ans_match = re.search(r"answerKey:\s*\{\s*q1:'(\d)',\s*q2:'(\d)',\s*q3:'(\d)',\s*q4:'(\d)'\s*\}", answer_section)
        if not curr_ans_match:
            print(f"  ⚠️  {unit_name}의 answerKey를 찾을 수 없습니다.")
            continue

        current_answers = {
            'q1': curr_ans_match.group(1),
            'q2': curr_ans_match.group(2),
            'q3': curr_ans_match.group(3),
            'q4': curr_ans_match.group(4),
        }

        print(f"  현재 정답: {current_answers}")
        print(f"  새 정답: {new_ans}")

        # 각 문제(q1~q4)에 대해 선지 재배치
        modified_quiz = quiz_section

        for q_num in ['q1', 'q2', 'q3', 'q4']:
            old_ans = current_answers[q_num]
            new_ans_val = new_ans[q_num]

            if old_ans == new_ans_val:
                print(f"    {q_num}: 정답 변경 없음 ({old_ans})")
                continue

            # 해당 문제의 선지 추출
            opts_pattern = rf"({q_num}_opts:\s*\[)(.*?)(\],)"
            opts_match = re.search(opts_pattern, modified_quiz, re.DOTALL)

            if not opts_match:
                print(f"    ⚠️  {q_num}_opts를 찾을 수 없습니다.")
                continue

            opts_text = opts_match.group(2)
            opts = extract_options(opts_text)

            if len(opts) != 4:
                print(f"    ⚠️  {q_num}의 선지가 4개가 아닙니다. ({len(opts)}개)")
                continue

            # 선지 재배치
            new_opts = rearrange_options(opts, old_ans, new_ans_val)

            # 재배치된 선지를 텍스트로 변환
            new_opts_text = ',\n        '.join(new_opts)

            # quiz 섹션에서 선지 교체
            new_opts_section = f"{opts_match.group(1)}\n        {new_opts_text}\n      {opts_match.group(3)}"
            modified_quiz = modified_quiz[:opts_match.start()] + new_opts_section + modified_quiz[opts_match.end():]

            print(f"    {q_num}: {old_ans} → {new_ans_val} ✓")

        # answerKey 업데이트
        new_answer_key = f"answerKey: {{ q1:'{new_ans['q1']}', q2:'{new_ans['q2']}', q3:'{new_ans['q3']}', q4:'{new_ans['q4']}' }}"
        modified_answer_section = re.sub(
            r"answerKey:\s*\{[^}]+\}",
            new_answer_key,
            answer_section
        )

        # explain 섹션에서 정답 번호 업데이트
        # q1 explain 업데이트
        modified_answer_section = re.sub(
            r"(q1:\s*'[^']*?)(\d)(번[^']*?')",
            lambda m: f"{m.group(1)}{new_ans['q1']}{m.group(3)}",
            modified_answer_section
        )
        # q2 explain 업데이트
        modified_answer_section = re.sub(
            r"(q2:\s*'[^']*?)(\d)(번[^']*?')",
            lambda m: f"{m.group(1)}{new_ans['q2']}{m.group(3)}",
            modified_answer_section
        )
        # q3 explain 업데이트
        modified_answer_section = re.sub(
            r"(q3:\s*'[^']*?)(\d)(번[^']*?')",
            lambda m: f"{m.group(1)}{new_ans['q3']}{m.group(3)}",
            modified_answer_section
        )
        # q4 explain 업데이트
        modified_answer_section = re.sub(
            r"(q4:\s*'[^']*?)(\d)(번[^']*?')",
            lambda m: f"{m.group(1)}{new_ans['q4']}{m.group(3)}",
            modified_answer_section
        )

        # 전체 content에 반영
        full_replacement = match.group(1) + modified_quiz + modified_answer_section
        content = content[:match.start()] + full_replacement + content[match.end():]

        print(f"  ✅ {unit_name} 완료")

    # 파일 저장
    output_path = file_path.replace('.js', '_rearranged.js')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n✅ 모든 작업 완료!")
    print(f"결과 파일: {output_path}")

    return output_path

if __name__ == '__main__':
    file_path = '/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js'
    process_file(file_path)
