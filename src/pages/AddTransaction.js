import React, { useState } from "react";

function AddTransaction() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  const addTransaction = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
      date: new Date().toLocaleString(),
    };

    const saved = JSON.parse(localStorage.getItem("transactions")) || [];
    localStorage.setItem("transactions", JSON.stringify([newTransaction, ...saved]));
    setText("");
    setAmount("");
    alert("Transaction added!");
  };

  return (
    <div className="page">
      <h1>Add Transaction</h1>
      <form onSubmit={addTransaction}>
        <input
          type="text"
          placeholder="Description"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddTransaction;
