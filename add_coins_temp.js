const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const User = require('./models/UserProgress');

    const user = await User.findOne({ name: '나최종', grade: '6학년' });

    if (!user) {
        console.log('❌ 학생을 찾을 수 없습니다.');
        mongoose.disconnect();
        return;
    }

    console.log('=== 현재 상태 ===');
    console.log('이름:', user.name);
    console.log('학년:', user.grade);
    console.log('총 획득 뱃지:', user.vocabularyQuiz?.totalCoins || 0);
    console.log('사용한 뱃지:', user.vocabularyQuiz?.usedCoins || 0);
    console.log('사용 가능 뱃지:', (user.vocabularyQuiz?.totalCoins || 0) - (user.vocabularyQuiz?.usedCoins || 0));

    await User.updateOne(
        { _id: user._id },
        { $inc: { 'vocabularyQuiz.totalCoins': 40 } }
    );

    const updated = await User.findById(user._id);
    console.log('\n=== 40 뱃지 추가 후 ===');
    console.log('총 획득 뱃지:', updated.vocabularyQuiz?.totalCoins || 0);
    console.log('사용한 뱃지:', updated.vocabularyQuiz?.usedCoins || 0);
    console.log('사용 가능 뱃지:', (updated.vocabularyQuiz?.totalCoins || 0) - (updated.vocabularyQuiz?.usedCoins || 0));

    mongoose.disconnect();
}).catch(err => {
    console.error('DB 연결 오류:', err);
    process.exit(1);
});
