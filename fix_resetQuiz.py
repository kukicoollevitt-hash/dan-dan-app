#!/usr/bin/env python3
"""
on_soc_02~20.html의 resetQuiz 함수에 clearEvidenceHighlights() 호출 추가
"""

import os
import re

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social'

for i in range(2, 21):
    filename = f'on_soc_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if not os.path.exists(filepath):
        print(f"{filename} 파일 없음")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # resetQuiz 함수 내부의 drawRadarChart 다음에 clearEvidenceHighlights 추가
    # 단, 아직 없는 경우에만

    # 패턴: resetQuiz 함수 내의 drawRadarChart 호출 직후
    old_pattern = r"(function resetQuiz\(\)[\s\S]*?drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)\n(\s*\})"

    # 이미 clearEvidenceHighlights가 함수 호출로 있는지 확인 (전역 노출 제외)
    # resetQuiz 함수 찾기
    resetQuiz_match = re.search(r'function resetQuiz\(\)[\s\S]*?drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);[\s\S]*?\n\s*\}', content)

    if resetQuiz_match:
        resetQuiz_content = resetQuiz_match.group()
        if 'clearEvidenceHighlights();' in resetQuiz_content:
            print(f"{filename}: resetQuiz에 이미 존재")
            continue

    # 수정
    new_pattern = r'\1\n\n      // ★ 하이라이트 제거\n      clearEvidenceHighlights();\n\2'

    new_content = re.sub(old_pattern, new_pattern, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"{filename}: clearEvidenceHighlights() 추가 완료")
    else:
        print(f"{filename}: 변경 없음")

print("\n=== 완료 ===")
