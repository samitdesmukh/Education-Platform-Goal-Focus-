const User = require("../models/user");
const TeacherProfile = require("../models/TeacherProfile");
const Category = require("../models/Category");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const LearningGoal = require("../models/LearningGoal");
const CareerPath = require("../models/CareerPath");
const { getApprovedTeachers, formatTutor } = require("../utils/tutorHelper");

exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await getApprovedTeachers();
    res.json({ success: true, data: tutors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getFeaturedTutors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 4;
    const tutors = await getApprovedTeachers();
    const featured = tutors
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, limit);
    res.json({ success: true, data: featured });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.searchTutors = async (req, res) => {
  try {
    const tutors = await getApprovedTeachers({
      subject: req.query.subject,
      categorySlug: req.query.category,
      minRating: req.query.minRating,
      maxPrice: req.query.maxPrice,
    });
    res.json({ success: true, data: tutors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getTutorById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "teacher",
      approvalStatus: "approved",
      isVerified: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Tutor not found" });
    }

    const profile = await TeacherProfile.findOne({ userId: user._id });
    res.json({ success: true, data: formatTutor(user, profile) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    const profiles = await TeacherProfile.find().populate("categoryIds");

    const data = await Promise.all(
      categories.map(async (cat) => {
        const teacherCount = profiles.filter((p) =>
          p.categoryIds.some((c) => c._id.toString() === cat._id.toString())
        ).length;

        const approvedTeachers = await User.countDocuments({
          role: "teacher",
          approvalStatus: "approved",
          isVerified: true,
          _id: { $in: profiles.filter((p) =>
            p.categoryIds.some((c) => c._id.toString() === cat._id.toString())
          ).map((p) => p.userId) },
        });

        const categoryProfiles = profiles.filter((p) =>
          p.categoryIds.some((c) => c._id.toString() === cat._id.toString())
        );
        const avgRating =
          categoryProfiles.length > 0
            ? (
                categoryProfiles.reduce((sum, p) => sum + (p.rating || 0), 0) /
                categoryProfiles.length
              ).toFixed(1)
            : 0;

        return {
          id: cat._id.toString(),
          name: cat.name,
          icon: cat.icon,
          slug: cat.slug,
          description: cat.description,
          tutors: approvedTeachers || teacherCount,
          rating: parseFloat(avgRating) || 0,
        };
      })
    );

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const studentId = req.userId;
    const {
      tutorId,
      teacherId,
      date,
      time,
      duration = 1,
      notes = "",
      isTrial = true,
      paymentMethod = "card",
    } = req.body;

    const resolvedTeacherId = teacherId || tutorId;
    if (!resolvedTeacherId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Teacher, date, and time are required",
      });
    }

    const teacher = await User.findOne({
      _id: resolvedTeacherId,
      role: "teacher",
      approvalStatus: "approved",
      isVerified: true,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not available for booking",
      });
    }

    const profile = await TeacherProfile.findOne({ userId: teacher._id });
    const hourlyRate = profile?.hourlyRate || 25;
    const fullPrice = hourlyRate * parseFloat(duration);
    const price = isTrial ? fullPrice / 2 : fullPrice;

    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(
      startDateTime.getTime() + parseFloat(duration) * 60 * 60 * 1000
    );

    const booking = await Booking.create({
      studentId,
      teacherId: teacher._id,
      date,
      time,
      startDateTime,
      endDateTime,
      duration: parseFloat(duration),
      isTrial,
      price,
      notes,
      paymentMethod,
      status: "confirmed",
    });

    if (profile) {
      profile.studentCount += 1;
      profile.classesCompleted += 1;
      profile.totalEarnings += price;
      await profile.save();
    }

    res.status(201).json({
      success: true,
      message: "Booking confirmed",
      data: {
        ...booking.toObject(),
        tutorName: `${teacher.firstName} ${teacher.lastName}`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const query =
      req.userRole === "admin"
        ? {}
        : req.userRole === "teacher"
          ? { teacherId: req.userId }
          : { studentId: req.userId };

    const bookings = await Booking.find(query)
      .populate("studentId", "firstName lastName email profilePicture")
      .populate("teacherId", "firstName lastName email profilePicture bio")
      .sort({ startDateTime: 1 });

    const data = bookings.map((b) => ({
      id: b._id.toString(),
      studentId: b.studentId?._id?.toString(),
      teacherId: b.teacherId?._id?.toString(),
      studentName: b.studentId
        ? `${b.studentId.firstName} ${b.studentId.lastName}`
        : "",
      tutorName: b.teacherId
        ? `${b.teacherId.firstName} ${b.teacherId.lastName}`
        : "",
      date: b.date,
      time: b.time,
      startDateTime: b.startDateTime,
      endDateTime: b.endDateTime,
      duration: b.duration,
      isTrial: b.isTrial,
      price: b.price,
      notes: b.notes,
      status: b.status,
      paymentMethod: b.paymentMethod,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.userRole;

    if (role === "student") {
      const bookings = await Booking.find({ studentId: userId });
      const completed = bookings.filter((b) => b.status === "completed").length;
      const confirmed = bookings.filter((b) =>
        ["confirmed", "completed"].includes(b.status)
      );
      const learningHours = confirmed.reduce(
        (sum, b) => sum + (b.duration || 1),
        0
      );
      const goals = await LearningGoal.find({ studentId: userId });
      const goalProgress =
        goals.length > 0
          ? Math.round(
              goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length
            )
          : 0;

      return res.json({
        success: true,
        data: {
          userStats: {
            classesCompleted: completed || confirmed.length,
            learningHours: Math.round(learningHours),
            goalProgress,
          },
        },
      });
    }

    if (role === "teacher") {
      const profile = await TeacherProfile.findOne({ userId });
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthBookings = await Booking.find({
        teacherId: userId,
        startDateTime: { $gte: monthStart },
      });
      const uniqueStudents = new Set(
        monthBookings.map((b) => b.studentId.toString())
      );

      return res.json({
        success: true,
        data: {
          teacherStats: {
            monthlyEarnings: Math.round(
              monthBookings.reduce((sum, b) => sum + b.price, 0)
            ),
            activeStudents: uniqueStudents.size,
            rating: profile?.rating || 0,
            classesThisMonth: monthBookings.length,
            totalEarnings: profile?.totalEarnings || 0,
            reviewCount: profile?.reviewCount || 0,
            retentionRate: profile?.studentCount
              ? Math.min(95, 70 + profile.classesCompleted * 0.5)
              : 0,
          },
        },
      });
    }

    if (role === "coaching") {
      const teachers = await User.countDocuments({
        role: "teacher",
        approvalStatus: "approved",
      });
      const students = await User.countDocuments({ role: "student" });
      const bookings = await Booking.find();
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthRevenue = bookings
        .filter((b) => b.startDateTime >= monthStart)
        .reduce((sum, b) => sum + b.price, 0);

      return res.json({
        success: true,
        data: {
          coachingStats: {
            totalStudents: students,
            activeTeachers: teachers,
            monthlyRevenue: Math.round(monthRevenue),
            activeBatches: Math.ceil(students / 25) || 1,
          },
        },
      });
    }

    if (role === "admin") {
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

      return res.json({
        success: true,
        data: {
          adminStats: {
            totalStudents: students,
            approvedTeachers: teachers,
            approvedCoaching: coaching,
            pendingApprovals: pending.length,
            pendingUsers: pending,
            totalBookings: bookings,
            totalCategories: categories,
          },
        },
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getStudentGoals = async (req, res) => {
  try {
    const goals = await LearningGoal.find({ studentId: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createStudentGoal = async (req, res) => {
  try {
    const { title, description, category, pathSlug, targetDate } = req.body;
    const path = pathSlug
      ? await CareerPath.findOne({ slug: pathSlug })
      : null;

    const milestones =
      path?.milestones?.map((m) => ({
        title: m.title,
        completed: false,
        order: m.order,
      })) || [];

    const goal = await LearningGoal.create({
      studentId: req.userId,
      title,
      description,
      category,
      pathSlug: pathSlug || "data-analyst",
      targetDate,
      progress: 0,
      milestones,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateGoalMilestone = async (req, res) => {
  try {
    const goal = await LearningGoal.findOne({
      _id: req.params.goalId,
      studentId: req.userId,
    });
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const milestone = goal.milestones.find(
      (m) => m._id.toString() === req.params.milestoneId
    );
    if (!milestone) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }

    milestone.completed = req.body.completed ?? true;
    const completedCount = goal.milestones.filter((m) => m.completed).length;
    goal.progress = Math.round((completedCount / goal.milestones.length) * 100);
    await goal.save();

    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCareerPath = async (req, res) => {
  try {
    const slug = req.params.slug || "data-analyst";
    const path = await CareerPath.findOne({ slug });
    const goals = await LearningGoal.find({
      studentId: req.userId,
      pathSlug: slug,
    });
    const activeGoal = goals[0] || null;

    res.json({
      success: true,
      data: { path, activeGoal, goals },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getTeacherInsights = async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({ userId: req.userId });
    const bookings = await Booking.find({ teacherId: req.userId }).sort({
      startDateTime: 1,
    });
    const upcoming = bookings.filter(
      (b) => b.startDateTime >= new Date() && b.status !== "cancelled"
    );
    const reviews = await Review.find({ teacherId: req.userId })
      .populate("studentId", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5);

    const revenueByDay = {};
    bookings.forEach((b) => {
      const key = b.startDateTime.toISOString().slice(0, 10);
      revenueByDay[key] = (revenueByDay[key] || 0) + b.price;
    });

    res.json({
      success: true,
      data: {
        profile,
        upcomingClasses: upcoming.slice(0, 5),
        recentReviews: reviews,
        revenueByDay,
        stats: {
          totalEarnings: profile?.totalEarnings || 0,
          classesCompleted: profile?.classesCompleted || 0,
          rating: profile?.rating || 0,
          reviewCount: profile?.reviewCount || 0,
          studentCount: profile?.studentCount || 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getStudentClasses = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { studentId: req.userId };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.startDateTime = { $gte: start, $lte: end };
    }

    const bookings = await Booking.find(query)
      .populate("teacherId", "firstName lastName profilePicture bio")
      .sort({ startDateTime: 1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
