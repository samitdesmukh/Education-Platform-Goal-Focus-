const mockData = require('../data/mockData');

// Tutors
exports.getAllTutors = (req, res) => {
  try {
    res.json({ success: true, data: mockData.tutors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTutorById = (req, res) => {
  try {
    const tutor = mockData.tutors.find(t => t.id === parseInt(req.params.id));
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });
    res.json({ success: true, data: tutor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.searchTutors = (req, res) => {
  try {
    const { subject, minRating, maxPrice } = req.query;
    let filtered = mockData.tutors;

    if (subject) filtered = filtered.filter(t => t.subject.toLowerCase() === subject.toLowerCase());
    if (minRating) filtered = filtered.filter(t => t.rating >= parseFloat(minRating));
    if (maxPrice) filtered = filtered.filter(t => t.price <= parseFloat(maxPrice));

    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Categories
exports.getCategories = (req, res) => {
  try {
    res.json({ success: true, data: mockData.categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Bookings
exports.createBooking = (req, res) => {
  try {
    const { tutorId, date, time, duration, userId } = req.body;
    const booking = {
      id: mockData.bookings.length + 1,
      tutorId,
      userId,
      date,
      time,
      duration,
      status: 'confirmed',
      createdAt: new Date(),
    };
    mockData.bookings.push(booking);
    res.json({ success: true, data: booking, message: 'Booking confirmed!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBookings = (req, res) => {
  try {
    res.json({ success: true, data: mockData.bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Messages
exports.sendMessage = (req, res) => {
  try {
    const { from, to, text } = req.body;
    const message = {
      id: mockData.messages.length + 1,
      from,
      to,
      text,
      timestamp: new Date(),
    };
    mockData.messages.push(message);
    res.json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMessages = (req, res) => {
  try {
    res.json({ success: true, data: mockData.messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Analytics/Dashboard
exports.getDashboardStats = (req, res) => {
  try {
    const stats = {
      totalStudents: 50000,
      totalTeachers: 10000,
      totalCountries: 100,
      totalClasses: 1000000,
      userStats: {
        classesCompleted: 24,
        learningHours: 142,
        goalProgress: 67,
      },
      teacherStats: {
        monthlyEarnings: 2450,
        activeStudents: 18,
        rating: 4.9,
        classesThisMonth: 42,
      },
      coachingStats: {
        totalStudents: 1240,
        activeTeachers: 34,
        monthlyRevenue: 18500,
        activeBatches: 12,
      },
    };
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
