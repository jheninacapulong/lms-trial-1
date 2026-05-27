import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    learners: 0,
  });

  useEffect(() => {
    async function load() {
      const courses = await API.get("/courses");
      const learners = await API.get("/learners");

      setStats({
        courses: courses.data.length,
        learners: learners.data.length,
      });
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Courses" value={stats.courses} />
        <Card title="Learners" value={stats.learners} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 shadow rounded">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}