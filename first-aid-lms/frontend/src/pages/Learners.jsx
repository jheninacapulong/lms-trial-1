import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function calculateAge(birthday) {
  if (!birthday) return "—";
  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) return "—";
  const diff = Date.now() - birth.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

export default function Learners() {
  const [learners, setLearners] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedLearner, setSelectedLearner] = useState(null);

  useEffect(() => {
    loadLearners();
    loadEnrollments();
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

  async function loadEnrollments() {
    try {
      const res = await API.get("/enrollments");
      setEnrollments(res.data || []);
    } catch (err) {
      console.error("Failed to load enrollments:", err);
    }
  }

  async function handleCreateLearner(e) {
    e.preventDefault();
    try {
      await API.post("/learners", formData);
      setFormData({ name: "", email: "" });
      setShowForm(false);
      await loadLearners();
      await loadEnrollments();
    } catch (err) {
      console.error("Failed to create learner:", err);
      alert("Error creating learner: " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDeleteLearner(id) {
    if (window.confirm("Delete this learner?")) {
      try {
        await API.delete(`/learners/${id}`);
        await loadLearners();
        await loadEnrollments();
      } catch (err) {
        console.error("Failed to delete learner:", err);
      }
    }
  }

  const courseMap = useMemo(() => Object.fromEntries((enrollments || []).map((enrollment) => [enrollment.courseId, enrollment.course])), [enrollments]);

  const filteredLearners = useMemo(() => {
    const lowered = searchTerm.trim().toLowerCase();

    return [...learners]
      .filter((learner) => {
        const matchesSearch = !lowered || `${learner.name || ""} ${learner.email || ""}`.toLowerCase().includes(lowered);
        const enrollmentCount = learner.enrollments?.length || 0;
        const matchesFilter = filterBy === "all" || (filterBy === "active" ? enrollmentCount > 0 : enrollmentCount === 0);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "enrollments") return (b.enrollments?.length || 0) - (a.enrollments?.length || 0);
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [learners, searchTerm, sortBy, filterBy]);

  return (
    <div className="min-h-screen w-full p-4 md:p-6 text-slate-700">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-700">Overview</p>
          <h1 className="text-3xl font-bold text-slate-800">Learner Management</h1>
          <p className="mt-1 text-slate-600">Search, sort, and review learner activity across all courses.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Learner"}
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total learners</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{learners.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total enrollments</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{enrollments.length}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none ring-0 focus:border-blue-400 xl:max-w-md"
        />
        <div className="flex flex-wrap gap-3">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
            <option value="name">Sort: Name A–Z</option>
            <option value="enrollments">Sort: Most enrollments</option>
          </select>
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
            <option value="all">Filter: All learners</option>
            <option value="active">Filter: Enrolled only</option>
            <option value="inactive">Filter: Unenrolled only</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Add New Learner</h2>
          <form onSubmit={handleCreateLearner} className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" required />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700" required />
            <button type="submit" className="rounded bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 md:col-span-2">Add Learner</button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-slate-600">Loading learners...</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] table-fixed text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="w-[28%] p-4 text-left">Name</th>
                  <th className="w-[32%] p-4 text-left">Email</th>
                  <th className="w-[18%] p-4 text-center">Enrollments</th>
                  <th className="w-[22%] p-4 text-center">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredLearners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-500">No learners match your search.</td>
                  </tr>
                ) : (
                  filteredLearners.map((learner) => {
                    const avgProgress = learner.enrollments?.length > 0 ? Math.round(learner.enrollments.reduce((sum, e) => sum + e.progress, 0) / learner.enrollments.length) : 0;
                    return (
                      <tr key={learner.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-4 align-top font-semibold text-blue-700">
                          <button type="button" onClick={() => setSelectedLearner(learner)} className="truncate text-left underline decoration-blue-200 hover:text-blue-900">{learner.name}</button>
                        </td>
                        <td className="p-4 align-top text-slate-600"><span className="block truncate">{learner.email}</span></td>
                        <td className="p-4 align-top text-center text-slate-700">{learner.enrollments?.length || 0}</td>
                        <td className="p-4 align-top text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${avgProgress}%` }} /></div>
                            <span className="text-xs text-slate-600">{avgProgress}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {selectedLearner ? (
              <>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-700">Learner profile</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">{selectedLearner.name}</h2>
                <p className="text-slate-600">{selectedLearner.email}</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div><span className="font-semibold">Full name:</span> {selectedLearner.fullName || selectedLearner.name || "Not provided"}</div>
                  <div><span className="font-semibold">Birthday:</span> {selectedLearner.birthday || "Not provided"}</div>
                  <div><span className="font-semibold">Age:</span> {calculateAge(selectedLearner.birthday)}</div>
                  <div><span className="font-semibold">Occupation:</span> {selectedLearner.occupation || "Not provided"}</div>
                </div>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <h3 className="text-base font-semibold text-slate-800">Enrolled courses</h3>
                  {(selectedLearner.enrollments || []).length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">No course enrollments yet.</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {(selectedLearner.enrollments || []).map((enrollment) => {
                        const course = courseMap[enrollment.courseId] || { title: "Course" };
                        return (
                          <div key={`${selectedLearner.id}-${enrollment.id}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-slate-700">{course.title || "Course"}</p>
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{enrollment.progress || 0}%</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{enrollment.completed ? "Completed" : "In progress"}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteLearner(selectedLearner.id)}
                    className="mt-5 w-full rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete Learner
                  </button>
                </div>
              </>
            ) : (
              <div className="text-slate-500">Select a learner to view detailed information.</div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}