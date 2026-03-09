#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def add_html_to_file(file_num):
    file_path = f"/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/BRAINUP/social/on_geo_{file_num}.html"

    html_code = f'''          <!-- 웹툰힌트 드롭다운 -->
          <div class="webtoon-hint-container">
            <a href="#" class="webtoon-hint-btn" id="webtoonHintBtn" onclick="toggleWebtoonDropdown(); return false;">웹툰힌트 <span class="arrow">▼</span></a>
            <div class="webtoon-dropdown" id="webtoonDropdown">
              <div class="webtoon-dropdown-header">
                <span>📖 배경지식 쉽게 익히기</span>
                <button class="webtoon-dropdown-close" onclick="closeWebtoonDropdown()">&times;</button>
              </div>
              <div class="webtoon-dropdown-body" id="webtoonBody">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_01.jpg" alt="웹툰힌트 1">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_02.jpg" alt="웹툰힌트 2">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_03.jpg" alt="웹툰힌트 3">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_04.jpg" alt="웹툰힌트 4">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_05.jpg" alt="웹툰힌트 5">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_06.jpg" alt="웹툰힌트 6">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_07.jpg" alt="웹툰힌트 7">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_08.jpg" alt="웹툰힌트 8">
                <img data-src="/images/웹툰/지리{file_num}/지리{file_num}_09.jpg" alt="웹툰힌트 9">
              </div>
            </div>
          </div>
'''

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 이미 추가되어 있는지 확인
        if f'지리{file_num}' in content:
            print(f"on_geo_{file_num}.html: 이미 추가되어 있음")
            return True

        # <div class="passage-wrap"> 다음에 HTML 추가
        # 정확한 패턴 찾기
        pattern = r'(<div class="passage-wrap">)\s*\n\s*(<!--.*?-->)?\s*\n\s*(<div class="passage-label">)'
        replacement = r'\1\n' + html_code + r'\2\n          \3'

        new_content = re.sub(pattern, replacement, content, count=1)

        if new_content == content:
            # 다른 패턴 시도
            pattern2 = r'(<div class="passage-wrap">)'
            replacement2 = r'\1\n' + html_code
            new_content = re.sub(pattern2, replacement2, content, count=1)

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ on_geo_{file_num}.html: HTML 추가 완료")
            return True
        else:
            print(f"✗ on_geo_{file_num}.html: 패턴을 찾을 수 없음")
            return False

    except Exception as e:
        print(f"✗ on_geo_{file_num}.html: 오류 - {e}")
        return False

# 04~20 파일 처리
files = ['04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

print("HTML 추가 중...")
for num in files:
    add_html_to_file(num)

print("\n완료!")
