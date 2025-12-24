#!/usr/bin/env python3
import os
import re

base_dir = "/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science"

for i in range(2, 21):
    filename = f"on_chem_{i:02d}.html"
    filepath = os.path.join(base_dir, filename)

    if not os.path.exists(filepath):
        print(f"파일 없음: {filename}")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. gradeQuiz 함수 끝 부분 찾아서 highlightEvidence() 추가
    # drawRadarChart 호출 후 함수가 끝나는 패턴을 찾음
    if "// ★ 정답 근거 하이라이트" not in content and "highlightEvidence();" not in content:
        # 패턴: drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
        #     }
        #
        #     function disableQuizInputs() {
        old_pattern = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);\s*\n\s*\})\n\n(\s*function disableQuizInputs)"
        new_text = r"""\1

      // ★ 정답 근거 하이라이트
      highlightEvidence();
    }

\2"""
        new_content = re.sub(old_pattern, new_text, content)
        if new_content != content:
            content = new_content
            modified = True
            print(f"gradeQuiz 끝에 highlightEvidence 추가: {filename}")
        else:
            # 다른 패턴 시도
            old_pattern2 = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);\s*\n\s*\})\n\n(\s*function)"
            new_content = re.sub(old_pattern2, new_text, content)
            if new_content != content:
                content = new_content
                modified = True
                print(f"gradeQuiz 끝에 highlightEvidence 추가 (패턴2): {filename}")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"저장 완료: {filename}")
    else:
        print(f"패턴 미일치 또는 이미 적용됨: {filename}")

print("\n=== 완료 ===")
