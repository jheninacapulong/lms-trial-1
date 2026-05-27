import "../styles/sidebar.css";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>First Aid LMS</h2>

      <Link to="/">Dashboard</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/learners">Learners</Link>
    </div>
  );
}