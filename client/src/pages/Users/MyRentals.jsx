import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, CarFront, BadgeCheck, ArrowLeft } from 'lucide-react';

import { useRentalStore } from '../../store/RentalStore.js';



const statusStyles = {
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  confirmed: { bg: 'bg-blue-100',   text: 'text-blue-800'   },
  completed: { bg: 'bg-green-100',  text: 'text-green-800'  },
  cancelled: { bg: 'bg-red-100',    text: 'text-red-700'    },
};

const MyRentals = () => {
  const navigate = useNavigate();
  const rentalStore = useRentalStore();
  const rentals = rentalStore.userRentals;
  const loading = rentalStore.isLoading;

  useEffect(() => {
    rentalStore.fetchUserRentals();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const handleChatSupport = (rental) => {
    // Go to chat and target the admin who uploaded the car
    const adminId = rental.car?.uploadedBy;
    navigate('/chat', {
      state: {
        adminId,
        context: 'rental',
        rentalId: rental._id,
        carName: `${rental.car?.brand} ${rental.car?.model}`,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading your rentals...
      </div>
    );
  }

  const activeCount = rentals.filter((r) =>
    ['pending', 'confirmed'].includes(r.status)
  ).length;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Rentals</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {activeCount} active · {rentals.length} total
          </p>
        </div>
        <button
          onClick={() => navigate('/cars')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          Rent Another Car
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {rentals.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <BadgeCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-base font-medium text-gray-500">No rentals yet</p>
            <p className="text-sm mt-1">Book your first car and track it here</p>
            <button
              onClick={() => navigate('/cars')}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {rentals.map((rental) => {
              const style = statusStyles[rental.status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
              return (
                <div key={rental._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Car info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <CarFront className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900">
                          {rental.car?.brand} {rental.car?.model}
                        </h3>
                        <p className="text-xs text-gray-400">{rental.car?.licensePlate}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(rental.rentalStartDate)} – {formatDate(rental.rentalEndDate)}
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                            {rental.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price + chat */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ₱{rental.totalPrice?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">total</p>
                      </div>
                      <button
                        onClick={() => handleChatSupport(rental)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Chat Support
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;
