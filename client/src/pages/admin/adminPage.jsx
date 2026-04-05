import React, { useState } from 'react';
import AdminSidebarLayout from '../layout/AdminSidebarLayout';
import { Outlet } from "react-router-dom";
import AdminNav from '../../components/navigations/AdminNav';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // In-update ang background para maging dark:bg-black
    <div className="flex min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">
      
      {/* Mobile overlay - Ginawang mas madilim (bg-black/60) para sa dark mode contrast */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 lg:hidden backdrop-blur-sm"
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
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;