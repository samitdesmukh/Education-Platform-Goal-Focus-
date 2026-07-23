import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import DashboardSidebar, { studentNav } from '../components/DashboardSidebar';
import TutorAvatar from '../components/TutorAvatar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StudentClasses() {
  const { user } = useAuth();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const res = await api.getStudentClasses(currentMonth, currentYear);
      if (res.success) setClasses(res.data);
      setLoading(false);
    };
    fetchClasses();
  }, [currentMonth, currentYear]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();

  const classesByDate = classes.reduce((acc, cls) => {
    const key = new Date(cls.startDateTime).getDate();
    if (!acc[key]) acc[key] = [];
    acc[key].push(cls);
    return acc;
  }, {});

  const upcoming = classes
    .filter((c) => new Date(c.startDateTime) >= new Date())
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DashboardSidebar items={studentNav} role="student" />

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
              <p className="text-gray-600">Calendar view of your scheduled lessons</p>
            </div>
            <Link to="/booking" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Book New Class
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-xl shadow border p-6">
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="px-3 py-1 border rounded-lg hover:bg-gray-50">←</button>
                <h2 className="text-xl font-bold">{monthName} {currentYear}</h2>
                <button onClick={nextMonth} className="px-3 py-1 border rounded-lg hover:bg-gray-50">→</button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-20 bg-gray-50 rounded-lg" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayClasses = classesByDate[day] || [];
                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() + 1 &&
                    currentYear === today.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`h-20 p-1 rounded-lg border text-sm ${
                        isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'
                      }`}
                    >
                      <span className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</span>
                      {dayClasses.slice(0, 2).map((cls) => (
                        <div key={cls._id} className="text-xs bg-blue-100 text-blue-800 rounded px-1 mt-0.5 truncate">
                          {cls.time}
                        </div>
                      ))}
                      {dayClasses.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayClasses.length - 2} more</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-lg font-bold mb-4">Upcoming Classes</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No upcoming classes</p>
                  <Link to="/tutors" className="text-blue-600 font-semibold">Find a tutor →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((cls) => (
                    <div key={cls._id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <p className="font-semibold text-gray-900">
                        with {cls.teacherId?.firstName} {cls.teacherId?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(cls.startDateTime).toLocaleDateString()} at {cls.time}
                      </p>
                      <p className="text-xs text-gray-500">{cls.duration}h · ${cls.price} {cls.isTrial && '(Trial)'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
