const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  platform: { type: String }, // e.g., "LeetCode"
  tags: [String],
  testCases: [testCaseSchema], // ✅ add test cases
  optimalSolution: { type: String }, // ✅ store reference optimal code/approach
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Problem", problemSchema);
