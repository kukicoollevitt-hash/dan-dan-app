#!/usr/bin/env python3
"""
on_world1 HTML 파일들의 resetQuiz 함수에 clearEvidenceHighlights 호출 추가
"""

import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/worldlit'

# resetQuiz 함수 끝에 추가할 코드
old_pattern = '''      drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
    }

    // 본문 제출'''

new_pattern = '''      drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });

      // 정답 근거 하이라이트 제거
      if (typeof clearEvidenceHighlights === 'function') {
        clearEvidenceHighlights();
      }
    }

    // 본문 제출'''

# 02~40 파일 처리
total_modified = 0
for i in range(2, 41):
    filename = f'on_world1_{i:02d}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if old_pattern in content:
            content = content.replace(old_pattern, new_pattern, 1)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[{filename}] ✓ resetQuiz에 clearEvidenceHighlights 추가됨")
            total_modified += 1
        else:
            print(f"[{filename}] - 이미 적용됨 또는 패턴 없음")
    else:
        print(f"[{filename}] 파일 없음")

print(f"\n완료! 총 {total_modified}개 파일 수정됨")
