import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addTransaction as addTransactionAPI } from "../utils/api";

function AddTransaction() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [category, setCategory] = useState("General");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addTransaction = async (e) => {
    e.preventDefault();
    
    if (!text || !amount) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    // Make amount negative for expenses
    const finalAmount = transactionType === "expense" 
      ? -Math.abs(parseFloat(amount)) 
      : Math.abs(parseFloat(amount));

    const newTransaction = {
      text,
      amount: finalAmount,
      category,
      date: new Date(),
      notes,
    };

    try {
      await addTransactionAPI(newTransaction);
      alert("Transaction added successfully!");
      setText("");
      setAmount("");
      setCategory("General");
      setNotes("");
      navigate("/transactions");
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="flex-between">
        <h1>Add Transaction</h1>
        <Link to="/transactions">
          <button style={{ background: "#6c757d" }}>Back to List</button>
        </Link>
      </div>

      <div className="card" style={{ maxWidth: "600px", margin: "20px auto" }}>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={addTransaction}>
          {/* Transaction Type Toggle */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "1.1rem", fontWeight: "600" }}>
              Transaction Type
            </label>
            <div className="flex" style={{ gap: "10px" }}>
              <button
                type="button"
                onClick={() => setTransactionType("expense")}
                style={{
                  flex: 1,
                  background: transactionType === "expense" 
                    ? "linear-gradient(135deg, #eb3349, #f45c43)" 
                    : "#e0e0e0",
                  color: transactionType === "expense" ? "white" : "#666",
                  border: transactionType === "expense" ? "3px solid #c72033" : "3px solid transparent",
                  transform: "none"
                }}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("income")}
                style={{
                  flex: 1,
                  background: transactionType === "income" 
                    ? "linear-gradient(135deg, #11998e, #38ef7d)" 
                    : "#e0e0e0",
                  color: transactionType === "income" ? "white" : "#666",
                  border: transactionType === "income" ? "3px solid #0d7a6f" : "3px solid transparent",
                  transform: "none"
                }}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label>Description *</label>
            <input
              type="text"
              placeholder="e.g., Grocery shopping, Salary, etc."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Amount (₹) *</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="General">General</option>
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Salary">Salary</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Notes (Optional)</label>
            <textarea
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: transactionType === "expense"
                ? "linear-gradient(135deg, #eb3349, #f45c43)"
                : "linear-gradient(135deg, #11998e, #38ef7d)",
              fontSize: "1.1rem",
              padding: "15px",
              marginTop: "10px"
            }}
          >
            {loading ? "Adding..." : `Add ${transactionType === "expense" ? "Expense" : "Income"}`}
          </button>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="card" style={{ maxWidth: "600px", margin: "20px auto", background: "#0f0f1e", color: "#b0b0b0", border: "1px solid rgba(139, 155, 255, 0.2)" }}>
        <h3>Quick Tips</h3>
        <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
          <li>Use <strong>negative amounts</strong> or select <strong>Expense</strong> for money going out</li>
          <li>Use <strong>positive amounts</strong> or select <strong>Income</strong> for money coming in</li>
          <li>Choose appropriate <strong>categories</strong> for better tracking</li>
          <li>Add <strong>notes</strong> for future reference</li>
        </ul>
      </div>
    </div>
  );
}

export default AddTransaction;

