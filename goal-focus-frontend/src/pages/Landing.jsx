import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import TutorAvatar from '../components/TutorAvatar'

export default function Landing() {
  const [categories, setCategories] = useState([])
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tutorRes] = await Promise.all([
          api.getCategories(),
          api.getFeaturedTutors(4)
        ])
        if (catRes.success) setCategories(catRes.data.slice(0, 12))
        if (tutorRes.success) setTutors(tutorRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const learningGoals = [
    { id: 1, title: 'Get a Software Developer Job', tutors: 45, timeline: '6-12 months', successRate: '89%' },
    { id: 2, title: 'Crack IELTS Band 8+', tutors: 38, timeline: '3-6 months', successRate: '76%' },
    { id: 3, title: 'Learn English Fluently', tutors: 52, timeline: '6-9 months', successRate: '92%' },
    { id: 4, title: 'Become a Data Analyst', tutors: 42, timeline: '4-8 months', successRate: '84%' },
    { id: 5, title: 'Crack Government Exams', tutors: 31, timeline: '6-12 months', successRate: '71%' },
    { id: 6, title: 'Master Graphic Design', tutors: 28, timeline: '3-6 months', successRate: '88%' },
  ]

  const institutes = [
    { id: 1, name: 'Tech Academy Pro', city: 'New York', rating: 4.9, students: 5420, courses: 45, online: true },
    { id: 2, name: 'English Masters', city: 'London', rating: 4.8, students: 3890, courses: 28, online: true },
    { id: 3, name: 'Data Science Hub', city: 'Bangalore', rating: 4.8, students: 4120, courses: 32, online: true },
    { id: 4, name: 'JEE Excellence', city: 'Delhi', rating: 4.9, students: 6780, courses: 52, online: true },
  ]

  const stats = [
    { label: '50,000+', desc: 'Students' },
    { label: '10,000+', desc: 'Teachers' },
    { label: '100+', desc: 'Countries' },
    { label: '1M+', desc: 'Classes Completed' },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-500 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Find the Perfect Tutor</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">Connect with expert tutors, coaching centers, and mentors worldwide.</p>
          <div className="bg-white rounded-lg shadow-xl p-4 mb-8 max-w-2xl mx-auto">
            <input type="text" placeholder="Search tutors, courses, or learning goals..." className="w-full px-4 py-3 rounded-lg focus:outline-none text-gray-900 placeholder-gray-500" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/tutors" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg transition-all">Find Teachers</Link>
            <Link to="/signup?role=teacher" className="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all">Become a Tutor</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12"><p className="text-gray-600">Loading categories...</p></div>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <Link key={cat.id} to={`/tutors?category=${cat.slug}`} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all hover:scale-105 block">
                  <div className="text-4xl mb-4">{cat.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{cat.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{cat.tutors} Tutors</p>
                  <div className="flex items-center justify-center gap-1"><span className="text-yellow-500">⭐</span><span className="text-gray-700 font-semibold">{cat.rating || 'New'}</span></div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">No categories available</div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Featured Teachers</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Ranked by rating, classes completed, and student reviews</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12"><p className="text-gray-600">Loading tutors...</p></div>
            ) : tutors.length > 0 ? (
              tutors.map((tutor) => (
                <div key={tutor.id} className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all border border-gray-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                    {tutor.verified && <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">✓ Verified</span>}
                  </div>
                  <div className="p-6 -mt-12 relative z-10 text-center">
                    <TutorAvatar tutor={tutor} size="lg" className="mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-1">{tutor.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{tutor.country} · {tutor.subject}</p>
                    <div className="flex items-center justify-center gap-2 mb-4"><span className="text-yellow-500">⭐ {tutor.rating}</span><span className="text-gray-600 text-sm">({tutor.classesCompleted} classes)</span></div>
                    <p className="font-bold text-blue-600 mb-4">${tutor.price}/hr</p>
                    <div className="flex flex-wrap gap-2 mb-4 justify-center">{(tutor.specialization || []).slice(0, 2).map((spec, idx) => (<span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{spec}</span>))}</div>
                    <div className="text-center mb-4 flex items-center justify-center gap-2">{tutor.online && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}<span className="text-gray-600 text-sm">{tutor.online ? 'Available Online' : 'Offline'}</span></div>
                    <Link to={`/booking?tutorId=${tutor.id}`} className="block w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Book Trial Lesson</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">No tutors available</div>
            )}
          </div>
        </div>
      </section>

      {/* Learning Goals */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Learning Goals that Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningGoals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-600">
                <h3 className="font-bold text-lg text-gray-900 mb-4">{goal.title}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="text-gray-600">Recommended Tutors:</span><span className="font-bold text-blue-600">{goal.tutors}+</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-600">Est. Timeline:</span><span className="font-bold text-gray-900">{goal.timeline}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-600">Success Rate:</span><span className="font-bold text-green-600">{goal.successRate}</span></div>
                </div>
                <Link to="/goal-path" className="mt-6 block w-full py-2 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors">View Path</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Institutes */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Top Coaching Institutes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutes.map((inst) => (
              <div key={inst.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200">
                <div className="w-16 h-16 rounded-lg bg-gray-300 mb-4 flex items-center justify-center text-2xl">🏢</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{inst.name}</h3>
                <p className="text-gray-600 text-sm mb-4">📍 {inst.city}</p>
                <div className="flex items-center gap-2 mb-4"><span className="text-yellow-500">⭐ {inst.rating}</span></div>
                <div className="space-y-2 mb-4 text-sm text-gray-600"><p>👥 {inst.students} Students</p><p>📚 {inst.courses} Courses</p><p>{inst.online ? '✅ Online Available' : '❌ Offline Only'}</p></div>
                <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Contact</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-6"><p className="text-4xl font-bold text-blue-400 mb-2">{stat.label}</p><p className="text-gray-300 font-medium">{stat.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of students already learning with Goal Focus</p>
          <Link to="/tutors" className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg transition-all">Find Your Tutor Now</Link>
        </div>
      </section>
    </div>
  )
}
