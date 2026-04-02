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
  revenue:  { label: "Revenue",  color: "var(--chart-1)" },
  bookings: { label: "Bookings", color: "var(--chart-2)" },
};

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const rentalStore = useRentalStore();
  const rentals = rentalStore.adminRentals;
  const loading = rentalStore.isLoading;
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    rentalStore.fetchAdminRentals();
  }, [rentalStore]);

  const stats = useMemo(() => {
    const customers      = new Set(rentals.map((r) => r.user?._id).filter(Boolean)).size;
    const orders         = rentals.length;
    const revenue        = rentals.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
    const activeBookings = rentals.filter((r) => ["pending","confirmed"].includes(r.status)).length;
    return [
      { title: 'Customers',       value: customers.toLocaleString(),      icon: UsersRound,  color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100'    },
      { title: 'Orders',          value: orders.toLocaleString(),         icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
      { title: 'Revenue',         value: `₱${revenue.toLocaleString()}`,  icon: DollarSign,  color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100'  },
      { title: 'Active Bookings', value: activeBookings.toLocaleString(), icon: Calendar,    color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
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
    <div className="space-y-8   max-w-7xl" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* Header */}
      <div>
        <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-1">Overview</p>
        <h1 className="text-3xl font-black text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
            ))
            : stats.map(({ title, value, icon, color, bg, border }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-slate-200 transition-all duration-200">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl mb-4 ${bg} border ${border}`}>
                  <UsersRound size={20} className={color} />
                </div>
                <h3 className="text-sm font-semibold text-slate-400 mb-1">{title}</h3>
                <div className="text-2xl font-black text-slate-900">{value}</div>
              </div>
            ))
        }
      </div>

      {/* Area Chart */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-full" />
              <Skeleton className="h-3 w-52 rounded-full" />
            </div>
            <Skeleton className="h-9 w-36 rounded-xl" />
          </div>
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
      ) : (
        <Card className="rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b border-slate-100 py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-base font-bold text-slate-800">Rentals Overview</CardTitle>
              <CardDescription className="text-xs text-slate-400">Revenue and bookings over time</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="hidden w-[160px] rounded-xl sm:ml-auto sm:flex border-slate-200 text-sm" aria-label="Select range">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg text-sm">Last 3 months</SelectItem>
                <SelectItem value="30d" className="rounded-lg text-sm">Last 30 days</SelectItem>
                <SelectItem value="7d"  className="rounded-lg text-sm">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            {filteredChartData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-slate-400">
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
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    className="text-xs text-slate-400"
                  />
                  <ChartTooltip cursor={false} content={
                    <ChartTooltipContent
                      labelFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      indicator="dot"
                    />
                  } />
                  <Area dataKey="bookings" type="natural" fill="url(#fillBookings)" stroke="var(--color-bookings)" stackId="a" />
                  <Area dataKey="revenue"  type="natural" fill="url(#fillRevenue)"  stroke="var(--color-revenue)"  stackId="a" />
                  <ChartLegend content={<ChartLegendContent />} />
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