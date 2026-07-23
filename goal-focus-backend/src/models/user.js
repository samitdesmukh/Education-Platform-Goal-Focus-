const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "coaching"],
      default: "student",
    },
    profilePicture: String,
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    country: { type: String, default: "" },
    instituteName: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
