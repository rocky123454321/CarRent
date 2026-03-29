import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Grid, Calendar, User, PieChart, Box, ChevronDown } from "lucide-react";
import img from "../../assets/brand.png";

const AdminSidebarLayout = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-50 h-screen w-[260px] bg-white text-gray-900 shadow-md flex flex-col">
        {/* Logo */}
        <div className="py-6 px-6 flex justify-center border-b border-gray-100">
          <Link to="/admin">
            <img src={img} alt="Car Rent Logo" width={140} />
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="flex flex-col gap-5">

            {/* Main Menu */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Main</h2>
              <ul className="flex flex-col gap-1">
                {/* Dashboard */}
                <li>
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <Grid size={18} />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </li>

                {/* Bookings */}
                <li>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <Calendar size={18} />
                    <span className="font-medium">Bookings</span>
                  </Link>
                </li>

                {/* Customers */}
                <li>
                  <Link
                    to="/customers"
                    className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <User size={18} />
                    <span className="font-medium">Customers</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Management Menu */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Management</h2>
              <ul className="flex flex-col gap-1">

                {/* Cars */}
                <li>
                  <button
                    className="flex items-center justify-between w-full py-2 px-3 rounded hover:bg-gray-100 transition"
                    onClick={() => toggleMenu("cars")}
                  >
                    <Box size={18} />
                    <span className="font-medium">Cars</span>
                    <ChevronDown size={16} className={`${openMenus.cars ? "rotate-180" : ""} transition-transform`} />
                  </button>
                  {openMenus.cars && (
                    <ul className="ml-7 mt-1 flex flex-col gap-1">
                      <li>
                        <Link
                          to="/admin/list"
                          className="block py-1 px-2 rounded hover:bg-gray-100 transition"
                        >
                          Car List
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/add"
                          className="block py-1 px-2 rounded hover:bg-gray-100 transition"
                        >
                          Add Car
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Reports */}
                <li>
                  <button
                    className="flex items-center justify-between w-full py-2 px-3 rounded hover:bg-gray-100 transition"
                    onClick={() => toggleMenu("reports")}
                  >
                    <PieChart size={18} />
                    <span className="font-medium">Reports</span>
                    <ChevronDown size={16} className={`${openMenus.reports ? "rotate-180" : ""} transition-transform`} />
                  </button>
                  {openMenus.reports && (
                    <ul className="ml-7 mt-1 flex flex-col gap-1">
                      <li>
                        <Link
                          to="/admin/reports/daily"
                          className="block py-1 px-2 rounded hover:bg-gray-100 transition"
                        >
                          Daily
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/reports/monthly"
                          className="block py-1 px-2 rounded hover:bg-gray-100 transition"
                        >
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
    </div>
  );
};

export default AdminSidebarLayout;