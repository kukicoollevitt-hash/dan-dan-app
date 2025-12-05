#!/usr/bin/env python3
"""
과학 과목 gradeQuiz 함수 async 수정 스크립트
- function gradeQuiz() -> async function gradeQuiz()
- refreshReportTab()을 saveFn() await 후에 호출하도록 변경
"""

import os
import re
import glob

science_dir = 'public/BRAINUP/science'
files = glob.glob(os.path.join(science_dir, '*.html'))

modified_count = 0
skipped_count = 0

for filepath in sorted(files):
    filename = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 async function gradeQuiz() 가 있으면 스킵
    if 'async function gradeQuiz()' in content:
        print(f"SKIP (already async): {filename}")
        skipped_count += 1
        continue

    # function gradeQuiz() 가 없으면 스킵
    if 'function gradeQuiz()' not in content:
        print(f"SKIP (no gradeQuiz): {filename}")
        skipped_count += 1
        continue

    original = content

    # 1. function gradeQuiz() -> async function gradeQuiz()
    content = content.replace('function gradeQuiz()', 'async function gradeQuiz()')

    # 2. gradeQuiz 내에서 refreshReportTab()과 saveFn() 패턴 수정
    # 패턴:
    #   // ★ 분석리포트 탭 즉시 업데이트
    #   refreshReportTab();
    #   ...
    #   // ★ 서버에 본문학습 채점 결과 저장
    #   saveFn({ ... });
    #
    # 변경:
    #   // ★ 서버에 본문학습 채점 결과 저장 후 분석리포트 탭 업데이트
    #   try {
    #     await saveFn({ ... });
    #     console.log('[gradeQuiz] 서버 저장 완료, 분석리포트 탭 업데이트');
    #     refreshReportTab();
    #   } catch (err) {
    #     console.error('[gradeQuiz] 서버 저장 실패:', err);
    #   }

    # 먼저 단독 refreshReportTab(); 호출 제거 (분석리포트 탭 즉시 업데이트 주석 포함)
    content = re.sub(
        r"// ★ 분석리포트 탭 즉시 업데이트\s*\n\s*refreshReportTab\(\);\s*\n",
        "",
        content
    )

    # saveFn({ ... }); 패턴을 찾아서 try/await/refreshReportTab 으로 변경
    # 주의: saveFn 호출이 여러 줄에 걸쳐있을 수 있음

    pattern = r"(// ★ 서버에 본문학습 채점 결과 저장\s*\n\s*)(saveFn\(\{[\s\S]*?\}\);)"

    def replace_savefn(match):
        comment = match.group(1).strip()
        savefn_call = match.group(2)

        # saveFn 호출의 들여쓰기 파악
        indent = "      "  # 기본 6칸

        return f"""// ★ 서버에 본문학습 채점 결과 저장 후 분석리포트 탭 업데이트
{indent}try {{
{indent}  await {savefn_call}
{indent}  console.log('[gradeQuiz] 서버 저장 완료, 분석리포트 탭 업데이트');
{indent}  refreshReportTab();
{indent}}} catch (err) {{
{indent}  console.error('[gradeQuiz] 서버 저장 실패:', err);
{indent}}}"""

    content = re.sub(pattern, replace_savefn, content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"MODIFIED: {filename}")
        modified_count += 1
    else:
        print(f"NO CHANGE: {filename}")

print(f"\n=== 완료 ===")
print(f"수정됨: {modified_count}개")
print(f"스킵됨: {skipped_count}개")
