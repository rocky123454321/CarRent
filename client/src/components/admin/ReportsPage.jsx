import React, { useEffect, useMemo } from 'react'
import { BarChart3, Table, TrendingUp, DollarSign, Calendar } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer,
  Tooltip, Legend, Pie, PieChart, Cell
} from "recharts";
import { useRentalStore } from "../../store/RentalStore.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const pieChartConfig = {
  pending:   { label: "Pending",   color: "#f59e0b" },
  confirmed: { label: "Confirmed", color: "#3b82f6" },
  completed: { label: "Completed", color: "#10b981" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

const statusBadge = (status) => ({
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  pending:   "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  cancelled: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
}[status] || "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400");

const ReportsPage = () => {
  const rentals           = useRentalStore((s) => s.adminRentals);
  const isLoading         = useRentalStore((s) => s.isLoading);
  const fetchAdminRentals = useRentalStore((s) => s.fetchAdminRentals);

  useEffect(() => {
    fetchAdminRentals();
  }, [fetchAdminRentals]);

  const reportStats = useMemo(() => {
    const totalRevenue   = rentals.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
    const totalBookings  = rentals.length;
    const completed      = rentals.filter((r) => r.status === "completed").length;
    const completionRate = totalBookings ? ((completed / totalBookings) * 100).toFixed(1) : "0.0";
    return [
      { title: 'Total Revenue',  value: `₱${totalRevenue.toLocaleString()}`, sub: `${completed} completed`, icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20' },
      { title: 'Total Bookings', value: totalBookings.toLocaleString(),       sub: `${completionRate}% completion`, icon: Calendar,   color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-500/10',    border: 'border-blue-100 dark:border-blue-500/20'    },
      { title: 'Active Rentals', value: rentals.filter((r) => ["pending","confirmed"].includes(r.status)).length.toLocaleString(), sub: `Cancelled: ${rentals.filter((r) => r.status === "cancelled").length}`, icon: TrendingUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-100 dark:border-indigo-500/20' },
    ];
  }, [rentals]);

  const recentBookings = useMemo(() =>
    rentals.slice(0, 6).map((r) => ({
      id:       `#${r._id?.slice(-6) || "N/A"}`,
      customer: r.user?.name || "Unknown",
      car:       `${r.car?.brand || ""} ${r.car?.model || ""}`.trim() || "Unknown",
      date:      new Date(r.createdAt).toLocaleDateString(),
      amount:    `₱${Number(r.totalPrice || 0).toLocaleString()}`,
      status:    r.status,
    })), [rentals]);

  const barChartData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const grouped = {};
    rentals.forEach((r) => {
      const key = months[new Date(r.createdAt).getMonth()];
      if (!grouped[key]) grouped[key] = { bookings: 0, revenue: 0 };
      grouped[key].bookings += 1;
      grouped[key].revenue  += Number(r.totalPrice || 0);
    });
    return Object.entries(grouped).map(([month, data]) => ({ month, ...data }));
  }, [rentals]);

  const pieData = useMemo(() =>
    ["pending","confirmed","completed","cancelled"]
      .map((s) => ({
        status: s,
        value:  rentals.filter((r) => r.status === s).length,
        fill:   pieChartConfig[s].color,
      }))
      .filter((d) => d.value > 0),
    [rentals]);

  return (
    <div className="space-y-8 max-w-7xl" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* Header */}
      <div>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-1">Analytics</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Reports & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitor performance and insights across your rental business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-6 space-y-4">
                <Skeleton className="w-11 h-11 rounded-xl dark:bg-slate-800" />
                <Skeleton className="h-4 w-28 rounded-full dark:bg-slate-800" />
                <Skeleton className="h-5 w-20 rounded-full dark:bg-slate-800" />
              </div>
            ))
          : reportStats.map(({ title, value, sub, icon: Icon, color, bg, border }, i) => (
              <div key={i} className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-6 hover:shadow-md transition-all duration-200">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl mb-4 ${bg} border ${border}`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
                <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
              </div>
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Table Container */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-6 transition-all duration-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
              <Table size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Recent Bookings</h3>
              <p className="text-xs text-slate-400">Latest 6 transactions</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5">
                  {["ID", "Customer", "Car", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {recentBookings.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{b.id}</td>
                    <td className="py-3 font-medium text-slate-800 dark:text-white">{b.customer}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{b.car}</td>
                    <td className="py-3 text-slate-400 dark:text-slate-500 text-xs">{b.date}</td>
                    <td className="py-3 font-semibold text-emerald-600 dark:text-emerald-400">{b.amount}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-6 transition-all duration-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
                <BarChart3 size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Bookings & Revenue</h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} className="fill-slate-400" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgb(15 23 42)', borderRadius: "12px", border: "none", color: "#fff" }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Bar dataKey="bookings" fill="#4f46e5" radius={[4,4,0,0]} name="Bookings" />
                  <Bar dataKey="revenue"  fill="#94a3b8" radius={[4,4,0,0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Card className="rounded-2xl bg-white dark:bg-[#0a0a0a] border-slate-100 dark:border-white/5 shadow-sm transition-all duration-200">
            <CardHeader className="items-center pb-0 pt-5">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-white">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[200px]">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="status" innerRadius={40} outerRadius={70} stroke="currentColor" className="text-white dark:text-slate-900" strokeWidth={4}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="status" />} className="text-xs" />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;