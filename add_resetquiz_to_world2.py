#!/usr/bin/env python3
"""
on_world2_01~40.html 파일의 resetQuiz 함수에 clearEvidenceHighlights() 호출을 추가합니다.
"""

import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit'

# 기존 패턴 (drawRadarChart 호출 직전)
old_pattern = '''drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
    }

    // 퀴즈 입력 활성화'''

# 새 패턴 (clearEvidenceHighlights 추가)
new_pattern = '''drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });

      // 정답 근거 하이라이트 제거
      if (typeof clearEvidenceHighlights === 'function') {
        clearEvidenceHighlights();
      }
    }

    // 퀴즈 입력 활성화'''

total_modified = 0

for i in range(1, 41):
    filename = f'on_world2_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'clearEvidenceHighlights();' in content and 'resetQuiz' in content:
            # 이미 resetQuiz에 추가되어 있는지 확인
            if 'drawRadarChart' in content and '// 정답 근거 하이라이트 제거' in content:
                print(f"[{filename}] - 이미 적용됨")
                continue

        if old_pattern in content:
            content = content.replace(old_pattern, new_pattern, 1)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[{filename}] ✓ resetQuiz에 clearEvidenceHighlights 추가됨")
            total_modified += 1
        else:
            print(f"[{filename}] - 패턴 없음")
    else:
        print(f"[{filename}] 파일 없음")

print(f"\n완료! 총 {total_modified}개 파일 수정됨")
