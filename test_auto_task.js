// 자동과제부여 테스트 스크립트
const http = require('http');

console.log('🧪 자동과제부여 테스트 시작...\n');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/test/auto-task-trigger',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 응답 수신:');
    console.log(data);
    console.log('\n💡 서버 로그를 확인하세요!');
    console.log('   자동과제부여 실행 결과가 서버 콘솔에 출력됩니다.\n');
  });
});

req.on('error', (error) => {
  console.error('❌ 오류 발생:', error);
});

req.end();
