#!/usr/bin/env python3
"""
on_classic_01~40.html 파일의 gradeQuiz 함수에서
explain.qX 직접 참조를 qXMsg 변수 참조로 변경하고
detail 변수를 추가
"""

import re
import os

def process_file(file_path):
    """HTML 파일 하나 처리"""
    if not os.path.exists(file_path):
        print(f"  ⚠ 파일 없음: {file_path}")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. answerKey, explain 선언 뒤에 detail 변수와 qXMsg 변수 추가
    # const explain = content.explain; 다음에 추가
    if 'const detail = content.detail || {};' not in content:
        old_pattern = r"(const explain = content\.explain;)"
        new_text = r"""\1
      const detail = content.detail || {};

      // detail 우선, 없으면 explain fallback
      const q1Msg = detail.q1 || explain.q1 || '';
      const q2Msg = detail.q2 || explain.q2 || '';
      const q3Msg = detail.q3 || explain.q3 || '';
      const q4Msg = detail.q4 || explain.q4 || '';
      const q5Msg = explain.q5 || '';"""

        new_content = re.sub(old_pattern, new_text, content)
        if new_content != content:
            content = new_content
            modified = True
            print(f"    ✓ detail 변수 및 qXMsg 변수 추가")

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
    base_path = "/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/korlit"

    print("on_classic HTML 파일 gradeQuiz 함수 수정 시작...")

    for i in range(1, 41):
        unit_num = str(i).zfill(2)
        file_path = os.path.join(base_path, f"on_classic_{unit_num}.html")
        print(f"\n📝 on_classic_{unit_num}.html 처리 중...")
        process_file(file_path)

    print("\n✅ 모든 파일 수정 완료!")

if __name__ == "__main__":
    main()
