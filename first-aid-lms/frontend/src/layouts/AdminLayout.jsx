import "../styles/layout.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}