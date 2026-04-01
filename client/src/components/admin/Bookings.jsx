import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './../../store/authStore.js';
import { Button } from './../ui/button';
import { MessageSquare, Calendar, CarFront, DollarSign, BadgeCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Badge } from './../ui/badge';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
const BADGE_CLASS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Bookings = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'renter') {
      fetchRentals();
    }
  }, [user]);

  const fetchRentals = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/admin/rentals`, { withCredentials: true });
      setRentals(response.data.data || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStatus = async (rentalId, status) => {
    setUpdatingStatus(prev => ({ ...prev, [rentalId]: true }));
    try {
      await axios.patch(`${API_URL}/api/users/${rentalId}/status`, { status }, { withCredentials: true });
      toast.success('Status updated');
      fetchRentals(); // Refresh list
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [rentalId]: false }));
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-500">{rentals.length} total rentals</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renter</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rentals.map((rental) => (
              <tr key={rental._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{rental._id.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CarFront className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rental.car?.brand} {rental.car?.model}</div>
                      <div className="text-xs text-gray-500">{rental.car?.licensePlate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{rental.user?.name}</div>
                    <div className="text-xs text-gray-500">{rental.user?.email}</div>
                    <div className="text-xs text-gray-400">{rental.personalDetails.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(rental.rentalStartDate)} - {formatDate(rental.rentalEndDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${BADGE_CLASS[rental.status] || "bg-gray-100 text-gray-700"} px-3 py-1 rounded-full text-xs font-medium`}>
                    {rental.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  ₱{rental.totalPrice?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate('/admin/chat', { state: { userId: rental.user._id, renterName: rental.user?.name } })}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <select
                    value={rental.status}
                    disabled={updatingStatus[rental._id]}
                    onChange={(e) => updateRentalStatus(rental._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rentals.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <BadgeCheck className="w-12 h-12 mx-auto mb-4 opacity-25" />
            <p>No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

