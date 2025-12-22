#!/usr/bin/env python3
"""
on_world2_01~40.html 파일의 gradeQuiz 함수에서
하드코딩된 answerKey, explain을 content.js에서 가져오도록 변경하고
detail 변수 및 qXMsg 변수를 추가
"""

import re
import os

def process_file(file_path, unit_num):
    """HTML 파일 하나 처리"""
    if not os.path.exists(file_path):
        print(f"  ⚠ 파일 없음: {file_path}")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. 하드코딩된 answerKey와 explain을 content.js에서 가져오도록 변경
    # 패턴: const answerKey = { ... }; const explain = { ... };
    # on_world2는 content.js에서 데이터를 가져와야 함

    # 먼저 하드코딩된 answerKey와 explain 블록을 찾아서 교체
    old_pattern = r'(function gradeQuiz\(\) \{\s*)\n\s*const answerKey = \{[^}]+\};\s*\n\s*const explain = \{[^}]+q5:[^\}]+\};'

    new_text = r'''\1
      // on_world2_content.js에서 데이터 가져오기
      const unitKey = 'on_world2_''' + unit_num + r'''';
      const content = window.CONTENTS?.[unitKey] || {};
      const answerKey = content.answerKey || {};
      const explain = content.explain || {};
      const detail = content.detail || {};

      // detail 우선, 없으면 explain fallback
      const q1Msg = detail.q1 || explain.q1 || '';
      const q2Msg = detail.q2 || explain.q2 || '';
      const q3Msg = detail.q3 || explain.q3 || '';
      const q4Msg = detail.q4 || explain.q4 || '';
      const q5Msg = explain.q5 || '';'''

    new_content = re.sub(old_pattern, new_text, content, flags=re.DOTALL)
    if new_content != content:
        content = new_content
        modified = True
        print(f"    ✓ answerKey/explain을 content.js에서 가져오도록 변경")

    # 2. fullMsgs.push에서 explain.qX를 qXMsg로 변경
    replacements = [
        (r'fullMsgs\.push\("정답 ✅ " \+ explain\.q1\)', 'fullMsgs.push("정답 ✅ " + q1Msg)'),
        (r'fullMsgs\.push\("오답 ❌ " \+ explain\.q1\)', 'fullMsgs.push("오답 ❌ " + q1Msg)'),
        (r'fullMsgs\.push\("정답 ✅ " \+ explain\.q2\)', 'fullMsgs.push("정답 ✅ " + q2Msg)'),
        (r'fullMsgs\.push\("오답 ❌ " \+ explain\.q2\)', 'fullMsgs.push("오답 ❌ " + q2Msg)'),
        (r'fullMsgs\.push\("정답 ✅ " \+ explain\.q3\)', 'fullMsgs.push("정답 ✅ " + q3Msg)'),
        (r'fullMsgs\.push\("오답 ❌ " \+ explain\.q3\)', 'fullMsgs.push("오답 ❌ " + q3Msg)'),
        (r'fullMsgs\.push\("정답 ✅ " \+ explain\.q4\)', 'fullMsgs.push("정답 ✅ " + q4Msg)'),
        (r'fullMsgs\.push\("오답 ❌ " \+ explain\.q4\)', 'fullMsgs.push("오답 ❌ " + q4Msg)'),
        (r'fullMsgs\.push\("서술형: 미작성 ❌ " \+ explain\.q5\)', 'fullMsgs.push("서술형: 미작성 ❌ " + q5Msg)'),
        (r'fullMsgs\.push\("서술형: 핵심어 표현 감지 ✅ " \+ explain\.q5\)', 'fullMsgs.push("서술형: 핵심어 표현 감지 ✅ " + q5Msg)'),
        (r'fullMsgs\.push\("서술형: 핵심어 표현 부족 ❌ " \+ explain\.q5\)', 'fullMsgs.push("서술형: 핵심어 표현 부족 ❌ " + q5Msg)'),
    ]

    for old, new in replacements:
        if re.search(old, content):
            content = re.sub(old, new, content)
            modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ {os.path.basename(file_path)} 수정 완료")
        return True
    else:
        print(f"  ⏭ {os.path.basename(file_path)} 이미 수정됨 또는 변경 없음")
        return False

def main():
    base_path = "/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/worldlit"

    print("on_world2 HTML 파일 gradeQuiz 함수 수정 시작...")

    for i in range(1, 41):
        unit_num = str(i).zfill(2)
        file_path = os.path.join(base_path, f"on_world2_{unit_num}.html")
        print(f"\n📝 on_world2_{unit_num}.html 처리 중...")
        process_file(file_path, unit_num)

    print("\n✅ 모든 파일 수정 완료!")

if __name__ == "__main__":
    main()
