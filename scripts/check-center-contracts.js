const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ccSchema = new mongoose.Schema({}, { strict: false, collection: 'centercontracts' });
const CenterContract = mongoose.model('CenterContract', ccSchema);

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const all = await CenterContract.find({}).sort({ updatedAt: -1 }).lean();
  console.log(`📄 CenterContract 총 ${all.length}건`);
  console.log('');
  all.forEach(c => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`schoolId        : ${c.schoolId}`);
    console.log(`contractType    : ${c.contractType}`);
    console.log(`name            : ${c.name || '(없음)'}`);
    console.log(`academyName 필드 : ${c.academyName || '(없음)'}`);
    console.log(`contractData.startDate: ${c.contractData ? c.contractData.contractStartDate : '(없음)'}`);
    console.log(`updatedAt       : ${c.updatedAt}`);
  });
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
