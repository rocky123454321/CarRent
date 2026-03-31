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
  return () => clearTimeout(timer); // cleanup
}, [count]);

  // ✅ Resend
  const handleResend = async () => {
    try {
      await resendVerificationEmail();
      setCount(30);
     localStorage.setItem("resendTimer", 30)
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
    e.preventDefault();
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
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-gray-50">
          <img src={brand} alt="brand" className="h-10 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                <p className="text-red-500 text-xs font-medium">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </motion.button>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            Didn't receive a code?{" "}
            {count === 0 ? (
              <button
                onClick={handleResend}
                className="text-blue-500 font-medium hover:underline"
              >
                Resend
              </button>
            ) : (
              <span className="text-gray-500">
                Resend in {count}s
              </span>
            )}
          </p>
        </div>

      </div>
    </motion.div>
  );
};

export default EmailVerificationPage;