import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch summary
      const summaryResponse = await fetch("/api/transactions/summary/all");
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);
      }

      // Fetch recent transactions
      const transactionsResponse = await fetch("/api/transactions");
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading your financial dashboard...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Financial Dashboard</h1>
      <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
        Welcome to your personal finance tracker. Track income, expenses, and reach your financial goals.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: "40px" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #11998e, #38ef7d)" }}>
          <h3>Total Income</h3>
          <p>₹{summary.income.toFixed(2)}</p>
        </div>
        <div className="card" style={{ background: "linear-gradient(135deg, #eb3349, #f45c43)" }}>
          <h3>Total Expenses</h3>
          <p>₹{summary.expense.toFixed(2)}</p>
        </div>
        <div className="card" style={{ 
          background: summary.balance >= 0 
            ? "linear-gradient(135deg, #667eea, #764ba2)" 
            : "linear-gradient(135deg, #f093fb, #f5576c)"
        }}>
          <h3>Balance</h3>
          <p>₹{summary.balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Quick Actions</h2>
        <div className="flex" style={{ marginTop: "15px" }}>
          <Link to="/add-transaction">
            <button style={{ background: "linear-gradient(135deg, #11998e, #38ef7d)", fontSize: "1.1rem", padding: "15px 30px" }}>
              Add Transaction
            </button>
          </Link>
          <Link to="/expenses">
            <button style={{ background: "linear-gradient(135deg, #eb3349, #f45c43)" }}>
              View Expenses
            </button>
          </Link>
          <Link to="/income">
            <button style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              View Income
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex-between">
          <h2>Recent Transactions</h2>
          <Link to="/transactions">View All →</Link>
        </div>
        {recentTransactions.length === 0 ? (
          <div style={{ 
            background: "#0f0f1e", 
            padding: "40px", 
            borderRadius: "10px", 
            textAlign: "center",
            marginTop: "15px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#b0b0b0" }}>No transactions yet</p>
            <Link to="/add-transaction">
              <button>Add your first transaction</button>
            </Link>
          </div>
        ) : (
          <ul style={{ marginTop: "15px" }}>
            {recentTransactions.map((t) => (
              <li key={t._id}>
                <div className="flex-between">
                  <div>
                    <strong style={{ fontSize: "1.1rem", color: "#e0e0e0" }}>{t.text}</strong>
                    <div style={{ fontSize: "0.9rem", color: "#888", marginTop: "5px" }}>
                      {t.category} • {formatDate(t.date)}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: "1.3rem", 
                    fontWeight: "700",
                    color: t.amount >= 0 ? "#11998e" : "#eb3349"
                  }}>
                    {t.amount >= 0 ? "+" : "-"}₹{Math.abs(t.amount).toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
