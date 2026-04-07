import React, { useEffect, useMemo, useState } from 'react'
import { UsersRound, ShoppingBag, DollarSign, Calendar } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useRentalStore } from "../../store/RentalStore.js";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  revenue:  { label: "Revenue",  color: "hsl(var(--zinc-900))" }, 
  bookings: { label: "Bookings", color: "hsl(var(--zinc-400))" },
};

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const rentals  = useRentalStore((s) => s.adminRentals);
  const loading  = useRentalStore((s) => s.isLoading);
  const fetchAdminRentals = useRentalStore((s) => s.fetchAdminRentals);
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    fetchAdminRentals();
  }, [fetchAdminRentals]);

  const stats = useMemo(() => {
    const customers      = new Set(rentals.map((r) => r.user?._id).filter(Boolean)).size;
    const orders         = rentals.length;
    const revenue        = rentals.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
    const activeBookings = rentals.filter((r) => ["pending","confirmed"].includes(r.status)).length;
    
    // Position remains the same, only colors/borders updated to Zinc theme
    return [
      { title: 'Customers', value: customers.toLocaleString(), icon: UsersRound, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-900/50', border: 'border-zinc-100 dark:border-zinc-800' },
      { title: 'Orders', value: orders.toLocaleString(), icon: ShoppingBag, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-900/50', border: 'border-zinc-100 dark:border-zinc-800' },
      { title: 'Revenue', value: `₱${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-900/50', border: 'border-zinc-100 dark:border-zinc-800' },
      { title: 'Active Bookings', value: activeBookings.toLocaleString(), icon: Calendar, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-900/50', border: 'border-zinc-100 dark:border-zinc-800' },
    ];
  }, [rentals]);

  const chartData = useMemo(() => {
    const map = {};
    rentals.forEach((r) => {
      const date = r.createdAt?.slice(0, 10);
      if (!date) return;
      if (!map[date]) map[date] = { date, revenue: 0, bookings: 0 };
      map[date].revenue  += Number(r.totalPrice) || 0;
      map[date].bookings += 1;
    });
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rentals]);

  const filteredChartData = useMemo(() => {
    if (!chartData.length) return [];
    const last  = new Date(chartData[chartData.length - 1].date);
    const days  = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const start = new Date(last);
    start.setDate(start.getDate() - days);
    return chartData.filter((d) => new Date(d.date) >= start);
  }, [chartData, timeRange]);

  return (
    <div className=" mt-18 lg:ml-5 space-y-8 max-w-7xl transition-colors duration-300">

      {/* Header - Fixed Positioning, Updated Typography to match Landing Page */}
      <div>
        <p className="text-zinc-400 dark:text-zinc-500 font-semibold text-[10px] tracking-[0.2em] uppercase mb-1">Overview</p>
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      {/* Stats Grid - Fixed Positioning */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-6 space-y-4">
                <Skeleton className="w-11 h-11 rounded-xl dark:bg-zinc-900" />
                <Skeleton className="h-3 w-20 rounded-full dark:bg-zinc-900" />
                <Skeleton className="h-7 w-28 rounded-full dark:bg-zinc-900" />
              </div>
            ))
          : stats.map(({ title, value, icon: Icon, color, bg, border }, i) => (
              <div key={i} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-6 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-200">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl mb-4 ${bg} border ${border}`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-1">{title}</h3>
                <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</div>
              </div>
            ))
        }
      </div>

      {/* Area Chart - Fixed Positioning */}
      {loading ? (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-full dark:bg-zinc-900" />
              <Skeleton className="h-3 w-52 rounded-full dark:bg-zinc-900" />
            </div>
            <Skeleton className="h-9 w-36 rounded-xl dark:bg-zinc-900" />
          </div>
          <Skeleton className="h-[250px] w-full rounded-xl dark:bg-zinc-900" />
        </div>
      ) : (
        <Card className="rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b border-zinc-100 dark:border-zinc-900 py-5 sm:flex-row bg-white dark:bg-zinc-950">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">Rentals Overview</CardTitle>
              <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500">Revenue and bookings over time</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white text-sm" aria-label="Select range">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:bg-zinc-950 dark:border-zinc-800">
                <SelectItem value="90d" className="text-sm">Last 3 months</SelectItem>
                <SelectItem value="30d" className="text-sm">Last 30 days</SelectItem>
                <SelectItem value="7d"  className="text-sm">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            {filteredChartData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-600 italic">
                No data available for this period.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart data={filteredChartData}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-revenue)"  stopOpacity={0.1} />
                      <stop offset="95%" stopColor="var(--color-revenue)"  stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-bookings)" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="var(--color-bookings)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-900" />
                  <XAxis
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    minTickGap={32}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    className="text-xs text-zinc-400"
                  />
                  <ChartTooltip cursor={false} content={
                    <ChartTooltipContent
                      className="dark:bg-zinc-950 dark:border-zinc-800"
                      labelFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      indicator="dot"
                    />
                  } />
                  <Area dataKey="bookings" type="monotone" fill="url(#fillBookings)" stroke="var(--color-bookings)" stackId="a" strokeWidth={2} />
                  <Area dataKey="revenue"  type="monotone" fill="url(#fillRevenue)"  stroke="var(--color-revenue)"  stackId="a" strokeWidth={2} />
                  <ChartLegend content={<ChartLegendContent className="dark:text-zinc-400 uppercase text-[10px] tracking-widest mt-4" />} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;