import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";

// Stores & Components
import { useAuthStore } from "../src/store/authStore";
import Navigation from "./components/navigations/UserNav";
import LoadingSpinner from "./components/public/LoadingSpinner";

// Public Pages
import LandingPage from "./pages/public/LandingPage";
import SignUpPage from "./pages/authentication/SignUpPage";
import LoginPage from "./pages/authentication/LoginPage";
import EmailVerificationPage from "./pages/authentication/EmailVerificationPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";

// User Pages
import Category from "./pages/Users/Category";
import DashboardPage from "./pages/Users/Home";
import CarDetailView from "./pages/Users/CarDetailView";
import ChatPage from "./pages/Chat/ChatPage";
import MyRentals from "./pages/Users/MyRentals";
import Settings from "./pages/Users/Settings";

// Admin Pages
import AdminPage from "./pages/admin/adminPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import CarsListPage from "./components/admin/CarsListPage";
import Bookings from "./components/admin/Bookings";
import AddCar from "./components/forms/admin/AddCar";
import ReportsPage from "./components/admin/ReportsPage";
import AdminChatPage from './pages/admin/AdminChatPage';
import SettingsAdmin from "./pages/admin/SettingsAdmin";

// --- LAYOUTS ---

const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="w-full px-6 py-8">
      <Outlet />
    </div>
  </div>
);

const DashboardLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navigation />
    <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
      <Outlet />
    </div>
  </div>
);

// --- ROUTE GUARDS (SECURITY) ---

// 1. Root Entry Logic: Nagdedesisyon kung saan itatapon ang user base sa role pag-landing sa "/"
const RootRedirect = () => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/landing" replace />;

  // Kung Admin/Renter, diretso sa Admin Dashboard
  if (user?.role === "admin" || user?.role === "renter") {
    return <Navigate to="/admin" replace />;
  }

  // Kung Regular User, ipakita ang User Dashboard Layout
  return <DashboardLayout />;
};

// 2. Admin Only Guard: Hinaharangan ang regular users sa /admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  
  const isAdmin = user?.role === "admin" || user?.role === "renter";
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return children;
};

// 3. Public Route Guard: Hinaharangan ang mga logged-in users sa login/signup pages
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated && user?.isVerified) {
    if (user?.role === "admin" || user?.role === "renter") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- MAIN APP ---

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
        {/* 🌍 Landing Page (Accessible to everyone, but redirects if logged in via PublicRoute inside) */}
        <Route path="/landing" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />

        {/* 🔐 Auth Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        </Route>

        {/* 👤 USER ROUTES (Root path uses RootRedirect for auto-routing) */}
        <Route path="/" element={<RootRedirect />}>
          <Route index element={<Category />} />
          <Route path="cars" element={<DashboardPage />} />
          <Route path="cars/:id" element={<CarDetailView />} />
          <Route path="car/:id" element={<CarDetailView />} />
          <Route path="my-rentals" element={<MyRentals />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 🛠 ADMIN ROUTES (Strictly for admin/renter roles) */}    
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="list" element={<CarsListPage />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="add" element={<AddCar />} />
          <Route path="settings" element={<SettingsAdmin/>} />
          <Route path="reports/daily" element={<ReportsPage type="daily" />} />
          <Route path="reports/monthly" element={<ReportsPage type="monthly" />} />
        </Route>

        {/* ❌ 404 Fallback */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </>
  );
}

export default App;