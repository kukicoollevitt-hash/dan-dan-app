const mongoose = require('mongoose');

/**
 * 교재 잔여 재고 — 슈퍼관리자만 관리.
 * 단일 도큐먼트(_id='inventory')에 Map으로 모든 항목을 저장한다.
 *
 * key 규칙:
 *   brain_<series>_<issue>          ex) brain_on_1 ~ brain_deep_12
 *   creative_<series>_<issue>       ex) creative_on_1 ~ creative_fit_12
 *   daily_<series>_<issue>          ex) daily_on_1 ~ daily_deep_12
 *   korhistory_basic, korhistory_advanced
 */
const textbookInventorySchema = new mongoose.Schema({
  _id: { type: String, default: 'inventory' },
  quantities: { type: Map, of: Number, default: {} },
  updatedBy: { type: String, default: '' }
}, {
  timestamps: true,
  _id: false
});

module.exports = mongoose.model('TextbookInventory', textbookInventorySchema);
