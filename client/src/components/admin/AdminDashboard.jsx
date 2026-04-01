import React, { useEffect, useMemo, useState } from 'react'
import { UsersRound, ShoppingBag, DollarSign, Calendar } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/admin/rentals`, { withCredentials: true });
        setRentals(response.data?.data || []);
      } catch {
        setRentals([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) run();
  }, [user?._id]);

  const stats = useMemo(() => {
    const customers = new Set(rentals.map((r) => r.user?._id).filter(Boolean)).size;
    const orders = rentals.length;
    const revenue = rentals.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
    const activeBookings = rentals.filter((r) => ["pending", "confirmed"].includes(r.status)).length;
    return [
      { title: 'Customers', value: customers.toLocaleString(), icon: UsersRound, color: 'text-blue-600' },
      { title: 'Orders', value: orders.toLocaleString(), icon: ShoppingBag, color: 'text-green-600' },
      { title: 'Revenue', value: `₱${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600' },
      { title: 'Bookings', value: activeBookings.toLocaleString(), icon: Calendar, color: 'text-indigo-600' },
    ];
  }, [rentals]);

  return (
    <div className="space-y-8 p-8 mt-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard. Monitor key metrics at a glance.</p>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading dashboard metrics...</p>}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color }, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-xl w-14 h-14 p-3 mb-4 flex items-center justify-center">
              <Icon size={24} className={color} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

