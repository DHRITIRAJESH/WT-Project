const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: "General" },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model("Transaction", transactionSchema);
