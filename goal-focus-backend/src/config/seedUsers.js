const bcrypt = require("bcryptjs");
const User = require("../models/user");

const demoUsers = [
  {
    firstName: "Demo",
    lastName: "Student",
    email: "student@example.com",
    password: "password123",
    role: "student",
  },
  {
    firstName: "Demo",
    lastName: "Teacher",
    email: "teacher@example.com",
    password: "password123",
    role: "teacher",
  },
  {
    firstName: "Demo",
    lastName: "Coaching",
    email: "coaching@example.com",
    password: "password123",
    role: "coaching",
  },
  {
    firstName: "Demo",
    lastName: "Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
];

const seedUsers = async () => {
  for (const userData of demoUsers) {
    const exists = await User.findOne({ email: userData.email });
    if (exists) continue;

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      approvalStatus: ["teacher", "coaching"].includes(userData.role)
        ? "approved"
        : "none",
      isVerified: ["teacher", "coaching", "admin"].includes(userData.role),
    });
    console.log(`✓ Seeded demo user: ${userData.email}`);
  }
};

module.exports = seedUsers;
