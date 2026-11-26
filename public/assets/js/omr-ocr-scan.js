/* 📷 OMR 답안지 사진 자동 입력 — 문해모의고사 온·업·중등 + 경시대회(KLC) 공용
   · '실제 소요시간' 박스 우측에 버튼 삽입 → 사진 선택/촬영 → /api/omr-ocr 인식
   · 결과를 기존 OMR 버블(.omr-bubble) 클릭으로 주입(내부 변수 수정 없이 기존 핸들러 재사용)
   · 신형 데이터구동 패널(window.MONTHLY_EXAM_DATA + #omrDrawer)에서만 동작, 아니면 자동 무시 */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(init);

  function init() {
    var EXAM = window.MONTHLY_EXAM_DATA;
    var timeLabel = document.querySelector('.omr-manual-time');
    var drawer = document.getElementById('omrDrawer');
    if (!EXAM || !EXAM.passages || !timeLabel || !drawer) return; // 신형 패널 아니면 종료
    if (document.getElementById('omrOcrBtn')) return;             // 중복 방지

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'omrOcrBtn';
    btn.textContent = '📷 OMR 사진 입력';
    btn.title = '아이들이 마킹한 OMR 답안지를 사진으로 찍으면 자동으로 입력됩니다.';
    btn.style.cssText = 'padding:6px 12px;border:1.5px solid #2e7d32;border-radius:10px;background:#eafaef;color:#1f7a34;font-size:12.5px;font-weight:800;cursor:pointer;white-space:nowrap;vertical-align:middle;';

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.setAttribute('capture', 'environment'); // 모바일은 후면 카메라
    fileInput.style.display = 'none';

    var status = document.createElement('span');
    status.id = 'omrOcrStatus';
    status.style.cssText = 'font-size:12px;font-weight:800;white-space:nowrap;vertical-align:middle;';

    // ✦ 채점하기 버튼 — OMR 창에서 바로 채점(기존 상단 채점버튼 #btnGradeTop을 눌러 동일 흐름 재사용)
    var gradeBtn = document.createElement('button');
    gradeBtn.type = 'button';
    gradeBtn.id = 'omrGradeBtn';
    gradeBtn.textContent = '✦ 채점하기';
    gradeBtn.title = 'OMR 답안 입력 창에서 바로 채점합니다.';
    gradeBtn.style.cssText = 'padding:6px 14px;border:none;border-radius:10px;background:linear-gradient(135deg,#f0902e,#d35a1a);color:#fff;font-size:12.5px;font-weight:800;cursor:pointer;white-space:nowrap;vertical-align:middle;box-shadow:0 3px 9px rgba(211,90,26,.35);';
    gradeBtn.addEventListener('click', function () {
      var g = document.getElementById('btnGradeTop');
      if (g) g.click();
    });

    // '실제 소요시간' 박스와 버튼들을 한 묶음(래퍼)으로 감싸 서로 붙인다
    // (헤더가 justify-content:space-between이라 그냥 두면 양끝으로 벌어짐)
    var wrap = document.createElement('span');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;';
    timeLabel.parentNode.insertBefore(wrap, timeLabel);
    wrap.appendChild(gradeBtn);    // 채점하기 (실제 소요시간 '좌측')
    wrap.appendChild(timeLabel);   // 실제 소요시간
    wrap.appendChild(btn);         // 📷 OMR 사진 입력
    wrap.appendChild(fileInput);
    wrap.appendChild(status);

    btn.addEventListener('click', function () { fileInput.click(); });

    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      setStatus('🔍 인식 중…', '#666');
      btn.disabled = true;
      resizeToDataUrl(file, 1600, 0.85).then(function (dataUrl) {
        var structure = EXAM.passages.map(function (p) {
          return {
            no: p.no, subject: p.subject,
            questions: (p.questions || []).map(function (q) {
              return { no: q.no, opts: (q.options && q.options.length) || 5 };
            })
          };
        });
        return fetch('/api/omr-ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ imageBase64: dataUrl, meta: { passages: structure, totalQuestions: EXAM.totalQuestions } })
        });
      }).then(function (res) { return res.json(); }).then(function (json) {
        if (!json || !json.ok) throw new Error((json && json.message) || '인식 실패');
        var applied = applyAnswers(json.answers || {});
        if (applied > 0) setStatus('✅ ' + applied + '문항 입력됨 — 확인·수정 후 제출하세요', '#1f7a34');
        else setStatus('⚠️ 마킹을 읽지 못했어요 — 더 밝고 반듯하게 다시 촬영', '#c0392b');
      }).catch(function (e) {
        console.error('[omr-ocr]', e);
        setStatus('⚠️ 인식 실패 — 잠시 후 다시 시도', '#c0392b');
      }).then(function () { btn.disabled = false; });
    });

    function setStatus(t, c) { status.textContent = t; status.style.color = c || '#666'; }

    // 인식 결과(문항번호→보기번호)를 OMR 버블 클릭으로 주입
    function applyAnswers(ans) {
      var n = 0;
      Object.keys(ans).forEach(function (k) {
        var no = parseInt(k, 10);
        var opt = parseInt(ans[k], 10);
        if (!no || !opt || opt < 1 || opt > 5) return;
        var cell = document.querySelector('.omr-cell[data-q-no="' + no + '"]');
        if (!cell) return;
        var bub = cell.querySelector('.omr-bubble[data-opt="' + opt + '"]');
        if (bub) { bub.click(); n++; } // 클릭 → 기존 핸들러가 userAnswers 갱신 + 재렌더
      });
      return n;
    }
  }

  // 파일 → 리사이즈된 JPEG dataURL (EXIF 회전 보정은 createImageBitmap에 위임)
  function resizeToDataUrl(file, maxDim, quality) {
    return new Promise(function (resolve, reject) {
      function draw(img, w, h) {
        try {
          var scale = Math.min(1, maxDim / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale));
          var ch = Math.max(1, Math.round(h * scale));
          var cv = document.createElement('canvas');
          cv.width = cw; cv.height = ch;
          cv.getContext('2d').drawImage(img, 0, 0, cw, ch);
          resolve(cv.toDataURL('image/jpeg', quality));
        } catch (e) { reject(e); }
      }
      if (window.createImageBitmap) {
        createImageBitmap(file).then(function (bmp) { draw(bmp, bmp.width, bmp.height); }).catch(fallback);
      } else { fallback(); }
      function fallback() {
        var fr = new FileReader();
        fr.onload = function () { var im = new Image(); im.onload = function () { draw(im, im.naturalWidth, im.naturalHeight); }; im.onerror = reject; im.src = fr.result; };
        fr.onerror = reject;
        fr.readAsDataURL(file);
      }
    });
  }
})();
