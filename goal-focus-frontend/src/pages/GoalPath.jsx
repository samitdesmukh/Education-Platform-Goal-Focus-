import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import DashboardSidebar, { studentNav } from '../components/DashboardSidebar';

export default function GoalPath() {
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareerPath('data-analyst').then((res) => {
      if (res.success) setPathData(res.data);
      setLoading(false);
    });
  }, []);

  const path = pathData?.path;
  const activeGoal = pathData?.activeGoal;

  const handleToggleMilestone = async (milestone) => {
    if (!activeGoal) return;
    await api.updateGoalMilestone(activeGoal._id, milestone._id, !milestone.completed);
    const res = await api.getCareerPath('data-analyst');
    if (res.success) setPathData(res.data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const progress = activeGoal?.progress ?? 0;
  const milestones = activeGoal?.milestones || path?.milestones || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/student-dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span className="mx-2">›</span>
            <span className="text-blue-600 font-semibold">{path?.title || 'Career Path'}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <DashboardSidebar items={studentNav} role="student" />

          <div className="lg:col-span-3 space-y-8">
            <section>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{path?.title}</h1>
              <p className="text-lg text-gray-600">{path?.description}</p>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8 border">
              <h2 className="text-2xl font-bold mb-6">Path Progress</h2>
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold">{progress}% Complete</p>
                {activeGoal && (
                  <span className="text-sm text-gray-500">
                    Target: {activeGoal.targetDate ? new Date(activeGoal.targetDate).toLocaleDateString() : 'Not set'}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {milestones.map((m, idx) => (
                  <div key={m._id || idx} className="text-center p-4 rounded-xl border">
                    <p className="text-gray-600 mb-2 text-sm">{m.title}</p>
                    {activeGoal ? (
                      <button
                        onClick={() => handleToggleMilestone(m)}
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          m.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {m.completed ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">Not started</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8 border">
              <h2 className="text-2xl font-bold mb-6">Core Path Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(path?.skills || []).map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </section>

            {!activeGoal && (
              <div className="text-center p-8 bg-blue-50 rounded-xl">
                <p className="text-gray-700 mb-4">Start this career path to track your progress</p>
                <button
                  onClick={async () => {
                    await api.createStudentGoal({
                      title: path?.title,
                      description: path?.description,
                      pathSlug: path?.slug,
                      category: 'Data Science',
                    });
                    const res = await api.getCareerPath('data-analyst');
                    if (res.success) setPathData(res.data);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Start This Path
                </button>
              </div>
            )}

            <Link to="/tutors" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
              Find Tutors for This Path →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
