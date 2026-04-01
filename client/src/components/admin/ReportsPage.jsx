import React, { useEffect, useMemo, useState } from 'react'
import { BarChart3, PieChart, Table, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

const ReportsPage = () => {
  const { user } = useAuthStore();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/admin/rentals`, { withCredentials: true });
        setRentals(response.data?.data || []);
      } catch {
        setRentals([]);
      }
    };
    if (user?._id) run();
  }, [user?._id]);

  const reportStats = useMemo(() => {
    const totalRevenue = rentals.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
    const totalBookings = rentals.length;
    const completed = rentals.filter((r) => r.status === "completed").length;
    const completionRate = totalBookings ? ((completed / totalBookings) * 100).toFixed(1) : "0.0";
    return [
      { title: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, change: `${completed} completed`, icon: DollarSign, color: 'text-green-600' },
      { title: 'Total Bookings', value: totalBookings.toLocaleString(), change: `${completionRate}% completion`, icon: Calendar, color: 'text-blue-600' },
      { title: 'Active Rentals', value: rentals.filter((r) => ["pending", "confirmed"].includes(r.status)).length.toLocaleString(), change: `Cancelled: ${rentals.filter((r) => r.status === "cancelled").length}`, icon: TrendingUp, color: 'text-purple-600' },
    ];
  }, [rentals]);

  const recentBookings = useMemo(
    () =>
      rentals.slice(0, 6).map((r) => ({
        id: `#${r._id?.slice(-6) || "N/A"}`,
        customer: r.user?.name || "Unknown",
        car: `${r.car?.brand || ""} ${r.car?.model || ""}`.trim() || "Unknown",
        date: new Date(r.createdAt).toLocaleDateString(),
        amount: `₱${Number(r.totalPrice || 0).toLocaleString()}`,
        status: r.status,
      })),
    [rentals]
  );

  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const grouped = {};
    rentals.forEach((r) => {
      const d = new Date(r.createdAt);
      const key = months[d.getMonth()];
      if (!grouped[key]) grouped[key] = { bookings: 0, revenue: 0 };
      grouped[key].bookings += 1;
      grouped[key].revenue += Number(r.totalPrice || 0);
    });
    return Object.entries(grouped).map(([month, data]) => ({
      month,
      bookings: data.bookings,
      revenue: data.revenue,
    }));
  }, [rentals]);

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Monitor performance and insights across your rental business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportStats.map(({ title, value, change, icon: Icon, color }, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-xl w-14 h-14 p-3 mb-4 flex items-center justify-center">
              <Icon size={24} className={color} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
            <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
            <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Table size={24} className="text-gray-500" />
            <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900">Booking ID</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Car</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 font-medium text-gray-900">{booking.id}</td>
                    <td className="py-3 text-gray-700">{booking.customer}</td>
                    <td className="py-3 text-gray-700">{booking.car}</td>
                    <td className="py-3 text-gray-700">{booking.date}</td>
                    <td className="py-3 font-semibold text-green-600">{booking.amount}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 size={24} className="text-gray-500" />
            <h3 className="text-xl font-bold text-gray-900">Bookings & Revenue Overview</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#2563eb" radius={4} name="Bookings" />
                  <Bar dataKey="revenue" fill="#60a5fa" radius={4} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Placeholder */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <PieChart size={24} className="text-gray-500" />
              <h3 className="text-xl font-bold text-gray-900">Status Distribution</h3>
            </div>
            <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
              <div className="text-center text-gray-500">
                <PieChart size={48} className="mx-auto mb-2" />
                <p>Pending: {rentals.filter((r) => r.status === "pending").length}</p>
                <p className="text-sm">Confirmed: {rentals.filter((r) => r.status === "confirmed").length} • Completed: {rentals.filter((r) => r.status === "completed").length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;