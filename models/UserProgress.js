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
      min: 0,
      max: 100
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

  // 학습실 과제 데이터
  studyRoom: {
    assignedTasks: [{
      taskId: String,
      title: String,
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
    }]
  },

  // 메뉴 완료 상태
  menuCompletion: {
    type: Map,
    of: Boolean,
    default: new Map()
  },

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
