#!/usr/bin/env python3
"""
bio, earth, physics 파일의 gradeQuiz() 내 saveFn 호출에 await 추가 및 refreshReportTab 호출 추가
"""

import os
import re
import glob

science_dir = 'public/BRAINUP/science'

# bio, earth, physics 파일들 (템플릿 제외)
patterns = ['bio_[0-9]*.html', 'earth_[0-9]*.html', 'physics_[0-9]*.html']
files = []
for p in patterns:
    files.extend(glob.glob(os.path.join(science_dir, p)))

modified_count = 0
skipped_count = 0

for filepath in sorted(files):
    filename = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # bio_01은 이미 수동 수정됨 - 확인
    if 'bio_01' in filename:
        if "await saveFn({" in content and "refreshReportTab();" in content:
            print(f"SKIP (already fixed manually): {filename}")
            skipped_count += 1
            continue

    original = content

    # 패턴 1: saveFn({ ... }); 호출을 찾아서 try/await/refreshReportTab으로 감싸기
    # 현재 패턴:
    #         saveFn({
    #           reportState: {
    #             ...
    #           }
    #         });
    #         console.log('[gradeQuiz] 서버에 본문학습 채점 결과 저장 요청 완료');

    pattern = r"(saveFn\(\{\s*\n\s*reportState:\s*\{[\s\S]*?\}\s*\}\);)\s*\n\s*console\.log\('\[gradeQuiz\] 서버에 본문학습 채점 결과 저장 요청 완료'\);"

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
        # 이미 await saveFn이 있는지 확인
        if 'await saveFn(' in content:
            print(f"CHECK: {filename} - already has await saveFn")
        else:
            print(f"NO CHANGE: {filename}")

print(f"\n=== 완료 ===")
print(f"수정됨: {modified_count}개")
print(f"스킵됨: {skipped_count}개")
