import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        // Filter only income (positive amounts)
        const incomeData = data.filter((t) => t.amount > 0);
        setIncomes(incomeData);
      }
    } catch (error) {
      console.error("Error fetching income:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIncomes(incomes.filter((t) => t._id !== id));
        alert("Income deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  if (loading) {
    return (
      <div className="page">
        <h1>Income</h1>
        <p>Loading income...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Income</h1>
      <div style={{ marginBottom: "20px" }}>
        <h3>Total Income: <span style={{ color: "green" }}>₹{totalIncome.toFixed(2)}</span></h3>
        <Link to="/add-transaction">
          <button style={{ marginTop: "10px" }}>Add New Income</button>
        </Link>
      </div>
      <button onClick={fetchIncomes} style={{ marginBottom: "10px" }}>
        Refresh
      </button>
      <ul>
        {incomes.length === 0 ? (
          <p>No income yet. Add your first income!</p>
        ) : (
          incomes.map((income) => (
            <li key={income._id}>
              <div>
                <strong>{income.text}</strong>
                <span style={{ marginLeft: "10px", color: "green" }}>
                  +₹{income.amount}
                </span>
              </div>
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                Category: {income.category} | Date: {formatDate(income.date)}
                {income.notes && <div>Notes: {income.notes}</div>}
              </div>
              <button onClick={() => deleteIncome(income._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Income;
