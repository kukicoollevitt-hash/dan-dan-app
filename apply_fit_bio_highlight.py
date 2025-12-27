#!/usr/bin/env python3
"""
fit_bio_02~20.html 파일에 하이라이트 CSS와 함수를 추가하는 스크립트
"""

import re
import os

base_path = '/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science'

# CSS 스타일 (style 태그 닫기 전에 추가)
highlight_css = '''
  /* ===== 정답 근거 하이라이트 스타일 ===== */
  .evidence-highlight {
    background: linear-gradient(180deg, transparent 60%, rgba(255, 220, 100, 0.5) 40%);
    padding: 2px 4px;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  .evidence-highlight:hover {
    background: linear-gradient(180deg, transparent 40%, rgba(255, 200, 50, 0.7) 40%);
  }
  .evidence-highlight .evidence-tag {
    display: inline-block;
    background: #ff6b6b;
    color: white;
    font-size: 11px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 4px;
    vertical-align: super;
  }
  /* 문제별 색상 구분 */
  .evidence-q1 { background: linear-gradient(180deg, transparent 60%, rgba(255, 182, 193, 0.6) 40%); }
  .evidence-q1:hover { background: linear-gradient(180deg, transparent 40%, rgba(255, 150, 170, 0.8) 40%); }
  .evidence-q1 .evidence-tag { background: #e91e63; }

  .evidence-q2 { background: linear-gradient(180deg, transparent 60%, rgba(173, 216, 230, 0.6) 40%); }
  .evidence-q2:hover { background: linear-gradient(180deg, transparent 40%, rgba(140, 190, 220, 0.8) 40%); }
  .evidence-q2 .evidence-tag { background: #2196f3; }

  .evidence-q3 { background: linear-gradient(180deg, transparent 60%, rgba(144, 238, 144, 0.6) 40%); }
  .evidence-q3:hover { background: linear-gradient(180deg, transparent 40%, rgba(100, 210, 100, 0.8) 40%); }
  .evidence-q3 .evidence-tag { background: #4caf50; }

  .evidence-q4 { background: linear-gradient(180deg, transparent 60%, rgba(255, 218, 185, 0.6) 40%); }
  .evidence-q4:hover { background: linear-gradient(180deg, transparent 40%, rgba(255, 190, 140, 0.8) 40%); }
  .evidence-q4 .evidence-tag { background: #ff9800; }

  .evidence-q5 { background: linear-gradient(180deg, transparent 60%, rgba(221, 160, 221, 0.6) 40%); }
  .evidence-q5:hover { background: linear-gradient(180deg, transparent 40%, rgba(200, 130, 200, 0.8) 40%); }
  .evidence-q5 .evidence-tag { background: #9c27b0; }
'''

