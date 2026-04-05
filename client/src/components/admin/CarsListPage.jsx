import React, { useEffect } from 'react'
import { AdminCards } from './AdminCards'
import { Skeleton } from '@/components/ui/skeleton'
import { useCarStore } from '../../store/CarStore'

const CarsListPage = () => {
  const { cars, isLoading, getAdminCars } = useCarStore()

  useEffect(() => {
    getAdminCars()
  }, [getAdminCars])

  return (
    <div className="space-y-8 max-w-7xl transition-colors duration-300">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Cars Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Manage your car inventory and availability.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-5 space-y-4"
            >
              <Skeleton className="h-40 w-full rounded-2xl dark:bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-lg dark:bg-slate-800" />
                <Skeleton className="h-4 w-1/2 rounded-lg dark:bg-slate-800" />
              </div>
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-xl dark:bg-slate-800" />
                <Skeleton className="h-9 flex-1 rounded-xl dark:bg-slate-800" />
              </div>
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