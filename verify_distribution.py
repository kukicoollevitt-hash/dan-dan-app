#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
정답 분포 검증 스크립트
"""

import re

def verify_content_js(file_path):
    """people1_content.js의 정답 분포 확인"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    distribution_q1 = {'1': [], '2': [], '3': [], '4': []}
    distribution_q2 = {'1': [], '2': [], '3': [], '4': []}

    for num in range(6, 41):
        num_str = str(num).zfill(2)

        # people1_XX 섹션 찾기
        pattern = rf'people1_{num_str}:.*?answerKey:\s*\{{.*?q1:\s*[\'"](\d)[\'"].*?q2:\s*[\'"](\d)[\'"]'
        match = re.search(pattern, content, re.DOTALL)

        if match:
            q1_answer = match.group(1)
            q2_answer = match.group(2)
            distribution_q1[q1_answer].append(num_str)
            distribution_q2[q2_answer].append(num_str)

    print("\n" + "="*70)
    print("📊 정답 분포 검증 결과")
    print("="*70)

    print("\n🔹 Q1 (1번 문제) 정답 분포:")
    print("-"*70)
    for answer in ['1', '2', '3', '4']:
        nums = distribution_q1[answer]
        symbol = ['①', '②', '③', '④'][int(answer)-1]
        print(f"  {symbol} {answer}번: {len(nums):2d}개 - {', '.join(nums)}")

    print("\n🔹 Q2 (2번 문제) 정답 분포:")
    print("-"*70)
    for answer in ['1', '2', '3', '4']:
        nums = distribution_q2[answer]
        symbol = ['①', '②', '③', '④'][int(answer)-1]
        print(f"  {symbol} {answer}번: {len(nums):2d}개 - {', '.join(nums)}")

    # 검증: Q1과 Q2가 동일한지 확인
    print("\n🔹 Q1과 Q2 정답 일치 여부:")
    print("-"*70)
    all_match = True
    for num in range(6, 41):
        num_str = str(num).zfill(2)
        q1 = None
        q2 = None
        for answer in ['1', '2', '3', '4']:
            if num_str in distribution_q1[answer]:
                q1 = answer
            if num_str in distribution_q2[answer]:
                q2 = answer

        if q1 != q2:
            print(f"  ⚠️  people1_{num_str}: q1={q1}, q2={q2} (불일치)")
            all_match = False

    if all_match:
        print(f"  ✅ 모든 인물의 Q1과 Q2 정답이 일치합니다!")

    # 목표와 비교
    print("\n🔹 목표 분포와 비교:")
    print("-"*70)
    target_distribution = {
        '1': ['06', '10', '14', '18', '22', '26', '30', '34', '38'],
        '2': ['07', '11', '15', '19', '23', '27', '31', '35', '39'],
        '3': ['08', '12', '16', '20', '24', '28', '32', '36', '40'],
        '4': ['09', '13', '17', '21', '25', '29', '33', '37']
    }

    all_correct = True
    for answer in ['1', '2', '3', '4']:
        symbol = ['①', '②', '③', '④'][int(answer)-1]
        if sorted(distribution_q1[answer]) == sorted(target_distribution[answer]):
            print(f"  ✅ {symbol} {answer}번: 목표와 일치")
        else:
            print(f"  ❌ {symbol} {answer}번: 목표와 불일치")
            print(f"     목표: {', '.join(target_distribution[answer])}")
            print(f"     실제: {', '.join(sorted(distribution_q1[answer]))}")
            all_correct = False

    print("\n" + "="*70)
    if all_correct and all_match:
        print("✅ 모든 검증 통과! 정답 재분배가 성공적으로 완료되었습니다.")
    else:
        print("⚠️  일부 항목이 목표와 다릅니다. 확인이 필요합니다.")
    print("="*70 + "\n")

if __name__ == '__main__':
    file_path = '/Users/dandan/Desktop/dan-dan-app_1205/public/BRAINUP/person/people1_content.js'
    verify_content_js(file_path)
