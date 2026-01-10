const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const User = require('./models/User');

    console.log('=== User 모델에서 삭제된 학생들 확인 ===\n');

    // 브레인딥 학생 찾기
    const bredip = await User.find({ name: /브레인딥|브.*딥/ }).lean();
    console.log('브레인딥 학생 검색 결과:', bredip.length, '명');
    bredip.forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: deleted=${u.deleted}, phone=${u.phone || u.phoneNumber}`);
    });

    // test 학생 찾기
    const testStudents = await User.find({ name: /test/i }).lean();
    console.log('\ntest 학생 검색 결과:', testStudents.length, '명');
    testStudents.forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: deleted=${u.deleted}, phone=${u.phone || u.phoneNumber}`);
    });

    // 삭제된 학생들 전체
    const allDeleted = await User.find({ deleted: true }).lean();
    console.log('\n전체 삭제된 학생 수:', allDeleted.length, '명');
    allDeleted.forEach(u => {
        console.log(`  - ${u.grade} ${u.name}: phone=${u.phone || u.phoneNumber}`);
    });

    mongoose.disconnect();
}).catch(err => {
    console.error('DB 오류:', err);
    process.exit(1);
});
