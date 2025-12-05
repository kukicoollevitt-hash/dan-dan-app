#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한국인물 people1_06~40의 1번, 2번 문제 정답을 균등 분배하는 스크립트
"""

import re
import os

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

def update_content_js(file_path):
    """people1_content.js 파일 업데이트"""
    print(f"\n{'='*60}")
    print(f"📝 업데이트 중: {file_path}")
    print(f"{'='*60}\n")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    changes = []

    for num in range(6, 41):
        num_str = str(num).zfill(2)
        target_answer = ANSWER_MAP[num_str]

        # people1_XX 섹션 찾기
        pattern = rf'(people1_{num_str}:\s*\{{.*?)(quiz:\s*\{{)(.*?)(answerKey:\s*\{{.*?q1:\s*[\'"])\d([\'"].*?q2:\s*[\'"])\d([\'"])'

        def replace_quiz(match):
            before_quiz = match.group(1)
            quiz_start = match.group(2)
            quiz_content = match.group(3)
            answer_q1_before = match.group(4)
            answer_q1_after = match.group(5)
            answer_q2_before = match.group(6)

            # quiz 섹션에서 q1_opts와 q2_opts 찾아서 재정렬
            new_quiz_content = quiz_content

            # q1_opts 재정렬
            q1_opts_pattern = r"(q1_opts:\s*\[)([^\]]+)(\])"
            q1_match = re.search(q1_opts_pattern, quiz_content)
            if q1_match:
                opts_str = q1_match.group(2)
                # 각 옵션을 파싱
                opts_list = re.findall(r"'([^']+)'", opts_str)
                if len(opts_list) == 4:
                    # 현재 정답 찾기 (③ 패턴 찾기)
                    correct_opt = None
                    correct_idx = -1
                    for i, opt in enumerate(opts_list):
                        # 옵션에서 번호 제거한 내용
                        opt_content = re.sub(r'^[①②③④]\s*', '', opt)
                        # 현재 어느 위치에 있는지 확인
                        if i == int(target_answer) - 1:
                            # 이 위치에 와야 할 정답이 이미 여기 있는지 확인할 필요 없음
                            # 대신 모든 옵션에서 정답 내용 찾기
                            pass

                    # 기존 옵션들에서 번호 제거
                    clean_opts = [re.sub(r'^[①②③④]\s*', '', opt) for opt in opts_list]

                    # 새로운 순서로 재배치 (정답이 target_answer 위치에 오도록)
                    # 먼저 현재 정답 위치 찾기 (content.js에서 answerKey 확인 필요하지만, 여기서는 임시로 처리)
                    # 실제로는 각 파일을 개별적으로 처리해야 함

                    new_opts = clean_opts[:]  # 일단 복사

                    # 새로운 번호 부여
                    number_symbols = ['①', '②', '③', '④']
                    new_opts_formatted = [f'{number_symbols[i]} {opt}' for i, opt in enumerate(new_opts)]

                    new_opts_str = ', '.join([f"'{opt}'" for opt in new_opts_formatted])
                    new_quiz_content = new_quiz_content.replace(
                        q1_match.group(0),
                        f"{q1_match.group(1)}{new_opts_str}{q1_match.group(3)}"
                    )

            # answerKey 업데이트
            result = before_quiz + quiz_start + new_quiz_content + answer_q1_before + target_answer + answer_q1_after + target_answer + "'"
            return result

        # 더 나은 접근: 각 people1_XX 블록을 개별적으로 처리
        unit_pattern = rf'(people1_{num_str}:\s*\{{)(.*?)(\n\s*\}},?\n\s*(?://.*?\n\s*)?people1_\d{{2}}:|\n\s*\}}\s*\}};?\s*$)'

        def process_unit(match):
            unit_start = match.group(1)
            unit_content = match.group(2)
            unit_end = match.group(3)

            # quiz 섹션 찾기
            quiz_pattern = r'(quiz:\s*\{)(.*?)(\n\s*\},)'
            quiz_match = re.search(quiz_pattern, unit_content, re.DOTALL)
            if not quiz_match:
                return match.group(0)

            quiz_content = quiz_match.group(2)

            # q1_opts 파싱
            q1_opts_match = re.search(r"q1_opts:\s*\[(.*?)\]", quiz_content, re.DOTALL)
            if not q1_opts_match:
                return match.group(0)

            q1_opts_str = q1_opts_match.group(1)
            q1_opts = [opt.strip().strip("'\"") for opt in re.findall(r"'([^']*)'", q1_opts_str)]

            if len(q1_opts) != 4:
                return match.group(0)

            # 현재 정답 위치 찾기 (answerKey에서)
            answer_match = re.search(r"q1:\s*['\"](\d)['\"]", unit_content)
            if not answer_match:
                return match.group(0)

            current_answer_idx = int(answer_match.group(1)) - 1
            target_answer_idx = int(target_answer) - 1

            # 정답 내용 추출 (번호 제거)
            correct_content = re.sub(r'^[①②③④]\s*', '', q1_opts[current_answer_idx])

            # 다른 옵션들 추출
            other_opts = [re.sub(r'^[①②③④]\s*', '', q1_opts[i]) for i in range(4) if i != current_answer_idx]

            # 새 배열 구성
            new_q1_opts = [''] * 4
            new_q1_opts[target_answer_idx] = correct_content

            # 나머지 위치에 다른 옵션 배치
            other_idx = 0
            for i in range(4):
                if i != target_answer_idx:
                    new_q1_opts[i] = other_opts[other_idx]
                    other_idx += 1

            # 번호 추가
            number_symbols = ['①', '②', '③', '④']
            new_q1_opts_formatted = [f'{number_symbols[i]} {opt}' for i, opt in enumerate(new_q1_opts)]

            # q2_opts도 동일하게 처리
            q2_opts_match = re.search(r"q2_opts:\s*\[(.*?)\]", quiz_content, re.DOTALL)
            new_q2_opts_formatted = None

            if q2_opts_match:
                q2_opts_str = q2_opts_match.group(1)
                q2_opts = [opt.strip().strip("'\"") for opt in re.findall(r"'([^']*)'", q2_opts_str)]

                if len(q2_opts) == 4:
                    # q2 현재 정답 위치
                    answer2_match = re.search(r"q2:\s*['\"](\d)['\"]", unit_content)
                    if answer2_match:
                        current_answer2_idx = int(answer2_match.group(1)) - 1

                        # q2 정답 내용 추출
                        correct_content2 = re.sub(r'^[①②③④]\s*', '', q2_opts[current_answer2_idx])
                        other_opts2 = [re.sub(r'^[①②③④]\s*', '', q2_opts[i]) for i in range(4) if i != current_answer2_idx]

                        new_q2_opts = [''] * 4
                        new_q2_opts[target_answer_idx] = correct_content2

                        other_idx2 = 0
                        for i in range(4):
                            if i != target_answer_idx:
                                new_q2_opts[i] = other_opts2[other_idx2]
                                other_idx2 += 1

                        new_q2_opts_formatted = [f'{number_symbols[i]} {opt}' for i, opt in enumerate(new_q2_opts)]

            # quiz_content 업데이트
            new_quiz_content = quiz_content

            # q1_opts 교체
            new_q1_str = ',\\n        '.join([f"'{opt}'" for opt in new_q1_opts_formatted])
            new_quiz_content = re.sub(
                r"(q1_opts:\s*\[).*?(\])",
                f"\\1{new_q1_str}\\2",
                new_quiz_content,
                flags=re.DOTALL
            )

            # q2_opts 교체
            if new_q2_opts_formatted:
                new_q2_str = ',\\n        '.join([f"'{opt}'" for opt in new_q2_opts_formatted])
                new_quiz_content = re.sub(
                    r"(q2_opts:\s*\[).*?(\])",
                    f"\\1{new_q2_str}\\2",
                    new_quiz_content,
                    flags=re.DOTALL
                )

            # unit_content에서 quiz 교체
            new_unit_content = unit_content.replace(quiz_match.group(0), quiz_match.group(1) + new_quiz_content + quiz_match.group(3))

            # answerKey 업데이트
            new_unit_content = re.sub(
                r"(answerKey:\s*\{.*?q1:\s*['\"])\d",
                f"\\g<1>{target_answer}",
                new_unit_content,
                flags=re.DOTALL
            )
            new_unit_content = re.sub(
                r"(q2:\s*['\"])\d",
                f"\\g<1>{target_answer}",
                new_unit_content
            )

            changes.append(f"  people1_{num_str}: q1={target_answer}, q2={target_answer}")

            return unit_start + new_unit_content + unit_end

        content = re.sub(unit_pattern, process_unit, content, flags=re.DOTALL)

    # 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ content.js 업데이트 완료:")
    for change in changes:
        print(change)

    return len(changes)

def update_html_file(file_path, num_str):
    """개별 HTML 파일 업데이트"""
    target_answer = ANSWER_MAP[num_str]

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Q1 섹션 찾기
    q1_pattern = r'(<div class="quiz-item"[^>]*>.*?<p class="quiz-q">.*?</p>\s*<ul class="quiz-options">)(.*?)(</ul>)'

    matches = list(re.finditer(q1_pattern, content, re.DOTALL))

    if len(matches) < 2:
        print(f"  ⚠️  {file_path}: quiz 섹션을 찾을 수 없습니다")
        return False

    # 첫 번째 quiz (Q1) 처리
    q1_match = matches[0]
    q1_options_html = q1_match.group(2)

    # 옵션 파싱
    option_pattern = r'<li><label><input type="radio" name="q1" value="(\d)"><span>([^<]+)</span></label></li>'
    q1_options = re.findall(option_pattern, q1_options_html)

    if len(q1_options) == 4:
        # 현재 옵션들에서 정답 찾기 (실제로는 content.js와 매칭해야 하지만, 여기서는 간단히 처리)
        # 각 옵션의 내용만 추출
        opts_content = [re.sub(r'^[①②③④]\s*', '', opt[1]) for opt in q1_options]

        # 임시: 정답이 몇 번째 옵션인지 찾기 위해 value 확인 (실제로는 다른 로직 필요)
        # 여기서는 간단히 옵션 순서 재배치

        # 새로운 옵션 HTML 생성
        number_symbols = ['①', '②', '③', '④']
        new_options_html = []

        # 재배치 로직은 content.js와 동일하게 해야 함
        # 임시로 옵션 순서만 변경
        for i in range(4):
            new_options_html.append(
                f'<li><label><input type="radio" name="q1" value="{i+1}"><span>{number_symbols[i]} {opts_content[i]}</span></label></li>'
            )

        new_q1_html = q1_match.group(1) + '\n                '.join(new_options_html) + '\n              ' + q1_match.group(3)
        content = content.replace(q1_match.group(0), new_q1_html)

    # 두 번째 quiz (Q2) 처리
    if len(matches) >= 2:
        q2_match = matches[1]
        q2_options_html = q2_match.group(2)

        option_pattern2 = r'<li><label><input type="radio" name="q2" value="(\d)"><span>([^<]+)</span></label></li>'
        q2_options = re.findall(option_pattern2, q2_options_html)

        if len(q2_options) == 4:
            opts_content2 = [re.sub(r'^[①②③④]\s*', '', opt[1]) for opt in q2_options]

            new_options_html2 = []
            for i in range(4):
                new_options_html2.append(
                    f'<li><label><input type="radio" name="q2" value="{i+1}"><span>{number_symbols[i]} {opts_content2[i]}</span></label></li>'
                )

            new_q2_html = q2_match.group(1) + '\n                '.join(new_options_html2) + '\n              ' + q2_match.group(3)
            content = content.replace(q2_match.group(0), new_q2_html)

    # 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def main():
    base_dir = '/Users/dandan/Desktop/dan-dan-app_1205/public/BRAINUP/person'
    content_js_path = os.path.join(base_dir, 'people1_content.js')

    print("\n" + "="*60)
    print("🚀 한국인물 people1 정답 재분배 작업 시작")
    print("="*60)

    # 1. content.js 업데이트
    changes_count = update_content_js(content_js_path)

    print(f"\n{'='*60}")
    print(f"📊 업데이트 완료: {changes_count}개 인물")
    print(f"{'='*60}\n")

    # 통계 출력
    answer_distribution = {'1': [], '2': [], '3': [], '4': []}
    for num_str, answer in sorted(ANSWER_MAP.items()):
        answer_distribution[answer].append(num_str)

    print("\n📈 새로운 정답 분포:")
    print("-" * 60)
    for answer in ['1', '2', '3', '4']:
        nums = answer_distribution[answer]
        symbol = ['①', '②', '③', '④'][int(answer)-1]
        print(f"  {symbol} {answer}번: {len(nums)}개 - {', '.join(nums)}")
    print("-" * 60)

    print("\n✅ 모든 작업이 완료되었습니다!")
    print("\n⚠️  주의: HTML 파일은 content.js를 기반으로 동적으로 생성되므로")
    print("   별도로 수정할 필요가 없습니다. 페이지를 새로고침하면 반영됩니다.")

if __name__ == '__main__':
    main()
