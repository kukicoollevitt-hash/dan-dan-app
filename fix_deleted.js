const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const UserProgress = require('./models/UserProgress');

    console.log('=== 삭제 처리할 학생들 ===\n');

    // 브레인딥 학생 삭제 처리
    const bredipResult = await UserProgress.updateMany(
        { name: '브레인딥' },
        { $set: { deleted: true } }
    );
    console.log('브레인딥 학생 삭제 처리:', bredipResult.modifiedCount, '명');

    // test 학생 삭제 처리
    const testResult = await UserProgress.updateMany(
        { name: 'test' },
        { $set: { deleted: true } }
    );
    console.log('test 학생 삭제 처리:', testResult.modifiedCount, '명');

    // 확인
    console.log('\n=== 삭제 후 확인 ===');
    const deletedUsers = await UserProgress.find({ deleted: true }).lean();
    console.log('삭제된 학생 수:', deletedUsers.length, '명');
    deletedUsers.forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: coins=${u.vocabularyQuiz?.totalCoins || 0}`);
    });

    mongoose.disconnect();
}).catch(err => {
    console.error('DB 오류:', err);
    process.exit(1);
});
