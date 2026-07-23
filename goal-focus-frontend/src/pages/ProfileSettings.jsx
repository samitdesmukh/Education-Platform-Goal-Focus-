import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import DashboardSidebar, { studentNav, teacherNav, coachingNav, adminNav } from './DashboardSidebar';

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    country: '',
    instituteName: '',
    profilePicture: '',
    subjects: '',
    hourlyRate: 25,
    languages: '',
    specialization: '',
    online: true,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navMap = {
    student: studentNav,
    teacher: teacherNav,
    coaching: coachingNav,
    admin: adminNav,
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, catRes] = await Promise.all([
          api.getProfile(),
          api.getCategories(),
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (profileRes.success) {
          const { user: u, teacherProfile } = profileRes.data;
          setForm({
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            bio: u.bio || '',
            phone: u.phone || '',
            country: u.country || '',
            instituteName: u.instituteName || '',
            profilePicture: u.profilePicture || '',
            subjects: teacherProfile?.subjects?.join(', ') || '',
            hourlyRate: teacherProfile?.hourlyRate || 25,
            languages: teacherProfile?.languages?.join(', ') || 'English',
            specialization: teacherProfile?.specialization?.join(', ') || '',
            online: teacherProfile?.online ?? true,
          });
          setSelectedCategories(
            teacherProfile?.categoryIds?.map((c) => c._id || c) || []
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500000) {
      setError('Image must be under 500KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profilePicture: reader.result }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      phone: form.phone,
      country: form.country,
      instituteName: form.instituteName,
      profilePicture: form.profilePicture,
    };

    if (user?.role === 'teacher') {
      payload.subjects = form.subjects.split(',').map((s) => s.trim()).filter(Boolean);
      payload.hourlyRate = Number(form.hourlyRate);
      payload.languages = form.languages.split(',').map((s) => s.trim()).filter(Boolean);
      payload.specialization = form.specialization.split(',').map((s) => s.trim()).filter(Boolean);
      payload.categoryIds = selectedCategories;
      payload.online = form.online;
    }

    const res = await api.updateProfile(payload);
    setSaving(false);

    if (res.success) {
      setMessage('Profile saved successfully');
      await refreshUser();
    } else {
      setError(res.message || 'Failed to save profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DashboardSidebar items={navMap[user?.role] || studentNav} role={user?.role} />

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600 mb-6">Update your personal information and profile photo</p>

            {user?.approvalStatus === 'pending' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
                Your account is pending admin approval. You will appear in Find Tutors after verification.
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                {form.profilePicture ? (
                  <img src={form.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600 font-bold">
                    {form.firstName?.[0]}{form.lastName?.[0]}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Max 500KB. JPG or PNG.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="w-full px-4 py-2 border rounded-lg" placeholder="Tell students about yourself..." />
              </div>

              {user?.role === 'coaching' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Institute Name</label>
                  <input value={form.instituteName} onChange={(e) => setForm({ ...form, instituteName: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              )}

              {user?.role === 'teacher' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects (comma separated)</label>
                      <input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Programming, Python" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
                      <input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Languages</label>
                      <input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Specializations</label>
                      <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setSelectedCategories((prev) =>
                              prev.includes(cat.id)
                                ? prev.filter((id) => id !== cat.id)
                                : [...prev, cat.id]
                            )
                          }
                          className={`px-3 py-1.5 rounded-full text-sm border ${
                            selectedCategories.includes(cat.id)
                              ? 'bg-blue-100 border-blue-400 text-blue-700'
                              : 'border-gray-300 text-gray-600'
                          }`}
                        >
                          {cat.icon} {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.online} onChange={(e) => setForm({ ...form, online: e.target.checked })} />
                    <span className="text-sm text-gray-700">Available for online classes</span>
                  </label>
                </>
              )}

              <button type="submit" disabled={saving} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
