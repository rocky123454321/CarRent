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
  const [role, setRole] = useState("user");

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name ,role);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(role)
  return (
    
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[400px]"
      >
        {/* Container */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-900 overflow-hidden shadow-sm">

          {/* Header */}
          <div className="px-10 pt-12 pb-8 text-center">
            <img 
              src={brand} 
              alt="brand" 
              className="h-8 mx-auto mb-6 dark:brightness-0 dark:invert opacity-90" 
            />
            <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-tight">
              Create account.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-3 font-medium">
              Join the premium fleet
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="px-10 pb-10 space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                <input
                  maxLength={20}
                  type="text"
                  placeholder="Juan dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition bg-zinc-50/50 dark:bg-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
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
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition bg-zinc-50/50 dark:bg-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                <input
                  maxLength={20}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition bg-zinc-50/50 dark:bg-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>
            <div className="flex flex-row gap-5 mt-2">
  <div className="flex items-center gap-1">
    <input
      type="radio"
      name="role"
      value="user"
      checked={role === "user"}
      onChange={(e) => setRole(e.target.value)}
      className="accent-zinc-900 dark:green"
      required
    />
    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em]">
      User
    </label>
  </div>

  <div className="flex items-center gap-1">
    <input
      type="radio"
      name="role"
      value="renter"
      checked={role === "renter"}
      onChange={(e) => setRole(e.target.value)}
      className="accent-zinc-900 "
      required
    />
    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em]">
      Renter
    </label>
  </div>
</div>

            {/* Strength Meter */}
            <div className="pt-1">
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl px-4 py-3"
              >
                <p className="text-red-500 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider text-center">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center shadow-sm"
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Get Started"}
            </motion.button>

            {/* Footer Link */}
            <p className="text-center pt-2">
              <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">Already a member? </span>
              <Link to="/login" className="text-[11px] text-zinc-900 dark:text-white font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;