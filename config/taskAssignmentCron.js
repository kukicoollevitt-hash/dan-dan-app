const cron = require('node-cron');
const UserProgress = require('../models/UserProgress');
const { getAllUnitIds, selectNextUnits } = require('./curriculum');

/**
 * 자동 과제 부여 크론 작업
 * 매일 0:00에 실행되어 활성화된 모든 스케줄을 확인하고 과제 부여
 */

// 요일 한글 -> 숫자 매핑 (일요일=0, 월요일=1, ...)
const DAY_OF_WEEK_MAP = {
  '일': 0,
  '월': 1,
  '화': 2,
  '수': 3,
  '목': 4,
  '금': 5,
  '토': 6
};

/**
 * 오늘이 스케줄 실행 요일인지 확인
 * @param {Object} schedule - 스케줄 객체
 * @returns {boolean} 실행 여부
 */
function shouldExecuteToday(schedule) {
  const today = new Date();
  const todayDay = today.getDay(); // 0(일) ~ 6(토)

  if (schedule.frequency === 'daily') {
    return true;
  }

  if (schedule.frequency === 'weekly') {
    // daysOfWeek 배열에 오늘 요일이 포함되어 있는지 확인
    return schedule.daysOfWeek.some(day => DAY_OF_WEEK_MAP[day] === todayDay);
  }

  return false;
}

/**
 * 단일 스케줄 실행: 과제 선택 및 부여
 * @param {Object} userProgress - 학생 UserProgress 문서
 * @param {Object} schedule - 실행할 스케줄
 */
async function executeSchedule(userProgress, schedule) {
  try {
    // 1. 이미 완료된 단원 ID 추출
    const completedUnitIds = [];
    userProgress.menuCompletion.forEach((isCompleted, unitId) => {
      if (isCompleted) {
        completedUnitIds.push(unitId);
      }
    });

    // 2. 이미 학습실에 배정된 단원 ID 추출
    const assignedUnitIds = userProgress.studyRoom.assignedTasks
      .filter(task => task.status !== 'completed')
      .map(task => task.id || task.unitId || task.taskId)
      .filter(id => id); // null/undefined 제거

    // 3. ★ 분야별로 각각 taskCount개씩 과제 선택
    const allSelectedUnits = [];
    const newTasks = [];

    for (const fieldName of schedule.fields) {
      // 해당 분야의 단원만 추출
      const fieldUnits = getAllUnitIds([fieldName], schedule.subjects);

      // 해당 분야에서 미완료/미배정 단원 선택
      const selectedForField = selectNextUnits(
        fieldUnits,
        completedUnitIds,
        [...assignedUnitIds, ...allSelectedUnits], // 이번에 선택된 것도 제외
        schedule.taskCount
      );

      // 선택된 단원들을 태스크로 변환
      for (const unitId of selectedForField) {
        allSelectedUnits.push(unitId);
        newTasks.push({
          id: unitId,
          unitId: unitId,
          title: `자동 부여 과제: ${unitId}`,
          series: 'BRAIN온',
          field: fieldName,
          subject: getSubjectFromUnitId(unitId),
          isAI: true,
          assignedAt: new Date(),
          status: 'pending',
          progress: 0
        });
      }

      if (selectedForField.length > 0) {
        console.log(`[크론] ${userProgress.grade} ${userProgress.name} - ${fieldName}: ${selectedForField.length}개 선택 (${selectedForField.join(', ')})`);
      }
    }

    // 4. 선택된 단원을 학습실에 추가
    if (newTasks.length > 0) {
      userProgress.studyRoom.assignedTasks.push(...newTasks);
      userProgress.studyRoom.lastAIAssignedAt = new Date();

      console.log(`[크론] ${userProgress.grade} ${userProgress.name} - 총 ${newTasks.length}개 과제 부여 완료`);
    } else {
      console.log(`[크론] ${userProgress.grade} ${userProgress.name} - 부여 가능한 과제 없음 (모두 완료 또는 배정됨)`);
    }

    // 5. 스케줄의 마지막 실행 시간 업데이트
    const scheduleIndex = userProgress.studyRoom.autoAssignmentSchedules.findIndex(
      s => s.scheduleId === schedule.scheduleId
    );
    if (scheduleIndex >= 0) {
      userProgress.studyRoom.autoAssignmentSchedules[scheduleIndex].lastExecutedAt = new Date();
    }

    // 6. 저장
    await userProgress.save();

    return newTasks.length;
  } catch (error) {
    console.error(`[크론 에러] ${userProgress.grade} ${userProgress.name} 스케줄 ${schedule.scheduleId} 실행 실패:`, error);
    return 0;
  }
}

