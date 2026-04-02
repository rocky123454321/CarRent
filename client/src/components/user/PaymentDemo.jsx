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
  AlertCircle, Car, Calendar, MapPin, User, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// ── Card number formatter ────────────────────────────────────────────────────
const formatCardNumber = (v) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (v) =>
  v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

// ── Detect card brand ────────────────────────────────────────────────────────
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
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-white">
      {map[brand]}
    </span>
  );
};

// ── Step indicator ───────────────────────────────────────────────────────────
const Steps = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {["Details", "Payment", "Confirm"].map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            i < current ? "bg-emerald-500 text-white" :
            i === current ? "bg-slate-900 text-white ring-4 ring-slate-900/20" :
            "bg-slate-100 text-slate-400"
          }`}>
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={`text-[10px] mt-1 font-medium ${i === current ? "text-slate-900" : "text-slate-400"}`}>
            {label}
          </span>
        </div>
        {i < 2 && (
          <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-500 ${i < current ? "bg-emerald-500" : "bg-slate-200"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const PaymentDemo = ({ car, rentalDetails, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]     = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvv, setCvv]               = useState("");
  const [expMonth, setExpMonth]     = useState("");
  const [expYear, setExpYear]       = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [comments, setComments]     = useState("");
  const [agreed, setAgreed]         = useState(false);

  const brand = detectBrand(cardNumber);

  // Demo car/rental data if none passed
  const carInfo = car || { brand: "Toyota", model: "Camry", pricePerDay: 2500 };
  const rental  = rentalDetails || { days: 3, pickup: "Manila", dropoff: "Cebu" };
  const total   = carInfo.pricePerDay * rental.days;

  const handleProcess = async () => {
    if (!cardNumber || !cardName  || !cvv) {
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

  // ── Success screen ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Payment Confirmed</h3>
          <p className="text-sm text-slate-500 mt-1">Your booking has been secured.</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-left w-full max-w-xs">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Summary</p>
          <p className="text-sm font-semibold text-slate-800">{carInfo.brand} {carInfo.model}</p>
          <p className="text-xs text-slate-500">{rental.days} days · {rental.pickup} → {rental.dropoff}</p>
          <p className="text-lg font-bold text-slate-900 mt-2">₱{total.toLocaleString()}</p>
        </div>
        <p className="text-xs text-slate-400">A confirmation email has been sent to you.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Steps current={step} />

      {/* ── STEP 0: Booking Summary ────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            {/* Car header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">{carInfo.brand} {carInfo.model}</p>
                <p className="text-slate-300 text-xs">₱{carInfo.pricePerDay?.toLocaleString()}/day</p>
              </div>
            </div>

            {/* Rental details */}
            <div className="p-5 space-y-3 bg-white">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={14} className="text-slate-400" />
                <span>{rental.days} day{rental.days !== 1 ? "s" : ""} rental</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span>{rental.pickup} → {rental.dropoff}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-sm text-slate-500">Total amount</span>
                <span className="text-xl font-bold text-slate-900">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Security badges */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: "SSL Secured" },
              { icon: Lock, label: "Encrypted" },
              { icon: CheckCircle2, label: "Verified" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-slate-50 border border-slate-100">
                <Icon size={16} className="text-emerald-500" />
                <span className="text-[10px] font-medium text-slate-500">{label}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setStep(1)}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            Proceed to Payment <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* ── STEP 1: Payment Form ───────────────────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-0">
          <FieldGroup>

            {/* Card details */}
            <FieldSet>
              <FieldLegend className="flex items-center gap-2 text-slate-900 font-bold">
                <CreditCard size={16} /> Card Details
              </FieldLegend>
              <FieldDescription className="text-slate-400 text-xs">
                Your payment is protected with 256-bit SSL encryption
              </FieldDescription>

              <FieldGroup className="mt-4 space-y-4">
                <Field>
                  <FieldLabel>Cardholder Name</FieldLabel>
                  <div className="relative">
                    <Input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Juan dela Cruz"
                      required
                      className="pr-10"
                    />
                    <User size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Card Number</FieldLabel>
                  <div className="relative">
                    <Input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                      className="pr-16 font-mono tracking-wider"
                    />
                    <CardBrandBadge brand={brand} />
                  </div>
                  <FieldDescription>Enter your 16-digit card number</FieldDescription>
                </Field>

                <div className="grid grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel>Month</FieldLabel>
                    <Select value={expMonth} onValueChange={setExpMonth} required>
                      <SelectTrigger><SelectValue placeholder="MM" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Year</FieldLabel>
                    <Select value={expYear} onValueChange={setExpYear} required>
                      <SelectTrigger><SelectValue placeholder="YYYY" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {["2025","2026","2027","2028","2029","2030"].map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>CVV</FieldLabel>
                    <div className="relative">
                      <Input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        type="password"
                        required
                        maxLength={4}
                      />
                    </div>
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator className="my-5" />

            {/* Billing */}
            <FieldSet>
              <FieldLegend className="text-slate-900 font-bold">Billing Address</FieldLegend>
              <FieldDescription className="text-slate-400 text-xs">
                The billing address associated with your card
              </FieldDescription>
              <FieldGroup className="mt-3">
                <Field orientation="horizontal">
                  <Checkbox
                    id="same-address"
                    checked={sameAddress}
                    onCheckedChange={setSameAddress}
                  />
                  <FieldLabel htmlFor="same-address" className="font-normal text-slate-600">
                    Same as rental address
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup className="mt-2">
                <Field>
                  <FieldLabel>Additional Comments <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
                  <Input
                  type="textarea"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Special requests or notes for your rental..."
                    className="resize-none text-sm"
                    rows={3}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal" className="pt-2">
              <Button type="submit" className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl">
                Review Order
              </Button>
              <Button variant="outline" type="button" onClick={() => setStep(0)} className="h-11 rounded-xl">
                Back
              </Button>
            </Field>

          </FieldGroup>
        </form>
      )}

      {/* ── STEP 2: Confirm & Pay ──────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Order review */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order Review</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{carInfo.brand} {carInfo.model}</span>
                <span className="font-medium">₱{carInfo.pricePerDay?.toLocaleString()}/day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium">{rental.days} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Card</span>
                <span className="font-mono font-medium">•••• {cardNumber.replace(/\s/g,"").slice(-4) || "0000"}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle size={15} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              This is a <strong>demo payment</strong>. No real charges will be made.
              By proceeding you agree to our rental terms and cancellation policy.
            </p>
          </div>

          <Field orientation="horizontal">
            <Checkbox
              id="agree-terms"
              checked={agreed}
              onCheckedChange={setAgreed}
            />
            <FieldLabel htmlFor="agree-terms" className="font-normal text-sm text-slate-600">
              I agree to the terms, conditions, and rental policy
            </FieldLabel>
          </Field>

          {/* Pay button */}
          <button
            onClick={handleProcess}
            disabled={processing || !agreed}
            className="w-full h-14 rounded-xl font-bold text-white text-base transition-all duration-200 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: processing
                ? "#94a3b8"
                : "linear-gradient(135deg, #0f172a 0%, #1e40af 100%)",
            }}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock size={16} />
                Pay ₱{total.toLocaleString()} Securely
              </span>
            )}
          </button>

          <Button variant="outline" onClick={() => setStep(1)} className="w-full h-11 rounded-xl">
            ← Back to Payment Details
          </Button>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-4 pt-1">
            {["PCI DSS", "SSL", "256-bit"].map((badge) => (
              <div key={badge} className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Shield size={10} className="text-emerald-400" /> {badge}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDemo;