// Mock database - In production, use MongoDB
const mockData = {
  tutors: [
    { id: 1, name: 'Sarah Johnson', subject: 'Programming', rating: 4.9, price: 30, country: 'USA', students: 342, image: '👩‍🏫', verified: true, bio: 'Expert in Python, JavaScript, and Web Development', languages: ['English'], specialization: ['Programming', 'JavaScript'], online: true },
    { id: 2, name: 'Priya Sharma', subject: 'Data Science', rating: 4.8, price: 15, country: 'India', students: 298, image: '👩‍💻', verified: true, bio: 'Data Science and Python specialist', languages: ['English', 'Hindi'], specialization: ['Data Science', 'Python'], online: true },
    { id: 3, name: 'Marcus Chen', subject: 'IELTS', rating: 4.9, price: 35, country: 'Singapore', students: 567, image: '👨‍🏫', verified: true, bio: 'IELTS Band 8+ examiner', languages: ['English', 'Mandarin'], specialization: ['IELTS', 'English'], online: true },
    { id: 4, name: 'Emma Wilson', subject: 'Mathematics', rating: 4.8, price: 28, country: 'UK', students: 421, image: '👩‍🏫', verified: true, bio: 'Mathematics and Physics teacher', languages: ['English'], specialization: ['Mathematics', 'Physics'], online: true },
    { id: 5, name: 'Rajesh Kumar', subject: 'JEE', rating: 4.9, price: 12, country: 'India', students: 521, image: '👨‍🏫', verified: true, bio: 'JEE Advanced mentor', languages: ['English', 'Hindi'], specialization: ['JEE', 'Physics'], online: true },
  ],
  categories: [
    { id: 1, name: 'Programming', icon: '💻', tutors: 2450, rating: 4.9 },
    { id: 2, name: 'Data Science', icon: '📊', tutors: 1890, rating: 4.8 },
    { id: 3, name: 'Mathematics', icon: '🔢', tutors: 3120, rating: 4.9 },
    { id: 4, name: 'English', icon: '🔤', tutors: 2890, rating: 4.7 },
    { id: 5, name: 'IELTS', icon: '🎯', tutors: 1560, rating: 4.8 },
    { id: 6, name: 'UPSC', icon: '📚', tutors: 890, rating: 4.9 },
    { id: 7, name: 'SSC', icon: '📖', tutors: 1230, rating: 4.8 },
    { id: 8, name: 'NEET', icon: '🔬', tutors: 1450, rating: 4.9 },
    { id: 9, name: 'JEE', icon: '⚛️', tutors: 980, rating: 4.9 },
    { id: 10, name: 'Business', icon: '💼', tutors: 1680, rating: 4.7 },
    { id: 11, name: 'Digital Marketing', icon: '📱', tutors: 1340, rating: 4.8 },
    { id: 12, name: 'Graphic Design', icon: '🎨', tutors: 1120, rating: 4.8 },
  ],
  bookings: [],
  users: [],
  messages: [],
};

module.exports = mockData;
