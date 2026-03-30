import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Grid, Calendar, User, PieChart, Box, ChevronDown, X } from "lucide-react";
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
    `flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-150 font-medium text-sm ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
    }`;

  const subLinkClass = (path) =>
    `block py-1.5 px-3 rounded-lg text-sm transition-all duration-150 ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-600 font-semibold"
        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen w-[240px] bg-white flex flex-col border-r border-slate-100 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Logo + Close button */}
      <div className="py-5 px-5 flex items-center justify-between border-b border-slate-100">
        <Link to="/admin">
          <img src={img} alt="Car Rent Logo" width={120} />
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="flex flex-col gap-6">

          {/* Main */}
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2 px-3">
              Main
            </p>
            <ul className="flex flex-col gap-0.5">
              <li>
                <Link to="/admin" className={linkClass("/admin")} onClick={onClose}>
                  <Grid size={17} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/bookings" className={linkClass("/admin/bookings")} onClick={onClose}>
                  <Calendar size={17} />
                  Bookings
                </Link>
              </li>
              <li>
                <Link to="/admin/customers" className={linkClass("/admin/customers")} onClick={onClose}>
                  <User size={17} />
                  Customers
                </Link>
              </li>
            </ul>
          </div>

          {/* Management */}
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2 px-3">
              Management
            </p>
            <ul className="flex flex-col gap-0.5">

              {/* Cars */}
              <li>
                <button
                  className={`flex items-center gap-3 w-full py-2 px-3 rounded-xl transition-all duration-150 text-sm font-medium ${
                    isParentActive(["/admin/list", "/admin/add"])
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  onClick={() => toggleMenu("cars")}
                >
                  <Box size={17} />
                  <span className="flex-1 text-left">Cars</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${openMenus.cars ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenus.cars && (
                  <ul className="ml-8 mt-0.5 flex flex-col gap-0.5">
                    <li>
                      <Link to="/admin/list" className={subLinkClass("/admin/list")} onClick={onClose}>
                        Car List
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/add" className={subLinkClass("/admin/add")} onClick={onClose}>
                        Add Car
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Reports */}
              <li>
                <button
                  className={`flex items-center gap-3 w-full py-2 px-3 rounded-xl transition-all duration-150 text-sm font-medium ${
                    isParentActive(["/admin/reports"])
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  onClick={() => toggleMenu("reports")}
                >
                  <PieChart size={17} />
                  <span className="flex-1 text-left">Reports</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${openMenus.reports ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenus.reports && (
                  <ul className="ml-8 mt-0.5 flex flex-col gap-0.5">
                    <li>
                      <Link to="/admin/reports/daily" className={subLinkClass("/admin/reports/daily")} onClick={onClose}>
                        Daily
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/reports/monthly" className={subLinkClass("/admin/reports/monthly")} onClick={onClose}>
                        Monthly
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