import React from 'react'
import { BarChart3, PieChart, Table, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"

const ReportsPage = () => {
  const reportStats = [
    { title: 'Total Revenue', value: '₱1,245,678', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Total Bookings', value: '2,456', change: '+8.2%', icon: Calendar, color: 'text-blue-600' },
    { title: 'Avg Rating', value: '4.8/5', change: '+0.3', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const recentBookings = [
    { id: '#BK001', customer: 'John Doe', car: 'Toyota Camry', date: '2024-01-15', amount: '₱5,200', status: 'Completed' },
    { id: '#BK002', customer: 'Jane Smith', car: 'Honda Civic', date: '2024-01-14', amount: '₱4,800', status: 'Completed' },
    { id: '#BK003', customer: 'Mike Johnson', car: 'BMW X5', date: '2024-01-13', amount: '₱12,500', status: 'Ongoing' },
  ];

  const chartData = [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
  ]

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
              <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="desktop" fill="#2563eb" radius={4} name="Desktop" />
                  <Bar dataKey="mobile" fill="#60a5fa" radius={4} name="Mobile" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Placeholder */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <PieChart size={24} className="text-gray-500" />
              <h3 className="text-xl font-bold text-gray-900">Bookings by Category</h3>
            </div>
            <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
              <div className="text-center text-gray-500">
                <PieChart size={48} className="mx-auto mb-2" />
                <p>Category distribution chart</p>
                <p className="text-sm">SUV • Sedan • Compact</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;