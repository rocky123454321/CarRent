import React from 'react'
import { AdminCards } from './AdminCards'

const CarsListPage = () => {
  return (
    <div className="space-y-8 p-8 mt-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cars Management</h1>
        <p className="text-gray-600">Manage your car inventory and availability.</p>
      </div>

      <AdminCards />
    </div>
  )
}

export default CarsListPage

