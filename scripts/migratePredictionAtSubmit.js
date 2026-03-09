/**
 * 기존 MockExamResult에 predictionAtSubmit 값 마이그레이션
 * 2회차 이상의 결과에 대해 이전 회차 + 보완학습 기반 예측값 계산 후 저장
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dandan';

// 스키마 정의 (필요한 필드만)
const MockExamResultSchema = new mongoose.Schema({
  userId: String,
  examId: String,
  studentInfo: {
    phoneNumber: String,
    studentName: String
  },
  wrongAnswers: [{
    questionNum: Number
  }],
  completedAt: Date,
  predictionAtSubmit: mongoose.Schema.Types.Mixed
}, { collection: 'mockexamresults' });

const MockExamUserSchema = new mongoose.Schema({
  phone: String,
  name: String
}, { collection: 'mockexamusers' });

const SupplementResultSchema = new mongoose.Schema({
  userId: String,
  phone: String,
  examId: String,
  correctCount: Number,
  totalQuestions: Number,
  isGraded: Boolean,
  completedAt: Date
}, { collection: 'supplementresults' });

const MockExamRecommendTaskSchema = new mongoose.Schema({
  userId: String,
  phone: String,
  parentArea: String,
  supplementExamId: String,
  correctCount: Number,
  totalCount: Number
}, { collection: 'mockexamrecommendtasks' });

const MockExamResult = mongoose.model('MockExamResult', MockExamResultSchema);
const MockExamUser = mongoose.model('MockExamUser', MockExamUserSchema);
const SupplementResult = mongoose.model('SupplementResult', SupplementResultSchema);
const MockExamRecommendTask = mongoose.model('MockExamRecommendTask', MockExamRecommendTaskSchema);

// 시험별 영역별 문항 번호
const areaQuestionsByExam = {
  'korean_mock_1': {
    speech: [1, 2, 4, 5, 6, 24, 25, 26, 27, 28, 29, 30],
    grammar: [3, 7, 8, 9, 10],
    reading: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    literature: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
  },
  'korean_mock_2': {
    speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    grammar: [11, 12, 13, 14, 15],
    reading: [16, 17, 18, 19, 20, 21, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    literature: [22, 23, 24, 25, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
  },
  'korean_mock_3': {
    speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    grammar: [11, 12, 13, 14, 15],
    reading: [20, 21, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
    literature: [16, 17, 18, 19, 25, 26, 27, 38, 39, 40, 41, 42, 43, 44, 45]
  },
  'korean_mock_4': {
    speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    grammar: [11, 12, 13, 14, 15],
    reading: [21, 22, 23, 24, 25, 29, 30, 31, 32, 33, 34, 38, 39, 40, 41, 42],
    literature: [16, 17, 18, 19, 20, 26, 27, 28, 34, 35, 36, 37, 43, 44, 45]
  }
};

// 보완학습 영역 매핑
const examAreaMap = {
  'supplement_classic_poem': 'literature', 'supplement_classic_poem_geumrusa': 'literature',
  'supplement_classic_prose': 'literature', 'supplement_classic_prose_nakseong': 'literature',
  'supplement_writing': 'speech', 'supplement_grammar_classic': 'grammar',
  'supplement_grammar_classic_case': 'grammar', 'supplement_modern_novel': 'literature',
  'supplement_speech': 'speech', 'supplement_modern_poem': 'literature',
  'supplement_grammar_modern': 'grammar', 'supplement_grammar_modern_semantic': 'grammar',
  'supplement_reading_science': 'reading', 'supplement_reading_science_tech': 'reading',
  'supplement_reading_law': 'reading', 'supplement_reading_law_property': 'reading',
  'supplement_reading_social': 'reading', 'supplement_reading_tech': 'reading',
  'supplement_reading_humanities': 'reading', 'supplement_reading_humanities_art': 'reading',
  'supplement_reading_art': 'reading', 'supplement_speech_integrated': 'speech',
  'supplement_speech_integrated_job': 'speech', 'supplement_speech_food': 'speech',
  'supplement_writing_subscription': 'speech', 'supplement_literature_poem_sea': 'literature',
  'supplement_literature_novel_rondo': 'literature'
};

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // 2회차 이상의 모든 결과 조회 (기존 잘못된 값도 재계산)
    const resultsToMigrate = await MockExamResult.find({
      examId: { $in: ['korean_mock_2', 'korean_mock_3', 'korean_mock_4'] }
    });

    console.log(`📋 마이그레이션 대상: ${resultsToMigrate.length}개 결과`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const result of resultsToMigrate) {
      try {
        // 사용자 정보 조회
        let user = null;
        if (mongoose.Types.ObjectId.isValid(result.userId)) {
          user = await MockExamUser.findById(result.userId);
        }

        // 현재 회차 결과 사용 (레이더 차트와 동일: 현재 회차 + 보완학습)

        // 보완학습 데이터 조회
        const supplementQueryConditions = [{ userId: result.userId }];
        if (user?.phone) supplementQueryConditions.push({ phone: user.phone });
        if (result.studentInfo?.phoneNumber) supplementQueryConditions.push({ phone: result.studentInfo.phoneNumber });

        // 모든 보완학습 조회 (레이더 차트 supplement-progress API와 동일)
        const supplementResults = await SupplementResult.find({
          $or: supplementQueryConditions,
          isGraded: true
        });

        const completedTasks = await MockExamRecommendTask.find({
          $or: supplementQueryConditions,
          status: 'completed'
        });

        // 보완학습 영역별 집계
        const supplementProgress = {
          speech: { correct: 0, total: 0 },
          grammar: { correct: 0, total: 0 },
          reading: { correct: 0, total: 0 },
          literature: { correct: 0, total: 0 }
        };

        supplementResults.forEach(sr => {
          const parentArea = examAreaMap[sr.examId];
          if (parentArea && supplementProgress[parentArea]) {
            supplementProgress[parentArea].correct += sr.correctCount || 0;
            supplementProgress[parentArea].total += sr.totalQuestions || 0;
          }
        });

        const alreadyCountedExamIds = new Set(supplementResults.map(r => r.examId));
        completedTasks.forEach(task => {
          // 이미 SupplementResult에서 집계된 보완학습이면 스킵 (중복 방지)
          if (task.supplementExamId && alreadyCountedExamIds.has(task.supplementExamId)) return;
          const parentArea = task.parentArea;
          const taskTotal = task.totalCount || 5;
          const taskCorrect = task.correctCount || Math.round(taskTotal * (task.avgRate || 70) / 100);
          if (parentArea && supplementProgress[parentArea]) {
            supplementProgress[parentArea].correct += taskCorrect;
            supplementProgress[parentArea].total += taskTotal;
          }
        });

        // 누적 예측값 계산: (현재 회차까지 모든 회차 + 보완학습)
        const currentWrongSet = new Set((result.wrongAnswers || []).map(w => w.questionNum));
        const currentExamId = result.examId;
        const roundMatch = currentExamId.match(/korean_mock_(\d+)/);
        const currentRound = roundMatch ? parseInt(roundMatch[1]) : 1;

        // 1. 이전 회차들의 결과 조회 (MockExamResult용 쿼리 조건 별도 구성)
        const mockExamQueryConditions = [{ userId: result.userId }];
        if (user?.phone) mockExamQueryConditions.push({ 'studentInfo.phoneNumber': user.phone });
        if (result.studentInfo?.phoneNumber) mockExamQueryConditions.push({ 'studentInfo.phoneNumber': result.studentInfo.phoneNumber });

        const previousResults = await MockExamResult.find({
          $or: mockExamQueryConditions,
          examId: { $in: Array.from({ length: currentRound - 1 }, (_, i) => `korean_mock_${i + 1}`) }
        }).sort({ examId: 1, completedAt: -1 });

        // 각 회차별로 최신 결과 1개씩만 사용 (completedAt 기준 정렬 후 첫 번째)
        const latestByExam = {};
        previousResults.forEach(r => {
          const examId = r.examId;
          if (!latestByExam[examId] || r.completedAt > latestByExam[examId].completedAt) {
            latestByExam[examId] = r;
          }
        });

        // 2. 누적 영역별 합계 계산 (이전 회차들)
        const cumulativeTotals = {
          speech: { correct: 0, total: 0 },
          grammar: { correct: 0, total: 0 },
          reading: { correct: 0, total: 0 },
          literature: { correct: 0, total: 0 }
        };

        Object.values(latestByExam).forEach(prevResult => {
          const prevWrongSet = new Set((prevResult.wrongAnswers || []).map(w => w.questionNum));
          const prevAreaQuestions = areaQuestionsByExam[prevResult.examId] || areaQuestionsByExam['korean_mock_1'];

          ['speech', 'grammar', 'reading', 'literature'].forEach(area => {
            const questions = prevAreaQuestions[area];
            const wrongCount = questions.filter(q => prevWrongSet.has(q)).length;
            cumulativeTotals[area].correct += questions.length - wrongCount;
            cumulativeTotals[area].total += questions.length;
          });
        });

        // 3. 예측값 계산: (이전 회차들 누적 + 보완학습) - 현재 회차는 제외!
        // 예측 = "이번 회차를 풀기 전 예상 점수"
        const predictionScores = {};
        let totalPredCorrect = 0;
        let totalPredTotal = 0;

        ['speech', 'grammar', 'reading', 'literature'].forEach(area => {
          const cumulativeCorrect = cumulativeTotals[area].correct;
          const cumulativeTotal = cumulativeTotals[area].total;

          const suppCorrect = supplementProgress[area].correct;
          const suppTotal = supplementProgress[area].total;

          const areaCorrect = cumulativeCorrect + suppCorrect;
          const areaTotal = cumulativeTotal + suppTotal;
          predictionScores[area] = areaTotal > 0 ? Math.round((areaCorrect / areaTotal) * 100) : 0;

          totalPredCorrect += areaCorrect;
          totalPredTotal += areaTotal;
        });

        predictionScores.avg = totalPredTotal > 0 ? Math.round((totalPredCorrect / totalPredTotal) * 100) : 0;

        // 저장
        await MockExamResult.updateOne(
          { _id: result._id },
          { $set: { predictionAtSubmit: predictionScores } }
        );

        console.log(`✅ ${result.studentInfo?.studentName || result.userId} - ${result.examId}: 예측값 저장 완료 (avg: ${predictionScores.avg}%)`);
        successCount++;

      } catch (err) {
        console.error(`❌ ${result._id} 처리 실패:`, err.message);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log('📊 마이그레이션 완료');
    console.log(`   - 성공: ${successCount}건`);
    console.log(`   - 스킵: ${skipCount}건`);
    console.log(`   - 실패: ${errorCount}건`);
    console.log('========================================');

  } catch (err) {
    console.error('❌ 마이그레이션 실패:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB 연결 종료');
  }
}

migrate();
