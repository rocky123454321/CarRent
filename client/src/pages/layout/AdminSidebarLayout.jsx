import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Grid, Calendar, MessageSquare, PieChart, Box, ChevronDown, X, Zap } from "lucide-react";
import img from "../../assets/brand.png";

const AdminSidebarLayout = ({ isOpen, onClose }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (paths) => paths.some((p) => location.pathname.startsWith(p));

  const linkClass = (path) =>
    `flex items-center gap-3 py-2.5 px-4 rounded-2xl transition-all duration-200 font-bold text-[13px] tracking-tight ${
      isActive(path)
        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-lg shadow-zinc-900/10"
        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
    }`;

  const subLinkClass = (path) =>
    `block py-2 px-4 rounded-xl text-[12px] font-bold transition-all duration-200 ${
      isActive(path)
        ? "text-zinc-900 dark:text-white translate-x-1"
        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:translate-x-1"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 z-100 h-screen w-[260px] bg-white dark:bg-zinc-950 flex flex-col border-r border-zinc-100 dark:border-zinc-900 transition-all duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Brand Header */}
      <div className="h-[80px] px-6 flex items-center justify-between border-b border-zinc-50 dark:border-zinc-900/50">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={img} alt="Car Rent Logo" width={110} className="dark:brightness-125 transition-all" />
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
        <nav className="flex flex-col gap-8">
          
          {/* Overview Section */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 mb-4">
              Overview
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link to="/admin" className={linkClass("/admin")} onClick={onClose}>
                  <Grid size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/bookings" className={linkClass("/admin/bookings")} onClick={onClose}>
                  <Calendar size={18} />
                  <span>Bookings</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/chat" className={linkClass("/admin/chat")} onClick={onClose}>
                  <MessageSquare size={18} />
                  <span>Messages</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Management Section */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 mb-4">
              Management
            </p>
            <ul className="space-y-1.5">
              {/* Cars Dropdown */}
              <li>
                <button
                  className={`flex items-center gap-3 w-full py-2.5 px-4 rounded-2xl transition-all duration-200 text-[13px] font-bold tracking-tight ${
                    isParentActive(["/admin/list", "/admin/add"])
                      ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                  onClick={() => toggleMenu("cars")}
                >
                  <Box size={18} />
                  <span className="flex-1 text-left">Fleet</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${openMenus.cars ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenus.cars && (
                  <ul className="mt-2 ml-4 space-y-1 border-l-2 border-zinc-100 dark:border-zinc-900">
                    <li className="pl-4">
                      <Link to="/admin/list" className={subLinkClass("/admin/list")} onClick={onClose}>
                        Inventory
                      </Link>
                    </li>
                    <li className="pl-4">
                      <Link to="/admin/add" className={subLinkClass("/admin/add")} onClick={onClose}>
                        Register Car
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Reports Dropdown */}
              <li>
                <button
                  className={`flex items-center gap-3 w-full py-2.5 px-4 rounded-2xl transition-all duration-200 text-[13px] font-bold tracking-tight ${
                    isParentActive(["/admin/reports"])
                      ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                  onClick={() => toggleMenu("reports")}
                >
                  <PieChart size={18} />
                  <span className="flex-1 text-left">Analytics</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${openMenus.reports ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenus.reports && (
                  <ul className="mt-2 ml-4 space-y-1 border-l-2 border-zinc-100 dark:border-zinc-900">
                    <li className="pl-4">
                      <Link to="/admin/reports/daily" className={subLinkClass("/admin/reports/daily")} onClick={onClose}>
                        Daily Performance
                      </Link>
                    </li>
                    <li className="pl-4">
                      <Link to="/admin/reports/monthly" className={subLinkClass("/admin/reports/monthly")} onClick={onClose}>
                        Monthly Audit
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>

      
    </aside>
  );
};

export default AdminSidebarLayout;