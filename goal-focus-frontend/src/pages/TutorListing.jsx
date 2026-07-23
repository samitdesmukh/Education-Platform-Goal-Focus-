import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import TutorAvatar from '../components/TutorAvatar';

export default function TutorListing() {
  const [searchParams] = useSearchParams();
  const [tutors, setTutors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: searchParams.get('category') || '',
    rating: '',
    price: '',
  });

  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters((prev) => ({ ...prev, subject: cat }));
      fetchTutors({ subject: cat, rating: '', price: '' });
    } else {
      fetchTutors();
    }
  }, []);

  const fetchTutors = async (filterObj = filters) => {
    setLoading(true);
    try {
      const res = await api.searchTutors({
        subject: filterObj.subject || '',
        category: filterObj.subject || '',
        minRating: filterObj.rating || '',
        maxPrice: filterObj.price || '',
      });
      if (res.success) setTutors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => fetchTutors(filters);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Tutor</h1>
        <p className="text-gray-600 mb-8">Only admin-verified teachers are shown here</p>

        <div className="bg-white rounded-xl shadow p-6 mb-8 border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select name="subject" value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} className="px-4 py-2 border rounded-lg">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <select name="rating" value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })} className="px-4 py-2 border rounded-lg">
              <option value="">Rating</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
              <option value="4.9">4.9+</option>
            </select>
            <select name="price" value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })} className="px-4 py-2 border rounded-lg">
              <option value="">Price Range</option>
              <option value="20">Under $20</option>
              <option value="40">Under $40</option>
              <option value="100">Any</option>
            </select>
            <button onClick={handleApplyFilters} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Apply Filters</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12"><p className="text-gray-600">Loading tutors...</p></div>
          ) : tutors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 mb-2">No verified tutors found.</p>
              <p className="text-sm text-gray-500">Teachers appear here after admin approval.</p>
            </div>
          ) : (
            tutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all">
                <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                  {tutor.verified && <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">✓ Verified</div>}
                </div>
                <div className="p-6 -mt-10 relative">
                  <TutorAvatar tutor={tutor} size="lg" className="mb-4" />
                  <h3 className="font-bold text-lg">{tutor.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{tutor.country} · {tutor.subject}</p>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{tutor.bio}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-yellow-600">⭐ {tutor.rating} ({tutor.students} students)</span>
                    <span className="font-bold text-blue-600">${tutor.price}/hr</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tutor.specialization?.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                  <Link to={`/booking?tutorId=${tutor.id}`} className="block w-full py-2 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 mb-2">
                    Book Trial Lesson
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
