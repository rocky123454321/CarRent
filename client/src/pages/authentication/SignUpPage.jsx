import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/public/PasswordStrengthMeter";
import { useAuthStore } from "../../store/authStore";
import brand from "../../assets/brand.png";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center border-b border-gray-50 dark:border-slate-800/50">
          <img src={brand} alt="brand" className="h-10 mx-auto mb-4 dark:brightness-110" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create an account</h2>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Sign up to get started today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="px-8 py-8 space-y-5">

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input
                maxLength={20}
                type="text"
                placeholder="Juan dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-gray-50 dark:bg-slate-950 dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input
                maxLength={36}  
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-gray-50 dark:bg-slate-950 dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input
                maxLength={20}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-gray-50 dark:bg-slate-950 dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Password Strength Meter */}
          <div className="pt-1">
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3"
            >
              <p className="text-red-500 dark:text-red-400 text-xs font-semibold">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800/50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Create Account"}
          </motion.button>

        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </motion.div>
  );
};

export default SignUpPage;