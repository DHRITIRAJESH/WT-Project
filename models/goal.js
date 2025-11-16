const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Optional for now, can be linked to users later
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    default: "General",
    enum: ["Vacation", "Emergency Fund", "Education", "Home", "Car", "Wedding", "Retirement", "General", "Other"]
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "completed", "cancelled"]
  },
  autoTrack: {
    type: Boolean,
    default: false // If true, automatically track from transactions
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate progress percentage
goalSchema.virtual("progress").get(function() {
  return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100);
});

// Calculate remaining amount
goalSchema.virtual("remaining").get(function() {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Calculate days remaining
goalSchema.virtual("daysRemaining").get(function() {
  const today = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Calculate required monthly savings
goalSchema.virtual("monthlySavingsRequired").get(function() {
  const remaining = this.remaining;
  const daysRemaining = this.daysRemaining;
  if (daysRemaining <= 0) return remaining;
  const monthsRemaining = daysRemaining / 30;
  return Math.ceil(remaining / Math.max(monthsRemaining, 1));
});

goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Goal", goalSchema);
