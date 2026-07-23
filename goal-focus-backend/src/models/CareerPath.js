const mongoose = require("mongoose");

const CareerPathSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    skills: [{ type: String }],
    milestones: [
      {
        title: String,
        description: String,
        order: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerPath", CareerPathSchema);
