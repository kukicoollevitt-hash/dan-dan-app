#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
deep_bio_content.js에서 answerKey와 explain의 불일치를 찾아서 수정하는 스크립트
"""

import re
import json

def extract_answer_from_explain(explain_text):
    """
    explain 텍스트에서 정답 번호를 추출
    예: "1번 선택지가 정답이다" -> '1'
    """
    # 패턴들을 시도
    patterns = [
        r'(\d+)번\s*선택지가\s*정답',
        r'정답은\s*(\d+)번',
        r'(\d+)번이\s*정답',
        r'선택지\s*(\d+)번.*?정답',
    ]

    for pattern in patterns:
        match = re.search(pattern, explain_text)
        if match:
            return match.group(1)

    return None

def find_answerkey_block(content, unit_name, start_pos):
    """
    특정 unit의 answerKey 블록을 찾음
    """
    # answerKey를 찾기
    answerkey_pattern = r'answerKey\s*:\s*\{([^}]+)\}'
    match = re.search(answerkey_pattern, content[start_pos:])

    if match:
        return match.group(0), start_pos + match.start(), start_pos + match.end()
    return None, None, None

def find_explain_block(content, unit_name, start_pos):
    """
    특정 unit의 explain 블록을 찾음
    """
    # explain 블록 찾기 (중첩된 객체 구조 고려)
    explain_start = content.find('explain:', start_pos)
    if explain_start == -1:
        return None, None, None

    # { 를 찾기
    brace_start = content.find('{', explain_start)
    if brace_start == -1:
        return None, None, None

    # 매칭되는 } 찾기
    depth = 1
    i = brace_start + 1
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1

    if depth == 0:
        explain_block = content[explain_start:i]
        return explain_block, explain_start, i

    return None, None, None

def parse_answerkey(answerkey_text):
    """
    answerKey 블록에서 q1, q2, q3, q4 값을 파싱
    """
    result = {}
    for q in ['q1', 'q2', 'q3', 'q4']:
        pattern = rf"{q}\s*:\s*['\"](\d+)['\"]"
        match = re.search(pattern, answerkey_text)
        if match:
            result[q] = match.group(1)
    return result

def parse_explain(explain_text):
    """
    explain 블록에서 q1, q2, q3, q4의 설명을 파싱하고 정답 번호를 추출
    """
    result = {}

    # q1, q2, q3, q4를 찾기
    for q in ['q1', 'q2', 'q3', 'q4']:
        # 작은따옴표로 감싸진 텍스트 찾기
        pattern = rf"{q}\s*:\s*'([^']+)'"
        match = re.search(pattern, explain_text)
        if match:
            explain_content = match.group(1)
            answer = extract_answer_from_explain(explain_content)
            result[q] = {
                'text': explain_content,
                'answer': answer
            }

    return result

def main():
    file_path = '/Users/dandan/Desktop/dan-dan-app_1214/public/BRAINUP/science/deep_bio_content.js'

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 결과 저장
    report = []
    modifications = []

    # deep_bio_01 ~ deep_bio_20 처리
    for i in range(1, 21):
        unit_name = f'deep_bio_{i:02d}'

        # unit 시작 위치 찾기
        unit_pattern = rf'{unit_name}\s*:\s*\{{'
        unit_match = re.search(unit_pattern, content)

        if not unit_match:
            print(f"❌ {unit_name} 을 찾을 수 없습니다.")
            continue

        unit_start = unit_match.start()

        # 다음 unit 또는 파일 끝까지를 범위로
        next_unit_pattern = rf'deep_bio_{(i+1):02d}\s*:\s*\{{'
        next_match = re.search(next_unit_pattern, content)
        unit_end = next_match.start() if next_match else len(content)

        # answerKey 블록 찾기
        answerkey_block, ak_start, ak_end = find_answerkey_block(content, unit_name, unit_start)
        if not answerkey_block:
            print(f"⚠️  {unit_name}: answerKey를 찾을 수 없습니다.")
            continue

        # explain 블록 찾기
        explain_block, ex_start, ex_end = find_explain_block(content, unit_name, unit_start)
        if not explain_block:
            print(f"⚠️  {unit_name}: explain을 찾을 수 없습니다.")
            continue

        # 파싱
        current_answers = parse_answerkey(answerkey_block)
        explain_data = parse_explain(explain_block)

        # 비교 및 수정
        unit_report = {
            'unit': unit_name,
            'mismatches': []
        }

        for q in ['q1', 'q2', 'q3', 'q4']:
            current = current_answers.get(q)
            if q in explain_data and explain_data[q]['answer']:
                correct = explain_data[q]['answer']

                if current != correct:
                    unit_report['mismatches'].append({
                        'question': q,
                        'current': current,
                        'correct': correct,
                        'explain': explain_data[q]['text'][:100]  # 처음 100자만
                    })

                    # 수정 내용 기록
                    modifications.append({
                        'unit': unit_name,
                        'question': q,
                        'old': current,
                        'new': correct,
                        'position': (ak_start, ak_end)
                    })

        if unit_report['mismatches']:
            report.append(unit_report)

    # 수정 전 보고서 출력
    print("\n" + "="*60)
    print("발견된 불일치 항목:")
    print("="*60)
    for unit_rep in report:
        print(f"\n📌 {unit_rep['unit']}:")
        for mm in unit_rep['mismatches']:
            print(f"  {mm['question']}: {mm['current']} → {mm['correct']}")
            print(f"    explain: {mm['explain'][:80]}...")

    # 수정 사항을 역순으로 적용 (뒤에서부터 수정해야 인덱스가 안 꼬임)
    modifications_by_unit = {}
    for mod in modifications:
        unit = mod['unit']
        if unit not in modifications_by_unit:
            modifications_by_unit[unit] = []
        modifications_by_unit[unit].append(mod)

    # 파일 수정
    modified_content = content
    for i in range(20, 0, -1):  # 역순으로
        unit_name = f'deep_bio_{i:02d}'
        if unit_name not in modifications_by_unit:
            continue

        # unit의 answerKey 블록 다시 찾기
        unit_pattern = rf'{unit_name}\s*:\s*\{{'
        unit_match = re.search(unit_pattern, modified_content)
        if not unit_match:
            continue

        unit_start = unit_match.start()
        answerkey_block, ak_start, ak_end = find_answerkey_block(modified_content, unit_name, unit_start)

        if answerkey_block:
            # answerKey 값들을 수정
            new_block = answerkey_block
            for mod in modifications_by_unit[unit_name]:
                q = mod['question']
                old_val = mod['old']
                new_val = mod['new']

                # q1: '3' -> q1: '4' 형태로 교체
                pattern = rf"({q}\s*:\s*['\"]){old_val}(['\"])"
                new_block = re.sub(pattern, rf"\g<1>{new_val}\g<2>", new_block)

            # 원본 파일에 반영
            modified_content = modified_content[:ak_start] + new_block + modified_content[ak_end:]

    # 수정된 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(modified_content)

    # 최종 보고서
    print("\n" + "="*60)
    print("✅ 수정 완료!")
    print("="*60)

    # 수정된 각 항목의 최종 answerKey 출력
    for i in range(1, 21):
        unit_name = f'deep_bio_{i:02d}'

        # 수정된 내용에서 다시 읽기
        unit_pattern = rf'{unit_name}\s*:\s*\{{'
        unit_match = re.search(unit_pattern, modified_content)
        if not unit_match:
            continue

        unit_start = unit_match.start()
        answerkey_block, _, _ = find_answerkey_block(modified_content, unit_name, unit_start)

        if answerkey_block:
            final_answers = parse_answerkey(answerkey_block)

            # 변경이 있었는지 확인
            has_change = unit_name in modifications_by_unit
            prefix = "🔧" if has_change else "  "

            print(f"{prefix} {unit_name}: q1:'{final_answers.get('q1', '?')}', q2:'{final_answers.get('q2', '?')}', q3:'{final_answers.get('q3', '?')}', q4:'{final_answers.get('q4', '?')}'")

if __name__ == '__main__':
    main()
