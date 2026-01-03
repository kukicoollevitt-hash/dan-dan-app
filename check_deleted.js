const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const UserProgress = require('./models/UserProgress');

    console.log('=== 삭제된 학생들 확인 ===\n');

    // 브레딥 학생 찾기
    const bredip = await UserProgress.find({ name: /브레딥|브.*딥/ }).lean();
    console.log('브레딥 학생 검색 결과:', bredip.length, '명');
    bredip.forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: deleted=${u.deleted}, coins=${u.vocabularyQuiz?.totalCoins || 0}`);
    });

    // test 학생 찾기
    const testStudents = await UserProgress.find({ name: /test/i }).lean();
    console.log('\ntest 학생 검색 결과:', testStudents.length, '명');
    testStudents.forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: deleted=${u.deleted}, coins=${u.vocabularyQuiz?.totalCoins || 0}`);
    });

    // 삭제된 학생들 전체
    const allDeleted = await UserProgress.find({ deleted: true }).lean();
    console.log('\n전체 삭제된 학생 수:', allDeleted.length, '명');
    allDeleted.slice(0, 10).forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: coins=${u.vocabularyQuiz?.totalCoins || 0}`);
    });

    // 삭제되지 않았지만 코인이 있는 학생들 중 삭제 상태 체크
    console.log('\n=== 코인이 있는 학생들의 deleted 필드 상태 ===');
    const coinsUsers = await UserProgress.find({
        'vocabularyQuiz.totalCoins': { $gt: 0 }
    }).lean();
    console.log('총', coinsUsers.length, '명');
    coinsUsers.forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: deleted=${u.deleted}, coins=${u.vocabularyQuiz?.totalCoins || 0}`);
    });

    mongoose.disconnect();
}).catch(err => {
    console.error('DB 오류:', err);
    process.exit(1);
});
