require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// connect database
connectDB(process.env.MONGO_URI);

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/goals", require("./routes/goals"));

app.get("/", (req, res) => {
  res.send("Finance Tracker Backend is running ");
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
