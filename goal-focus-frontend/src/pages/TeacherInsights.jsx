import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import DashboardSidebar, { teacherNav } from '../components/DashboardSidebar';

export default function TeacherInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeacherInsights().then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, []);

  const revenueEntries = data?.revenueByDay
    ? Object.entries(data.revenueByDay).slice(-7)
    : [];
  const maxRevenue = Math.max(...revenueEntries.map(([, v]) => v), 1);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DashboardSidebar items={teacherNav} role="teacher" />

        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Insights</h1>
            <p className="text-gray-600">Performance analytics based on your classes and ratings</p>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading insights...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Earnings', value: `$${data?.stats?.totalEarnings || 0}`, color: 'text-green-600' },
                  { label: 'Classes Completed', value: data?.stats?.classesCompleted || 0, color: 'text-blue-600' },
                  { label: 'Rating', value: `${data?.stats?.rating || 0} ⭐`, color: 'text-yellow-600' },
                  { label: 'Students', value: data?.stats?.studentCount || 0, color: 'text-purple-600' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl shadow border p-5">
                    <p className="text-sm text-gray-600">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow border p-6">
                  <h2 className="text-lg font-bold mb-4">Revenue (Last 7 Days)</h2>
                  {revenueEntries.length === 0 ? (
                    <p className="text-gray-500 text-sm">No revenue data yet. Bookings will appear here.</p>
                  ) : (
                    <div className="flex items-end gap-2 h-48">
                      {revenueEntries.map(([day, amount]) => (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-blue-600 rounded-t"
                            style={{ height: `${(amount / maxRevenue) * 100}%`, minHeight: '4px' }}
                          />
                          <span className="text-xs text-gray-500">{day.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow border p-6">
                  <h2 className="text-lg font-bold mb-4">Performance Score</h2>
                  <div className="text-center py-6">
                    <p className="text-5xl font-bold text-blue-600">
                      {Math.round(
                        (data?.stats?.rating || 0) * 20 +
                        (data?.stats?.classesCompleted || 0) * 2 +
                        (data?.stats?.studentCount || 0) * 0.5
                      )}
                    </p>
                    <p className="text-gray-600 mt-2">Higher scores appear in Featured Teachers</p>
                    <p className="text-sm text-gray-500 mt-4">{data?.stats?.reviewCount || 0} reviews</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border p-6">
                <h2 className="text-lg font-bold mb-4">Upcoming Classes</h2>
                {data?.upcomingClasses?.length === 0 ? (
                  <p className="text-gray-500">No upcoming classes scheduled.</p>
                ) : (
                  <div className="space-y-3">
                    {data.upcomingClasses.map((cls) => (
                      <div key={cls._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{cls.date} at {cls.time}</p>
                          <p className="text-sm text-gray-600">{cls.duration}h · ${cls.price}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs capitalize">{cls.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
