import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar({ items, role }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-24">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-gray-500 capitalize">{role}</p>
        </div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export const studentNav = [
  { to: '/student-dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/student/classes', label: 'My Classes', icon: '📅' },
  { to: '/goal-path', label: 'Learning Goals', icon: '🎯' },
  { to: '/tutors', label: 'Find Tutors', icon: '👨‍🏫' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export const teacherNav = [
  { to: '/teacher-dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/teacher/insights', label: 'Insights', icon: '📈' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export const coachingNav = [
  { to: '/coaching-dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export const adminNav = [
  { to: '/admin-dashboard', label: 'Overview', icon: '🛡️' },
  { to: '/admin-dashboard/approvals', label: 'Approvals', icon: '✅' },
  { to: '/admin-dashboard/users', label: 'Users', icon: '👥' },
  { to: '/admin-dashboard/categories', label: 'Categories', icon: '📚' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];
