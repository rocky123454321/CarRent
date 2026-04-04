import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field, FieldDescription, FieldGroup,
  FieldLabel, FieldLegend, FieldSeparator, FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import {
  Shield, Lock, CreditCard, CheckCircle2,
  AlertCircle, Car, Calendar, MapPin, User, ChevronRight, Loader2
} from "lucide-react";
import { toast } from "sonner";

// -- Formatter Helpers (No UI changes needed) --
const formatCardNumber = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const detectBrand = (num) => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return null;
};

const CardBrandBadge = ({ brand }) => {
  const map = { visa: "VISA", mastercard: "MC", amex: "AMEX" };
  if (!brand) return null;
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 transition-colors">
      {map[brand]}
    </span>
  );
};

// -- Step Indicator with Dark Mode --
const Steps = ({ current }) => (
  <div className="flex items-center gap-0 mb-8 px-2">
    {["Details", "Payment", "Confirm"].map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            i < current ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
            i === current ? "bg-blue-600 text-white ring-4 ring-blue-600/10 dark:ring-blue-600/20 shadow-lg shadow-blue-600/20" :
            "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
          }`}>
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={`text-[10px] mt-2 font-black uppercase tracking-wider ${i === current ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>
            {label}
          </span>
        </div>
        {i < 2 && (
          <div className={`flex-1 h-0.5 mx-2 mb-6 transition-all duration-500 ${i < current ? "bg-emerald-500" : "bg-slate-100 dark:bg-slate-800"}`} />
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
  const [sameAddress, setSameAddress] = useState(true);
  const [comments, setComments]     = useState("");
  const [agreed, setAgreed]         = useState(false);

  const brand = detectBrand(cardNumber);
  const carInfo = car || { brand: "Toyota", model: "Camry", pricePerDay: 2500 };
  const rental  = rentalDetails || { days: 3, pickup: "Manila", dropoff: "Cebu" };
  const total   = carInfo.pricePerDay * rental.days;

  const handleProcess = async () => {
    if (!cardNumber || !cardName || !cvv || !expMonth || !expYear) {
      toast.error("Please fill in all card details");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2200));
    setProcessing(false);
    setDone(true);
    toast.success("Payment successful!");
    onSuccess?.();
  };

  // -- Success Screen --
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border-4 border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center animate-in zoom-in-75 duration-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 shadow-sm" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Success!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your reservation is confirmed.</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] px-8 py-6 text-left w-full max-w-sm shadow-xl dark:shadow-none transition-all">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3 font-black uppercase tracking-[0.2em]">Summary</p>
          <div className="space-y-1">
            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{carInfo.brand} {carInfo.model}</p>
            <p className="text-xs text-slate-500 font-medium italic">{rental.days} days · {rental.pickup} → {rental.dropoff}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex justify-between items-end">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid</span>
             <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">₱{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-transparent transition-colors duration-300">
      <Steps current={step} />

      {/* -- STEP 0: Booking Summary -- */}
      {step === 0 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl dark:shadow-none bg-white dark:bg-slate-900/50 transition-all">
            <div className="bg-slate-900 dark:bg-slate-800 px-6 py-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <p className="text-white font-black text-lg uppercase tracking-tight">{carInfo.brand} {carInfo.model}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold tracking-widest">₱{carInfo.pricePerDay?.toLocaleString()} / DAY</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <Calendar size={16} className="text-blue-500" />
                  <span>{rental.days} Days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <MapPin size={16} className="text-blue-500" />
                  <span className="truncate">{rental.pickup}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Amount Due</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: "SSL SECURED", color: "text-emerald-500" },
              { icon: Lock, label: "ENCRYPTED", color: "text-blue-500" },
              { icon: CheckCircle2, label: "VERIFIED", color: "text-purple-500" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2 py-4 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-200 dark:hover:border-slate-700">
                <Icon size={18} className={color} />
                <span className="text-[9px] font-black text-slate-500 dark:text-slate-600 tracking-tighter">{label}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setStep(1)}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
          >
            Checkout Securely <ChevronRight size={18} />
          </Button>
        </div>
      )}

      {/* -- STEP 1: Payment Form -- */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <FieldSet className="space-y-5">
            <div className="flex flex-col gap-1">
              <FieldLegend className="flex items-center gap-2 text-slate-900 dark:text-white font-black uppercase tracking-widest text-sm">
                <CreditCard size={18} className="text-blue-500" /> Card Details
              </FieldLegend>
              <FieldDescription className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                We accept Visa, Mastercard, and Amex
              </FieldDescription>
            </div>

            <div className="space-y-4">
              <Field>
                <FieldLabel className="text-[10px] font-black uppercase tracking-widest dark:text-slate-500">Cardholder Name</FieldLabel>
                <div className="relative group">
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="JUAN DELA CRUZ"
                    className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20 pr-10 uppercase font-bold"
                  />
                  <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-[10px] font-black uppercase tracking-widest dark:text-slate-500">Card Number</FieldLabel>
                <div className="relative">
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20 font-mono tracking-[0.2em] font-black text-base pr-16"
                  />
                  <CardBrandBadge brand={brand} />
                </div>
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field>
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest dark:text-slate-500">Month</FieldLabel>
                  <Select value={expMonth} onValueChange={setExpMonth}>
                    <SelectTrigger className="h-12 rounded-xl dark:bg-slate-900/50 dark:border-slate-800"><SelectValue placeholder="MM" /></SelectTrigger>
                    <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                      {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
                        <SelectItem key={m} value={m} className="font-bold">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest dark:text-slate-500">Year</FieldLabel>
                  <Select value={expYear} onValueChange={setExpYear}>
                    <SelectTrigger className="h-12 rounded-xl dark:bg-slate-900/50 dark:border-slate-800"><SelectValue placeholder="YYYY" /></SelectTrigger>
                    <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                      {["2025","2026","2027","2028","2029","2030"].map(y => (
                        <SelectItem key={y} value={y} className="font-bold">{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest dark:text-slate-500">CVV</FieldLabel>
                  <Input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    type="password"
                    className="h-12 rounded-xl dark:bg-slate-900/50 dark:border-slate-800 text-center font-black tracking-widest"
                  />
                </Field>
              </div>
            </div>
          </FieldSet>

          <FieldSeparator className="border-slate-100 dark:border-slate-800" />

          <div className="space-y-4">
            <Field orientation="horizontal" className="flex items-center gap-3">
              <Checkbox id="same-address" checked={sameAddress} onCheckedChange={setSameAddress} className="rounded-md border-slate-300 dark:border-slate-700" />
              <FieldLabel htmlFor="same-address" className="text-xs font-bold text-slate-500 dark:text-slate-400">Same as rental address</FieldLabel>
            </Field>

            <Field className="space-y-2">
              <FieldLabel className="text-[10px] font-black uppercase tracking-widest dark:text-slate-500">Special Instructions <span className="text-slate-400 lowercase">(optional)</span></FieldLabel>
              <Input
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Ex. Pick up near terminal..."
                className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl min-h-[80px]"
              />
            </Field>

            <div className="flex gap-3">
              <Button variant="outline" type="button" onClick={() => setStep(0)} className="h-12 flex-1 rounded-xl border-slate-200 dark:border-slate-800 dark:text-white font-bold uppercase tracking-widest text-[10px]">Back</Button>
              <Button type="submit" className="h-12 flex-[2] bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]">Review Order</Button>
            </div>
          </div>
        </form>
      )}

      {/* -- STEP 2: Confirm & Pay -- */}
      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-xl transition-all">
            <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/50">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Final Verification</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Reservation</span>
                <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{carInfo.brand} {carInfo.model}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Duration</span>
                <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{rental.days} Days</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Payment Method</span>
                <span className="font-mono font-black text-slate-900 dark:text-white tracking-widest underline decoration-blue-500/30">•••• {cardNumber.slice(-4)}</span>
              </div>
              <div className="border-t border-slate-50 dark:border-slate-800 pt-4 flex justify-between items-end">
                <span className="font-black text-slate-900 dark:text-white text-base">TOTAL DUE</span>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-2xl p-4 flex gap-3">
            <AlertCircle size={18} className="text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 dark:text-amber-500/80 font-bold italic leading-relaxed uppercase tracking-tight">
              DEMO: No real charges. By paying, you agree to our policies.
            </p>
          </div>

          <Field orientation="horizontal" className="flex items-center gap-3">
            <Checkbox id="agree-terms" checked={agreed} onCheckedChange={setAgreed} className="rounded-md border-blue-600" />
            <FieldLabel htmlFor="agree-terms" className="text-xs font-bold text-slate-500 dark:text-slate-400">I agree to the rental terms and conditions</FieldLabel>
          </Field>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleProcess}
              disabled={processing || !agreed}
              className="w-full h-16 rounded-[1.5rem] font-black text-white text-base transition-all duration-300 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed shadow-2xl dark:shadow-none overflow-hidden relative"
              style={{ background: !processing && agreed ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" : undefined }}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span className="uppercase tracking-widest text-xs">Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock size={16} />
                  <span className="uppercase tracking-widest">Pay Securely</span>
                </div>
              )}
            </button>
            <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase tracking-widest text-[9px]">Edit Card</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDemo;