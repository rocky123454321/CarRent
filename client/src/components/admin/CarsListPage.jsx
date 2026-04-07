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
    <div className=" mt-18 ml-5 space-y-8 max-w-7xl transition-colors duration-300">
      {/* Header - Fixed Position, Zinc Typography */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Inventory
          </p>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white">
          Cars Management
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your car inventory and availability in real-time.
        </p>
      </div>

      {/* Content - Position stays the same */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-5 space-y-4"
            >
              {/* Updated Skeleton Colors */}
              <Skeleton className="h-40 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
                <Skeleton className="h-4 w-1/2 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
              </div>
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                <Skeleton className="h-9 flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
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