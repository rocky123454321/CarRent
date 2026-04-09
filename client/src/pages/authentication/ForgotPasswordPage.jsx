import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import brand from "../../assets/brand.png";
import Codefront from "../../components/codefront";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword, devResetURL } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center transition-colors duration-300">

      {/* ✅ Codefront banner — lalabas sa taas ng page kung walang email credits */}
      <Codefront devResetURL={devResetURL} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[400px]"
      >
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-900 overflow-hidden shadow-sm">

          {/* Header */}
          <div className="px-10 pt-12 pb-8 text-center">
            <img src={brand} alt="brand" className="h-8 mx-auto mb-6 dark:brightness-0 dark:invert opacity-90" />
            <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-tight">
              Forgot Password.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-3 font-medium">
              Recover your access
            </p>
          </div>

          <div className="px-10 pb-10">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center leading-relaxed uppercase tracking-widest font-medium px-2">
                  Enter your email and we'll send you a recovery link.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                    <input
                      maxLength={36}
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition bg-zinc-50/50 dark:bg-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center shadow-sm"
                >
                  {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                </motion.button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto"
                >
                  <Mail className="h-7 w-7 text-zinc-900 dark:text-white" />
                </motion.div>

                <div className="space-y-3">
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-widest font-medium">
                    If an account exists for <br />
                    <span className="font-bold text-zinc-900 dark:text-white break-all">{email}</span>, <br />
                    you will receive a link shortly.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-10 py-6 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-900 flex justify-center">
            <Link
              to="/login"
              className="text-[10px] text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all"
            >
              <ArrowLeft size={12} /> Back to Login
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;