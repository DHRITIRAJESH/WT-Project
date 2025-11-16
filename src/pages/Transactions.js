import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        throw new Error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from state
        setTransactions(transactions.filter((t) => t._id !== id));
        alert("✅ Transaction deleted successfully!");
      } else {
        const error = await response.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    // Apply filter
    if (filter === "income") {
      filtered = filtered.filter(t => t.amount >= 0);
    } else if (filter === "expense") {
      filtered = filtered.filter(t => t.amount < 0);
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();
  const totalIncome = transactions.filter(t => t.amount >= 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error">{error}</div>
        <button onClick={fetchTransactions}>🔄 Retry</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex-between">
        <h1>All Transactions</h1>
        <Link to="/add-transaction">
          <button>Add New</button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginTop: "20px", marginBottom: "25px" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #11998e, #38ef7d)", padding: "20px" }}>
          <h4>Total Transactions</h4>
          <p style={{ fontSize: "2rem", margin: "5px 0" }}>{transactions.length}</p>
        </div>
        <div className="card" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "20px" }}>
          <h4>Total Income</h4>
          <p style={{ fontSize: "2rem", margin: "5px 0" }}>₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="card" style={{ background: "linear-gradient(135deg, #eb3349, #f45c43)", padding: "20px" }}>
          <h4>Total Expenses</h4>
          <p style={{ fontSize: "2rem", margin: "5px 0" }}>₹{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex" style={{ marginBottom: "20px", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income Only</option>
          <option value="expense">Expenses Only</option>
        </select>
        <button onClick={fetchTransactions}>Refresh</button>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
            {searchTerm || filter !== "all" 
              ? "No transactions match your filters" 
              : "No transactions yet"}
          </p>
          <Link to="/add-transaction">
            <button>Add your first transaction</button>
          </Link>
        </div>
      ) : (
        <ul>
          {filteredTransactions.map((t) => (
            <li key={t._id}>
              <div className="flex-between">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "5px", color: "#e0e0e0" }}>
                    {t.text}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#888" }}>
                    <span style={{ 
                      display: "inline-block",
                      background: "#0f0f1e",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      marginRight: "10px",
                      border: "1px solid rgba(139, 155, 255, 0.2)"
                    }}>
                      {t.category}
                    </span>
                    {formatDate(t.date)}
                  </div>
                  {t.notes && (
                    <div style={{ fontSize: "0.85rem", color: "#888", marginTop: "5px", fontStyle: "italic" }}>
                      {t.notes}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ 
                    fontSize: "1.4rem", 
                    fontWeight: "700",
                    color: t.amount >= 0 ? "#11998e" : "#eb3349",
                    minWidth: "120px",
                    textAlign: "right"
                  }}>
                    {t.amount >= 0 ? "+" : "-"}₹{Math.abs(t.amount).toFixed(2)}
                  </div>
                  <button 
                    onClick={() => deleteTransaction(t._id)}
                    style={{ 
                      background: "linear-gradient(135deg, #eb3349, #f45c43)",
                      padding: "8px 15px",
                      fontSize: "0.9rem"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transactions;

