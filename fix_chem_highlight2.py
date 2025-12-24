#!/usr/bin/env python3
import os
import re

base_dir = "/Users/dandan/Desktop/dan-dan-app_new/public/BRAINUP/science"

# 하이라이트 함수
highlight_functions = '''    /* ===== 하이라이트 함수 ===== */
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

for i in range(2, 21):
    filename = f"on_chem_{i:02d}.html"
    filepath = os.path.join(base_dir, filename)

    if not os.path.exists(filepath):
        print(f"파일 없음: {filename}")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. 하이라이트 함수 추가 (highlightEvidence 함수가 없으면)
    if 'function highlightEvidence()' not in content:
        # /* ===== 본문 채점 ===== */ 앞에 함수 추가
        old_str = "    /* ===== 본문 채점 ===== */"
        if old_str in content:
            content = content.replace(old_str, highlight_functions + old_str)
            modified = True
            print(f"함수 추가: {filename}")

    # 2. gradeQuiz 끝에 highlightEvidence() 호출 추가
    if "// ★ 정답 근거 하이라이트" not in content:
        old_str = """        console.log('[gradeQuiz] 서버에 본문학습 채점 결과 저장 요청 완료');
      } else {
        console.error('[gradeQuiz] saveUnitProgressToServer 함수를 찾을 수 없음!');
      }
    }"""
        new_str = """        console.log('[gradeQuiz] 서버에 본문학습 채점 결과 저장 요청 완료');
      } else {
        console.error('[gradeQuiz] saveUnitProgressToServer 함수를 찾을 수 없음!');
      }

      // ★ 정답 근거 하이라이트
      highlightEvidence();
    }"""
        if old_str in content:
            content = content.replace(old_str, new_str)
            modified = True
            print(f"gradeQuiz에 highlightEvidence 추가: {filename}")

    # 3. _customResetQuiz에 clearEvidenceHighlights() 추가
    if "window._customResetQuiz = function()" in content and "// ★ 정답 근거 하이라이트 제거" not in content:
        old_str = """    window._customResetQuiz = function() {
      // 입력 필드 다시 활성화
      enableQuizInputs();"""
        new_str = """    window._customResetQuiz = function() {
      // ★ 정답 근거 하이라이트 제거
      clearEvidenceHighlights();

      // 입력 필드 다시 활성화
      enableQuizInputs();"""
        if old_str in content:
            content = content.replace(old_str, new_str)
            modified = True
            print(f"_customResetQuiz에 clear 추가: {filename}")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"저장 완료: {filename}")
    else:
        print(f"수정 필요 없음 또는 패턴 미일치: {filename}")

print("\n=== 완료 ===")
