# 과제 관리 시스템 구현 가이드

## 완료된 백엔드 시스템

### 1. 파일 구조
```
config/
  ├── curriculum.js              # 커리큘럼 데이터 (5개 분야, 9+ 과목, 440+ 단원)
  └── taskAssignmentCron.js      # 크론 작업 (매일 00:00 실행)

models/
  └── UserProgress.js            # autoAssignmentSchedules 스키마 추가됨

public/
  ├── js/taskNotification.js     # 학생 로그인 알림 팝업
  └── student-main.html          # 알림 스크립트 연동 완료

server.js                         # 7개 API 엔드포인트 구현 완료
```

### 2. API 엔드포인트 (모두 구현됨)

```javascript
// 커리큘럼 조회
GET /api/auto-assignment/curriculum

// 스케줄 생성
POST /api/auto-assignment/create
Body: {
  grade: "초등 3학년",
  name: "홍길동",
  frequency: "daily" | "weekly",
  daysOfWeek: ["월", "화", "수"],  // weekly일 때만
  fields: ["과학분야", "사회분야"],
  subjects: ["생물", "지리"],
  taskCount: 3
}

// 스케줄 일시중단
POST /api/auto-assignment/pause/:scheduleId
Body: { grade, name }

// 스케줄 재개
POST /api/auto-assignment/resume/:scheduleId
Body: { grade, name }

// 스케줄 삭제
DELETE /api/auto-assignment/:scheduleId
Body: { grade, name }

// 학생의 스케줄 목록 조회
GET /api/auto-assignment/student/:grade/:name

// 학습실 과제 확인 (학생용)
GET /api/study-room/has-tasks
```

### 3. 크론 작업 동작 방식

- **실행 시간**: 매일 00:00 (한국 시간)
- **실행 로직**:
  1. 모든 학생의 `autoAssignmentSchedules` 조회
  2. `isActive: true`이고 오늘 실행 조건 만족하는 스케줄 필터링
  3. 각 스케줄마다:
     - `selectNextUnits()`로 순차적 단원 선택
     - 완료된 단원, 이미 배정된 단원 제외
     - `studyRoom.assignedTasks`에 과제 추가
     - `lastExecutedAt` 업데이트

## 미완성 프론트엔드 구현 가이드

### branch_user_list.html 업데이트 (우선순위 1)

#### 1. 테이블 헤더에 컬럼 추가
현재 위치: `<thead>` 부분

```html
<th>학년</th>
<th>학교/학원</th>
<th>이름</th>
<th>자동과제 스케줄</th>  <!-- 추가 -->
<th>시리즈</th>
<th>작업</th>
```

#### 2. 테이블 바디에 스케줄 표시 컬럼 추가

```javascript
// fetchBranchStudents() 함수 내 renderTable 부분
function renderTable(users) {
  const html = users.map(user => {
    // 스케줄 개수 조회
    const scheduleCount = user.autoAssignmentSchedules?.length || 0;
    const activeCount = user.autoAssignmentSchedules?.filter(s => s.isActive).length || 0;

    return `
      <tr>
        <td>${user.grade}</td>
        <td>${user.school || '-'}</td>
        <td>
          <a href="#" onclick="openStudentView('${user.grade}', '${user.name}'); return false;">
            ${user.name}
          </a>
        </td>
        <td>
          <button onclick="openScheduleModal('${user.grade}', '${user.name}'); return false;">
            📅 ${scheduleCount}개 (활성: ${activeCount})
          </button>
        </td>
        <td>${user.series || '-'}</td>
        <td>...</td>
      </tr>
    `;
  }).join('');
}
```

#### 3. 학생 이름 클릭 → 새 탭 열기

