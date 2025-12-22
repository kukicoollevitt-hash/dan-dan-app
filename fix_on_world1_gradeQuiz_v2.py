#!/usr/bin/env python3
"""
on_world1_01~40.html 파일의 gradeQuiz 함수에서
qXMsg 변수 선언 추가 (on_world1 구조에 맞게)
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

    # on_world1 구조: explain = (pack && pack.explain) || {...}; 다음에 추가
    if 'const detail = (pack && pack.detail) || {};' not in content:
        # 기존 explain 정의 뒤에 detail과 qXMsg 변수 추가
        old_pattern = r"(const explain = \(pack && pack\.explain\) \|\| \{[^}]+\};)"
        new_text = r"""\1

      const detail = (pack && pack.detail) || {};

      // detail 우선, 없으면 explain fallback
      const q1Msg = detail.q1 || explain.q1 || '';
      const q2Msg = detail.q2 || explain.q2 || '';
      const q3Msg = detail.q3 || explain.q3 || '';
      const q4Msg = detail.q4 || explain.q4 || '';
      const q5Msg = explain.q5 || '';"""

        new_content = re.sub(old_pattern, new_text, content, flags=re.DOTALL)
        if new_content != content:
            content = new_content
            modified = True
            print(f"    ✓ detail 변수 및 qXMsg 변수 추가")

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

    print("on_world1 HTML 파일 qXMsg 변수 추가...")

    for i in range(1, 41):
        unit_num = str(i).zfill(2)
        file_path = os.path.join(base_path, f"on_world1_{unit_num}.html")
        print(f"\n📝 on_world1_{unit_num}.html 처리 중...")
        process_file(file_path)

    print("\n✅ 모든 파일 수정 완료!")

if __name__ == "__main__":
    main()
