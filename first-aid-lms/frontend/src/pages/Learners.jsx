import { useEffect, useState } from "react";
import API from "../services/api";

export default function Learners() {
  const [learners, setLearners] = useState([]);

  useEffect(() => {
    API.get("/learners?include=kpi")
      .then((res) => setLearners(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Learners KPI</h1>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Progress</th>
              <th>KPI Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {learners.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-3 font-medium">{l.name}</td>
                <td>{l.email}</td>

                <td>{l.enrollment?.progress || 0}%</td>

                <td>{l.enrollment?.kpiScore || 0}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      l.enrollment?.kpiScore >= 80
                        ? "bg-green-100 text-green-700"
                        : l.enrollment?.kpiScore >= 60
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {l.enrollment?.kpiScore >= 80
                      ? "High Performer"
                      : l.enrollment?.kpiScore >= 60
                      ? "Average"
                      : "At Risk"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}