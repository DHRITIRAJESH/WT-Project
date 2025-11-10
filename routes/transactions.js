const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");

// CRUD routes
router.get("/", controller.getTransactions);
router.post("/", controller.addTransaction);
router.put("/:id", controller.updateTransaction);
router.delete("/:id", controller.deleteTransaction);
router.get("/summary/all", controller.getSummary);

module.exports = router;
