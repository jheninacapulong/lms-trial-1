import { useEffect, useState } from "react";
import API from "../services/api";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    API.get("/lessons")
      .then(res => setLessons(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>

      <div className="space-y-2">
        {lessons.map(l => (
          <div key={l.id} className="p-3 bg-white shadow rounded">
            <h2 className="font-semibold">{l.title}</h2>
            <p className="text-sm text-gray-500">{l.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}