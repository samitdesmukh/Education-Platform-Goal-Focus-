import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import DashboardSidebar, { studentNav } from '../components/DashboardSidebar';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, goalsRes, classesRes] = await Promise.all([
          api.getDashboardStats(),
          api.getStudentGoals(),
          api.getStudentClasses(),
        ]);
        if (statsRes.success) setStats(statsRes.data.userStats);
        if (goalsRes.success) setGoals(goalsRes.data);
        if (classesRes.success) {
          const future = classesRes.data
            .filter((c) => new Date(c.startDateTime) >= new Date())
            .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
            .slice(0, 5);
          setUpcoming(future);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DashboardSidebar items={studentNav} role="student" />

        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user?.firstName}!
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow border p-6">
              <p className="text-gray-600 text-sm mb-2">Classes Completed</p>
              <p className="text-3xl font-bold text-blue-600">{loading ? '-' : stats?.classesCompleted ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow border p-6">
              <p className="text-gray-600 text-sm mb-2">Learning Hours</p>
              <p className="text-3xl font-bold text-green-600">{loading ? '-' : stats?.learningHours ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow border p-6">
              <p className="text-gray-600 text-sm mb-2">Goal Progress</p>
              <p className="text-3xl font-bold text-purple-600">{loading ? '-' : stats?.goalProgress ?? 0}%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Lessons</h2>
              <Link to="/student/classes" className="text-blue-600 text-sm font-semibold">View Calendar →</Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">No upcoming lessons</p>
                <Link to="/booking" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Book a Trial Lesson</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((cls) => (
                  <div key={cls._id} className="border-l-4 border-blue-600 pl-4 py-3 hover:bg-gray-50 rounded-r-lg">
                    <p className="font-semibold text-gray-900">
                      with {cls.teacherId?.firstName} {cls.teacherId?.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {new Date(cls.startDateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} at {cls.time}
                    </p>
                    <p className="text-gray-500 text-sm">{cls.duration}h · ${cls.price} {cls.isTrial && '· Trial'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Learning Goals Progress</h2>
              <Link to="/goal-path" className="text-blue-600 text-sm font-semibold">View Path →</Link>
            </div>
            {goals.length === 0 ? (
              <p className="text-gray-500">No goals yet. <Link to="/goal-path" className="text-blue-600">Start a learning path</Link></p>
            ) : (
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal._id}>
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-gray-900">{goal.title}</p>
                      <span className="text-blue-600 font-bold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
