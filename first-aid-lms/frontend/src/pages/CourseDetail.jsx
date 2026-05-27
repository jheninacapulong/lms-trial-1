import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}`).then(res => setCourse(res.data));
  }, [id]);

  const createModule = async () => {
    await API.post("/modules", {
      title: "New Module",
      courseId: id,
    });

    const res = await API.get(`/courses/${id}`);
    setCourse(res.data);
  };

  const createLesson = async (moduleId) => {
    await API.post("/lessons", {
      title: "New Lesson",
      moduleId,
      content: defaultLessonHTML(),
    });

    const res = await API.get(`/courses/${id}`);
    setCourse(res.data);
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <h1>{course.title}</h1>

      <button onClick={createModule}>
        + Add Module
      </button>

      {course.modules?.map(module => (
        <div key={module.id} style={{ marginTop: 20, padding: 15, background: "#fff" }}>
          <h3>{module.title}</h3>

          <button onClick={() => createLesson(module.id)}>
            + Add Lesson
          </button>

          {module.lessons?.map(lesson => (
            <div key={lesson.id} style={{ marginTop: 10, padding: 10, border: "1px solid #ddd" }}>
              <h4>{lesson.title}</h4>

              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function defaultLessonHTML() {
  return `
    <h2>Lesson Title</h2>
    <p>This is a placeholder lesson content.</p>

    <ul>
      <li>Key point 1</li>
      <li>Key point 2</li>
      <li>Key point 3</li>
    </ul>

    <p><strong>First Aid Note:</strong> Follow proper safety procedures.</p>
  `;
}