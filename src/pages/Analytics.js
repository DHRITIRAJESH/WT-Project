import React, { useState, useEffect } from "react";

export default function Analytics() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch("/api/transactions/summary/all");
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  const savingsRate = summary.income > 0 
    ? ((summary.balance / summary.income) * 100).toFixed(1) 
    : 0;
  
  const expenseRate = summary.income > 0 
    ? ((summary.expense / summary.income) * 100).toFixed(1) 
    : 0;

  return (
    <div className="page">
      <div className="flex-between">
        <h1>Financial Analytics</h1>
        <button onClick={fetchSummary} style={{ fontSize: "0.95rem" }}>
          Refresh
        </button>
      </div>

      {/* Main Summary Cards */}
      <div className="grid grid-3" style={{ marginTop: "30px", marginBottom: "30px" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #11998e, #38ef7d)" }}>
          <h3>Total Income</h3>
          <p style={{ fontSize: "2.5rem", marginTop: "10px", marginBottom: "10px" }}>
            ₹{summary.income.toFixed(2)}
          </p>
          <small style={{ opacity: 0.9 }}>All-time earnings</small>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, #eb3349, #f45c43)" }}>
          <h3>Total Expenses</h3>
          <p style={{ fontSize: "2.5rem", marginTop: "10px", marginBottom: "10px" }}>
            ₹{summary.expense.toFixed(2)}
          </p>
          <small style={{ opacity: 0.9 }}>{expenseRate}% of income</small>
        </div>

        <div className="card" style={{ 
          background: summary.balance >= 0 
            ? "linear-gradient(135deg, #667eea, #764ba2)" 
            : "linear-gradient(135deg, #f093fb, #f5576c)"
        }}>
          <h3>Current Balance</h3>
          <p style={{ fontSize: "2.5rem", marginTop: "10px", marginBottom: "10px" }}>
            ₹{summary.balance.toFixed(2)}
          </p>
          <small style={{ opacity: 0.9 }}>
            {summary.balance >= 0 ? `Savings rate: ${savingsRate}%` : "Overspending detected"}
          </small>
        </div>
      </div>

      {/* Insights Section */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h2>Financial Insights</h2>
        <div className="grid grid-2" style={{ marginTop: "20px", gap: "20px" }}>
          <div style={{ padding: "15px", background: "rgba(139, 155, 255, 0.1)", borderRadius: "10px", border: "1px solid rgba(139, 155, 255, 0.2)" }}>
            <h4 style={{ marginBottom: "10px" }}>Spending Ratio</h4>
            <div style={{ 
              background: "#ddd", 
              height: "30px", 
              borderRadius: "15px", 
              overflow: "hidden",
              position: "relative"
            }}>
              <div style={{ 
                background: "linear-gradient(90deg, #11998e, #38ef7d)",
                height: "100%",
                width: `${100 - parseFloat(expenseRate)}%`,
                transition: "width 0.5s ease"
              }}></div>
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                color: "#0f0f1e",
                fontSize: "0.9rem"
              }}>
                {100 - parseFloat(expenseRate)}% saved
              </div>
            </div>
          </div>

          <div style={{ padding: "15px", background: "rgba(139, 155, 255, 0.1)", borderRadius: "10px", border: "1px solid rgba(139, 155, 255, 0.2)" }}>
            <h4 style={{ marginBottom: "10px" }}>Financial Health</h4>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {savingsRate >= 50 ? "Excellent" : 
               savingsRate >= 30 ? "Good" : 
               savingsRate >= 10 ? "Fair" : 
               savingsRate >= 0 ? "Needs Attention" : 
               "Critical"}
            </p>
            <p style={{ fontSize: "0.9rem", marginTop: "10px", opacity: 0.9 }}>
              {savingsRate >= 50 ? "You're saving more than half your income!" : 
               savingsRate >= 30 ? "You're on the right track!" : 
               savingsRate >= 10 ? "Consider reducing expenses." : 
               savingsRate >= 0 ? "Try to increase your savings rate." : 
               "You're spending more than you earn!"}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-2" style={{ gap: "20px" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #ffecd2, #fcb69f)" }}>
          <h3>Average Transaction</h3>
          <p style={{ fontSize: "2rem", margin: "10px 0" }}>
            ₹{((summary.income + summary.expense) / 2).toFixed(2)}
          </p>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, #a8edea, #fed6e3)" }}>
          <h3>Net Worth</h3>
          <p style={{ fontSize: "2rem", margin: "10px 0", color: summary.balance >= 0 ? "#11998e" : "#eb3349" }}>
            ₹{summary.balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

