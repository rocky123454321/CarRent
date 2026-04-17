import React, { useState } from "react";
import {
  Shield, Lock, CreditCard, CheckCircle2,
  AlertCircle, Car, Calendar, MapPin, User,
  ChevronRight, Loader2, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const formatCardNumber = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const detectBrand = (num) => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "VISA";
  if (/^5[1-5]/.test(n)) return "MC";
  if (/^3[47]/.test(n)) return "AMEX";
  return null;
};

const inputCls = "w-full bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

const Steps = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {["Summary", "Payment", "Confirm"].map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i < current ? "bg-green-500 text-white" :
            i === current ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30" :
            "bg-gray-100 dark:bg-gray-800 text-gray-400"
          }`}>
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={`text-[10px] mt-1.5 font-semibold ${
            i === current ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"
          }`}>{label}</span>
        </div>
        {i < 2 && (
          <div className={`flex-1 h-px mx-2 mb-5 ${i < current ? "bg-green-500" : "bg-gray-200 dark:bg-gray-800"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const PaymentDemo = ({ car, rentalDetails, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]     = useState("");
  const [cvv, setCvv]               = useState("");
  const [expMonth, setExpMonth]     = useState("");
  const [expYear, setExpYear]       = useState("");
  const [comments, setComments]     = useState("");
  const [agreed, setAgreed]         = useState(false);

  const brand   = detectBrand(cardNumber);
  const carInfo = car || { brand: "Toyota", model: "Camry", pricePerDay: 2500 };
  const rental  = rentalDetails || { days: 3, pickup: "Manila", dropoff: "Cebu" };
  const total   = carInfo.pricePerDay * rental.days;

  const handleProcess = async () => {
    if (!cardNumber || !cardName || !cvv || !expMonth || !expYear)
      return toast.error("Please fill in all card details");
    if (!agreed)
      return toast.error("Please agree to the terms");
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2200));
    setProcessing(false);
    setDone(true);
    toast.success("Payment successful!");
    onSuccess?.();
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Confirmed</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your reservation is all set.</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/8 rounded-2xl px-6 py-5 text-left w-full">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Booking Summary</p>
          <p className="text-base font-bold text-gray-900 dark:text-white">{carInfo.brand} {carInfo.model}</p>
          <p className="text-sm text-gray-500 mt-0.5">{rental.days} days · {rental.pickup} → {rental.dropoff}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400">Total Paid</span>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">₱{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <Steps current={step} />

      {/* STEP 0: Summary */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden">
            <div className="bg-gray-900 dark:bg-[#111] px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{carInfo.brand} {carInfo.model}</p>
                <p className="text-gray-400 text-xs">₱{carInfo.pricePerDay?.toLocaleString()} / day</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500"><Calendar size={14} /> Duration</span>
                <span className="font-semibold text-gray-900 dark:text-white">{rental.days} Days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500"><MapPin size={14} /> Pick-up</span>
                <span className="font-semibold text-gray-900 dark:text-white">{rental.pickup}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-white/5 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500">Total</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: "SSL Secured", color: "text-green-500" },
              { icon: Lock, label: "Encrypted", color: "text-blue-500" },
              { icon: CheckCircle2, label: "Verified", color: "text-purple-500" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5">
                <Icon size={16} className={color} />
                <span className="text-[10px] font-semibold text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            Continue to Payment <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 1: Card Details */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard size={16} className="text-blue-600" /> Card Details
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Visa, Mastercard, and Amex accepted</p>
          </div>

          <div className="space-y-3">
            {/* Cardholder */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Cardholder Name</label>
              <div className="relative">
                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Juan Dela Cruz" className={inputCls} />
                <User size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Card Number</label>
              <div className="relative">
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className={`${inputCls} font-mono tracking-widest pr-16`}
                />
                {brand && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-1.5 py-0.5 rounded">
                    {brand}
                  </span>
                )}
              </div>
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Month</label>
                <select value={expMonth} onChange={e => setExpMonth(e.target.value)} className={inputCls}>
                  <option value="">MM</option>
                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Year</label>
                <select value={expYear} onChange={e => setExpYear(e.target.value)} className={inputCls}>
                  <option value="">YYYY</option>
                  {["2025","2026","2027","2028","2029","2030"].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">CVV</label>
                <input
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="•••"
                  type="password"
                  className={`${inputCls} text-center tracking-widest`}
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                Special Instructions <span className="text-gray-300 font-normal">(optional)</span>
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="e.g. Pick up near terminal..."
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Confirm */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-white/5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Order Review</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Vehicle",  value: `${carInfo.brand} ${carInfo.model}` },
                { label: "Duration", value: `${rental.days} Days` },
                { label: "Card",     value: `•••• ${cardNumber.slice(-4)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 dark:border-white/5 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Total Due</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              This is a demo. No real charges will be made.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500 font-medium">I agree to the rental terms and conditions</span>
          </label>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleProcess}
              disabled={processing || !agreed}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20 transition-all"
            >
              {processing ? (
                <><Loader2 className="animate-spin w-4 h-4" /> Processing...</>
              ) : (
                <><Lock size={14} /> Pay Securely</>
              )}
            </button>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-white font-medium transition-all py-2"
            >
              ← Edit Payment Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDemo;