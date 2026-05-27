import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses").then(res => setCourses(res.data));
  }, []);

  return (
    <div>
      <h1>Courses</h1>

      {courses.map(course => (
        <Link
          key={course.id}
          to={`/courses/${course.id}`}
          style={{
            display: "block",
            padding: 15,
            margin: "10px 0",
            background: "white",
            border: "1px solid #ddd",
            textDecoration: "none",
            color: "black"
          }}
        >
          {course.title}
        </Link>
      ))}
    </div>
  );
}