# 하이라이트 함수 (gradeQuiz 함수 앞에 추가)
highlight_functions = '''
    /* ===== 정답 근거 하이라이팅 함수 ===== */
    function clearEvidenceHighlights() {
      const passageTextEl = document.querySelector('.passage-text');
      const vocabBoxEl = document.querySelector('.vocab-box');

      // 검색할 영역들
      const areas = [passageTextEl, vocabBoxEl].filter(el => el !== null);

      if (areas.length === 0) {
        console.log('[clearEvidenceHighlights] 검색 영역 없음');
        return;
      }

      let tagCount = 0;
      let highlightCount = 0;

      areas.forEach(area => {
        // 1. 먼저 모든 .evidence-tag 제거 (어디에 있든 상관없이)
        const tags = Array.from(area.querySelectorAll('.evidence-tag'));
        tagCount += tags.length;
        tags.forEach(tag => tag.remove());

        // 2. 하이라이트 span 제거 (라이브 컬렉션 문제 방지를 위해 Array.from 사용)
        const highlights = Array.from(area.querySelectorAll('.evidence-highlight'));
        highlightCount += highlights.length;

        highlights.forEach(span => {
          const parent = span.parentNode;
          // 나머지 내용을 부모로 이동
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
          }
          // span 제거
          parent.removeChild(span);
        });
      });

      console.log('[clearEvidenceHighlights] 제거 완료 - 태그:', tagCount, '하이라이트:', highlightCount);
    }
    // window 객체에 등록
    window.clearEvidenceHighlights = clearEvidenceHighlights;

    function highlightEvidence() {
      const content = window.CONTENTS[window.CUR_UNIT];
      if (!content || !content.explain) {
        console.log('[highlightEvidence] explain 데이터 없음');
        return;
      }

      const passageTextEl = document.querySelector('.passage-text');
      const vocabBoxEl = document.querySelector('.vocab-box');

      // 기존 하이라이트 제거
      clearEvidenceHighlights();

      // evidence가 있으면 evidence 사용, 없으면 explain 사용
      const evidenceSource = content.evidence || content.explain;
      const qLabels = { q1: '1번', q2: '2번', q3: '3번', q4: '4번', q5: '5번' };

      // 본문 문단들 (p와 li 모두 포함 - 어휘 목록이 ol > li로 되어 있음)
      const paragraphs = passageTextEl ? passageTextEl.querySelectorAll('p, li') : [];
      // 어휘 학습 탭의 어휘 박스 (li 또는 td 등)
      const vocabItems = vocabBoxEl ? vocabBoxEl.querySelectorAll('li, td, .vocab-item, .vocab-def') : [];

      ['q1', 'q2', 'q3', 'q4'].forEach(qKey => {  // q5(서술형) 제외
        const evidenceText = evidenceSource[qKey];
        if (!evidenceText) return;

        let found = false;

        // q3(어휘 문제)는 어휘 박스에서 먼저 검색
        if (qKey === 'q3' && vocabItems.length > 0) {
          vocabItems.forEach(item => {
            if (found) return;
            const plainText = item.textContent;
            if (plainText.includes(evidenceText)) {
              let html = item.innerHTML;
              const chars = evidenceText.split('');
              const regexPattern = chars.map(c => {
                const escaped = c.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
                return escaped;
              }).join('(?:<[^>]*>)*');
              const regex = new RegExp(`(${regexPattern})`);
              if (regex.test(html)) {
                html = html.replace(regex,
                  `<span class="evidence-highlight evidence-${qKey}">$1<span class="evidence-tag">${qLabels[qKey]}</span></span>`);
                item.innerHTML = html;
                found = true;
                console.log(`[highlightEvidence] ${qKey} 어휘박스 하이라이팅 완료:`, evidenceText);
              }
            }
          });
        }

        // 본문에서 검색 (q3가 어휘박스에서 못 찾았으면 본문에서도 시도)
        if (!found && paragraphs.length > 0) {
          paragraphs.forEach(p => {
            if (found) return;
            const plainText = p.textContent;
            if (plainText.includes(evidenceText)) {
              let html = p.innerHTML;
              const chars = evidenceText.split('');
              const regexPattern = chars.map(c => {
                const escaped = c.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
                return escaped;
              }).join('(?:<[^>]*>)*');
              const regex = new RegExp(`(${regexPattern})`);
              if (regex.test(html)) {
                html = html.replace(regex,
                  `<span class="evidence-highlight evidence-${qKey}">$1<span class="evidence-tag">${qLabels[qKey]}</span></span>`);
                p.innerHTML = html;
                found = true;
                console.log(`[highlightEvidence] ${qKey} 본문 하이라이팅 완료:`, evidenceText);
              }
            }
          });
        }
      });

      console.log('[highlightEvidence] 하이라이팅 완료');
    }
    // window 객체에 등록 (learning-common.js에서 호출 가능하도록)
    window.highlightEvidence = highlightEvidence;

'''

