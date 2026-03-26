const fs = require('fs');
const content = fs.readFileSync('/Users/dandan/Desktop/brainmoon_academy0326/public/BRAINUP/worldlit/on_world2_content.js', 'utf8');

// 문제 유닛들의 paragraphMain 확인
const units = ['02', '11', '12', '15', '16'];

units.forEach(num => {
  const unitKey = `on_world2_${num}`;
  const unitStart = content.indexOf(`${unitKey}:`);
  if (unitStart === -1) return;

  const nextUnit = `on_world2_${(parseInt(num)+1).toString().padStart(2, '0')}:`;
  const unitEnd = content.indexOf(nextUnit, unitStart);
  const unitContent = unitEnd > 0 ? content.slice(unitStart, unitEnd) : content.slice(unitStart, unitStart + 10000);

  // paragraphMain 추출
  const pmMatch = unitContent.match(/paragraphMain:\s*\[([\s\S]*?)\]/);
  if (!pmMatch) return;

  const pmRaw = pmMatch[1];
  const paragraphs = pmRaw.match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];

  // q2_opts 추출
  const q2OptsMatch = unitContent.match(/q2_opts:\s*\[([\s\S]*?)\]/);
  if (!q2OptsMatch) return;

  const optsRaw = q2OptsMatch[1];
  const opts = optsRaw.match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];

  // answerKey q2 추출
  const ansMatch = unitContent.match(/answerKey:\s*\{[^}]*q2:\s*['"]([^'"]+)['"][^}]*\}/);
  const q2Answer = ansMatch ? ansMatch[1] : '?';

  console.log(`\n=== ${unitKey} (현재 정답: ${q2Answer}번) ===`);
  console.log('paragraphMain:');
  paragraphs.forEach((p, i) => console.log(`  ${i+1}문단: ${p.substring(0, 50)}...`));
  console.log('\nq2_opts:');
  opts.forEach((o, i) => console.log(`  ${i+1}번: ${o}`));
});
