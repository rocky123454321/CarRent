import React, { useState } from 'react';
import AdminSidebarLayout from '../layout/AdminSidebarLayout';
import { Outlet } from "react-router-dom";
import AdminNav from '../../components/navigations/AdminNav';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebarLayout
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right side */}
      <div className="flex-1 flex flex-col lg:ml-[240px]">
        <AdminNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;