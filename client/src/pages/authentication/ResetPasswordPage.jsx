import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Loader } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, isLoading, message } = useAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success("Password reset successfully, redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center  transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-[400px]"
            >
                {/* Card Container */}
                <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-900 overflow-hidden shadow-sm">
                    <div className="px-10 py-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-tight">
                                Reset Password.
                            </h2>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-3 font-medium">
                                Secure your account
                            </p>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-6 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl px-4 py-3 text-center"
                            >
                                <p className="text-red-500 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider">{error}</p>
                            </motion.div>
                        )}
                        
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-6 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl px-4 py-3 text-center"
                            >
                                <p className="text-emerald-500 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">{message}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                                    <input
                                        maxLength={20}
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition bg-zinc-50/50 dark:bg-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                                    <input
                                        maxLength={20}
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Update Password"}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;