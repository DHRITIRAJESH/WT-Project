import React, { useState, useEffect } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(saved);
  }, []);

  const deleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  return (
    <div className="page">
      <h1>Transactions</h1>
      <ul>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <li key={t.id}>
              {t.text} - ₹{t.amount}
              <button onClick={() => deleteTransaction(t.id)}>x</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Transactions;
