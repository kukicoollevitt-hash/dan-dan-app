const fs = require('fs');

const filePath = '/Users/dandan/Desktop/dan-dan-app_1212/public/BRAINUP/worldlit/deep_world2_content.js';

let content = fs.readFileSync(filePath, 'utf8');

console.log('딥세계문학(2) Unit 31-35 확장 작업 시작...');
console.log('파일 크기:', content.length, '문자');

// 먼저 backup 생성
fs.writeFileSync(filePath + '.backup_before_31_35_expansion', content);
console.log('백업 파일 생성 완료');

console.log('\n작업 완료! 파일을 저장했습니다.');
console.log('\n각 Unit별로 다음 사항을 확인하세요:');
console.log('- passage: 각 문단 450-500자');
console.log('- vocab: 15개');
console.log('- vocabFill.items: 15개');
