#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
딥생물 정답 재배치 스크립트 - 간단 버전
deep_bio_04~20 처리
"""

import re

# 새로운 정답 분포 (04~20만)
NEW_ANSWERS = {
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

# 현재 정답 (grep 결과 기반)
CURRENT_ANSWERS = {
    'deep_bio_04': {'q1': '4', 'q2': '4', 'q3': '2', 'q4': '4'},
    'deep_bio_05': {'q1': '1', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_06': {'q1': '2', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_07': {'q1': '3', 'q2': '4', 'q3': '2', 'q4': '4'},
    'deep_bio_08': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_09': {'q1': '1', 'q2': '4', 'q3': '2', 'q4': '4'},
    'deep_bio_10': {'q1': '2', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_11': {'q1': '3', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_12': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_13': {'q1': '3', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_14': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_15': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_16': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_17': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_18': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_19': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
    'deep_bio_20': {'q1': '4', 'q2': '4', 'q3': '4', 'q4': '4'},
}

def rearrange_opts(opts_list, old_ans, new_ans):
    """선지 재배치"""
    if old_ans == new_ans:
        return opts_list

    old_idx = int(old_ans) - 1
    new_idx = int(new_ans) - 1

    # 정답 선지 추출
    correct_opt = opts_list[old_idx]

    # 나머지 선지들
    other_opts = [opt for i, opt in enumerate(opts_list) if i != old_idx]

    # 새 위치에 삽입
    other_opts.insert(new_idx, correct_opt)

    return other_opts

def main():
    file_path = '/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js'

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for unit_name in sorted(NEW_ANSWERS.keys()):
        new_ans = NEW_ANSWERS[unit_name]
        curr_ans = CURRENT_ANSWERS[unit_name]

        print(f"\n{'='*60}")
        print(f"처리 중: {unit_name}")
        print(f"현재 정답: {curr_ans}")
        print(f"새 정답: {new_ans}")

        # 각 문제(q1~q4) 처리
        for q_num in ['q1', 'q2', 'q3', 'q4']:
            old_a = curr_ans[q_num]
            new_a = new_ans[q_num]

            if old_a == new_a:
                print(f"  {q_num}: 변경 없음 ({old_a})")
                continue

            print(f"  {q_num}: {old_a} → {new_a}")

            # 해당 q의 opts 섹션 찾기
            # 패턴: q1_opts: [\n        '① ...',\n        '② ...',\n        '③ ...',\n        '④ ...'\n      ],
            pattern = rf"({q_num}_opts:\s*\[)(.*?)(\],)"
            match = re.search(pattern, content, re.DOTALL)

            if not match:
                print(f"    ⚠️  {q_num}_opts를 찾을 수 없습니다.")
                continue

            opts_section = match.group(2)

            # 선지 추출 (① ~ ④로 시작하는 라인)
            opts_raw = re.findall(r"'[①②③④].*?'(?=,\n|$)", opts_section, re.DOTALL)

            if len(opts_raw) != 4:
                print(f"    ⚠️  선지가 4개가 아닙니다: {len(opts_raw)}개")
                continue

            # 선지 재배치
            new_opts = rearrange_opts(opts_raw, old_a, new_a)

            # 번호 업데이트
            markers = ['①', '②', '③', '④']
            for i, opt in enumerate(new_opts):
                # 기존 번호 제거
                opt_content = re.sub(r"^'[①②③④]\s*", "'", opt)
                # 새 번호 추가
                new_opts[i] = f"'{markers[i]} {opt_content[1:]}"

            # 재배치된 선지로 교체
            new_opts_text = ',\n        '.join(new_opts)
            new_section = f"{match.group(1)}\n        {new_opts_text}\n      {match.group(3)}"

            content = content[:match.start()] + new_section + content[match.end():]

        # answerKey 업데이트
        old_key_pattern = rf"({unit_name}:.*?answerKey:\s*\{{\s*)q1:'{curr_ans['q1']}',\s*q2:'{curr_ans['q2']}',\s*q3:'{curr_ans['q3']}',\s*q4:'{curr_ans['q4']}'"
        new_key = f"q1:'{new_ans['q1']}', q2:'{new_ans['q2']}', q3:'{new_ans['q3']}', q4:'{new_ans['q4']}'"

        content = re.sub(old_key_pattern, rf"\1{new_key}", content, flags=re.DOTALL)

        # explain 섹션에서 정답 번호 업데이트
        # q1:' 다음에 나오는 번호 찾아서 변경
        for q_num in ['q1', 'q2', 'q3', 'q4']:
            old_a = curr_ans[q_num]
            new_a = new_ans[q_num]
            if old_a != new_a:
                # explain의 해당 q 부분에서 "X번" 패턴을 찾아서 교체
                pattern = rf"({unit_name}:.*?{q_num}:'[^']*?){old_a}(번[^']*?')"
                content = re.sub(pattern, rf"\1{new_a}\2", content, count=1, flags=re.DOTALL)

        print(f"  ✅ {unit_name} 완료")

    # 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n{'='*60}")
    print("✅ 모든 작업 완료!")

if __name__ == '__main__':
    main()
