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
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-900 overflow-hidden shadow-sm">
          
          {/* Header */}
          <div className="px-10 pt-12 pb-8 text-center">
            <img 
              src={brand} 
              alt="brand" 
              className="h-8 mx-auto mb-6 dark:brightness-0 dark:invert opacity-90" 
            />
            <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-tight">
              Verify Email.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-3 font-medium">
              Enter 6-digit code
            </p>
          </div>

          {/* Form Content */}
          <div className="px-10 pb-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
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
                    className="w-full h-12 text-center text-lg font-bold bg-zinc-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-all"
                  />
                ))}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl px-4 py-3 text-center"
                >
                  <p className="text-red-500 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider">{error}</p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading || code.some((digit) => !digit)}
                className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-100 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center shadow-sm disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-10 py-6 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
              Didn't receive a code?{" "}
              {count === 0 ? (
                <button
                  onClick={handleResend}
                  className="text-zinc-900 dark:text-white font-bold hover:opacity-70 transition-opacity"
                >
                  Resend
                </button>
              ) : (
                <span className="text-zinc-300 dark:text-zinc-600 tabular-nums font-bold">
                  Try again in {count}s
                </span>
              )}
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;