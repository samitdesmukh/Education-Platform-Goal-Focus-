import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, getRoleLabel } from '../utils/auth'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    navigate('/')
  }

  const dashboardPath = user ? getDashboardPath(user.role) : '/login'

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GF</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Goal Focus</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-gray-700">
            <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
            <Link to="/tutors" className="hover:text-blue-600 transition-colors font-medium">Find Tutors</Link>
            <Link to="/goal-path" className="hover:text-blue-600 transition-colors font-medium">Learning Goals</Link>
            {user && (
              <Link to={dashboardPath} className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse" />
            ) : user ? (
              <>
                <div className="text-right">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover mx-auto mb-1 border-2 border-blue-200" />
                  ) : null}
                  <p className="text-sm font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Sign up
                </Link>
                <Link
                  to="/signup?role=teacher"
                  className="px-5 py-2 text-blue-700 font-semibold border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Become a Tutor
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Home</Link>
            <Link to="/tutors" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Find Tutors</Link>
            <Link to="/goal-path" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Learning Goals</Link>
            {user && (
              <Link to={dashboardPath} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Dashboard</Link>
            )}

            {user ? (
              <>
                <div className="px-4 py-2 text-sm">
                  <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-500">{getRoleLabel(user.role)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Sign up
                </Link>
                <Link to="/signup?role=teacher" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-blue-700 font-semibold border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  Become a Tutor
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
