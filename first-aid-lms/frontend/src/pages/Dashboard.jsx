import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, overviewRes] = await Promise.all([
          API.get("/dashboard/stats"),
          API.get("/dashboard/overview"),
        ]);

        setStats(statsRes.data);
        setOverview(overviewRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="space-y-8">
        <p>Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="space-y-8">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl text-gray-700 font-bold mb-8">Dashboard Overview</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Courses" value={stats.totalCourses} />
        <DashboardCard title="Total Modules" value={stats.totalModules} />
        <DashboardCard title="Total Lessons" value={stats.totalLessons} />
        <DashboardCard title="Total Learners" value={stats.totalLearners} />
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <DashboardCard
          title="Enrollments"
          value={stats.totalEnrollments}
        />
        <DashboardCard
          title="Completed"
          value={stats.completedEnrollments}
        />
        <DashboardCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
        />
      </div>

      {/* ANALYTICS SECTION */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <div className="bg-white shadow rounded-lg p-6 ">
          <h2 className="font-bold text-gray-700 text-lg mb-4">Learning Overview</h2>

          <p className="text-gray-600">
            Average Progress:{" "}
            <span className="font-bold">{overview.avgProgress}%</span>
          </p>

          <div className="mt-4 space-y-2">
            {Object.entries(overview.progressBuckets).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span>{key}%</span>
                <span>{val} learners</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder chart box */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-bold text-lg mb-4  text-gray-700">Analytics (Future Chart)</h2>
          <div className="h-40 flex items-center justify-center text-gray-400 border rounded">
            Chart Area
          </div>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="mt-10 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4  text-gray-700">LMS Admin Panel</h2>
        <p className="text-gray-600">
          Manage courses, modules, lessons, assessments, and track learner progress
          across the platform.
        </p>
      </div>
    </div>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

function DashboardCard({ icon, title, value }) {
  return (
    <div className="card">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}