```javascript
function openStudentView(grade, name) {
  const url = `/branch/logs?grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
}
```

#### 4. 자동과제 관리 모달 추가

**HTML (</body> 전에 추가)**:

```html
<!-- 자동과제 관리 모달 -->
<div id="task-schedule-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:10000; overflow-y:auto;">
  <div style="background:white; max-width:800px; margin:50px auto; border-radius:20px; padding:40px;">
    <h2>자동 과제 관리</h2>
    <p id="modal-student-info">학생: </p>

    <!-- 스케줄 목록 -->
    <div id="schedule-list"></div>

    <!-- 새 스케줄 추가 -->
    <div style="margin-top:30px; padding-top:30px; border-top:2px solid #eee;">
      <h3>새 스케줄 추가</h3>

      <label>빈도:</label>
      <select id="new-frequency">
        <option value="daily">매일</option>
        <option value="weekly">주중 선택</option>
      </select>

      <div id="days-selector" style="display:none; margin-top:10px;">
        <label><input type="checkbox" value="월"> 월</label>
        <label><input type="checkbox" value="화"> 화</label>
        <label><input type="checkbox" value="수"> 수</label>
        <label><input type="checkbox" value="목"> 목</label>
        <label><input type="checkbox" value="금"> 금</label>
        <label><input type="checkbox" value="토"> 토</label>
        <label><input type="checkbox" value="일"> 일</label>
      </div>

      <label>분야/과목 선택:</label>
      <div id="curriculum-checkboxes"></div>

      <label>과제 개수:</label>
      <input type="number" id="new-task-count" min="1" max="5" value="3">

      <button onclick="createSchedule()">스케줄 추가</button>
    </div>

    <button onclick="closeScheduleModal()">닫기</button>
  </div>
</div>
```

**JavaScript**:

```javascript
let currentModalStudent = null;
let curriculumData = null;

// 커리큘럼 데이터 로드
async function loadCurriculum() {
  if (curriculumData) return;
  const res = await fetch('/api/auto-assignment/curriculum');
  curriculumData = await res.json();
}

// 모달 열기
async function openScheduleModal(grade, name) {
  currentModalStudent = { grade, name };
  document.getElementById('modal-student-info').textContent = `학생: ${grade} ${name}`;

  await loadCurriculum();
  renderCurriculumCheckboxes();
  await loadSchedules(grade, name);

  document.getElementById('task-schedule-modal').style.display = 'block';
}

// 모달 닫기
function closeScheduleModal() {
  document.getElementById('task-schedule-modal').style.display = 'none';
  currentModalStudent = null;
}

// 커리큘럼 체크박스 렌더링
function renderCurriculumCheckboxes() {
  const container = document.getElementById('curriculum-checkboxes');
  const fields = curriculumData.curriculum.fields;

  let html = '';
  for (const [fieldName, fieldData] of Object.entries(fields)) {
    html += `<div style="margin:10px 0;">
      <strong>${fieldName}</strong><br>`;

    for (const [subjectName, subjectData] of Object.entries(fieldData.subjects)) {
      html += `<label style="margin-left:20px;">
        <input type="checkbox" class="subject-checkbox"
               data-field="${fieldName}"
               data-subject="${subjectName}">
        ${subjectName}
      </label><br>`;
    }
    html += '</div>';
  }

  container.innerHTML = html;
}

// 스케줄 목록 로드
async function loadSchedules(grade, name) {
  const res = await fetch(`/api/auto-assignment/student/${encodeURIComponent(grade)}/${encodeURIComponent(name)}`);
  const data = await res.json();

  const schedules = data.schedules || [];
  renderScheduleList(schedules);
}

// 스케줄 목록 렌더링
function renderScheduleList(schedules) {
  const container = document.getElementById('schedule-list');

  if (schedules.length === 0) {
    container.innerHTML = '<p>등록된 스케줄이 없습니다.</p>';
    return;
  }

  const html = schedules.map(s => {
    const statusBadge = s.isActive
      ? '<span style="color:green;">●</span> 활성'
      : '<span style="color:gray;">●</span> 중단됨';

    const frequencyText = s.frequency === 'daily'
      ? '매일'
      : `주중: ${s.daysOfWeek.join(', ')}`;

    const lastExec = s.lastExecutedAt
      ? new Date(s.lastExecutedAt).toLocaleString('ko-KR')
      : '아직 실행 안됨';

    return `
      <div style="border:1px solid #ddd; padding:15px; margin:10px 0; border-radius:10px;">
        <strong>${statusBadge}</strong> | ${frequencyText} | 과제 ${s.taskCount}개
        <br>분야: ${s.fields.join(', ')}
        <br>과목: ${s.subjects.join(', ')}
        <br>마지막 실행: ${lastExec}
        <br>
        <button onclick="pauseSchedule('${s.scheduleId}')" ${!s.isActive ? 'disabled' : ''}>일시중단</button>
        <button onclick="resumeSchedule('${s.scheduleId}')" ${s.isActive ? 'disabled' : ''}>재개</button>
        <button onclick="deleteSchedule('${s.scheduleId}')">삭제</button>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

// 스케줄 생성
async function createSchedule() {
  const frequency = document.getElementById('new-frequency').value;
  const taskCount = parseInt(document.getElementById('new-task-count').value);

  let daysOfWeek = [];
  if (frequency === 'weekly') {
    const checkboxes = document.querySelectorAll('#days-selector input:checked');
    daysOfWeek = Array.from(checkboxes).map(cb => cb.value);
    if (daysOfWeek.length === 0) {
      alert('요일을 선택하세요.');
      return;
    }
  }

  const checkboxes = document.querySelectorAll('.subject-checkbox:checked');
  const fields = [...new Set(Array.from(checkboxes).map(cb => cb.dataset.field))];
  const subjects = Array.from(checkboxes).map(cb => cb.dataset.subject);

  if (subjects.length === 0) {
    alert('과목을 선택하세요.');
    return;
  }

  try {
    const res = await fetch('/api/auto-assignment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grade: currentModalStudent.grade,
        name: currentModalStudent.name,
        frequency,
        daysOfWeek,
        fields,
        subjects,
        taskCount
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('스케줄이 생성되었습니다!');
      await loadSchedules(currentModalStudent.grade, currentModalStudent.name);
    } else {
      alert('생성 실패: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('오류 발생');
  }
}

// 스케줄 일시중단
async function pauseSchedule(scheduleId) {
  const res = await fetch(`/api/auto-assignment/pause/${scheduleId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentModalStudent)
  });

  const data = await res.json();
  if (data.success) {
    alert('스케줄이 일시중단되었습니다.');
    await loadSchedules(currentModalStudent.grade, currentModalStudent.name);
  }
}

