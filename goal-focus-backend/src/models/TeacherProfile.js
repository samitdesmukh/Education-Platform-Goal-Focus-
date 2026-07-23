const mongoose = require("mongoose");

const TeacherProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    subjects: [{ type: String }],
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    hourlyRate: { type: Number, default: 25 },
    languages: [{ type: String }],
    specialization: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    studentCount: { type: Number, default: 0 },
    classesCompleted: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    online: { type: Boolean, default: true },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherProfile", TeacherProfileSchema);
