import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCourse(e) {
    e.preventDefault();
    try {
      await API.post("/courses", formData);
      setFormData({ title: "", description: "", category: "" });
      setShowForm(false);
      await loadCourses();
    } catch (err) {
      console.error("Failed to create course:", err);
    }
  }

  async function handleDeleteCourse(id) {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await API.delete(`/courses/${id}`);
        loadCourses();
      } catch (err) {
        console.error("Failed to delete course:", err);
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl  text-gray-700 font-bold">Courses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "+ Add New Course"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Course</h2>
          <form onSubmit={handleCreateCourse}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border rounded px-3 py-2 bg-gray-100"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <textarea
              placeholder="Course Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-4 bg-gray-100"
              rows="3"
            />
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Create Course
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                {course.category && <p className="text-sm text-gray-500 italic mb-2">({course.category})</p>}
                {course.modules && <p className="text-sm text-gray-500 mb-2">{course.modules.length} modules</p>}
                <p className="text-sm text-gray-600 mb-4">{course.description?.substring(0, 100)}...</p>
                <div className="flex gap-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}