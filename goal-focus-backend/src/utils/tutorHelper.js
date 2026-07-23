const User = require("../models/user");
const TeacherProfile = require("../models/TeacherProfile");

const formatTutor = (user, profile) => {
  const primarySubject = profile?.subjects?.[0] || profile?.specialization?.[0] || "General";
  return {
    id: user._id.toString(),
    userId: user._id.toString(),
    name: `${user.firstName} ${user.lastName}`,
    subject: primarySubject,
    subjects: profile?.subjects || [],
    rating: profile?.rating || 0,
    price: profile?.hourlyRate || 25,
    country: user.country || "Global",
    students: profile?.studentCount || 0,
    image: user.profilePicture || "👨‍🏫",
    profilePicture: user.profilePicture || "",
    verified: user.isVerified && user.approvalStatus === "approved",
    bio: user.bio || profile?.specialization?.join(", ") || "",
    languages: profile?.languages || ["English"],
    specialization: profile?.specialization || profile?.subjects || [],
    online: profile?.online ?? true,
    reviewCount: profile?.reviewCount || 0,
    classesCompleted: profile?.classesCompleted || 0,
    isFeatured: profile?.isFeatured || false,
    performanceScore: calculatePerformanceScore(profile),
  };
};

const calculatePerformanceScore = (profile) => {
  if (!profile) return 0;
  return (
    (profile.rating || 0) * 20 +
    (profile.classesCompleted || 0) * 2 +
    (profile.studentCount || 0) * 0.5 +
    (profile.reviewCount || 0) * 1.5 +
    (profile.isFeatured ? 10 : 0)
  );
};

const getApprovedTeachers = async (filters = {}) => {
  const query = {
    role: "teacher",
    approvalStatus: "approved",
    isVerified: true,
  };

  const users = await User.find(query).select("-password");
  const userIds = users.map((u) => u._id);
  const profiles = await TeacherProfile.find({ userId: { $in: userIds } });
  const profileMap = Object.fromEntries(
    profiles.map((p) => [p.userId.toString(), p])
  );

  let tutors = users.map((user) =>
    formatTutor(user, profileMap[user._id.toString()])
  );

  if (filters.subject) {
    const subject = filters.subject.toLowerCase();
    tutors = tutors.filter(
      (t) =>
        t.subject.toLowerCase().includes(subject) ||
        t.subjects.some((s) => s.toLowerCase().includes(subject)) ||
        t.specialization.some((s) => s.toLowerCase().includes(subject))
    );
  }

  if (filters.categorySlug) {
    const Category = require("../models/Category");
    const category = await Category.findOne({ slug: filters.categorySlug });
    if (category) {
      const categoryProfiles = profiles.filter((p) =>
        p.categoryIds.some((id) => id.toString() === category._id.toString())
      );
      const allowedIds = new Set(categoryProfiles.map((p) => p.userId.toString()));
      tutors = tutors.filter((t) => allowedIds.has(t.userId));
    }
  }

  if (filters.minRating) {
    tutors = tutors.filter((t) => t.rating >= parseFloat(filters.minRating));
  }

  if (filters.maxPrice) {
    tutors = tutors.filter((t) => t.price <= parseFloat(filters.maxPrice));
  }

  return tutors;
};

module.exports = {
  formatTutor,
  calculatePerformanceScore,
  getApprovedTeachers,
};
