import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import brand from "../../assets/brand.png";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("resendTimer");
    return saved ? parseInt(saved) : 30;
  });
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail, resendVerificationEmail } = useAuthStore();

  // ✅ Countdown
  useEffect(() => {
    if (count <= 0) return;
    localStorage.setItem("resendTimer", count);
    const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  // ✅ Resend
  const handleResend = async () => {
    try {
      await resendVerificationEmail();
      setCount(30);
      localStorage.setItem("resendTimer", 30);
      toast.success("Verification code resent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code.");
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Check code and try again."
      );
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Verify Your Email</h2>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-14 text-center text-xl font-black bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3"
              >
                <p className="text-red-500 dark:text-red-400 text-xs font-semibold">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            Didn't receive a code?{" "}
            {count === 0 ? (
              <button
                onClick={handleResend}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors"
              >
                Resend
              </button>
            ) : (
              <span className="text-slate-400 dark:text-slate-600 tabular-nums">
                Resend in <span className="font-bold">{count}s</span>
              </span>
            )}
          </p>
        </div>

      </div>
    </motion.div>
  );
};

export default EmailVerificationPage;