/**
 * unitId로부터 과목명 추출
 * @param {string} unitId - 단원 ID (예: 'bio_01', 'geo_02')
 * @returns {string} 과목명
 */
function getSubjectFromUnitId(unitId) {
  const prefix = unitId.split('_')[0];
  const subjectMap = {
    'bio': '생물',
    'chem': '화학',
    'physics': '물리',
    'earth': '지구과학',
    'geo': '지리',
    'society': '사회문화',
    'law': '법',
    'pol': '정치경제',
    'classic': '고전문학',
    'modern': '현대문학',
    'world1': '세계문학(1)',
    'world2': '세계문학(2)',
    'people1': '인물(1)',
    'people2': '인물(2)'
  };
  return subjectMap[prefix] || prefix;
}

/**
 * 모든 학생의 활성화된 스케줄 확인 및 실행
 */
async function runAutoAssignment() {
  const startTime = new Date();
  console.log(`\n========================================`);
  console.log(`[크론 시작] ${startTime.toLocaleString('ko-KR')} - 자동 과제 부여 실행`);
  console.log(`========================================`);

  try {
    // 자동 과제 스케줄이 있는 모든 학생 조회
    const students = await UserProgress.find({
      'studyRoom.autoAssignmentSchedules.0': { $exists: true }
    });

    console.log(`[크론] 스케줄이 있는 학생: ${students.length}명`);

    let totalExecuted = 0;
    let totalTasksAssigned = 0;

    for (const student of students) {
      // 활성화된 스케줄만 필터링
      const activeSchedules = student.studyRoom.autoAssignmentSchedules.filter(
        schedule => schedule.isActive && shouldExecuteToday(schedule)
      );

      if (activeSchedules.length === 0) {
        continue;
      }

      console.log(`\n[크론] ${student.grade} ${student.name} - 실행할 스케줄: ${activeSchedules.length}개`);

      // 각 스케줄 실행
      for (const schedule of activeSchedules) {
        const tasksAssigned = await executeSchedule(student, schedule);
        totalTasksAssigned += tasksAssigned;
        totalExecuted++;
      }
    }

    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\n========================================`);
    console.log(`[크론 완료] ${endTime.toLocaleString('ko-KR')}`);
    console.log(`- 실행된 스케줄: ${totalExecuted}개`);
    console.log(`- 부여된 과제: ${totalTasksAssigned}개`);
    console.log(`- 소요 시간: ${duration}초`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error('[크론 치명적 에러] 자동 과제 부여 실패:', error);
  }
}

/**
 * 크론 작업 시작
 */
function startAutoAssignmentCron() {
  // 매일 0:00에 실행
  // 크론 표현식: '0 0 * * *' = "초 분 시 일 월 요일"
  // - 0초 0분 0시 매일 매월 모든 요일
  const job = cron.schedule('0 0 * * *', () => {
    runAutoAssignment();
  }, {
    timezone: 'Asia/Seoul' // 한국 시간 기준
  });

  console.log('[크론 초기화] 자동 과제 부여 크론 작업이 시작되었습니다.');
  console.log('[크론 초기화] 실행 시간: 매일 00:00 (한국 시간)');

  return job;
}

/**
 * 테스트용: 즉시 실행
 */
async function runAutoAssignmentNow() {
  console.log('[크론 테스트] 자동 과제 부여를 즉시 실행합니다...');
  await runAutoAssignment();
}

module.exports = {
  startAutoAssignmentCron,
  runAutoAssignmentNow
};