def add_highlight_to_file(filepath):
    """HTML 파일에 하이라이트 CSS와 함수 추가"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 하이라이트 CSS가 있으면 스킵
    if '.evidence-highlight' in content:
        print(f"[{os.path.basename(filepath)}] 이미 하이라이트 CSS 있음 - 스킵")
        return False

    modified = False

    # 1. CSS 추가 (</style> 앞에)
    # background: url...learning-bg.jpg 패턴 찾기
    css_pattern = r'(background:\s*url\("https://cdn\.jsdelivr\.net/gh/kukicoollevitt-hash/dan-dan-app@main/public/images/learning-bg\.jpg"\)[^}]*}\s*)(</style>)'

    if re.search(css_pattern, content):
        content = re.sub(css_pattern, r'\1' + highlight_css + r'\2', content)
        modified = True
        print(f"[{os.path.basename(filepath)}] CSS 추가 완료")
    else:
        print(f"[{os.path.basename(filepath)}] CSS 삽입 위치를 찾을 수 없음")

    # 2. 하이라이트 함수 추가 (/* ===== 본문 채점 ===== */ 앞에)
    func_pattern = r'(\s*)(\/\* ===== 본문 채점 ===== \*\/)'

    if re.search(func_pattern, content):
        content = re.sub(func_pattern, highlight_functions + r'\n\1\2', content)
        modified = True
        print(f"[{os.path.basename(filepath)}] 함수 추가 완료")
    else:
        print(f"[{os.path.basename(filepath)}] 함수 삽입 위치를 찾을 수 없음")

    # 3. gradeQuiz 끝에 highlightEvidence() 호출 추가
    # saveUnitProgressToServer 함수를 찾을 수 없음 뒤에 추가
    grade_pattern = r"(console\.error\('\[gradeQuiz\] saveUnitProgressToServer 함수를 찾을 수 없음!'\);\s*})"

    if re.search(grade_pattern, content) and 'highlightEvidence();' not in content.split('gradeQuiz')[1].split('resetQuiz')[0]:
        replacement = r"\1\n\n      // ★ 정답 근거 하이라이팅\n      highlightEvidence();"
        content = re.sub(grade_pattern, replacement, content)
        modified = True
        print(f"[{os.path.basename(filepath)}] gradeQuiz에 highlightEvidence 호출 추가")

    # 4. resetQuiz 끝에 clearEvidenceHighlights() 호출 추가
    reset_pattern = r"(drawRadarChart\(\{ literal:0, structural:0, lexical:0, inferential:0, critical:0 \}\);)\s*(\n\s*\})"

    if re.search(reset_pattern, content) and 'clearEvidenceHighlights()' not in content:
        replacement = r"\1\n\n      // ★ 지문 하이라이트 초기화\n      clearEvidenceHighlights();\2"
        content = re.sub(reset_pattern, replacement, content)
        modified = True
        print(f"[{os.path.basename(filepath)}] resetQuiz에 clearEvidenceHighlights 호출 추가")

    # 5. saveReadingProgress에 highlightEvidence 호출 추가
    save_pattern = r'(async function saveReadingProgress\(\) \{\s*gradeQuiz\(\);)'

    if re.search(save_pattern, content) and 'window.highlightEvidence' not in content.split('saveReadingProgress')[1][:500]:
        replacement = r'''\1

  // ★ 채점 후 바로 하이라이트 표시 (PDF 캡처 전에)
  if (typeof window.highlightEvidence === 'function') {
    window.highlightEvidence();
  }'''
        content = re.sub(save_pattern, replacement, content)
        modified = True
        print(f"[{os.path.basename(filepath)}] saveReadingProgress에 highlightEvidence 호출 추가")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

# fit_bio_02 ~ fit_bio_20 처리
for i in range(2, 21):
    filename = f'fit_bio_{str(i).zfill(2)}.html'
    filepath = os.path.join(base_path, filename)

    if os.path.exists(filepath):
        print(f"\n=== {filename} 처리 중 ===")
        add_highlight_to_file(filepath)
    else:
        print(f"\n[{filename}] 파일 없음")

print("\n\n=== 완료 ===")
