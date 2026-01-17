/**
 * 단단국어 커리큘럼 데이터 구조
 * - 모든 시리즈(BRAIN온/업/핏/딥)의 분야/과목/단원 매핑 정보
 */

// 분야별 과목 및 단원 정보
const CURRICULUM = {
  fields: {
    '과학분야': {
      id: 'science',
      subjects: {
        '생물': {
          id: 'bio',
          unitCount: 20,
          unitPrefix: 'bio'
        },
        '화학': {
          id: 'chem',
          unitCount: 20,
          unitPrefix: 'chem'
        },
        '물리': {
          id: 'physics',
          unitCount: 20,
          unitPrefix: 'physics'
        },
        '지구과학': {
          id: 'earth',
          unitCount: 20,
          unitPrefix: 'earth'
        }
      }
    },
    '사회분야': {
      id: 'social',
      subjects: {
        '지리': {
          id: 'geo',
          unitCount: 4,
          unitPrefix: 'geo'
        },
        '사회문화': {
          id: 'society',
          unitCount: 20,
          unitPrefix: 'society'
        },
        '법': {
          id: 'law',
          unitCount: 20,
          unitPrefix: 'law'
        },
        '정치경제': {
          id: 'pol',
          unitCount: 20,
          unitPrefix: 'pol'
        }
      }
    },
    '한국문학': {
      id: 'korlit',
      subjects: {
        '고전문학': {
          id: 'classic',
          unitCount: 40,
          unitPrefix: 'classic'
        },
        '현대문학': {
          id: 'modern',
          unitCount: 40,
          unitPrefix: 'modern'
        }
      }
    },
    '세계문학': {
      id: 'worldlit',
      subjects: {
        '세계문학(1)': {
          id: 'world1',
          unitCount: 40,
          unitPrefix: 'world1'
        },
        '세계문학(2)': {
          id: 'world2',
          unitCount: 40,
          unitPrefix: 'world2'
        }
      }
    },
    '인물분야': {
      id: 'person',
      subjects: {
        '인물(1)': {
          id: 'people1',
          unitCount: 40,
          unitPrefix: 'people1'
        },
        '인물(2)': {
          id: 'people2',
          unitCount: 40,
          unitPrefix: 'people2'
        }
      }
    }
  }
};

/**
 * 특정 과목의 모든 단원 ID 목록 생성
 * @param {string} unitPrefix - 단원 접두사 (예: 'geo', 'bio')
 * @param {number} unitCount - 단원 개수
 * @returns {string[]} 단원 ID 배열 (예: ['geo_01', 'geo_02', ...])
 */
function generateUnitIds(unitPrefix, unitCount) {
  const units = [];
  for (let i = 1; i <= unitCount; i++) {
    const unitNum = String(i).padStart(2, '0');
    units.push(`${unitPrefix}_${unitNum}`);
  }
  return units;
}

/**
 * 선택된 분야/과목에서 모든 단원 ID 추출
 * @param {string[]} fields - 선택된 분야 목록
 * @param {string[]} subjects - 선택된 과목 목록
 * @returns {string[]} 모든 단원 ID 배열
 */
function getAllUnitIds(fields, subjects) {
  const allUnits = [];

  for (const fieldName of fields) {
    const field = CURRICULUM.fields[fieldName];
    if (!field) continue;

    for (const subjectName of subjects) {
      const subject = field.subjects[subjectName];
      if (!subject) continue;

      const units = generateUnitIds(subject.unitPrefix, subject.unitCount);
      allUnits.push(...units);
    }
  }

  return allUnits;
}

/**
 * 단원 ID로부터 분야/과목 정보 추출
 * @param {string} unitId - 단원 ID (예: 'geo_01')
 * @returns {object|null} {field, subject, unitPrefix} 또는 null
 */
function getUnitInfo(unitId) {
  const prefix = unitId.split('_')[0];

  for (const [fieldName, field] of Object.entries(CURRICULUM.fields)) {
    for (const [subjectName, subject] of Object.entries(field.subjects)) {
      if (subject.unitPrefix === prefix) {
        return {
          field: fieldName,
          subject: subjectName,
          unitPrefix: prefix,
          fieldId: field.id,
          subjectId: subject.id
        };
      }
    }
  }

  return null;
}

/**
 * 완료되지 않은 단원 중에서 다음 과제를 선택
 * @param {string[]} availableUnits - 선택 가능한 모든 단원 ID
 * @param {string[]} completedUnitIds - 이미 완료된 단원 ID
 * @param {string[]} assignedUnitIds - 이미 학습실에 배정된 단원 ID
 * @param {number} count - 부여할 과제 개수
 * @returns {string[]} 선택된 단원 ID 배열
 */
function selectNextUnits(availableUnits, completedUnitIds, assignedUnitIds, count) {
  // 완료되지 않고 배정되지도 않은 단원만 필터링
  const unfinishedUnits = availableUnits.filter(unitId =>
    !completedUnitIds.includes(unitId) && !assignedUnitIds.includes(unitId)
  );

  // 요청된 개수만큼 또는 가능한 만큼만 선택 (순차적으로)
  return unfinishedUnits.slice(0, count);
}

module.exports = {
  CURRICULUM,
  generateUnitIds,
  getAllUnitIds,
  getUnitInfo,
  selectNextUnits
};
