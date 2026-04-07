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

// Zinc-focused Chart Config
const pieChartConfig = {
  pending:   { label: "Pending",   color: "hsl(var(--zinc-400))" },
  confirmed: { label: "Confirmed", color: "hsl(var(--zinc-900))" },
  completed: { label: "Completed", color: "hsl(var(--zinc-200))" },
  cancelled: { label: "Cancelled", color: "hsl(var(--zinc-600))" },
};

const statusBadge = (status) => ({
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  confirmed: "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white",
  pending:   "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50",
  cancelled: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
}[status] || "bg-zinc-50 text-zinc-700 border-zinc-100 dark:bg-zinc-800 dark:text-zinc-400");

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
      { title: 'Total Revenue',  value: `₱${totalRevenue.toLocaleString()}`, sub: `${completed} completed`, icon: DollarSign, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-900/50', border: 'border-zinc-100 dark:border-zinc-800' },
      { title: 'Total Bookings', value: totalBookings.toLocaleString(),       sub: `${completionRate}% completion`, icon: Calendar,   color: 'text-zinc-600 dark:text-zinc-400',   bg: 'bg-zinc-50 dark:bg-zinc-900/50',    border: 'border-zinc-100 dark:border-zinc-800'    },
      { title: 'Active Rentals', value: rentals.filter((r) => ["pending","confirmed"].includes(r.status)).length.toLocaleString(), sub: `Cancelled: ${rentals.filter((r) => r.status === "cancelled").length}`, icon: TrendingUp, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-50 dark:bg-zinc-900/50', border: 'border-zinc-100 dark:border-zinc-800' },
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
    <div className="space-y-8 max-w-7xl transition-colors duration-300">

      {/* Header - Consistent with Dashboard */}
      <div>
        <p className="text-zinc-400 dark:text-zinc-500 font-semibold text-[10px] tracking-[0.2em] uppercase mb-1">Analytics</p>
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-1">Reports & Analytics</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Monitor performance and insights across your rental business.</p>
      </div>

      {/* Stats Cards - Zinc Styled */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-6 space-y-4">
                <Skeleton className="w-11 h-11 rounded-xl dark:bg-zinc-900" />
                <Skeleton className="h-4 w-28 rounded-full dark:bg-zinc-900" />
                <Skeleton className="h-5 w-20 rounded-full dark:bg-zinc-900" />
              </div>
            ))
          : reportStats.map(({ title, value, sub, icon: Icon, color, bg, border }, i) => (
              <div key={i} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-6 hover:shadow-md transition-all duration-200">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl mb-4 ${bg} border ${border}`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-1">{title}</h3>
                <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">{value}</div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600 font-medium">{sub}</p>
              </div>
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Table Container - Updated to Zinc Theme */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
              <Table size={16} className="text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Recent Bookings</h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Latest 6 transactions</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-900">
                  {["ID", "Customer", "Car", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left pb-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
                {recentBookings.map((b, i) => (
                  <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">{b.id}</td>
                    <td className="py-4 font-semibold text-zinc-900 dark:text-white text-xs">{b.customer}</td>
                    <td className="py-4 text-zinc-500 dark:text-zinc-400 text-xs">{b.car}</td>
                    <td className="py-4 text-zinc-400 dark:text-zinc-500 text-[10px]">{b.date}</td>
                    <td className="py-4 font-bold text-zinc-900 dark:text-white">₱{b.amount.replace('₱', '')}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter border ${statusBadge(b.status)}`}>
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
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                <BarChart3 size={16} className="text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Bookings & Revenue</h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-900" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} className="fill-zinc-400" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgb(9 9 11)', borderRadius: "12px", border: "1px solid rgb(39 39 42)", color: "#fff" }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="bookings" fill="hsl(var(--zinc-900))" radius={[4,4,0,0]} name="Bookings" className="dark:fill-white" />
                  <Bar dataKey="revenue"  fill="hsl(var(--zinc-300))" radius={[4,4,0,0]} name="Revenue" className="dark:fill-zinc-700" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Card className="rounded-2xl bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 shadow-sm">
            <CardHeader className="items-center pb-0 pt-5">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[200px]">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="status" innerRadius={45} outerRadius={75} stroke="currentColor" className="text-white dark:text-zinc-950" strokeWidth={5}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="status" className="text-[10px] uppercase tracking-widest font-bold" />} />
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