// 스케줄 재개
async function resumeSchedule(scheduleId) {
  const res = await fetch(`/api/auto-assignment/resume/${scheduleId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentModalStudent)
  });

  const data = await res.json();
  if (data.success) {
    alert('스케줄이 재개되었습니다.');
    await loadSchedules(currentModalStudent.grade, currentModalStudent.name);
  }
}

// 스케줄 삭제
async function deleteSchedule(scheduleId) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  const res = await fetch(`/api/auto-assignment/${scheduleId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentModalStudent)
  });

  const data = await res.json();
  if (data.success) {
    alert('스케줄이 삭제되었습니다.');
    await loadSchedules(currentModalStudent.grade, currentModalStudent.name);
  }
}

// 빈도 선택 변경 시 요일 선택기 표시/숨김
document.getElementById('new-frequency').addEventListener('change', function(e) {
  const daysSelector = document.getElementById('days-selector');
  daysSelector.style.display = e.target.value === 'weekly' ? 'block' : 'none';
});
```

### 슈퍼관리자 페이지도 동일하게 적용

`/super/users` 라우트에서 렌더링하는 페이지에도 위와 동일한 코드 추가.

## 테스트 시나리오

### 1. 스케줄 생성 테스트
1. 관리자 로그인 → 학생 목록
2. 학생의 "자동과제 스케줄" 버튼 클릭
3. 새 스케줄 추가:
   - 빈도: 매일
   - 과목: 생물, 지리
   - 과제 개수: 3
4. "스케줄 추가" 클릭
5. 스케줄 목록에 표시되는지 확인

### 2. 크론 작업 테스트
서버 콘솔에서 다음 실행:
```javascript
const { runAutoAssignmentNow } = require('./config/taskAssignmentCron');
runAutoAssignmentNow();
```

### 3. 학생 알림 테스트
1. 학생 계정으로 로그인
2. 학습실에 과제가 있으면 알림 팝업 표시
3. "오늘 다시 보지 않기" 클릭
4. 로그아웃 후 재로그인 → 알림 안 뜸
5. 다음 날 로그인 → 알림 다시 뜸

## 주요 데이터 흐름

```
관리자
  ↓
스케줄 생성 (POST /api/auto-assignment/create)
  ↓
UserProgress.autoAssignmentSchedules에 저장
  ↓
크론 작업 (매일 00:00)
  ↓
isActive && 오늘 실행 조건 만족?
  ↓
selectNextUnits() → 순차적 단원 선택
  ↓
UserProgress.studyRoom.assignedTasks에 추가
  ↓
학생 로그인
  ↓
GET /api/study-room/has-tasks
  ↓
과제 있으면 알림 팝업 표시
```

## 구현 완료 체크리스트

- [x] curriculum.js 생성
- [x] taskAssignmentCron.js 생성
- [x] UserProgress 스키마 업데이트
- [x] 7개 API 엔드포인트 구현
- [x] 크론 작업 서버 통합
- [x] 학생 알림 팝업 구현
- [ ] branch_user_list.html 업데이트
- [ ] super admin 페이지 업데이트
- [ ] 학생 이름 클릭 → 새 탭 기능
- [ ] 전체 시스템 테스트
