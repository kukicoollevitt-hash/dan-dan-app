#!/usr/bin/env python3
"""과학 분야 HTML 파일들의 geo 패턴을 각 과목에 맞게 수정"""

import os
import re

SCIENCE_DIR = "/Users/dandan/Desktop/dan-dan-app_1205/public/BRAINUP/science"

SUBJECTS = {
    'earth': list(range(1, 21)),  # earth_01 ~ earth_20
    'chem': list(range(1, 22)),   # chem_01 ~ chem_21
    'physics': list(range(1, 21)), # physics_01 ~ physics_20
    'bio': list(range(2, 21)),    # bio_02 ~ bio_20 (bio_01은 이미 수정됨)
}

def fix_file(subject, num):
    filename = f"{subject}_{num:02d}.html"
    filepath = os.path.join(SCIENCE_DIR, filename)

    if not os.path.exists(filepath):
        print(f"  [SKIP] {filename} 없음")
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. 정규식 패턴 수정: geo[_-]? -> {subject}[_-]?
    content = re.sub(r'geo\[_-\]\?', f'{subject}[_-]?', content)

    # 2. 템플릿 리터럴 수정: `geo_ -> `{subject}_
    content = content.replace('`geo_', f'`{subject}_')

    # 3. 정규식 내 패턴: /geo_ -> /{subject}_
    content = content.replace('/geo_', f'/{subject}_')

    # 4. localStorage 키: dan-geo-report-state -> dan-{subject}-report-state
    content = content.replace('dan-geo-report-state', f'dan-{subject}-report-state')

    # 5. 탭 저장 키: current-geo-tab -> current-{subject}-tab
    content = content.replace('current-geo-tab', f'current-{subject}-tab')

    # 6. 주석 수정
    content = content.replace('?unit=geo_XX', f'?unit={subject}_XX')
    content = content.replace('geo_XX.html', f'{subject}_XX.html')
    content = content.replace('geo_02.html', f'{subject}_02.html')

    # 7. physics 전용: BRAINUP_social_geo -> BRAINUP_science_physics_
    if subject == 'physics':
        content = content.replace('BRAINUP_social_geo', 'BRAINUP_science_physics_')

    # 8. refreshReportTab에 else 블록 추가 (없으면)
    if "저장된 데이터 없으면 빈 레이더" not in content:
        # 패턴: "          });\n        }\n      } catch(e) {"
        old_pattern = """          });
        }
      } catch(e) {
        console.error('Failed to refresh report:', e);"""
        new_pattern = """          });
        } else {
          // 저장된 데이터 없으면 빈 레이더 그리기
          drawRadarChart({ literal:0, structural:0, lexical:0, inferential:0, critical:0 });
        }
      } catch(e) {
        console.error('Failed to refresh report:', e);"""
        content = content.replace(old_pattern, new_pattern)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [OK] {filename} 수정됨")
        return True
    else:
        print(f"  [SKIP] {filename} 변경 없음")
        return False

def main():
    total = 0
    for subject, nums in SUBJECTS.items():
        print(f"\n=== {subject.upper()} ===")
        for num in nums:
            if fix_file(subject, num):
                total += 1

    print(f"\n총 {total}개 파일 수정됨")

if __name__ == "__main__":
    main()
