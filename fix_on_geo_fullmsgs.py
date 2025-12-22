#!/usr/bin/env python3
"""
on_geo_01~20.html 파일의 gradeQuiz 함수에서
detail.qX 직접 참조를 qXMsg 변수 참조로 변경
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

    # 1. detail 객체 선언 뒤에 qXMsg 변수 추가
    # const detail = {...}; 다음에 추가
    detail_pattern = r"(const detail = \{[^}]+\};)"

    def add_msg_vars(match):
        detail_block = match.group(1)
        msg_vars = """

      // detail 우선, 없으면 explain fallback
      const q1Msg = detail.q1 || explain.q1 || '';
      const q2Msg = detail.q2 || explain.q2 || '';
      const q3Msg = detail.q3 || explain.q3 || '';
      const q4Msg = detail.q4 || explain.q4 || '';
      const q5Msg = explain.q5 || '';"""
        return detail_block + msg_vars

    # 이미 q1Msg 정의가 있으면 스킵
    if 'const q1Msg = detail.q1 || explain.q1' not in content:
        content = re.sub(detail_pattern, add_msg_vars, content, flags=re.DOTALL)

    # 2. fullMsgs.push에서 detail.qX를 qXMsg로 변경
    content = re.sub(r'fullMsgs\.push\("정답 ✅ " \+ detail\.q1\)', 'fullMsgs.push("정답 ✅ " + q1Msg)', content)
    content = re.sub(r'fullMsgs\.push\("오답 ❌ " \+ detail\.q1\)', 'fullMsgs.push("오답 ❌ " + q1Msg)', content)
    content = re.sub(r'fullMsgs\.push\("정답 ✅ " \+ detail\.q2\)', 'fullMsgs.push("정답 ✅ " + q2Msg)', content)
    content = re.sub(r'fullMsgs\.push\("오답 ❌ " \+ detail\.q2\)', 'fullMsgs.push("오답 ❌ " + q2Msg)', content)
    content = re.sub(r'fullMsgs\.push\("정답 ✅ " \+ detail\.q3\)', 'fullMsgs.push("정답 ✅ " + q3Msg)', content)
    content = re.sub(r'fullMsgs\.push\("오답 ❌ " \+ detail\.q3\)', 'fullMsgs.push("오답 ❌ " + q3Msg)', content)
    content = re.sub(r'fullMsgs\.push\("정답 ✅ " \+ detail\.q4\)', 'fullMsgs.push("정답 ✅ " + q4Msg)', content)
    content = re.sub(r'fullMsgs\.push\("오답 ❌ " \+ detail\.q4\)', 'fullMsgs.push("오답 ❌ " + q4Msg)', content)

    # 3. 서술형 q5도 q5Msg로 변경
    content = re.sub(r'fullMsgs\.push\("서술형: 미작성 ❌ " \+ explain\.q5\)', 'fullMsgs.push("서술형: 미작성 ❌ " + q5Msg)', content)
    content = re.sub(r'fullMsgs\.push\("서술형: 핵심어 표현 감지 ✅ " \+ explain\.q5\)', 'fullMsgs.push("서술형: 핵심어 표현 감지 ✅ " + q5Msg)', content)
    content = re.sub(r'fullMsgs\.push\("서술형: 핵심어 표현 부족 ❌ " \+ explain\.q5\)', 'fullMsgs.push("서술형: 핵심어 표현 부족 ❌ " + q5Msg)', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  ✅ {os.path.basename(file_path)} 수정 완료")
    return True

def main():
    base_path = "/Users/dandan/Desktop/dan-dan-app_1217/public/BRAINUP/social"

    print("on_geo HTML 파일 qXMsg 변수 추가 및 참조 수정 시작...")

    for i in range(1, 21):
        unit_num = str(i).zfill(2)
        file_path = os.path.join(base_path, f"on_geo_{unit_num}.html")
        print(f"\n📝 on_geo_{unit_num}.html 처리 중...")
        process_file(file_path)

    print("\n✅ 모든 파일 수정 완료!")

if __name__ == "__main__":
    main()
