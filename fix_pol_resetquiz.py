#!/usr/bin/env python3
"""
on_pol_02~20.html 파일에 resetQuiz 함수에 clearEvidenceHighlights() 추가
"""

import os
import re

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # resetQuiz에 clearEvidenceHighlights() 추가
    if 'clearEvidenceHighlights();' not in content:
        # drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 }); 패턴 찾기
        pattern = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)"
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1\n\n      // ★ 하이라이트 제거\n      clearEvidenceHighlights();', content)
            modified = True
            print(f"  ✓ resetQuiz에 clearEvidenceHighlights() 추가")
        else:
            print(f"  ✗ resetQuiz 패턴 없음")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    else:
        print(f"  → 이미 적용되었거나 패턴 없음")
    return False

# 메인 실행
for i in range(2, 21):
    filename = f'on_pol_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        print(f"\n=== {filename} ===")
        process_file(filepath)
    else:
        print(f"\n=== {filename} 파일 없음 ===")

print("\n\n=== 완료 ===")
