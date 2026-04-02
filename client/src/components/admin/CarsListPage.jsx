import React, { useState, useEffect } from 'react'
import { AdminCards } from './AdminCards'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : ''

const CarsListPage = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/cars`, { withCredentials: true })
        setCars(res.data?.data || [])
      } catch (err) {
        console.error(err)
        setCars([])
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cars Management</h1>
        <p className="text-gray-600">Manage your car inventory and availability.</p>
      </div>

      {/* Admin Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" /> {/* Car image */}
              <Skeleton className="h-4 w-32 rounded-full" />   {/* Car name */}
              <Skeleton className="h-3 w-20 rounded-full" />   {/* Price / other info */}
            </div>
          ))}
        </div>
      ) : (
        <AdminCards cars={cars} />
      )}
    </div>
  )
}

export default CarsListPage