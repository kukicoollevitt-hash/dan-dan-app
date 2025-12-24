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

    # 1. gradeQuiz 끝에 highlightEvidence() 호출 추가
    if "// ★ 정답 근거 하이라이트" not in content:
        old_str = """        console.log('[gradeQuiz] 서버에 본문학습 채점 결과 저장 요청 완료');
      } else {
        console.error('[gradeQuiz] saveUnitProgressToServer 함수를 찾을 수 없음!');
      }
    }

    // window._customResetQuiz"""
        new_str = """        console.log('[gradeQuiz] 서버에 본문학습 채점 결과 저장 요청 완료');
      } else {
        console.error('[gradeQuiz] saveUnitProgressToServer 함수를 찾을 수 없음!');
      }

      // ★ 정답 근거 하이라이트
      highlightEvidence();
    }

    // window._customResetQuiz"""
        if old_str in content:
            content = content.replace(old_str, new_str)
            modified = True
            print(f"gradeQuiz에 highlightEvidence 추가: {filename}")

    # 2. _customResetQuiz에 clearEvidenceHighlights() 추가
    old_str2 = """    window._customResetQuiz = function() {
      // 입력 필드 다시 활성화
      enableQuizInputs();"""
    new_str2 = """    window._customResetQuiz = function() {
      // ★ 정답 근거 하이라이트 제거
      clearEvidenceHighlights();

      // 입력 필드 다시 활성화
      enableQuizInputs();"""
    if old_str2 in content and "// ★ 정답 근거 하이라이트 제거\n      clearEvidenceHighlights();" not in content:
        content = content.replace(old_str2, new_str2)
        modified = True
        print(f"_customResetQuiz에 clear 추가: {filename}")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"저장 완료: {filename}")
    else:
        print(f"패턴 확인 필요: {filename}")

print("\n=== 완료 ===")
