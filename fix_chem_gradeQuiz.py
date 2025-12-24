#!/usr/bin/env python3
import os

base_dir = "/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science"

for i in range(3, 21):
    filename = f"on_chem_{i:02d}.html"
    filepath = os.path.join(base_dir, filename)

    if not os.path.exists(filepath):
        print(f"파일 없음: {filename}")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 gradeQuiz에 highlightEvidence가 있으면 스킵
    if "// ★ 정답 근거 하이라이트\n      highlightEvidence();\n    }\n\n    function resetQuiz()" in content:
        print(f"이미 적용됨: {filename}")
        continue

    old_str = """      // ★ 분석리포트 탭 즉시 업데이트
      refreshReportTab();
    }

    function resetQuiz() {"""

    new_str = """      // ★ 분석리포트 탭 즉시 업데이트
      refreshReportTab();

      // ★ 정답 근거 하이라이트
      highlightEvidence();
    }

    function resetQuiz() {"""

    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"gradeQuiz에 highlightEvidence 추가: {filename}")
    else:
        print(f"패턴 미일치: {filename}")

print("\n=== 완료 ===")
