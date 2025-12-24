#!/usr/bin/env python3
import os

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
    if "// ★ 정답 근거 하이라이트" not in content:
        old_str = """      drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
    }

        function disableQuizInputs()"""
        new_str = """      drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });

      // ★ 정답 근거 하이라이트
      highlightEvidence();
    }

        function disableQuizInputs()"""
        if old_str in content:
            content = content.replace(old_str, new_str)
            modified = True
            print(f"gradeQuiz에 highlightEvidence 추가: {filename}")

    # 2. _customResetQuiz에 clearEvidenceHighlights() 추가 (있으면)
    if "window._customResetQuiz" in content and "clearEvidenceHighlights();" not in content:
        old_str2 = """    window._customResetQuiz = function() {
      // 입력 필드 다시 활성화
      enableQuizInputs();"""
        new_str2 = """    window._customResetQuiz = function() {
      // ★ 정답 근거 하이라이트 제거
      clearEvidenceHighlights();

      // 입력 필드 다시 활성화
      enableQuizInputs();"""
        if old_str2 in content:
            content = content.replace(old_str2, new_str2)
            modified = True
            print(f"_customResetQuiz에 clear 추가: {filename}")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"저장 완료: {filename}")
    else:
        print(f"패턴 미일치 또는 이미 적용됨: {filename}")

print("\n=== 완료 ===")
