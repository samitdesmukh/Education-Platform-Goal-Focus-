const mongoose = require("mongoose");

const LearningGoalSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    pathSlug: { type: String, default: "data-analyst" },
    targetDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    milestones: [
      {
        title: String,
        completed: { type: Boolean, default: false },
        order: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningGoal", LearningGoalSchema);
