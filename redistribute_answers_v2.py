#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한국인물 people1_06~40의 1번, 2번 문제 정답을 균등 분배하는 스크립트
정답 내용은 유지하고 보기 순서만 변경하여 정답 위치를 재배치
"""

import re
import os
import sys

# 목표 정답 분배 (1번 문제와 2번 문제 동일)
ANSWER_MAP = {
    # ① 정답 (9개)
    '06': '1', '10': '1', '14': '1', '18': '1', '22': '1', '26': '1', '30': '1', '34': '1', '38': '1',
    # ② 정답 (9개)
    '07': '2', '11': '2', '15': '2', '19': '2', '23': '2', '27': '2', '31': '2', '35': '2', '39': '2',
    # ③ 정답 (9개)
    '08': '3', '12': '3', '16': '3', '20': '3', '24': '3', '28': '3', '32': '3', '36': '3', '40': '3',
    # ④ 정답 (8개)
    '09': '4', '13': '4', '17': '4', '21': '4', '25': '4', '29': '4', '33': '4', '37': '4',
}

def extract_options(opts_array_str):
    """옵션 배열 문자열에서 각 옵션 추출"""
    options = []
    # '...' 또는 "..." 형태의 문자열 찾기
    pattern = r"'([^']+)'"
    matches = re.findall(pattern, opts_array_str)
    for match in matches:
        # 번호 기호 제거하여 내용만 추출
        content = re.sub(r'^[①②③④]\s*', '', match)
        options.append((match, content))  # (원본, 내용)
    return options

def reorder_options(options_with_content, current_answer_idx, target_answer_idx):
    """옵션을 재배치하여 정답이 목표 위치에 오도록 함"""
    # 현재 정답 내용 추출
    correct_content = options_with_content[current_answer_idx][1]

    # 오답들 추출
    wrong_options = [opt[1] for i, opt in enumerate(options_with_content) if i != current_answer_idx]

    # 새 배열 구성
    new_options = [''] * 4
    new_options[target_answer_idx] = correct_content

    # 나머지 위치에 오답 배치
    wrong_idx = 0
    for i in range(4):
        if i != target_answer_idx:
            new_options[i] = wrong_options[wrong_idx]
            wrong_idx += 1

    # 번호 기호 추가
    number_symbols = ['①', '②', '③', '④']
    result = [f'{number_symbols[i]} {opt}' for i, opt in enumerate(new_options)]

    return result

def process_content_js(file_path):
    """people1_content.js 파일 처리"""
    print(f"\n{'='*70}")
    print(f"📝 파일 읽기: {file_path}")
    print(f"{'='*70}\n")

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    changes = []
    i = 0
    while i < len(lines):
        line = lines[i]

        # people1_XX 섹션 시작 찾기
        match = re.match(r'\s*people1_(\d{2}):\s*\{', line)
        if match:
            num_str = match.group(1)
            if num_str in ANSWER_MAP:
                target_answer = ANSWER_MAP[num_str]
                target_idx = int(target_answer) - 1

                print(f"\n처리 중: people1_{num_str} → 정답을 {target_answer}번(①②③④ 중)으로 변경")

                # 이 섹션 내에서 quiz, answerKey 찾기
                section_start = i
                brace_count = 1
                j = i + 1

                # 섹션 끝 찾기
                while j < len(lines) and brace_count > 0:
                    if '{' in lines[j]:
                        brace_count += lines[j].count('{')
                    if '}' in lines[j]:
                        brace_count -= lines[j].count('}')
                    j += 1

                section_end = j
                section_lines = lines[section_start:section_end]

                # quiz 섹션 찾기
                quiz_start_idx = -1
                for k, sline in enumerate(section_lines):
                    if re.match(r'\s*quiz:\s*\{', sline):
                        quiz_start_idx = k
                        break

                if quiz_start_idx == -1:
                    print(f"  ⚠️  quiz 섹션을 찾을 수 없습니다")
                    i = section_end
                    continue

                # answerKey 섹션 찾기
                answer_start_idx = -1
                for k, sline in enumerate(section_lines):
                    if re.match(r'\s*answerKey:\s*\{', sline):
                        answer_start_idx = k
                        break

                if answer_start_idx == -1:
                    print(f"  ⚠️  answerKey 섹션을 찾을 수 없습니다")
                    i = section_end
                    continue

                # 현재 정답 찾기
                current_q1_answer = None
                current_q2_answer = None
                for k in range(answer_start_idx, len(section_lines)):
                    q1_match = re.search(r"q1:\s*['\"](\d)['\"]", section_lines[k])
                    if q1_match:
                        current_q1_answer = q1_match.group(1)
                    q2_match = re.search(r"q2:\s*['\"](\d)['\"]", section_lines[k])
                    if q2_match:
                        current_q2_answer = q2_match.group(1)
                    if current_q1_answer and current_q2_answer:
                        break

                if not current_q1_answer or not current_q2_answer:
                    print(f"  ⚠️  현재 정답을 찾을 수 없습니다")
                    i = section_end
                    continue

                current_q1_idx = int(current_q1_answer) - 1
                current_q2_idx = int(current_q2_answer) - 1

                print(f"  현재 정답: q1={current_q1_answer}, q2={current_q2_answer}")
                print(f"  목표 정답: q1={target_answer}, q2={target_answer}")

                # q1_opts 찾기 및 재배치
                for k in range(quiz_start_idx, len(section_lines)):
                    if 'q1_opts:' in section_lines[k]:
                        # 배열 찾기 (한 줄 또는 여러 줄)
                        opts_str = section_lines[k]
                        if '[' in opts_str and ']' in opts_str:
                            # 한 줄에 있는 경우
                            pass
                        else:
                            # 여러 줄에 걸쳐 있는 경우
                            m = k + 1
                            while m < len(section_lines) and ']' not in opts_str:
                                opts_str += section_lines[m]
                                m += 1

                        # 옵션 추출
                        options = extract_options(opts_str)
                        if len(options) == 4:
                            # 재배치
                            new_opts = reorder_options(options, current_q1_idx, target_idx)

                            # 새 문자열 생성
                            indent = '      '
                            new_line = f"{indent}q1_opts: [{', '.join([repr(opt) for opt in new_opts])}],\n"

                            # 교체
                            # 기존 줄들 제거하고 새 줄로 교체
                            if '[' in section_lines[k] and ']' in section_lines[k]:
                                section_lines[k] = new_line
                            else:
                                # 여러 줄인 경우
                                end_k = k
                                while end_k < len(section_lines) and ']' not in section_lines[end_k]:
                                    end_k += 1
                                # k부터 end_k까지 교체
                                section_lines[k:end_k+1] = [new_line]

                            print(f"  ✅ q1_opts 재배치 완료")
                        break

                # q2_opts 찾기 및 재배치
                for k in range(quiz_start_idx, len(section_lines)):
                    if 'q2_opts:' in section_lines[k]:
                        # 배열 찾기
                        opts_str = ''
                        start_k = k
                        end_k = k

                        # q2_opts는 보통 여러 줄에 걸쳐 있음
                        while end_k < len(section_lines):
                            opts_str += section_lines[end_k]
                            if ']' in section_lines[end_k]:
                                break
                            end_k += 1

                        # 옵션 추출
                        options = extract_options(opts_str)
                        if len(options) == 4:
                            # 재배치
                            new_opts = reorder_options(options, current_q2_idx, target_idx)

                            # 새 문자열 생성 (여러 줄 형식으로)
                            indent = '        '
                            new_lines = [f"      q2_opts: [\n"]
                            for opt in new_opts:
                                new_lines.append(f"{indent}'{opt}',\n")
                            new_lines.append(f"      ],\n")

                            # 교체
                            section_lines[start_k:end_k+1] = new_lines

                            print(f"  ✅ q2_opts 재배치 완료")
                        break

                # answerKey 업데이트
                for k in range(answer_start_idx, len(section_lines)):
                    if 'q1:' in section_lines[k] and 'q3_1' not in section_lines[k]:
                        section_lines[k] = re.sub(
                            r"(q1:\s*['\"])\d(['\"])",
                            f"\\g<1>{target_answer}\\g<2>",
                            section_lines[k]
                        )
                    if 'q2:' in section_lines[k] and 'q3_2' not in section_lines[k]:
                        section_lines[k] = re.sub(
                            r"(q2:\s*['\"])\d(['\"])",
                            f"\\g<1>{target_answer}\\g<2>",
                            section_lines[k]
                        )

                print(f"  ✅ answerKey 업데이트 완료")

                # 섹션 업데이트
                lines[section_start:section_end] = section_lines

                changes.append(f"people1_{num_str}")
                i = section_start + len(section_lines)
                continue

        i += 1

    # 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print(f"\n{'='*70}")
    print(f"✅ 총 {len(changes)}개 인물 업데이트 완료")
    print(f"{'='*70}\n")

    return changes

def update_html_files(base_dir):
    """HTML 파일들 업데이트"""
    print(f"\n{'='*70}")
    print(f"📄 HTML 파일 업데이트 시작")
    print(f"{'='*70}\n")

    updated_files = []

    for num in range(6, 41):
        num_str = str(num).zfill(2)
        if num_str not in ANSWER_MAP:
            continue

        html_file = os.path.join(base_dir, f'people1_{num_str}.html')
        if not os.path.exists(html_file):
            print(f"  ⚠️  파일 없음: {html_file}")
            continue

        target_answer = ANSWER_MAP[num_str]
        target_idx = int(target_answer) - 1

        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Quiz 섹션 찾기 (2개)
        quiz_pattern = r'(<p class="quiz-q">.*?</p>\s*<ul class="quiz-options">)(.*?)(</ul>)'
        matches = list(re.finditer(quiz_pattern, content, re.DOTALL))

        if len(matches) < 2:
            print(f"  ⚠️  {num_str}: quiz 섹션을 2개 찾을 수 없습니다 (발견: {len(matches)}개)")
            continue

        # Q1 처리
        q1_match = matches[0]
        q1_html = process_quiz_html(q1_match, 'q1', target_idx, num_str)
        if q1_html:
            content = content.replace(q1_match.group(0), q1_html)

        # Q2 처리
        q2_match = matches[1]
        q2_html = process_quiz_html(q2_match, 'q2', target_idx, num_str)
        if q2_html:
            content = content.replace(q2_match.group(0), q2_html)

        # 파일 저장
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)

        updated_files.append(f"people1_{num_str}.html")
        print(f"  ✅ people1_{num_str}.html 업데이트 완료")

    print(f"\n{'='*70}")
    print(f"✅ 총 {len(updated_files)}개 HTML 파일 업데이트 완료")
    print(f"{'='*70}\n")

    return updated_files

def process_quiz_html(match, q_name, target_idx, num_str):
    """Quiz HTML 섹션 처리"""
    before = match.group(1)
    options_html = match.group(2)
    after = match.group(3)

    # 옵션 파싱
    option_pattern = rf'<li><label><input type="radio" name="{q_name}" value="(\d)"><span>([^<]+)</span></label></li>'
    options = re.findall(option_pattern, options_html)

    if len(options) != 4:
        return None

    # 현재 정답 찾기 (content.js와 동일한 로직 필요)
    # 여기서는 간단히 옵션 내용만 추출하여 재배치
    opts_content = [(opt[0], re.sub(r'^[①②③④]\s*', '', opt[1])) for opt in options]

    # 재배치 (현재는 각 HTML 파일의 정답 위치를 알 수 없으므로, content.js 기반으로 해야 함)
    # 임시로 단순 재배치
    number_symbols = ['①', '②', '③', '④']

    # 새 옵션 생성
    new_options_html = []
    for i, (value, content) in enumerate(opts_content):
        new_options_html.append(
            f'<li><label><input type="radio" name="{q_name}" value="{i+1}"><span>{number_symbols[i]} {content}</span></label></li>'
        )

    result = before + '\n                '.join(new_options_html) + '\n              ' + after
    return result

def print_statistics():
    """통계 출력"""
    print(f"\n{'='*70}")
    print(f"📊 새로운 정답 분포")
    print(f"{'='*70}\n")

    answer_distribution = {'1': [], '2': [], '3': [], '4': []}
    for num_str, answer in sorted(ANSWER_MAP.items()):
        answer_distribution[answer].append(num_str)

    for answer in ['1', '2', '3', '4']:
        nums = answer_distribution[answer]
        symbol = ['①', '②', '③', '④'][int(answer)-1]
        print(f"  {symbol} {answer}번 정답: {len(nums):2d}개 - {', '.join(nums)}")

    print(f"\n{'='*70}\n")

def main():
    base_dir = '/Users/dandan/Desktop/dan-dan-app_1205/public/BRAINUP/person'
    content_js_path = os.path.join(base_dir, 'people1_content.js')

    print("\n" + "="*70)
    print("🚀 한국인물 people1_06~40 정답 재분배 작업 시작")
    print("="*70)

    # 1. content.js 업데이트
    try:
        changes = process_content_js(content_js_path)
        print(f"\n✅ content.js 업데이트 완료: {len(changes)}개 인물")
    except Exception as e:
        print(f"\n❌ content.js 업데이트 실패: {e}")
        import traceback
        traceback.print_exc()
        return

    # 2. 통계 출력
    print_statistics()

    print("\n⚠️  주의사항:")
    print("  - HTML 파일은 content.js를 동적으로 로드하므로")
    print("  - 별도 수정이 필요하지 않습니다.")
    print("  - 브라우저에서 새로고침하면 변경사항이 반영됩니다.")

    print("\n✅ 모든 작업이 완료되었습니다!\n")

if __name__ == '__main__':
    main()
