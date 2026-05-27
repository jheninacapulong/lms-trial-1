import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalModules: 0,
    totalLessons: 0,
    totalLearners: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get("/courses/stats");
        setStats(response.data);
      } catch (err) {
        setError("Failed to load statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6"><p>Loading...</p></div>;
  if (error) return <div className="p-6"><p className="text-red-500">{error}</p></div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          icon="📚"
          title="Total Courses" 
          value={stats.totalCourses} 
          color="bg-blue-50 border-blue-200"
        />
        <DashboardCard 
          icon="📦"
          title="Total Modules" 
          value={stats.totalModules}
          color="bg-green-50 border-green-200"
        />
        <DashboardCard 
          icon="📄"
          title="Total Lessons" 
          value={stats.totalLessons}
          color="bg-purple-50 border-purple-200"
        />
        <DashboardCard 
          icon="👥"
          title="Total Learners" 
          value={stats.totalLearners}
          color="bg-orange-50 border-orange-200"
        />
      </div>

      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Welcome to First Aid LMS</h2>
        <p className="text-gray-600 mb-4">
          This admin portal allows you to manage First Aid training courses, modules, lessons, and learner enrollments.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Create and manage courses with structured modules</li>
          <li>Add lessons with rich content and multimedia</li>
          <li>Create assessments and quizzes</li>
          <li>Track learner enrollments and progress</li>
          <li>View comprehensive learning analytics</li>
        </ul>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value, color }) {
  return (
    <div className={`${color} border-2 rounded-lg p-6 transition-transform hover:scale-105`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}