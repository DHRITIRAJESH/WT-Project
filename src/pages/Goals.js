import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: ""
  });

  const API_URL = "http://localhost:5000/api/goals";

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setShowForm(false);
      resetForm();
      fetchGoals();
    } catch (err) {
      console.error("Error creating goal:", err);
      alert("Error creating goal");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchGoals();
      } catch (err) {
        console.error("Error deleting goal:", err);
      }
    }
  };

  const handleUpdateAmount = async (goalId, newAmount) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      await axios.put(`${API_URL}/${goalId}`, {
        ...goal,
        currentAmount: parseFloat(newAmount)
      });
      fetchGoals();
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      targetAmount: "",
      currentAmount: "",
      deadline: ""
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "#4CAF50";
    if (progress >= 50) return "#FFC107";
    return "#FF9800";
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>My Savings Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? "#f44336" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
          }}
        >
          {showForm ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: "30px" }}>
          <h2 style={{ marginBottom: "20px" }}>Create New Goal</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Goal Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Vacation Fund"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label>Target Amount *</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  required
                  min="0"
                />
              </div>

              <div>
                <label>Current Amount</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  min="0"
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label>Target Date *</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                marginTop: "20px"
              }}
            >
              Create Goal
            </button>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div style={{ display: "grid", gap: "20px" }}>
        {goals.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2 style={{ color: "#b0b0b0" }}>No Goals Yet</h2>
            <p style={{ color: "#808080", marginTop: "10px" }}>Create your first savings goal to get started!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ marginBottom: "8px" }}>{goal.title}</h2>
                  <p style={{ fontSize: "14px", color: "#b0b0b0" }}>
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                {goal.progress >= 100 && (
                  <span style={{
                    background: "#4CAF50",
                    color: "white",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>
                    Completed
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#b0b0b0" }}>Progress</span>
                  <span style={{ fontSize: "18px", fontWeight: "600", color: getProgressColor(goal.progress) }}>
                    {goal.progress}%
                  </span>
                </div>
                <div style={{
                  width: "100%",
                  height: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${Math.min(goal.progress, 100)}%`,
                    height: "100%",
                    background: getProgressColor(goal.progress),
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              {/* Amounts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#808080", marginBottom: "4px" }}>Current</p>
                  <input
                    type="number"
                    value={goal.currentAmount}
                    onChange={(e) => handleUpdateAmount(goal._id, e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#8b9bff",
                      background: "rgba(139, 155, 255, 0.1)",
                      border: "1px solid rgba(139, 155, 255, 0.3)",
                      padding: "8px 12px",
                      borderRadius: "6px"
                    }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#808080", marginBottom: "4px" }}>Target</p>
                  <p style={{ fontSize: "20px", fontWeight: "600", color: "#b0b0b0", marginTop: "8px" }}>
                    {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(goal._id)}
                style={{
                  background: "rgba(244, 67, 54, 0.2)",
                  color: "#f44336",
                  border: "1px solid #f44336",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  width: "100%"
                }}
              >
                Delete Goal
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;
