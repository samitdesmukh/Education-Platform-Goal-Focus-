const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
};

const parseResponse = async (res) => {
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    return { success: false, message: payload?.message || payload?.error || `HTTP ${res.status}` };
  }
  return payload;
};

const authFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });
  return parseResponse(res);
};

export const api = {
  getAllTutors: async () => parseResponse(await fetch(`${API_BASE_URL}/tutors`)),
  getFeaturedTutors: async (limit = 4) =>
    parseResponse(await fetch(`${API_BASE_URL}/tutors/featured?limit=${limit}`)),
  getTutorById: async (id) => parseResponse(await fetch(`${API_BASE_URL}/tutors/${id}`)),
  searchTutors: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.category) params.append('category', filters.category);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    return parseResponse(await fetch(`${API_BASE_URL}/tutors/search?${params}`));
  },
  getCategories: async () => parseResponse(await fetch(`${API_BASE_URL}/categories`)),
  createBooking: async (bookingData) =>
    authFetch(`${API_BASE_URL}/bookings`, { method: 'POST', body: JSON.stringify(bookingData) }),
  getBookings: async () => authFetch(`${API_BASE_URL}/bookings`),
  getDashboardStats: async () => authFetch(`${API_BASE_URL}/dashboard/stats`),
  getProfile: async () => authFetch(`${API_BASE_URL}/profile`),
  updateProfile: async (data) =>
    authFetch(`${API_BASE_URL}/profile`, { method: 'PATCH', body: JSON.stringify(data) }),
  getStudentGoals: async () => authFetch(`${API_BASE_URL}/student/goals`),
  createStudentGoal: async (data) =>
    authFetch(`${API_BASE_URL}/student/goals`, { method: 'POST', body: JSON.stringify(data) }),
  updateGoalMilestone: async (goalId, milestoneId, completed) =>
    authFetch(`${API_BASE_URL}/student/goals/${goalId}/milestones/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
  getStudentClasses: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return authFetch(`${API_BASE_URL}/student/classes?${params}`);
  },
  getCareerPath: async (slug = 'data-analyst') =>
    authFetch(`${API_BASE_URL}/paths/${slug}`),
  getTeacherInsights: async () => authFetch(`${API_BASE_URL}/teacher/insights`),
  getCoachingDashboard: async () => authFetch(`${API_BASE_URL}/coaching/dashboard`),
  getAdminStats: async () => authFetch(`${API_BASE_URL}/admin/stats`),
  getAdminUsers: async (role) =>
    authFetch(`${API_BASE_URL}/admin/users${role ? `?role=${role}` : ''}`),
  approveUser: async (id) =>
    authFetch(`${API_BASE_URL}/admin/users/${id}/approve`, { method: 'PATCH' }),
  rejectUser: async (id) =>
    authFetch(`${API_BASE_URL}/admin/users/${id}/reject`, { method: 'PATCH' }),
  toggleFeatured: async (id) =>
    authFetch(`${API_BASE_URL}/admin/teachers/${id}/feature`, { method: 'PATCH' }),
  deleteStudent: async (id) =>
    authFetch(`${API_BASE_URL}/admin/students/${id}`, { method: 'DELETE' }),
  createCategory: async (data) =>
    authFetch(`${API_BASE_URL}/admin/categories`, { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: async (id, data) =>
    authFetch(`${API_BASE_URL}/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
