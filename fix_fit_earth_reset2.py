#!/usr/bin/env python3
"""
fit_earth_02~20.html의 resetQuiz 함수에 clearEvidenceHighlights() 호출 추가
"""

import re
import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science'

def fix_reset_quiz(filepath):
    """resetQuiz 함수에 clearEvidenceHighlights 호출 추가"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = os.path.basename(filepath)

    # 이미 resetQuiz에 clearEvidenceHighlights가 있으면 스킵
    if 'resetQuiz' in content and 'submitQuiz' in content:
        reset_section = content.split('resetQuiz')[1].split('submitQuiz')[0]
        if 'clearEvidenceHighlights' in reset_section:
            print(f"[{filename}] resetQuiz에 이미 clearEvidenceHighlights 있음 - 스킵")
            return False

    # resetQuiz 함수 끝 부분 (drawRadarChart 다음 줄)에 clearEvidenceHighlights 추가
    # 패턴: drawRadarChart({ literal:0, ... }); 다음에 } 그리고 어휘학습 주석
    pattern = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)(\s*\n\s*\}\s*\n\s*/\* ===== 어휘학습)"

    if re.search(pattern, content):
        replacement = r'\1\n\n      // ★ 지문 하이라이트 초기화\n      clearEvidenceHighlights();\2'
        content = re.sub(pattern, replacement, content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"[{filename}] resetQuiz에 clearEvidenceHighlights 추가 완료")
        return True
    else:
        print(f"[{filename}] 패턴을 찾을 수 없음")
        return False

# fit_earth_02 ~ fit_earth_20 처리
for i in range(2, 21):
    filename = f'fit_earth_{str(i).zfill(2)}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        fix_reset_quiz(filepath)

print("\n=== 완료 ===")
