import React from 'react';
import AppSidebarUI from '../layout/AdminSidebarLayout';
import { Outlet } from "react-router-dom";
import AdminNav from '../../components/navigations/AdminNav';
const AdminPage = () => {
  return (
    <>
    <AdminNav />
    <div className="flex min-h-screen">

    

      <AppSidebarUI />

    
      <main className="flex-1 ml-[260px] p-6 bg-gray-100 min-h-screen">
        <Outlet /> 
      </main>
    </div>
    </>
  );
};

export default AdminPage;