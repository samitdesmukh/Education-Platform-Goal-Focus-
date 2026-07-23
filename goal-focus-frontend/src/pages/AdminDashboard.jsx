import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import DashboardSidebar, { adminNav } from '../components/DashboardSidebar';

export default function AdminDashboard() {
  const location = useLocation();
  const section = location.pathname.split('/').pop() || 'admin-dashboard';
  const activeSection = section === 'admin-dashboard' ? 'overview' : section;

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '📚', slug: '', description: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, catRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getCategories(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const pendingUsers = users.filter((u) => u.approvalStatus === 'pending');
  const students = users.filter((u) => u.role === 'student');
  const teachers = users.filter((u) => u.role === 'teacher');

  const handleApprove = async (id) => {
    await api.approveUser(id);
    loadData();
  };

  const handleReject = async (id) => {
    await api.rejectUser(id);
    loadData();
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Remove this student?')) {
      await api.deleteStudent(id);
      loadData();
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
    await api.createCategory({ ...newCategory, slug });
    setNewCategory({ name: '', icon: '📚', slug: '', description: '' });
    loadData();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DashboardSidebar items={adminNav} role="admin" />

        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-600">Manage users, verify teachers, and control platform content</p>
          </div>

          {(activeSection === 'overview' || activeSection === 'admin-dashboard') && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Students', value: stats?.totalStudents, color: 'text-blue-600' },
                  { label: 'Approved Teachers', value: stats?.approvedTeachers, color: 'text-green-600' },
                  { label: 'Coaching Centers', value: stats?.approvedCoaching, color: 'text-purple-600' },
                  { label: 'Pending Approvals', value: stats?.pendingApprovals?.length ?? pendingUsers.length, color: 'text-yellow-600' },
                  { label: 'Total Bookings', value: stats?.totalBookings, color: 'text-indigo-600' },
                  { label: 'Categories', value: stats?.totalCategories, color: 'text-pink-600' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl shadow border p-5">
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className={`text-3xl font-bold ${item.color}`}>{loading ? '-' : item.value ?? 0}</p>
                  </div>
                ))}
              </div>

              {pendingUsers.length > 0 && (
                <div className="bg-white rounded-xl shadow border p-6">
                  <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
                  <div className="space-y-3">
                    {pendingUsers.slice(0, 5).map((u) => (
                      <div key={u._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{u.firstName} {u.lastName}</p>
                          <p className="text-sm text-gray-600">{u.email} · {u.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(u._id)} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">Approve</button>
                          <button onClick={() => handleReject(u._id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeSection === 'approvals' && (
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-bold mb-4">Verify Teachers & Coaching Centers</h2>
              {pendingUsers.length === 0 ? (
                <p className="text-gray-600">No pending approvals.</p>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((u) => (
                    <div key={u._id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-xl">
                      <div>
                        <p className="font-semibold text-lg">{u.firstName} {u.lastName}</p>
                        <p className="text-gray-600">{u.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs capitalize">{u.role}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(u._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">Approve</button>
                        <button onClick={() => handleReject(u._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'users' && (
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-xl font-bold mb-4">Manage Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-600">
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b">
                        <td className="py-3 font-medium">{u.firstName} {u.lastName}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3 capitalize">{u.role}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            u.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                            u.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {u.approvalStatus || 'active'}
                          </span>
                        </td>
                        <td className="py-3">
                          {u.approvalStatus === 'pending' && (
                            <button onClick={() => handleApprove(u._id)} className="text-green-600 mr-2">Approve</button>
                          )}
                          {u.role === 'teacher' && u.approvalStatus === 'approved' && (
                            <button onClick={() => api.toggleFeatured(u._id).then(loadData)} className="text-blue-600 mr-2">Toggle Featured</button>
                          )}
                          {u.role === 'student' && (
                            <button onClick={() => handleDeleteStudent(u._id)} className="text-red-600">Remove</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow border p-6">
                <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{cat.icon} {cat.name}</span>
                      <span className="text-sm text-gray-500">{cat.tutors} tutors · ⭐ {cat.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow border p-6">
                <h2 className="text-xl font-bold mb-4">Add Category</h2>
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <input placeholder="Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                  <input placeholder="Icon (emoji)" value={newCategory.icon} onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                  <input placeholder="Slug (optional)" value={newCategory.slug} onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                  <textarea placeholder="Description" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
                  <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold">Create Category</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
