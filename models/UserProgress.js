const mongoose = require('mongoose');

/**
 * 사용자 학습 진행 데이터 스키마
 * localStorage 데이터를 서버에 영구 보관
 */
const userProgressSchema = new mongoose.Schema({
  // 사용자 식별 정보
  grade: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  school: {
    type: String,
    default: ''
  },

  // 어휘퀴즈 데이터
  vocabularyQuiz: {
    totalScore: {
      type: Number,
      default: 0,
      min: 0
    },
    quizCount: {
      type: Number,
      default: 0,
      min: 0
    },
    avgScore: {
      type: Number,
      default: 0,
      min: 0
      // max 제한 제거 - 보너스 점수로 100점 초과 가능
    },
    totalCoins: {
      type: Number,
      default: 0,
      min: 0
    },
    usedCoins: {
      type: Number,
      default: 0,
      min: 0
    },
    currentRank: {
      type: Number,
      default: 0
    },
    previousRank: {
      type: Number,
      default: 0
    },
    lastRankUpdate: {
      type: Date,
      default: Date.now
    }
  },

  // 어휘학습 이력 데이터
  vocabularyQuizHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    vocabCount: {
      type: Number,
      required: true,
      min: 15,
      max: 50
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
      // max 제한 제거 - 보너스 점수로 100점 초과 가능
    }
  }],

  // 독서 감상문 제출 이력
  readingReports: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'kakao'],
      required: true
    },
    storyId: {
      type: String,
      default: 'whale_island'  // 기본값: 시즌1
    },
    storyTitle: {
      type: String,
      default: '푸른 고래섬의 비밀 모험단 시즌 1: 푸른 고래섬 탐험'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    month: {
      type: String, // 형식: "2025-01"
      required: true
    }
  }],

  // 학습실 과제 데이터
  studyRoom: {
    assignedTasks: [{
      id: String,           // 단원 ID (예: "geo_01") - AI 과제용
      unitId: String,       // 단원 ID (관리자 과제용)
      taskId: String,       // 과제 ID (기존 호환성)
      title: String,
      unitTitle: String,    // 단원 제목 (예: "생명과학 01") - 자동과제부여용
      series: String,       // 시리즈 (예: "BRAIN업")
      seriesName: String,   // 시리즈 이름 (예: "BRAIN업") - 자동과제부여용
      field: String,        // 분야 (예: "사회분야")
      fieldName: String,    // 분야 이름 - 자동과제부여용
      domain: String,       // 분야 (기존 호환성)
      subject: String,      // 과목 (예: "지리")
      subjectName: String,  // 과목 이름 - 자동과제부여용
      isAI: {              // AI 자동 부여 여부
        type: Boolean,
        default: false
      },
      isAutoAssigned: {    // 자동과제부여 여부
        type: Boolean,
        default: false
      },
      assignedAt: Date,     // 과제 부여 시간
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
      },
      completedAt: Date,
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    }],
    lastAIAssignedAt: Date,  // 마지막 AI 과제 부여 시간

    // 자동 과제 스케줄 데이터
    autoTaskSchedules: [{
      scheduleId: {
        type: String,
        required: true
      },
      subjects: [{          // 선택된 과목들 (예: ["science/bio", "social/geo"])
        type: String
      }],
      days: [{              // 실행 요일 (0=일요일, 1=월요일, ..., 6=토요일)
        type: Number,
        min: 0,
        max: 6
      }],
      taskCount: {          // 1일 과제 개수 (1-5)
        type: Number,
        min: 1,
        max: 5,
        default: 1
      },
      isActive: {           // 활성화 여부 (일시정지 시 false)
        type: Boolean,
        default: true
      },
      createdAt: {          // 생성일시
        type: Date,
        default: Date.now
      },
      lastExecutedAt: Date, // 마지막 실행일시
      nextScheduledDate: Date // 다음 예정일시
    }]
  },

  // 메뉴 완료 상태
  menuCompletion: {
    type: Map,
    of: Boolean,
    default: new Map()
  },

  // 종합리포트 뱃지 데이터
  reportBadge: {
    radarAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    totalProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // 단원별 학습 진행 데이터 (본문학습 채점 결과 등)
  unitProgress: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },

  // 완료된 페이지 목록
  completedPages: [{
    type: String
  }],

  // 마지막 업데이트 시간
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

// 복합 인덱스: grade + name 조합으로 빠른 조회
userProgressSchema.index({ grade: 1, name: 1 }, { unique: true });

// 마지막 업데이트 시간 자동 갱신
userProgressSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// 평균 점수 자동 계산
userProgressSchema.pre('save', function(next) {
  if (this.vocabularyQuiz.quizCount > 0) {
    this.vocabularyQuiz.avgScore = Math.round(
      this.vocabularyQuiz.totalScore / this.vocabularyQuiz.quizCount
    );
  }
  next();
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
