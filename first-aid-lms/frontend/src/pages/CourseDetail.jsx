import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import StyledRTE from "../components/StyledRTE";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [expandedModule, setExpandedModule] = useState(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForms, setShowLessonForms] = useState({});

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLessonForms, setNewLessonForms] = useState({});

  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingLessonForm, setEditingLessonForm] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      setLoading(true);
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to load course:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateModule(e) {
    e.preventDefault();

    await API.post("/modules", {
      title: newModuleTitle,
      courseId: id,
      order: Number((course?.modules?.length || 0) + 1),
    });

    setNewModuleTitle("");
    setShowModuleForm(false);
    await loadCourse();
  }

  async function handleCreateLesson(e, moduleId) {
    e.preventDefault();

    const form = newLessonForms[moduleId] || { title: "", content: "" };
    if (!form.title.trim()) return;

    const moduleData = course?.modules?.find(
      (m) => m.id === moduleId
    );

    await API.post("/lessons", {
      title: form.title.trim(),
      content: form.content.trim(),
      moduleId,
      order: (moduleData?.lessons?.length || 0) + 1,
    });

    setNewLessonForms((prev) => ({
      ...prev,
      [moduleId]: { title: "", content: "" },
    }));

    setShowLessonForms((prev) => ({
      ...prev,
      [moduleId]: false,
    }));

    await loadCourse();
  }

  function startEditLesson(lesson) {
    setEditingLessonId(lesson.id);
    setEditingLessonForm({
      title: lesson.title || "",
      content: lesson.content || "",
    });
  }

  async function handleSaveLesson() {
    await API.put(`/lessons/${editingLessonId}`, {
      title: editingLessonForm.title.trim(),
      content: editingLessonForm.content.trim(),
    });

    setEditingLessonId(null);
    await loadCourse();
  }

  async function handleDeleteLesson() {
    if (!window.confirm("Delete this lesson?")) return;

    await API.delete(`/lessons/${editingLessonId}`);
    setEditingLessonId(null);
    await loadCourse();
  }

  if (loading) return <div className="p-6 text-left">Loading...</div>;

  if (!course)
    return <div className="p-6 text-left text-red-500">Course not found</div>;

  return (
    <div className="p-6 text-left">

      {/* HEADER */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/courses")}
          className="text-blue-600 mb-4"
        >
          ← Back to Courses
        </button>

        <h1 className="text-3xl font-bold text-gray-700">
          {course.title}
        </h1>

        <p className="text-gray-600">
          {course.description}
        </p>
      </div>

      {/* MODULES */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Modules ({course.modules?.length || 0})
          </h2>

          <button
            onClick={() => setShowModuleForm((v) => !v)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showModuleForm ? "Cancel" : "+ Add Module"}
          </button>
        </div>

        {/* CREATE MODULE */}
        {showModuleForm && (
          <form onSubmit={handleCreateModule} className="mb-4">
            <input
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="w-full border px-3 py-2 mb-2"
              placeholder="Module title"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Create Module
            </button>
          </form>
        )}

        {/* MODULE LIST */}
        <div className="space-y-4">

          {course.modules?.map((mod) => (
            <div key={mod.id} className="border rounded">

              {/* MODULE HEADER */}
              <div
                className="bg-gray-100 p-4 flex justify-between cursor-pointer"
                onClick={() =>
                  setExpandedModule(
                    expandedModule === mod.id ? null : mod.id
                  )
                }
              >
                <div>
                  <p className="font-bold">{mod.title}</p>
                  <p className="text-sm text-gray-600">
                    {mod.lessons?.length || 0} lessons
                  </p>
                </div>

                <span>
                  {expandedModule === mod.id ? "▼" : "▶"}
                </span>
              </div>

              {/* LESSONS */}
              {expandedModule === mod.id && (
                <div className="p-4">

                  {/* ADD LESSON */}
                  <button
                    onClick={() =>
                      setShowLessonForms((p) => ({
                        ...p,
                        [mod.id]: !p[mod.id],
                      }))
                    }
                    className="bg-blue-600 text-white px-3 py-1 mb-3"
                  >
                    + Add Lesson
                  </button>

                  {showLessonForms[mod.id] && (
                    <form
                      onSubmit={(e) => handleCreateLesson(e, mod.id)}
                      className="mb-4"
                    >
                      <input
                        value={newLessonForms[mod.id]?.title || ""}
                        onChange={(e) =>
                          setNewLessonForms((p) => ({
                            ...p,
                            [mod.id]: {
                              ...p[mod.id],
                              title: e.target.value,
                            },
                          }))
                        }
                        className="w-full border px-3 py-2 mb-2"
                        placeholder="Lesson title"
                      />

                      <StyledRTE
                        value={newLessonForms[mod.id]?.content || ""}
                        onChange={(val) =>
                          setNewLessonForms((p) => ({
                            ...p,
                            [mod.id]: {
                              ...p[mod.id],
                              content: val,
                            },
                          }))
                        }
                        height={180}
                      />

                      <button className="bg-green-600 text-white px-4 py-2 mt-2">
                        Save Lesson
                      </button>
                    </form>
                  )}

                  {/* LESSON LIST */}
                  <div className="space-y-2">
                    {mod.lessons?.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border p-2 flex justify-between"
                      >
                        <p>{lesson.title}</p>

                        <button
                          className="text-blue-600"
                          onClick={() => startEditLesson(lesson)}
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* EDIT MODAL */}
      {editingLessonId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl p-5 rounded">

            {/* TITLE */}
            <input
              className="w-full border px-3 py-2 mb-3 bg-yellow-50 font-semibold"
              value={editingLessonForm.title}
              onChange={(e) =>
                setEditingLessonForm((p) => ({
                  ...p,
                  title: e.target.value,
                }))
              }
            />

            {/* CONTENT */}
            <StyledRTE
              value={editingLessonForm.content}
              onChange={(val) =>
                setEditingLessonForm((p) => ({
                  ...p,
                  content: val,
                }))
              }
              height={220}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={handleSaveLesson}
                className="bg-green-600 text-white px-4 py-2"
              >
                Save
              </button>

              <button
                onClick={() => setEditingLessonId(null)}
                className="border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteLesson}
                className="bg-red-600 text-white px-4 py-2"
              >
                Delete
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}