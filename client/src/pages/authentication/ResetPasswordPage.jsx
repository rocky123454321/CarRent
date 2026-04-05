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
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all"
            >
                <div className="px-8 py-10">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="text-sm text-gray-400 dark:text-slate-500 text-center mb-8">
                        Enter your new password below to regain access.
                    </p>

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3">
                            <p className="text-red-500 dark:text-red-400 text-xs font-semibold">{error}</p>
                        </div>
                    )}
                    
                    {message && (
                        <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl px-4 py-3">
                            <p className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                <input
                                    maxLength={20}
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white dark:bg-black dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                <input
                                    maxLength={20}
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white dark:bg-black dark:text-white"
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
                            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Set New Password"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;