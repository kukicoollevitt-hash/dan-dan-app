#!/usr/bin/env python3
"""
과학 과목 gradeQuiz 함수 수정 - saveFn에 await 추가 후 refreshReportTab 호출
"""

import os
import re
import glob

science_dir = 'public/BRAINUP/science'
files = glob.glob(os.path.join(science_dir, '*.html'))

modified_count = 0

for filepath in sorted(files):
    filename = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 처리된 파일 (await saveFn 이 있으면 스킵)
    if 'await saveFn(' in content:
        print(f"SKIP (already fixed): {filename}")
        continue

    # async function gradeQuiz()가 없으면 스킵
    if 'async function gradeQuiz()' not in content:
        print(f"SKIP (not async): {filename}")
        continue

    original = content

    # gradeQuiz 함수 내에서 saveFn({ ... }); 패턴 찾아서 await + refreshReportTab 추가
    # 패턴: saveFn({ ... reportState: { ... } ... });
    # 변경: try { await saveFn({ ... }); refreshReportTab(); } catch(err) { ... }

    # saveFn 호출 패턴 (여러 줄에 걸친 객체)
    pattern = r"(saveFn\(\{\s*\n\s*reportState:\s*\{[\s\S]*?\}\s*\}\);)"

    def replace_savefn(match):
        savefn_call = match.group(1)
        return f"""try {{
          await {savefn_call}
          console.log('[gradeQuiz] 서버 저장 완료, 분석리포트 탭 업데이트');
          refreshReportTab();
        }} catch (err) {{
          console.error('[gradeQuiz] 서버 저장 실패:', err);
        }}"""

    new_content = re.sub(pattern, replace_savefn, content)

    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"MODIFIED: {filename}")
        modified_count += 1
    else:
        print(f"NO CHANGE: {filename}")

print(f"\n=== 완료 ===")
print(f"수정됨: {modified_count}개")
