const Transaction = require("../models/transaction");

// GET all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err.message });
  }
};

// POST a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { text, amount, category, date, notes } = req.body;
    const newTransaction = new Transaction({ text, amount, category, date, notes });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: "Error adding transaction", error: err.message });
  }
};

// PUT (update)
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: "Error updating transaction", error: err.message });
  }
};

// DELETE
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting transaction", error: err.message });
  }
};

// Summary route
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const amounts = transactions.map((t) => t.amount);
    const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
    const expense = Math.abs(amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0));
    const balance = income - expense;
    res.json({ income, expense, balance });
  } catch (err) {
    res.status(500).json({ message: "Error fetching summary", error: err.message });
  }
};
