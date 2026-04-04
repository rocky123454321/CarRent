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
  revenue:  { label: "Revenue",  color: "hsl(var(--chart-1))" },
  bookings: { label: "Bookings", color: "hsl(var(--chart-2))" },
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
    return [
      { title: 'Customers', value: customers.toLocaleString(), icon: UsersRound, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800' },
      { title: 'Orders', value: orders.toLocaleString(), icon: ShoppingBag, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800' },
      { title: 'Revenue', value: `₱${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800' },
      { title: 'Active Bookings', value: activeBookings.toLocaleString(), icon: Calendar, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800' },
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
    <div className="space-y-8 max-w-7xl transition-colors duration-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <div>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-1">Overview</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
                <Skeleton className="w-11 h-11 rounded-xl dark:bg-slate-800" />
                <Skeleton className="h-3 w-20 rounded-full dark:bg-slate-800" />
                <Skeleton className="h-7 w-28 rounded-full dark:bg-slate-800" />
              </div>
            ))
          : stats.map(({ title, value, icon: Icon, color, bg, border }, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl mb-4 ${bg} border ${border}`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 mb-1">{title}</h3>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
              </div>
            ))
        }
      </div>

      {/* Area Chart */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-full dark:bg-slate-800" />
              <Skeleton className="h-3 w-52 rounded-full dark:bg-slate-800" />
            </div>
            <Skeleton className="h-9 w-36 rounded-xl dark:bg-slate-800" />
          </div>
          <Skeleton className="h-[250px] w-full rounded-xl dark:bg-slate-800" />
        </div>
      ) : (
        <Card className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b border-slate-100 dark:border-slate-800 py-5 sm:flex-row bg-white dark:bg-slate-900">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Rentals Overview</CardTitle>
              <CardDescription className="text-xs text-slate-400 dark:text-slate-500">Revenue and bookings over time</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 text-sm" aria-label="Select range">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:bg-slate-900 dark:border-slate-800">
                <SelectItem value="90d" className="text-sm">Last 3 months</SelectItem>
                <SelectItem value="30d" className="text-sm">Last 30 days</SelectItem>
                <SelectItem value="7d"  className="text-sm">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            {filteredChartData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-slate-400 dark:text-slate-600">
                No data available for this period.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart data={filteredChartData}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-revenue)"  stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-revenue)"  stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-bookings)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-bookings)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                  <XAxis
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    minTickGap={32}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    className="text-xs text-slate-400 dark:text-slate-500"
                  />
                  <ChartTooltip cursor={false} content={
                    <ChartTooltipContent
                      className="dark:bg-slate-950 dark:border-slate-800"
                      labelFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      indicator="dot"
                    />
                  } />
                  <Area dataKey="bookings" type="natural" fill="url(#fillBookings)" stroke="var(--color-bookings)" stackId="a" />
                  <Area dataKey="revenue"  type="natural" fill="url(#fillRevenue)"  stroke="var(--color-revenue)"  stackId="a" />
                  <ChartLegend content={<ChartLegendContent className="dark:text-slate-400" />} />
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