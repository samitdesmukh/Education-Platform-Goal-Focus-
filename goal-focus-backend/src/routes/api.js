const express = require("express");
const router = express.Router();
const platformController = require("../controllers/platformController");
const profileController = require("../controllers/profileController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// Public tutor & category routes
router.get("/tutors/featured", platformController.getFeaturedTutors);
router.get("/tutors/search", platformController.searchTutors);
router.get("/tutors/:id", platformController.getTutorById);
router.get("/tutors", platformController.getAllTutors);
router.get("/categories", platformController.getCategories);

// Authenticated routes
router.post("/bookings", authMiddleware, platformController.createBooking);
router.get("/bookings", authMiddleware, platformController.getBookings);
router.get("/dashboard/stats", authMiddleware, platformController.getDashboardStats);

// Student routes
router.get("/student/goals", authMiddleware, roleMiddleware(["student"]), platformController.getStudentGoals);
router.post("/student/goals", authMiddleware, roleMiddleware(["student"]), platformController.createStudentGoal);
router.patch(
  "/student/goals/:goalId/milestones/:milestoneId",
  authMiddleware,
  roleMiddleware(["student"]),
  platformController.updateGoalMilestone
);
router.get("/student/classes", authMiddleware, roleMiddleware(["student"]), platformController.getStudentClasses);
router.get("/paths/:slug", authMiddleware, platformController.getCareerPath);

// Teacher routes
router.get(
  "/teacher/insights",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  platformController.getTeacherInsights
);

// Profile routes
router.get("/profile", authMiddleware, profileController.getProfile);
router.patch("/profile", authMiddleware, profileController.updateProfile);

// Coaching routes
router.get(
  "/coaching/dashboard",
  authMiddleware,
  roleMiddleware(["coaching", "admin"]),
  profileController.getCoachingDashboard
);

// Admin routes
router.get(
  "/admin/stats",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.getAdminStats
);
router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.getAllUsers
);
router.patch(
  "/admin/users/:id/approve",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.approveUser
);
router.patch(
  "/admin/users/:id/reject",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.rejectUser
);
router.patch(
  "/admin/teachers/:id/feature",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.toggleFeatured
);
router.delete(
  "/admin/students/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.deleteStudent
);
router.post(
  "/admin/categories",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.createCategory
);
router.patch(
  "/admin/categories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  profileController.updateCategory
);

module.exports = router;
