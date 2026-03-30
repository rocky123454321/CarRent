import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import FloatingShape from "./components/user/FloatingShape";
import Navigation from "./components/navigations/UserNav";
import AdminDashboard from "./components/admin/AdminDashboard";
import LandingPage from "./pages/public/LandingPage";
import Category from "./pages/Users/Category";
import Settings from "./pages/Users/Settings";
import CarsListPage from "./components/admin/CarsListPage";
import AddCarPage from "./components/admin/AddCarPage";
import ReportsPage from "./components/admin/ReportsPage";
import AdminSidebarLayout from '../../client/src/pages/layout/AdminSidebarLayout'

// ✅ iisa lang (tinanggal duplicate)
import DashboardPage from "./pages/Users/Home";
import { Toaster } from "sonner";  
// admin page
import Admin from "./pages/admin/adminPage";
import AddCar from "./components/forms/admin/AddCar";
import SignUpPage from "./pages/authentication/SignUpPage";
import LoginPage from "./pages/authentication/LoginPage";
import EmailVerificationPage from "./pages/authentication/EmailVerificationPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
import AdminPage from "./pages/admin/adminPage";
import LoadingSpinner from "./components/public/LoadingSpinner";
import Bookings from "./components/admin/Bookings"

import { useAuthStore } from "../src/store/authStore"
import { useEffect } from "react";

import Car from "./pages/Users/CarDetailView";
// 🌐 Public Layout
const PublicLayout = () => (
  <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden'>
    <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
    <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
    <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
    <div className='max-w-7xl mx-auto px-6 py-24'>
      <Outlet />
    </div>
  </div>
);


// 📊 Dashboard Layout
const DashboardLayout = () => (
  <div className='min-h-screen bg-gray-50'>
    <Navigation />
    <div className='pt-20 max-w-7xl mx-auto px-6 py-12'>
      <Outlet />
    </div>
  </div>
);


// 🔐 Require Login
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/landing' replace />;
  }

  return children;
};


// 🔐 Admin Only
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/landing' replace />;
  }

  if (user?.role !== "renter") {
    return <Navigate to='/' replace />;
  }

  return children;
};


// 🔓 Public Pages (login/signup)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    if (user?.role === "renter") {
      return <Navigate to='/admin' replace />;
    }
    return <Navigate to='/' replace />;
  }

  return children;
};


function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
    <Toaster position="top-center" richColors />
  
      <Routes>

        {/* 🌍 Landing */}
        <Route path='/landing' element={<LandingPage />} />

        {/* 🌍 Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path='/signup' element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path='/verify-email' element={<EmailVerificationPage />} />
          <Route path='/forgot-password' element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path='/reset-password/:token' element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        </Route>

        {/* 👤 USER DASHBOARD */}
        <Route path="/" element={<AuthenticatedRoute><DashboardLayout /></AuthenticatedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="cars" element={<Category />} />
          <Route path="car" element={<Car />} />
           <Route path="settings" element={<Settings />} /> 
        </Route>

        {/* 🛠 ADMIN DASHBOARD */}
  <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
  <Route index element={<AdminDashboard />} />           {/* /admin */}
  <Route path="list" element={<CarsListPage />} />    
  <Route path="bookings" element={<Bookings />} />   
    {/* /admin/list */}
  <Route path="add" element={<AddCar />} />              {/* /admin/add */}
  <Route path="reports/daily" element={<ReportsPage type="daily" />} />
  <Route path="reports/monthly" element={<ReportsPage type="monthly" />} />
</Route>
        {/* ❌ 404 */}
        <Route path="*" element={<Navigate to="/landing" replace />} />

      </Routes>

    </>
  );
}

export default App;