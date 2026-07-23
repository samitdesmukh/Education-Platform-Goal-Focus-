const Category = require("../models/Category");
const CareerPath = require("../models/CareerPath");
const User = require("../models/user");
const TeacherProfile = require("../models/TeacherProfile");
const LearningGoal = require("../models/LearningGoal");

const categories = [
  { name: "Programming", icon: "💻", slug: "programming", description: "Learn coding and software development" },
  { name: "Data Science", icon: "📊", slug: "data-science", description: "Analytics, ML, and data engineering" },
  { name: "Mathematics", icon: "🔢", slug: "mathematics", description: "Algebra, calculus, and more" },
  { name: "English", icon: "🔤", slug: "english", description: "Spoken and written English" },
  { name: "IELTS", icon: "🎯", slug: "ielts", description: "IELTS exam preparation" },
  { name: "UPSC", icon: "📚", slug: "upsc", description: "Civil services preparation" },
  { name: "SSC", icon: "📖", slug: "ssc", description: "Staff selection commission exams" },
  { name: "NEET", icon: "🔬", slug: "neet", description: "Medical entrance preparation" },
  { name: "JEE", icon: "⚛️", slug: "jee", description: "Engineering entrance preparation" },
  { name: "Business", icon: "💼", slug: "business", description: "Business and management skills" },
  { name: "Digital Marketing", icon: "📱", slug: "digital-marketing", description: "SEO, ads, and social media" },
  { name: "Graphic Design", icon: "🎨", slug: "graphic-design", description: "Visual design and branding" },
];

const careerPaths = [
  {
    slug: "data-analyst",
    title: "Senior Data Analyst Career Path",
    description: "A milestone-based pathway to become a Senior Data Analyst.",
    skills: ["SQL", "Python", "Tableau", "Statistics", "Excel"],
    milestones: [
      { title: "Core SQL", description: "Master database queries", order: 1 },
      { title: "Python Data Science", description: "Pandas, NumPy, visualization", order: 2 },
      { title: "Advanced Tableau", description: "Dashboards and storytelling", order: 3 },
    ],
  },
  {
    slug: "software-developer",
    title: "Software Developer Career Path",
    description: "From basics to full-stack development.",
    skills: ["JavaScript", "React", "Node.js", "Git", "APIs"],
    milestones: [
      { title: "Programming Fundamentals", description: "Logic and problem solving", order: 1 },
      { title: "Web Development", description: "HTML, CSS, JavaScript", order: 2 },
      { title: "Full Stack Projects", description: "Build real applications", order: 3 },
    ],
  },
];

const seedPlatformData = async () => {
  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
  }

  for (const path of careerPaths) {
    await CareerPath.findOneAndUpdate({ slug: path.slug }, path, { upsert: true });
  }

  const demoTeacher = await User.findOne({ email: "teacher@example.com" });
  if (demoTeacher) {
    await User.findByIdAndUpdate(demoTeacher._id, {
      isVerified: true,
      approvalStatus: "approved",
      bio: "Expert in Python, JavaScript, and Web Development with 8+ years experience.",
      country: "India",
    });

    const programming = await Category.findOne({ slug: "programming" });
    const dataScience = await Category.findOne({ slug: "data-science" });

    await TeacherProfile.findOneAndUpdate(
      { userId: demoTeacher._id },
      {
        userId: demoTeacher._id,
        subjects: ["Programming", "Data Science"],
        categoryIds: [programming?._id, dataScience?._id].filter(Boolean),
        hourlyRate: 30,
        languages: ["English", "Hindi"],
        specialization: ["Programming", "Python", "JavaScript"],
        rating: 4.9,
        reviewCount: 48,
        studentCount: 124,
        classesCompleted: 89,
        isFeatured: true,
        online: true,
        totalEarnings: 12500,
      },
      { upsert: true }
    );
  }

  const demoCoaching = await User.findOne({ email: "coaching@example.com" });
  if (demoCoaching) {
    await User.findByIdAndUpdate(demoCoaching._id, {
      isVerified: true,
      approvalStatus: "approved",
      instituteName: "Goal Focus Academy",
      country: "India",
      bio: "Leading coaching institute for JEE and NEET preparation.",
    });
  }

  const demoStudent = await User.findOne({ email: "student@example.com" });
  if (demoStudent) {
    const existingGoal = await LearningGoal.findOne({ studentId: demoStudent._id });
    if (!existingGoal) {
      await LearningGoal.create({
        studentId: demoStudent._id,
        title: "Become a Data Analyst",
        description: "Complete the data analyst career path",
        category: "Data Science",
        pathSlug: "data-analyst",
        targetDate: new Date("2026-12-31"),
        progress: 45,
        milestones: [
          { title: "Core SQL", completed: true, order: 1 },
          { title: "Python Data Science", completed: false, order: 2 },
          { title: "Advanced Tableau", completed: false, order: 3 },
        ],
      });
      await LearningGoal.create({
        studentId: demoStudent._id,
        title: "Master Python Programming",
        description: "Build strong Python fundamentals",
        category: "Programming",
        pathSlug: "software-developer",
        targetDate: new Date("2026-09-30"),
        progress: 30,
        milestones: [
          { title: "Programming Fundamentals", completed: true, order: 1 },
          { title: "Web Development", completed: false, order: 2 },
          { title: "Full Stack Projects", completed: false, order: 3 },
        ],
      });
    }
  }
};

module.exports = seedPlatformData;
