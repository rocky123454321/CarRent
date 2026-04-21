import React, { useState, useRef } from "react";
import {
  Shield, Lock, CreditCard, CheckCircle2,
  AlertCircle, Car, Calendar, MapPin, User,
  ChevronRight, Loader2, ArrowLeft, Clock,
  Printer, Download, ArrowRight
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

// ─── Receipt Component ──────────────────────────────────────────────
const Receipt = ({ carInfo, rental, total, cardName, cardNumber, brand, bookingRef, paidAt, onGoToRentals }) => {
  const receiptRef = useRef();

  const handlePrint = () => {
    const content = receiptRef.current?.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Receipt – ${bookingRef}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; background: #fff; color: #111; padding: 32px; max-width: 420px; margin: 0 auto; }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: -1px; margin-bottom: 4px; }
        .sub { font-size: 11px; color: #666; margin-bottom: 24px; }
        .divider { border: none; border-top: 1px dashed #ccc; margin: 16px 0; }
        .row { display: flex; justify-content: space-between; font-size: 12px; margin: 6px 0; }
        .row.bold { font-weight: 700; font-size: 14px; }
        .label { color: #666; }
        .stamp { text-align: center; margin-top: 24px; padding: 12px; border: 2px solid #16a34a; border-radius: 8px; color: #16a34a; font-weight: 900; font-size: 14px; letter-spacing: 2px; }
        .ref { text-align: center; font-size: 11px; color: #999; margin-top: 12px; }
        .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px; }
      </style></head><body>
      <div class="logo">DriveEasy</div>
      <div class="sub">Official Rental Receipt</div>
      <hr class="divider"/>
      <div class="section-title">Vehicle</div>
      <div class="row"><span>${carInfo.brand} ${carInfo.model}</span><span>₱${carInfo.pricePerDay?.toLocaleString()}/day</span></div>
      <hr class="divider"/>
      <div class="section-title">Trip Details</div>
      <div class="row"><span class="label">Pick-up</span><span>${rental.pickup}</span></div>
      <div class="row"><span class="label">Pick-up Date</span><span>${rental.pickupDate ? new Date(rental.pickupDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric"}) : "—"} ${rental.pickupTime || ""}</span></div>
      <div class="row"><span class="label">Drop-off</span><span>${rental.dropoff}</span></div>
      <div class="row"><span class="label">Return Date</span><span>${rental.dropoffDate ? new Date(rental.dropoffDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric"}) : "—"} ${rental.dropoffTime || ""}</span></div>
      <div class="row"><span class="label">Duration</span><span>${rental.days} Day${rental.days !== 1 ? "s" : ""}</span></div>
      <hr class="divider"/>
      <div class="section-title">Payment</div>
      <div class="row"><span class="label">Cardholder</span><span>${cardName}</span></div>
      <div class="row"><span class="label">Card</span><span>${brand ? brand + " " : ""}•••• ${cardNumber.slice(-4)}</span></div>
      <div class="row"><span class="label">Rate/Day</span><span>₱${carInfo.pricePerDay?.toLocaleString()}</span></div>
      <div class="row"><span class="label">Days</span><span>× ${rental.days}</span></div>
      <hr class="divider"/>
      <div class="row bold"><span>TOTAL PAID</span><span>₱${total.toLocaleString()}</span></div>
      <hr class="divider"/>
      <div class="ref">Booking Ref: ${bookingRef}</div>
      <div class="ref">Paid: ${paidAt}</div>
      <div class="stamp">PAYMENT VERIFIED</div>
      <div class="ref" style="margin-top:16px">Thank you for choosing DriveEasy.</div>
    </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <div className="flex flex-col items-center text-center pt-2 pb-1 space-y-2">
        <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Successful!</h3>
          <p className="text-xs text-gray-400 mt-0.5">{paidAt}</p>
        </div>
      </div>

      {/* Receipt card */}
      <div ref={receiptRef} className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
        {/* Header stripe */}
        <div className="bg-gray-900 dark:bg-black px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-black text-base tracking-tight">DriveEasy</p>
              <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">Official Rental Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-medium">Booking Ref</p>
              <p className="text-white font-mono font-bold text-sm tracking-widest">{bookingRef}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Vehicle */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Vehicle</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <Car size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{carInfo.brand} {carInfo.model}</p>
                <p className="text-xs text-gray-400">₱{carInfo.pricePerDay?.toLocaleString()} per day</p>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 dark:border-white/10" />

          {/* Trip */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trip Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-500/8 rounded-xl p-3">
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Pick-up</p>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={11} className="text-gray-400 shrink-0" />
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{rental.pickup || "—"}</p>
                </div>
                {rental.pickupDate && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar size={11} className="text-gray-400 shrink-0" />
                    <p className="text-[10px] text-gray-500">
                      {new Date(rental.pickupDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" })}
                    </p>
                  </div>
                )}
                {rental.pickupTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-gray-400 shrink-0" />
                    <p className="text-[10px] text-gray-500">{rental.pickupTime}</p>
                  </div>
                )}
              </div>
              <div className="bg-green-50 dark:bg-green-500/8 rounded-xl p-3">
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1.5">Drop-off</p>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={11} className="text-gray-400 shrink-0" />
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{rental.dropoff || "—"}</p>
                </div>
                {rental.dropoffDate && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar size={11} className="text-gray-400 shrink-0" />
                    <p className="text-[10px] text-gray-500">
                      {new Date(rental.dropoffDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" })}
                    </p>
                  </div>
                )}
                {rental.dropoffTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-gray-400 shrink-0" />
                    <p className="text-[10px] text-gray-500">{rental.dropoffTime}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Duration</span>
              <span className="font-semibold text-gray-900 dark:text-white">{rental.days} {rental.days === 1 ? "Day" : "Days"}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 dark:border-white/10" />

          {/* Payment breakdown */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Breakdown</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Cardholder</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{cardName || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Card</span>
                <span className="font-mono font-medium text-gray-800 dark:text-gray-200">
                  {brand ? `${brand} ` : ""}•••• {cardNumber.slice(-4) || "——"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Rate/Day</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">₱{carInfo.pricePerDay?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Days</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">× {rental.days}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-white/10" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white text-sm">Total Paid</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₱{total.toLocaleString()}</span>
          </div>

          {/* Verified stamp */}
          <div className="flex items-center justify-center gap-2 border-2 border-dashed border-green-300 dark:border-green-600/40 rounded-xl py-3 bg-green-50 dark:bg-green-500/5">
            <CheckCircle2 size={15} className="text-green-600 dark:text-green-400" />
            <span className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Payment Verified</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          <Printer size={14} /> Print Receipt
        </button>
        <button
          onClick={onGoToRentals}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all"
        >
          My Rentals <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Main PaymentDemo ───────────────────────────────────────────────
const PaymentDemo = ({ car, rentalDetails, onSuccess, onGoToRentals }) => {
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [paidAt, setPaidAt] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]     = useState("");
  const [cvv, setCvv]               = useState("");
  const [expMonth, setExpMonth]     = useState("");
  const [expYear, setExpYear]       = useState("");
  const [comments, setComments]     = useState("");
  const [agreed, setAgreed]         = useState(false);

  const brand   = detectBrand(cardNumber);
  const carInfo = car || { brand: "Toyota", model: "Camry", pricePerDay: 2500 };
  const rental  = rentalDetails || { days: 3, pickup: "Manila", dropoff: "Cebu", pickupDate: "", dropoffDate: "", pickupTime: "", dropoffTime: "" };
  const total   = carInfo.pricePerDay * rental.days;

  const bookingRef = React.useMemo(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return "BK-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }, []);

  const handleProcess = async () => {
    if (!cardNumber || !cardName || !cvv || !expMonth || !expYear)
      return toast.error("Please fill in all card details");
    if (!agreed)
      return toast.error("Please agree to the terms");
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2200));
    setProcessing(false);
    const now = new Date().toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
    setPaidAt(now);
    setDone(true);
    toast.success("Payment successful!");
    // Call onSuccess but do NOT navigate — let user choose
    onSuccess?.({ bookingRef, paidAt: now, cardLastFour: cardNumber.slice(-4), brand });
  };

  if (done) {
    return (
      <Receipt
        carInfo={carInfo}
        rental={rental}
        total={total}
        cardName={cardName}
        cardNumber={cardNumber}
        brand={brand}
        bookingRef={bookingRef}
        paidAt={paidAt}
        onGoToRentals={onGoToRentals}
      />
    );
  }

  return (
    <div className="w-full font-sans">
      <Steps current={step} />

      {/* STEP 0 */}
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
              <div className="flex items-start justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500 shrink-0"><MapPin size={14} /> Pick-up</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{rental.pickup || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {rental.pickupDate ? new Date(rental.pickupDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" }) : ""}
                    {rental.pickupTime ? ` · ${rental.pickupTime}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500 shrink-0"><MapPin size={14} /> Drop-off</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{rental.dropoff || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {rental.dropoffDate ? new Date(rental.dropoffDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" }) : ""}
                    {rental.dropoffTime ? ` · ${rental.dropoffTime}` : ""}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-white/5 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500">Total</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{ icon: Shield, label: "SSL Secured", color: "text-green-500" }, { icon: Lock, label: "Encrypted", color: "text-blue-500" }, { icon: CheckCircle2, label: "Verified", color: "text-purple-500" }].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5">
                <Icon size={16} className={color} />
                <span className="text-[10px] font-semibold text-gray-400">{label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20 transition-all">
            Continue to Payment <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard size={16} className="text-blue-600" /> Card Details
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Visa, Mastercard, and Amex accepted</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Cardholder Name</label>
              <div className="relative">
                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Juan Dela Cruz" className={inputCls} />
                <User size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Card Number</label>
              <div className="relative">
                <input value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} placeholder="0000 0000 0000 0000" className={`${inputCls} font-mono tracking-widest pr-16`} />
                {brand && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-1.5 py-0.5 rounded">{brand}</span>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Month</label>
                <select value={expMonth} onChange={e => setExpMonth(e.target.value)} className={inputCls}>
                  <option value="">MM</option>
                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Year</label>
                <select value={expYear} onChange={e => setExpYear(e.target.value)} className={inputCls}>
                  <option value="">YYYY</option>
                  {["2025","2026","2027","2028","2029","2030"].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">CVV</label>
                <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" type="password" className={`${inputCls} text-center tracking-widest`} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Special Instructions <span className="text-gray-300 font-normal">(optional)</span></label>
              <textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="e.g. Pick up near terminal..." rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(0)} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <ArrowLeft size={14} /> Back
            </button>
            <button onClick={() => setStep(2)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all">
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-white/5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Order Review</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Vehicle</span>
                <span className="font-semibold text-gray-900 dark:text-white">{carInfo.brand} {carInfo.model}</span>
              </div>
              <div className="flex items-start justify-between text-sm">
                <span className="text-gray-500 font-medium">Pick-up</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{rental.pickup || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {rental.pickupDate ? new Date(rental.pickupDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" }) : ""}
                    {rental.pickupTime ? ` · ${rental.pickupTime}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between text-sm">
                <span className="text-gray-500 font-medium">Drop-off</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{rental.dropoff || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {rental.dropoffDate ? new Date(rental.dropoffDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" }) : ""}
                    {rental.dropoffTime ? ` · ${rental.dropoffTime}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Duration</span>
                <span className="font-semibold text-gray-900 dark:text-white">{rental.days} {rental.days === 1 ? "Day" : "Days"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Cardholder</span>
                <span className="font-semibold text-gray-900 dark:text-white">{cardName || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Card</span>
                <span className="font-semibold text-gray-900 dark:text-white font-mono">{brand ? `${brand} ` : ""}•••• {cardNumber.slice(-4) || "——"}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-white/5 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Total Due</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">This is a demo. No real charges will be made.</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-xs text-gray-500 font-medium">I agree to the rental terms and conditions</span>
          </label>
          <div className="flex flex-col gap-2">
            <button onClick={handleProcess} disabled={processing || !agreed} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20 transition-all">
              {processing ? <><Loader2 className="animate-spin w-4 h-4" /> Processing...</> : <><Lock size={14} /> Pay Securely</>}
            </button>
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-white font-medium transition-all py-2">
              ← Edit Payment Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDemo;