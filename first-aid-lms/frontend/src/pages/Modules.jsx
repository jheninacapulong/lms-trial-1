import { useEffect, useState } from "react";
import API from "../services/api";

export default function Modules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    API.get("/modules")
      .then(res => setModules(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Modules</h1>

      <div className="space-y-2">
        {modules.map(m => (
          <div key={m.id} className="p-3 bg-white shadow rounded">
            {m.title}
          </div>
        ))}
      </div>
    </div>
  );
}