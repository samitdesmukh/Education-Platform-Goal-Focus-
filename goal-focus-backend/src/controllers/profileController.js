const User = require("../models/user");
const TeacherProfile = require("../models/TeacherProfile");
const Category = require("../models/Category");
const Booking = require("../models/Booking");
const LearningGoal = require("../models/LearningGoal");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    let profile = null;
    if (user.role === "teacher") {
      profile = await TeacherProfile.findOne({ userId: user._id }).populate(
        "categoryIds",
        "name slug icon"
      );
    }
    res.json({ success: true, data: { user, teacherProfile: profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      phone,
      country,
      instituteName,
      profilePicture,
      subjects,
      hourlyRate,
      languages,
      specialization,
      categoryIds,
      online,
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (country !== undefined) user.country = country;
    if (instituteName !== undefined) user.instituteName = instituteName;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    let teacherProfile = null;
    if (user.role === "teacher") {
      teacherProfile = await TeacherProfile.findOne({ userId: user._id });
      if (!teacherProfile) {
        teacherProfile = await TeacherProfile.create({ userId: user._id });
      }
      if (subjects) teacherProfile.subjects = subjects;
      if (hourlyRate !== undefined) teacherProfile.hourlyRate = hourlyRate;
      if (languages) teacherProfile.languages = languages;
      if (specialization) teacherProfile.specialization = specialization;
      if (categoryIds) teacherProfile.categoryIds = categoryIds;
      if (online !== undefined) teacherProfile.online = online;
      await teacherProfile.save();
    }

    const updatedUser = await User.findById(req.userId).select("-password");
    res.json({
      success: true,
      message: "Profile updated",
      data: { user: updatedUser, teacherProfile },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [students, teachers, coaching, pending, bookings, categories] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher", approvalStatus: "approved" }),
        User.countDocuments({ role: "coaching", approvalStatus: "approved" }),
        User.find({
          role: { $in: ["teacher", "coaching"] },
          approvalStatus: "pending",
        }).select("-password"),
        Booking.countDocuments(),
        Category.countDocuments({ isActive: true }),
      ]);

    res.json({
      success: true,
      data: {
        totalStudents: students,
        approvedTeachers: teachers,
        approvedCoaching: coaching,
        pendingApprovals: pending,
        totalBookings: bookings,
        totalCategories: categories,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !["teacher", "coaching"].includes(user.role)) {
      return res.status(400).json({ success: false, message: "Invalid user" });
    }

    user.approvalStatus = "approved";
    user.isVerified = true;
    await user.save();

    if (user.role === "teacher") {
      let profile = await TeacherProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await TeacherProfile.create({ userId: user._id });
      }
    }

    res.json({ success: true, message: "User approved", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.approvalStatus = "rejected";
    user.isVerified = false;
    await user.save();
    res.json({ success: true, message: "User rejected", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({ userId: req.params.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }
    profile.isFeatured = !profile.isFeatured;
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon, slug, description } = req.body;
    const category = await Category.create({ name, icon, slug, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "student") {
      return res.status(400).json({ success: false, message: "Invalid student" });
    }
    await LearningGoal.deleteMany({ studentId: user._id });
    await User.findByIdAndDelete(user._id);
    res.json({ success: true, message: "Student removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCoachingDashboard = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      approvalStatus: "approved",
    }).select("-password");
    const students = await User.find({ role: "student" }).select("-password");
    const bookings = await Booking.find().populate(
      "teacherId studentId",
      "firstName lastName"
    );

    res.json({
      success: true,
      data: { teachers, students, bookings },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
