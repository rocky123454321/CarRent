import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Navigation from "./components/navigation2"
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Category from "./pages/Category";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";



// Public layout with gradient bg
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

// Dashboard layout with nav
const DashboardLayout = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <div className='pt-20 max-w-7xl mx-auto px-6 py-12'>
        <Outlet />
      </div>
    </div>
  );
};

// Require auth but allow unverified
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to='/landing' replace />;
  }
  return children;
};

// Redirect verified to dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
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
    
      <Routes>
        {/* Public routes */}
           <Route path='/landing' element={<LandingPage />} />
        <Route element={<PublicLayout />}>
       
          <Route 
            path='/signup' 
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            } 
          />
          <Route 
            path='/login' 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route path='/verify-email' element={<EmailVerificationPage />} />
          <Route 
            path='/forgot-password' 
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } 
          />
          <Route 
            path='/reset-password/:token' 
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            } 
          />
        </Route>

        {/* Dashboard routes */}
        <Route path="/" element={<AuthenticatedRoute><DashboardLayout /></AuthenticatedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="home" element={<Home />} />
          <Route path="cars" element={<Category />} />
        </Route>

        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

