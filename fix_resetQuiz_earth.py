#!/usr/bin/env python3
"""
지구과학(earth) earth_01~20 resetQuiz 함수에 입력창 활성화 코드 추가
"""

import os
import re

def fix_resetQuiz(filepath):
    """resetQuiz 함수에 disabled = false 코드 추가"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 수정되어 있는지 확인
    if 'q3-1").disabled = false' in content:
        return False, "이미 수정됨"

    # 패턴 1: 라디오 버튼 forEach 수정
    old_pattern1 = r"(function resetQuiz\(\) \{)\s*\n\s*(document\.querySelectorAll\('#tab-reading input\[type=\"radio\"\]'\)\.forEach\(r => r\.checked = false\);)"

    new_code1 = r'''\1
      document.querySelectorAll('#tab-reading input[type="radio"]').forEach(r => {
        r.checked = false;
        r.disabled = false;  // 라디오 버튼 활성화
      });'''

    new_content, count1 = re.subn(old_pattern1, new_code1, content)

    if count1 == 0:
        return False, "패턴1 미발견"

    # 패턴 2: q5 value 초기화 다음에 disabled = false 추가
    old_pattern2 = r'(document\.getElementById\("q5"\)\.value = "";)\s*\n\s*(const quizBlocks)'

    new_code2 = r'''\1

      // 입력창 활성화
      document.getElementById("q3-1").disabled = false;
      document.getElementById("q3-2").disabled = false;
      document.getElementById("q4-1").disabled = false;
      document.getElementById("q4-2").disabled = false;
      document.getElementById("q5").disabled = false;

      \2'''

    new_content, count2 = re.subn(old_pattern2, new_code2, new_content)

    if count2 == 0:
        return False, "패턴2 미발견"

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True, "수정 완료"

# 실행
base = "/Users/dandan/Desktop/dan-dan-app/public/BRAINUP/science"

print("=== 지구과학(earth) resetQuiz 수정 ===\n")

for i in range(1, 21):
    filename = f"earth_{i:02d}.html"
    filepath = os.path.join(base, filename)

    if os.path.exists(filepath):
        success, msg = fix_resetQuiz(filepath)
        status = "✅" if success else "⏭️"
        print(f"{status} {filename}: {msg}")
    else:
        print(f"❌ {filename}: 파일 없음")

print("\n✅ 완료!")
