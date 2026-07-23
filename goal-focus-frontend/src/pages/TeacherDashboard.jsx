import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import DashboardSidebar, { teacherNav } from '../components/DashboardSidebar';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, insightsRes] = await Promise.all([
          api.getDashboardStats(),
          api.getTeacherInsights(),
        ]);
        if (statsRes.success) setStats(statsRes.data.teacherStats);
        if (insightsRes.success) setInsights(insightsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenueEntries = insights?.revenueByDay
    ? Object.entries(insights.revenueByDay).slice(-7)
    : [];
  const maxRevenue = Math.max(...revenueEntries.map(([, v]) => v), 1);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DashboardSidebar items={teacherNav} role="teacher" />

        <div className="lg:col-span-3">
          {user?.approvalStatus === 'pending' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
              Your teacher profile is pending admin approval. Complete your profile in Settings while you wait.
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {user?.firstName}!</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow border p-5">
              <p className="text-gray-600 text-sm mb-2">Monthly Earnings</p>
              <p className="text-2xl font-bold text-green-600">${loading ? '-' : stats?.monthlyEarnings ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow border p-5">
              <p className="text-gray-600 text-sm mb-2">Active Students</p>
              <p className="text-2xl font-bold text-blue-600">{loading ? '-' : stats?.activeStudents ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow border p-5">
              <p className="text-gray-600 text-sm mb-2">Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{loading ? '-' : stats?.rating ?? 0} ⭐</p>
            </div>
            <div className="bg-white rounded-xl shadow border p-5">
              <p className="text-gray-600 text-sm mb-2">Classes This Month</p>
              <p className="text-2xl font-bold text-purple-600">{loading ? '-' : stats?.classesThisMonth ?? 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming Classes</h2>
              <Link to="/teacher/insights" className="text-blue-600 text-sm font-semibold">Full Insights →</Link>
            </div>
            {insights?.upcomingClasses?.length === 0 ? (
              <p className="text-gray-500">No upcoming classes. Students will book you from Find Tutors.</p>
            ) : (
              <div className="space-y-3">
                {insights?.upcomingClasses?.map((cls) => (
                  <div key={cls._id} className="border-l-4 border-blue-600 pl-4 py-2">
                    <p className="font-semibold">{cls.date} at {cls.time}</p>
                    <p className="text-sm text-gray-600">{cls.duration}h · ${cls.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-bold mb-4">Revenue This Month</h2>
              {revenueEntries.length === 0 ? (
                <p className="text-gray-500 text-sm">Revenue chart updates as you get bookings.</p>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {revenueEntries.map(([day, amount]) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-blue-600 rounded-t" style={{ height: `${(amount / maxRevenue) * 100}%`, minHeight: 4 }} />
                      <span className="text-xs text-gray-500 mt-1">{day.slice(8)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-bold mb-4">Student Retention</h2>
              <div className="flex items-center justify-center py-4">
                <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{Math.round(stats?.retentionRate || 0)}%</p>
                    <p className="text-gray-600 text-xs">Retention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
