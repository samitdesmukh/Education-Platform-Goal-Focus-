import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import DashboardSidebar, { coachingNav } from '../components/DashboardSidebar';

export default function CoachingDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, dashRes] = await Promise.all([
          api.getDashboardStats(),
          api.getCoachingDashboard(),
        ]);
        if (statsRes.success) setStats(statsRes.data.coachingStats);
        if (dashRes.success) setData(dashRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const teachers = data?.teachers || [];
  const students = data?.students || [];
  const recentBookings = (data?.bookings || []).slice(-5).reverse();

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DashboardSidebar items={coachingNav} role="coaching" />

        <div className="lg:col-span-3 space-y-6">
          {user?.approvalStatus === 'pending' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
              Your coaching center is pending admin verification.
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.instituteName || 'Coaching Center'} Dashboard</h1>
            <p className="text-gray-600">Manage your institute overview</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: stats?.totalStudents, color: 'text-blue-600' },
              { label: 'Active Teachers', value: stats?.activeTeachers, color: 'text-green-600' },
              { label: 'Monthly Revenue', value: `$${stats?.monthlyRevenue ?? 0}`, color: 'text-purple-600' },
              { label: 'Active Batches', value: stats?.activeBatches, color: 'text-yellow-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow border p-5">
                <p className="text-sm text-gray-600">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{loading ? '-' : s.value ?? 0}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-bold mb-4">Approved Teachers on Platform</h2>
              {teachers.length === 0 ? (
                <p className="text-gray-500 text-sm">No approved teachers yet.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {teachers.slice(0, 8).map((t) => (
                    <div key={t._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{t.firstName} {t.lastName}</p>
                        <p className="text-xs text-gray-500">{t.email}</p>
                      </div>
                      <span className="text-green-600 text-xs">✓ Verified</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-bold mb-4">Registered Students</h2>
              <p className="text-3xl font-bold text-blue-600 mb-4">{students.length}</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {students.slice(0, 6).map((s) => (
                  <div key={s._id} className="text-sm p-2 bg-gray-50 rounded">{s.firstName} {s.lastName}</div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border p-6 md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
              {recentBookings.length === 0 ? (
                <p className="text-gray-500">No bookings on the platform yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => (
                    <div key={b._id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {b.studentId?.firstName} {b.studentId?.lastName} → {b.teacherId?.firstName} {b.teacherId?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{b.date} at {b.time}</p>
                      </div>
                      <span className="font-bold text-green-600">${b.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link to="/settings" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
            Edit Institute Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
