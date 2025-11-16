import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        // Filter only expenses (negative amounts)
        const expenseData = data.filter((t) => t.amount < 0);
        setExpenses(expenseData);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExpenses(expenses.filter((t) => t._id !== id));
        alert("Expense deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);

  if (loading) {
    return (
      <div className="page">
        <h1>Expenses</h1>
        <p>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Expenses</h1>
      <div style={{ marginBottom: "20px" }}>
        <h3>Total Expenses: <span style={{ color: "red" }}>₹{totalExpenses.toFixed(2)}</span></h3>
        <Link to="/add-transaction">
          <button style={{ marginTop: "10px" }}>Add New Expense</button>
        </Link>
      </div>
      <button onClick={fetchExpenses} style={{ marginBottom: "10px" }}>
        Refresh
      </button>
      <ul>
        {expenses.length === 0 ? (
          <p>No expenses yet. Start tracking your spending!</p>
        ) : (
          expenses.map((expense) => (
            <li key={expense._id}>
              <div>
                <strong>{expense.text}</strong>
                <span style={{ marginLeft: "10px", color: "red" }}>
                  -₹{Math.abs(expense.amount)}
                </span>
              </div>
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                Category: {expense.category} | Date: {formatDate(expense.date)}
                {expense.notes && <div>Notes: {expense.notes}</div>}
              </div>
              <button onClick={() => deleteExpense(expense._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Expenses;
