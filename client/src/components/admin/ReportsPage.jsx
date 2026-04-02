import React, { useEffect, useMemo } from 'react'
import { BarChart3, Table, TrendingUp, DollarSign, Calendar } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer,
  Tooltip, Legend, Pie, PieChart, Cell
} from "recharts";
import { useAuthStore } from "../../store/authStore";
import { useRentalStore } from "../../store/RentalStore.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";



const pieChartConfig = {
  pending:   { label: "Pending",   color: "var(--chart-1)" },
  confirmed: { label: "Confirmed", color: "var(--chart-2)" },
  completed: { label: "Completed", color: "var(--chart-3)" },
  cancelled: { label: "Cancelled", color: "var(--chart-4)" },
};

const statusBadge = (status) => ({
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-100",
  pending:   "bg-amber-50 text-amber-700 border border-amber-100",
  cancelled: "bg-red-50 text-red-700 border border-red-100",
}[status] || "bg-slate-50 text-slate-700 border border-slate-100");

const ReportsPage = () => {
  const { user } = useAuthStore();
  const rentalStore = useRentalStore();
  const rentals = rentalStore.adminRentals;
  const loading = rentalStore.isLoading;

  useEffect(() => {
    rentalStore.fetchAdminRentals();
  }, [rentalStore]);

  const reportStats = useMemo(() => {
    const totalRevenue = rentals.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
    const totalBookings = rentals.length;
    const completed = rentals.filter((r) => r.status === "completed").length;
    const completionRate = totalBookings ? ((completed / totalBookings) * 100).toFixed(1) : "0.0";
    return [
      { title: 'Total Revenue',  value: `₱${totalRevenue.toLocaleString()}`, sub: `${completed} completed`,          icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-100' },
      { title: 'Total Bookings', value: totalBookings.toLocaleString(),       sub: `${completionRate}% completion`,   icon: Calendar,   color: 'text-blue-600',    bg: 'bg-blue-50',     border: 'border-blue-100'   },
      { title: 'Active Rentals', value: rentals.filter((r) => ["pending","confirmed"].includes(r.status)).length.toLocaleString(), sub: `Cancelled: ${rentals.filter((r) => r.status === "cancelled").length}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    ];
  }, [rentals]);

  const recentBookings = useMemo(() =>
    rentals.slice(0, 6).map((r) => ({
      id: `#${r._id?.slice(-6) || "N/A"}`,
      customer: r.user?.name || "Unknown",
      car: `${r.car?.brand || ""} ${r.car?.model || ""}`.trim() || "Unknown",
      date: new Date(r.createdAt).toLocaleDateString(),
      amount: `₱${Number(r.totalPrice || 0).toLocaleString()}`,
      status: r.status,
    })), [rentals]);

  const barChartData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const grouped = {};
    rentals.forEach((r) => {
      const key = months[new Date(r.createdAt).getMonth()];
      if (!grouped[key]) grouped[key] = { bookings: 0, revenue: 0 };
      grouped[key].bookings += 1;
      grouped[key].revenue += Number(r.totalPrice || 0);
    });
    return Object.entries(grouped).map(([month, data]) => ({ month, ...data }));
  }, [rentals]);

  const pieData = useMemo(() =>
    ["pending","confirmed","completed","cancelled"]
      .map((s) => ({ status: s, value: rentals.filter((r) => r.status === s).length, fill: pieChartConfig[s].color }))
      .filter((d) => d.value > 0),
    [rentals]);

  return (
    <div className="space-y-8 max-w-7xl " style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* Header */}
      <div>
        <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-1">Analytics</p>
        <h1 className="text-3xl font-black text-slate-900 mb-1">Reports & Analytics</h1>
        <p className="text-slate-500">Monitor performance and insights across your rental business.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
            ))
          : reportStats.map(({ title, value, sub, icon, color, bg, border }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-slate-200 transition-all duration-200">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl mb-4 ${bg} border ${border}`}>
                  <DollarSign size={20} className={color} />
                </div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">{title}</h3>
                <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Table size={16} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Recent Bookings</h3>
              <p className="text-xs text-slate-400">Latest 6 transactions</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["ID", "Customer", "Car", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="py-3">
                            <Skeleton className="h-4 w-full rounded-md" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : recentBookings.length === 0 ? (
                      <tr><td colSpan={6} className="py-10 text-center text-slate-400 text-sm">No bookings yet.</td></tr>
                    ) : recentBookings.map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-mono text-xs text-slate-500">{b.id}</td>
                        <td className="py-3 font-medium text-slate-800">{b.customer}</td>
                        <td className="py-3 text-slate-500">{b.car}</td>
                        <td className="py-3 text-slate-400 text-xs">{b.date}</td>
                        <td className="py-3 font-semibold text-emerald-600">{b.amount}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <BarChart3 size={16} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Bookings & Revenue</h3>
                <p className="text-xs text-slate-400">Monthly overview</p>
              </div>
            </div>
            <div className="h-56">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : barChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">No data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} barCategoryGap="30%">
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs text-slate-400" />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                    <Bar dataKey="bookings" fill="#4f46e5" radius={[6,6,0,0]} name="Bookings" />
                    <Bar dataKey="revenue"  fill="#a5b4fc" radius={[6,6,0,0]} name="Revenue (₱)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="items-center pb-0 pt-5">
              <CardTitle className="text-base font-bold text-slate-800">Status Distribution</CardTitle>
              <CardDescription className="text-xs text-slate-400">Breakdown of all rental statuses</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              {loading ? (
                <Skeleton className="h-48 w-full rounded-xl mx-auto" />
              ) : pieData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-slate-400">No data available.</div>
              ) : (
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[220px]">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="status" outerRadius={80} innerRadius={40}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="status" />}
                      className="flex-wrap gap-2 *:basis-1/4 *:justify-center text-xs"
                    />
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ReportsPage;