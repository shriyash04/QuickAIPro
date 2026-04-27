// frontend/src/components/AdminNav.jsx
import { BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const AdminNav = () => {
  return (
    <div className="flex gap-4 items-center">
      <Link
        to="/admin/dashboard"
        className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-sm"
      >
        <BarChart3 size={18} />
        Dashboard
      </Link>
      <Link
        to="/admin/panel"
        className="flex items-center gap-2 px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 transition text-white font-semibold text-sm"
      >
        <Settings size={18} />
        Panel
      </Link>
    </div>
  );
};

export default AdminNav;
