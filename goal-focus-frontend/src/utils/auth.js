export const getDashboardPath = (role) => {
  switch (role) {
    case 'student':
      return '/student-dashboard';
    case 'teacher':
      return '/teacher-dashboard';
    case 'coaching':
      return '/coaching-dashboard';
    case 'admin':
      return '/admin-dashboard';
    default:
      return '/';
  }
};

export const getRoleLabel = (role) => {
  switch (role) {
    case 'student':
      return 'Student';
    case 'teacher':
      return 'Teacher';
    case 'coaching':
      return 'Coaching Center';
    case 'admin':
      return 'Admin';
    default:
      return 'User';
  }
};
