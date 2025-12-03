#!/usr/bin/env python3
"""
분석리포트 탭 기능 일괄 적용 스크립트
- CUR_UNIT 블록에 로딩텍스트 변경 코드 추가
- 탭 클릭 이벤트에 새로고침 코드 추가
"""

import os
import re

def update_file(filepath, unit_prefix):
    """HTML 파일에 분석리포트 탭 기능 추가"""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 수정되어 있는지 확인
    if '분석리포트 탭으로 새로고침된 경우' in content:
        return False, "이미 수정됨"

    modified = False

    # 1. CUR_UNIT 블록에 로딩텍스트 변경 코드 추가
    # 패턴: window.CUR_UNIT = unit || 'xxx_nn';
    #       console.log('[study page] CUR_UNIT =', window.CUR_UNIT);
    #     })();

    cur_unit_pattern = r"(window\.CUR_UNIT = unit \|\| '[^']+';)\s*\n\s*(console\.log\('\[(?:study page|[^\]]+)\] CUR_UNIT =', window\.CUR_UNIT\);)\s*\n(\s*\}\)\(\);)"

    def cur_unit_replacement(match):
        indent = "    "
        return f"""{match.group(1)}
    {match.group(2)}

{indent}// 분석리포트 탭으로 새로고침된 경우 로딩 텍스트 변경
{indent}const savedTab = localStorage.getItem(`current-geo-tab:${{window.CUR_UNIT}}`);
{indent}if (savedTab === 'report') {{
{indent}  document.addEventListener('DOMContentLoaded', () => {{
{indent}    const loadingText = document.querySelector('.loading-text');
{indent}    if (loadingText) loadingText.textContent = 'AI 학습 분석 중...';
{indent}  }});
{indent}}}
{match.group(3)}"""

    new_content, count1 = re.subn(cur_unit_pattern, cur_unit_replacement, content)
    if count1 > 0:
        content = new_content
        modified = True

    # 2. 탭 클릭 이벤트 수정
    # 기존 패턴 찾기
    tab_click_pattern = r"(// 탭 버튼 클릭 이벤트\s*\n\s*document\.querySelectorAll\('\.tab-btn'\)\.forEach\(btn => \{\s*\n\s*btn\.addEventListener\('click', \(\) => \{\s*\n\s*const target = btn\.dataset\.tab;)\s*\n\s*(activateTab\(target\);)\s*\n\s*(// 현재 탭을 단원별로 localStorage에 저장)\s*\n\s*(const unit = window\.CUR_UNIT \|\| '[^']+';)\s*\n\s*(localStorage\.setItem\(`current-[^`]+:\$\{unit\}`, target\);)"

    def tab_click_replacement(match):
        # unit_prefix에서 단원명 추출
        return f"""{match.group(1)}
        const unit = {match.group(4).replace('const unit = ', '')};

        // 분석리포트 탭 클릭 시 페이지 새로고침하여 최신 데이터 가져오기
        if (target === 'report') {{
          localStorage.setItem(`current-geo-tab:${{unit}}`, target);
          location.reload();
          return;
        }}

        {match.group(2)}
        {match.group(3)}
        localStorage.setItem(`current-geo-tab:${{unit}}`, target);"""

    new_content, count2 = re.subn(tab_click_pattern, tab_click_replacement, content)
    if count2 > 0:
        content = new_content
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "수정 완료"
    else:
        return False, "패턴 미발견"

def process_subject(base_path, subject, prefix, start, end):
    """과목별 파일 처리"""
    print(f"\n=== {subject} ({prefix}) ===")

    for i in range(start, end + 1):
        filename = f"{prefix}_{i:02d}.html"
        filepath = os.path.join(base_path, filename)

        if os.path.exists(filepath):
            success, msg = update_file(filepath, prefix)
            status = "✅" if success else "⏭️"
            print(f"{status} {filename}: {msg}")
        else:
            print(f"❌ {filename}: 파일 없음")

# 실행
base = "/Users/dandan/Desktop/dan-dan-app/public/BRAINUP"

# Science (02~20)
process_subject(f"{base}/science", "Science - Earth", "earth", 2, 20)
process_subject(f"{base}/science", "Science - Physics", "physics", 2, 20)
process_subject(f"{base}/science", "Science - Chem", "chem", 2, 20)

# Social (02~20)
process_subject(f"{base}/social", "Social - Soc", "soc", 2, 20)
process_subject(f"{base}/social", "Social - Geo", "geo", 2, 20)
process_subject(f"{base}/social", "Social - Law", "law", 2, 20)
process_subject(f"{base}/social", "Social - Pol", "pol", 2, 20)

# Korlit (02~40)
process_subject(f"{base}/korlit", "Korlit - Modern", "modern", 2, 40)
process_subject(f"{base}/korlit", "Korlit - Classic", "classic", 2, 40)

# Worldlit (02~40)
process_subject(f"{base}/worldlit", "Worldlit - World1", "world1", 2, 40)
process_subject(f"{base}/worldlit", "Worldlit - World2", "world2", 2, 40)

# Person (02~40)
process_subject(f"{base}/person", "Person - People1", "people1", 2, 40)
process_subject(f"{base}/person", "Person - People2", "people2", 2, 40)

print("\n✅ 완료!")
