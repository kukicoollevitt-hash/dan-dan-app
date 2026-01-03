const mongoose = require("mongoose");

const StudyProgressSchema = new mongoose.Schema({
  studentKey: { type: String, required: true, index: true },
  unitKey: { type: String, required: true },
  pageKey: { type: String, required: true },
  kind: { type: String, required: true }, 
  completed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudyProgress", StudyProgressSchema);
