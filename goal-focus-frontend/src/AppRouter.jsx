import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext';
import { getDashboardPath } from './utils/auth';
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import GoalPath from './pages/GoalPath'
import TutorListing from './pages/TutorListing'
import StudentDashboard from './pages/StudentDashboard'
import StudentClasses from './pages/StudentClasses'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherInsights from './pages/TeacherInsights'
import CoachingDashboard from './pages/CoachingDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProfileSettings from './pages/ProfileSettings'
import BookingFlow from './pages/BookingFlow'
import Messaging from './pages/Messaging'

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to={getDashboardPath(user.role)} /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={getDashboardPath(user.role)} /> : <Signup />} />

          <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} requiredRoles={['student']} />} />
          <Route path="/student/classes" element={<ProtectedRoute element={<StudentClasses />} requiredRoles={['student']} />} />
          <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} requiredRoles={['teacher']} />} />
          <Route path="/teacher/insights" element={<ProtectedRoute element={<TeacherInsights />} requiredRoles={['teacher']} />} />
          <Route path="/coaching-dashboard" element={<ProtectedRoute element={<CoachingDashboard />} requiredRoles={['coaching']} />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={['admin']} />} />
          <Route path="/admin-dashboard/approvals" element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={['admin']} />} />
          <Route path="/admin-dashboard/users" element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={['admin']} />} />
          <Route path="/admin-dashboard/categories" element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={['admin']} />} />

          <Route path="/settings" element={<ProtectedRoute element={<ProfileSettings />} />} />
          <Route path="/goal-path" element={<ProtectedRoute element={<GoalPath />} requiredRoles={['student']} />} />
          <Route path="/tutors" element={<ProtectedRoute element={<TutorListing />} />} />
          <Route path="/booking" element={<ProtectedRoute element={<BookingFlow />} requiredRoles={['student']} />} />
          <Route path="/messages" element={<ProtectedRoute element={<Messaging />} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
