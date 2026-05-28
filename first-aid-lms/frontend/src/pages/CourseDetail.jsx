import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import StyledRTE from "../components/StyledRTE";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: "", description: "", category: "" });
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [draggedLessonId, setDraggedLessonId] = useState(null);

  const [expandedModule, setExpandedModule] = useState(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForms, setShowLessonForms] = useState({});

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLessonForms, setNewLessonForms] = useState({});

  const [editingLessonId, setEditingLessonId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editingLessonForm, setEditingLessonForm] = useState({
    title: "",
    content: "",
  });

  const loadCourse = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data);
      setCourseForm({
        title: res.data?.title || "",
        description: res.data?.description || "",
        category: res.data?.category || "",
      });
    } catch (err) {
      console.error("Failed to load course:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadStudents = useCallback(async () => {
    try {
      const res = await API.get("/enrollments");
      const filtered = (res.data || [])
        .filter((enrollment) => enrollment.courseId === id)
        .map((enrollment) => ({
          id: enrollment.id,
          learnerName: enrollment.learner?.name || "Unknown learner",
          email: enrollment.learner?.email || "",
          progress: Number(enrollment.progress || 0),
          completed: Boolean(enrollment.completed),
        }));
      setStudents(filtered);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  }, [id]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  function startEditCourse() {
    setEditingCourse(true);
    setCourseForm({
      title: course?.title || "",
      description: course?.description || "",
      category: course?.category || "",
    });
  }

  async function handleSaveCourse() {
    await API.put(`/courses/${id}`, courseForm);
    setEditingCourse(false);
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

  function handleCancelLessonForm(moduleId) {
    const form = newLessonForms[moduleId] || { title: "", content: "" };
    const hasInput = form.title.trim() || form.content?.trim();

    if (hasInput && !window.confirm("Changes won't be saved when cancelled.")) {
      return;
    }

    setShowLessonForms((prev) => ({ ...prev, [moduleId]: false }));
    setNewLessonForms((prev) => ({ ...prev, [moduleId]: { title: "", content: "" } }));
  }

  async function handleReorderLessons(moduleId, draggedId, targetId) {
    const moduleData = course?.modules?.find((mod) => mod.id === moduleId);
    const lessons = [...(moduleData?.lessons || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

    if (!lessons.length || draggedId === targetId) return;

    const fromIndex = lessons.findIndex((lesson) => lesson.id === draggedId);
    const toIndex = lessons.findIndex((lesson) => lesson.id === targetId);

    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = [...lessons];
    const [movedLesson] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedLesson);

    const updates = reordered.map((lesson, index) =>
      API.put(`/lessons/${lesson.id}`, { order: index + 1 })
    );

    await Promise.all(updates);
    await loadCourse();
    setDraggedLessonId(null);
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

        <div className="mt-4 flex flex-wrap gap-3">
          {!editingCourse ? (
            <button
              onClick={startEditCourse}
              className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
            >
              Edit Course Details
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveCourse}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save Course
              </button>
              <button
                onClick={() => setEditingCourse(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={() => setShowStudents((prev) => !prev)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            {showStudents ? "Hide Students" : "Students"}
          </button>
        </div>

        {editingCourse && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
            <input
              value={courseForm.title}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded border border-amber-200 bg-white px-3 py-2 text-gray-700"
              placeholder="Course title"
            />
            <input
              value={courseForm.category}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded border border-amber-200 bg-white px-3 py-2 text-gray-700"
              placeholder="Category"
            />
            <textarea
              value={courseForm.description}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded border border-amber-200 bg-white px-3 py-2 text-gray-700"
              rows="3"
              placeholder="Course description"
            />
          </div>
        )}

        {showStudents && (
          <div className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Enrolled students</h3>
            {students.length === 0 ? (
              <p className="text-sm text-gray-500">No students have enrolled in this course yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="rounded border border-gray-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-700">{student.learnerName}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        KPI {student.progress}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded bg-gray-200">
                      <div className="h-2 rounded bg-emerald-500" style={{ width: `${Math.min(student.progress, 100)}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{student.completed ? "Completed" : "In progress"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODULES */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-600">
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
                    className="mb-3 rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 transition"
                  >
                    {showLessonForms[mod.id] ? "− Close Lesson" : "+ Add Lesson"}
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
                        className="mb-2 w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none"
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

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition">
                          Save Lesson
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelLessonForm(mod.id)}
                          className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Changes won’t be saved if you cancel.</p>
                    </form>
                  )}

                  {/* LESSON LIST */}
                  <div className="space-y-2">
                    {([...mod.lessons || []].sort((a, b) => (a.order || 0) - (b.order || 0))).map((lesson, index) => (
                      <div
                        key={lesson.id}
                        draggable
                        onClick={() => setSelectedLesson(lesson)}
                        onDragStart={() => setDraggedLessonId(lesson.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleReorderLessons(mod.id, draggedLessonId, lesson.id)}
                        onDragEnd={() => setDraggedLessonId(null)}
                        className={`flex cursor-pointer items-center gap-3 rounded border border-gray-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${draggedLessonId === lesson.id ? "scale-[1.01] border-blue-300 bg-blue-50" : ""}`}
                      >
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-xs font-semibold">{index + 1}</span>
                          <span className="text-lg leading-none">⋮⋮</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">{lesson.title}</p>
                          <p className="text-xs text-gray-500">Click to view content • Drag to reorder</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedLesson && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
                      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Lesson details</p>
                            <h4 className="mt-1 text-xl font-semibold text-gray-900">{selectedLesson.title}</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedLesson(null)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          >
                            Close
                          </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <div
                            className="prose prose-sm max-w-none text-gray-700 prose-headings:text-black"
                            style={{ whiteSpace: "pre-wrap" }}
                            dangerouslySetInnerHTML={{ __html: selectedLesson.content || "<p>No lesson content yet.</p>" }}
                          />
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLesson(null);
                              startEditLesson(selectedLesson);
                            }}
                            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                          >
                            Edit lesson
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            if (window.confirm("Delete this course and its related modules?")) {
              API.delete(`/courses/${id}`).then(() => navigate("/courses"));
            }
          }}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
          Delete Course
        </button>
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
                onClick={handleDeleteLesson}
                className="bg-red-600 text-white px-4 py-2"
              >
                Delete
              </button>

              <button
                onClick={() => setEditingLessonId(null)}
                className="border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveLesson}
                className="bg-green-600 text-white px-4 py-2"
              >
                Save
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}