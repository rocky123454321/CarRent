import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Navigation from "./components/navigations/UserNav";
import AdminDashboard from "./components/admin/AdminDashboard";
import LandingPage from "./pages/public/LandingPage";
import Category from "./pages/Users/Category";
import Settings from "./pages/Users/Settings";
import CarsListPage from "./components/admin/CarsListPage";
import ReportsPage from "./components/admin/ReportsPage";
import DashboardPage from "./pages/Users/Home";
import { Toaster } from "sonner";
import AddCar from "./components/forms/admin/AddCar";
import SignUpPage from "./pages/authentication/SignUpPage";
import LoginPage from "./pages/authentication/LoginPage";
import EmailVerificationPage from "./pages/authentication/EmailVerificationPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
import AdminPage from "./pages/admin/adminPage";
import LoadingSpinner from "./components/public/LoadingSpinner";
import Bookings from "./components/admin/Bookings";
import { useAuthStore } from "../src/store/authStore";
import { useEffect } from "react";
import CarDetailView from "./pages/Users/CarDetailView";
import ChatPage from "./pages/Chat/ChatPage";
import AdminChatPage from './pages/admin/AdminChatPage';
import MyRentals from "./pages/Users/MyRentals";
import SettingsAdmin from "./pages/admin/SettingsAdmin";

// 🌐 Public Layout — white/blue minimal
const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="w-full px-6 py-8">
      <Outlet />
    </div>
  </div>
);

// 📊 Dashboard Layout
const DashboardLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navigation />
    <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
      <Outlet />
    </div>
  </div>
);

// 🔐 Require Login
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  return children;
};

// 🔐 Admin Only
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) return <LoadingSpinner />; // ✅ hintayin muna
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  if (!(user?.role === "admin" || user?.role === "renter")) return <Navigate to="/" replace />;
  return children;
};
// 🔓 Public Pages (login/signup)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    if (user?.role === "renter") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
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
        <Route path="/landing" element={<LandingPage />} />

        {/* 🌍 Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        </Route>

        {/* 👤 USER DASHBOARD */}
        <Route path="/" element={<AuthenticatedRoute><DashboardLayout /></AuthenticatedRoute>}>
          <Route index element={<Category /> } />
<Route path="cars" element={<DashboardPage />} />
          {/* canonical car detail route */}
          <Route path="cars/:id" element={<CarDetailView />} />
          {/* legacy/backward-compatible route */}
          <Route path="car/:id" element={<CarDetailView />} />
          <Route path="my-rentals" element={<MyRentals />} />
          <Route path="chat" element={<AuthenticatedRoute><ChatPage /></AuthenticatedRoute>} />
          <Route path="settings" element={<Settings />} />

        </Route>

        {/* 🛠 ADMIN DASHBOARD */}    
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="list" element={<CarsListPage />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="add" element={<AddCar />} />
          <Route path="reports/daily" element={<ReportsPage type="daily" />} />
          <Route path="settings" element={<SettingsAdmin/>} />
          <Route path="reports/monthly" element={<ReportsPage type="monthly" />} />
        </Route>

        {/* ❌ 404 */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
        <Route path="/" element={<Navigate to="/landing" replace />} />
      </Routes>
    </>
  );
}

export default App;