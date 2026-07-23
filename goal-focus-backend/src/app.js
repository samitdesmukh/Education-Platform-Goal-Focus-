const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedUsers = require('./config/seedUsers');
const seedPlatformData = require('./config/seedPlatformData');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB and start server
app.get('/', (req, res) => {
  res.json({ message: 'Goal Focus API - Backend running', status: 'success' });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// API Routes
app.use('/api', apiRoutes);

(async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedPlatformData();
  } catch (err) {
    console.error('Error while connecting to DB:', err && err.message);
  }

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
  });
})();
