import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import brand from "../../assets/brand.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto px-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center border-b border-gray-50 dark:border-slate-800/50">
          <img src={brand} alt="brand" className="h-10 mx-auto mb-4 dark:brightness-110" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Forgot Password</h2>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">We'll send you a reset link</p>
        </div>

        <div className="px-8 py-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-gray-500 dark:text-slate-400 text-center leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>

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
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-gray-50 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800/50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
              </motion.button>
            </form>
          ) : (
            <div className="text-center space-y-5 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto border-4 border-white dark:border-slate-800 shadow-xl"
              >
                <Mail className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  If an account exists for <br />
                  <span className="font-bold text-gray-800 dark:text-white break-all">{email}</span>, <br />
                  you will receive a password reset link shortly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 flex justify-center">
          <Link to="/login" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;