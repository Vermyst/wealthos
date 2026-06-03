const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  remainingAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  minimumPayment: { type: Number, required: true },
  dueDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Debt", debtSchema);