#!/usr/bin/env python3
"""
chem 파일의 gradeQuiz() 끝에 refreshReportTab() 호출 추가
- chem 파일은 gradeQuiz에서 서버 저장을 안하므로
- localStorage에 저장 후 refreshReportTab() 호출만 추가
"""

import os
import re
import glob

science_dir = 'public/BRAINUP/science'
files = glob.glob(os.path.join(science_dir, 'chem_*.html'))

modified_count = 0

for filepath in sorted(files):
    filename = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 gradeQuiz 내에서 refreshReportTab()을 호출하면 스킵
    # gradeQuiz 함수 블록 찾기
    gradeQuiz_match = re.search(r'async function gradeQuiz\(\)(.*?)function resetQuiz\(\)', content, re.DOTALL)
    if gradeQuiz_match:
        gradeQuiz_body = gradeQuiz_match.group(1)
        if 'refreshReportTab()' in gradeQuiz_body:
            print(f"SKIP (already has refreshReportTab): {filename}")
            continue

    original = content

    # chem 파일의 gradeQuiz 끝 패턴:
    # localStorage.setItem(`dan-geo-report-state:${window.CUR_UNIT}`, JSON.stringify({
    #   ...
    # }));
    #
    #       }
    #
    # function resetQuiz() {

    # localStorage 저장 후 } 닫고 바로 refreshReportTab() 호출 추가
    pattern = r"(localStorage\.setItem\(`dan-geo-report-state:\$\{window\.CUR_UNIT\}`, JSON\.stringify\(\{[\s\S]*?\}\)\);)(\s*\}\s*\n\s*function resetQuiz)"

    def add_refresh(match):
        storage_call = match.group(1)
        closing = match.group(2)
        return f"""{storage_call}

      // ★ 분석리포트 탭 즉시 업데이트
      refreshReportTab();{closing}"""

    new_content = re.sub(pattern, add_refresh, content)

    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"MODIFIED: {filename}")
        modified_count += 1
    else:
        print(f"NO CHANGE: {filename}")

print(f"\n=== 완료 ===")
print(f"수정됨: {modified_count}개")
