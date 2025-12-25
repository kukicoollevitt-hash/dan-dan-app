#!/usr/bin/env python3
"""
on_pol_02~20.html 파일에 resetQuiz 함수에 clearEvidenceHighlights() 추가
drawRadarChart({ literal:0, ... }); 다음 줄에 추가
highlightEvidence 함수 내의 clearEvidenceHighlights() 는 별개임
"""

import os
import re

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/social'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # resetQuiz 함수 내에 clearEvidenceHighlights() 가 있는지 확인
    # highlightEvidence() 함수 내의 것은 제외하고 확인

    # resetQuiz 함수에서 drawRadarChart 패턴 찾기
    pattern = r"(drawRadarChart\(\{\s*literal:\s*0,\s*structural:\s*0,\s*lexical:\s*0,\s*inferential:\s*0,\s*critical:\s*0\s*\}\);)\n(\s*\})"

    match = re.search(pattern, content)
    if not match:
        print(f"  ✗ resetQuiz 패턴 없음")
        return False

    # drawRadarChart 다음에 clearEvidenceHighlights가 있는지 확인
    after_draw = content[match.end(1):match.end(1)+200]
    if 'clearEvidenceHighlights();' in after_draw:
        print(f"  → 이미 적용됨")
        return False

    # 추가
    replacement = r'\1\n\n      // ★ 하이라이트 제거\n      clearEvidenceHighlights();\n\2'
    content = re.sub(pattern, replacement, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  ✓ resetQuiz에 clearEvidenceHighlights() 추가")
    return True

# 메인 실행
modified_count = 0
for i in range(2, 21):
    filename = f'on_pol_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        print(f"\n=== {filename} ===")
        if process_file(filepath):
            modified_count += 1
    else:
        print(f"\n=== {filename} 파일 없음 ===")

print(f"\n\n=== 총 {modified_count}개 파일 수정 완료 ===")
