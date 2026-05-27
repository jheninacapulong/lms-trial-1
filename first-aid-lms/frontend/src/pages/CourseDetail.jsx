import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

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
  const [savingLesson, setSavingLesson] = useState({});

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
    try {
      await API.post("/modules", {
        title: newModuleTitle,
        courseId: id,
        order: Number((course?.modules?.length || 0) + 1),
      });
      setNewModuleTitle("");
      setShowModuleForm(false);
      await loadCourse();
    } catch (err) {
      console.error("Failed to create module:", err);
    }
  }

  async function handleCreateLesson(e, moduleId) {
    e.preventDefault();

    const lessonForm = newLessonForms[moduleId] || { title: "", content: "" };
    if (!lessonForm.title?.trim()) return;

    try {
      setSavingLesson((current) => ({ ...current, [moduleId]: true }));

      const moduleData = course?.modules?.find((module) => module.id === moduleId);
      const order = Number((moduleData?.lessons?.length || 0) + 1);

      await API.post("/lessons", {
        title: lessonForm.title.trim(),
        content: lessonForm.content.trim(),
        moduleId,
        order,
      });

      setNewLessonForms((current) => ({
        ...current,
        [moduleId]: { title: "", content: "", order: "" },
      }));
      setShowLessonForms((current) => ({ ...current, [moduleId]: false }));
      await loadCourse();
    } catch (err) {
      console.error("Failed to create lesson:", err);
    } finally {
      setSavingLesson((current) => ({ ...current, [moduleId]: false }));
    }
  }

  async function handleDeleteModule(moduleId) {
    if (window.confirm("Delete this module and all its lessons?")) {
      try {
        await API.delete(`/modules/${moduleId}`);
        loadCourse();
      } catch (err) {
        console.error("Failed to delete module:", err);
      }
    }
  }

  async function handleDeleteLesson(lessonId) {
    if (window.confirm("Delete this lesson?")) {
      try {
        await API.delete(`/lessons/${lessonId}`);
        await loadCourse();
      } catch (err) {
        console.error("Failed to delete lesson:", err);
      }
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6 text-red-500">Course not found</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/courses")}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Courses
        </button>
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Modules ({course.modules?.length || 0})</h2>
          <button
            onClick={() => setShowModuleForm(!showModuleForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showModuleForm ? "Cancel" : "+ Add Module"}
          </button>
        </div>

        {showModuleForm && (
          <form onSubmit={handleCreateModule} className="mb-6 p-4 bg-gray-50 rounded">
            <input
              type="text"
              placeholder="Module Title"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Create Module
            </button>
          </form>
        )}

        {!course.modules || course.modules.length === 0 ? (
          <p className="text-gray-500">No modules yet. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module, idx) => (
              <div key={module.id} className="border rounded-lg overflow-hidden">
                <div
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="bg-gray-100 p-4 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">{idx + 1}. {module.title}</h3>
                    <p className="text-sm text-gray-600">{module.lessons?.length || 0} lessons</p>
                  </div>
                  <span className="text-xl">{expandedModule === module.id ? "▼" : "▶"}</span>
                </div>

                {expandedModule === module.id && (
                  <div className="p-4 bg-white">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold">Lessons</h4>
                        <button
                          type="button"
                          onClick={() => setShowLessonForms((current) => ({ ...current, [module.id]: !(current[module.id] || false) }))}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition"
                        >
                          {showLessonForms[module.id] ? "Cancel" : "+ Add Lesson"}
                        </button>
                      </div>

                      {showLessonForms[module.id] && (
                        <form onSubmit={(e) => handleCreateLesson(e, module.id)} className="mb-4 p-4 bg-gray-50 rounded border">
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              type="text"
                              placeholder="Lesson Title"
                              value={newLessonForms[module.id]?.title || ""}
                              onChange={(e) => setNewLessonForms((current) => ({
                                ...current,
                                [module.id]: {
                                  ...current[module.id],
                                  title: e.target.value,
                                },
                              }))}
                              className="border rounded px-3 py-2"
                              required
                            />
                            <input
                              type="number"
                              min="1"
                              placeholder="Lesson Order"
                              value={newLessonForms[module.id]?.order || ""}
                              onChange={(e) => setNewLessonForms((current) => ({
                                ...current,
                                [module.id]: {
                                  ...current[module.id],
                                  order: e.target.value,
                                },
                              }))}
                              className="border rounded px-3 py-2"
                            />
                          </div>
                          <textarea
                            placeholder="Lesson content"
                            value={newLessonForms[module.id]?.content || ""}
                            onChange={(e) => setNewLessonForms((current) => ({
                              ...current,
                              [module.id]: {
                                ...current[module.id],
                                content: e.target.value,
                              },
                            }))}
                            className="w-full border rounded px-3 py-2 mt-3"
                            rows="4"
                          />
                          <button
                            type="submit"
                            disabled={savingLesson[module.id]}
                            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-70"
                          >
                            {savingLesson[module.id] ? "Saving..." : "Create Lesson"}
                          </button>
                        </form>
                      )}

                      {!module.lessons || module.lessons.length === 0 ? (
                        <p className="text-gray-500 text-sm">No lessons yet</p>
                      ) : (
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIdx) => (
                            <div key={lesson.id} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <p className="font-semibold">{lessonIdx + 1}. {lesson.title}</p>
                                <p className="text-xs text-gray-500">{lesson.content?.substring(0, 50)}...</p>
                              </div>
                              <button
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="text-red-600 hover:text-red-800 ml-2"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {module.assessments && module.assessments.length > 0 && (
                      <div className="mb-4 pt-4 border-t">
                        <h4 className="font-bold mb-2">Assessments</h4>
                        <div className="space-y-2">
                          {module.assessments.map((assessment) => (
                            <div key={assessment.id} className="p-2 bg-blue-50 rounded text-sm">
                              <p className="font-semibold">{assessment.title}</p>
                              <p className="text-gray-600">{assessment.questions?.length || 0} questions</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="w-full text-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete Module
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}