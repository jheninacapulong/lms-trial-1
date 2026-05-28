import { useEffect, useState } from "react";
import API from "../services/api";

export default function Learners() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    loadLearners();
  }, []);

  async function loadLearners() {
    try {
      setLoading(true);
      const res = await API.get("/learners");
      setLearners(res.data);
    } catch (err) {
      console.error("Failed to load learners:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLearner(e) {
    e.preventDefault();
    try {
      await API.post("/learners", formData);
      setFormData({ name: "", email: "" });
      setShowForm(false);
      loadLearners();
    } catch (err) {
      console.error("Failed to create learner:", err);
      alert("Error creating learner: " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDeleteLearner(id) {
    if (window.confirm("Delete this learner?")) {
      try {
        await API.delete(`/learners/${id}`);
        loadLearners();
      } catch (err) {
        console.error("Failed to delete learner:", err);
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Learner Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Learner"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Learner</h2>
          <form onSubmit={handleCreateLearner}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border rounded px-3 py-2 bg-gray-100"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border rounded px-3 py-2 bg-gray-100"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Add Learner
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading learners...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Enrollments</th>
                <th className="p-4 text-center">Progress</th>
                <th className="p-4 text-center">Completed</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {learners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No learners yet
                  </td>
                </tr>
              ) : (
                learners.map((learner) => {
                  const avgProgress = learner.enrollments?.length > 0
                    ? Math.round(learner.enrollments.reduce((sum, e) => sum + e.progress, 0) / learner.enrollments.length)
                    : 0;
                  const completedCount = learner.enrollments?.filter(e => e.completed).length || 0;

                  return (
                    <tr key={learner.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{learner.name}</td>
                      <td className="p-4">{learner.email}</td>
                      <td className="p-4 text-center">{learner.enrollments?.length || 0}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${avgProgress}%` }}
                            />
                          </div>
                          <span className="ml-2 text-xs">{avgProgress}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {completedCount > 0 ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {completedCount} course{completedCount > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteLearner(learner.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}