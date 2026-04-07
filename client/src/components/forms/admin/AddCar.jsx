import React, { useState, useRef } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useAdminCarStore } from "../../../store/AdminCarStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagePlus, X, CheckCircle, Tag, Sparkles } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SEASON_OPTIONS = [
  { value: "summer",     label: "☀️ Summer" },
  { value: "christmas",  label: "🎄 Christmas" },
  { value: "valentines", label: "💝 Valentine's" },
  { value: "halloween",  label: "🎃 Halloween" },
  { value: "new_year",   label: "🎆 New Year" },
  { value: "payday",     label: "💸 Payday" },
  { value: "sale",       label: "🛍️ General Sale" },
];

const AddCar = () => {
  const [form, setForm] = useState({
    brand: "", model: "", year: "", color: "",
    pricePerDay: "", mileage: "", fuelType: "Petrol",
    transmission: "Automatic", licensePlate: "",
    isAvailable: true, image: null,
    isPromo: false, promoPrice: "", promoLabel: "",
    promoSeason: "", promoExpiry: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useAuthStore();
  const fetchAdminCars = useAdminCarStore((s) => s.fetchAdminCars);

  const handle = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setForm(prev => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) { toast.error("Please login first"); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'image') {
           if (form.image) formData.append("image", form.image);
        } else if (key === 'licensePlate') {
           formData.append(key, form[key].toUpperCase());
        } else {
           formData.append(key, form[key]);
        }
      });
      formData.append("uploadedBy", user._id);

      const res = await fetch(`${API_URL}/api/cars`, {
        method: "POST", body: formData, credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add car");

      toast.success("Car added successfully!");
      fetchAdminCars();
      setForm({
        brand: "", model: "", year: "", color: "",
        pricePerDay: "", mileage: "", fuelType: "Petrol",
        transmission: "Automatic", licensePlate: "",
        isAvailable: true, image: null,
        isPromo: false, promoPrice: "", promoLabel: "",
        promoSeason: "", promoExpiry: "",
      });
      setPreview(null);
    } catch (error) {
      toast.error(error.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 mb-2 block";

  return (
    <div className="max-w-2xl mx-auto my-12 p-10 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-none transition-all">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Registry</p>
        </div>
        <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white">Add New Vehicle</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Register a new unit to your active inventory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Image Upload */}
        <div>
          <label className={labelClass}>Vehicle Showcase</label>
          <div
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`relative h-56 w-full rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
              ${preview
                ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="h-full w-full object-contain p-6" />
                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="absolute top-4 right-4 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 shadow-xl transition-all">
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-zinc-950/90 text-zinc-900 dark:text-white text-[10px] font-bold px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <CheckCircle size={12} className="text-emerald-500" /> Ready to Upload
                </div>
              </>
            ) : (
              <div className="text-center group">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                  <ImagePlus className="text-zinc-400 dark:text-zinc-600" size={28} />
                </div>
                <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Drop car photo here</p>
                <p className="text-[9px] text-zinc-300 dark:text-zinc-700 mt-1 uppercase tracking-tight">Max size 5MB</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>

        {/* Technical Specs Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="space-y-6">
             <div>
              <label className={labelClass}>Brand</label>
              <Input className="h-12 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white" placeholder="e.g. BMW" value={form.brand} onChange={handle("brand")} required />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <Input className="h-12 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" type="number" min={1990} max={new Date().getFullYear()+1} placeholder="2024" value={form.year} onChange={handle("year")} required />
            </div>
            <div>
              <label className={labelClass}>Daily Rate (₱)</label>
              <Input className="h-12 rounded-xl font-bold text-zinc-900 dark:text-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" type="number" min={0} placeholder="2500" value={form.pricePerDay} onChange={handle("pricePerDay")} required />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Model</label>
              <Input className="h-12 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" placeholder="e.g. M4 Competition" value={form.model} onChange={handle("model")} required />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <Input className="h-12 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" placeholder="Alpine White" value={form.color} onChange={handle("color")} />
            </div>
            <div>
              <label className={labelClass}>License Plate</label>
              <Input className="h-12 rounded-xl uppercase font-mono tracking-widest dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" placeholder="ABC-1234" value={form.licensePlate} onChange={handle("licensePlate")} required />
            </div>
          </div>
        </div>

        {/* Secondary Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-1">
            <label className={labelClass}>Fuel</label>
            <Select value={form.fuelType} onValueChange={(val) => setForm(p => ({ ...p, fuelType: val }))}>
              <SelectTrigger className="h-12 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"><SelectValue /></SelectTrigger>
              <SelectContent className="dark:bg-zinc-950 dark:border-zinc-800">
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <label className={labelClass}>Gearbox</label>
            <Select value={form.transmission} onValueChange={(val) => setForm(p => ({ ...p, transmission: val }))}>
              <SelectTrigger className="h-12 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"><SelectValue /></SelectTrigger>
              <SelectContent className="dark:bg-zinc-950 dark:border-zinc-800">
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <label className={labelClass}>Mileage (KM)</label>
            <Input className="h-12 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" type="number" min={0} placeholder="0" value={form.mileage || ""} onChange={handle("mileage")} />
          </div>
        </div>

        {/* Promo Section - Re-designed as a Feature Card */}
        <div className={`group rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${form.isPromo ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/50 dark:bg-zinc-900/20' : 'border-zinc-100 dark:border-zinc-900 bg-transparent'}`}>
          <div 
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => setForm(p => ({ ...p, isPromo: !p.isPromo }))}
          >
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${form.isPromo ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-700'}`}>
                  <Sparkles size={18} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Seasonal Promotion</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium uppercase tracking-widest">Apply discounts and labels</p>
               </div>
            </div>
            <Checkbox 
              id="isPromo" 
              className="w-6 h-6 rounded-lg dark:border-zinc-800 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-zinc-950"
              checked={form.isPromo} 
              onCheckedChange={(checked) => setForm(p => ({ ...p, isPromo: checked }))} 
            />
          </div>

          {form.isPromo && (
            <div className="px-6 pb-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Promo Rate (₱)</label>
                  <Input
                    className="h-11 rounded-xl font-bold text-emerald-600 dark:text-emerald-400 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    type="number"
                    placeholder="Discounted price"
                    value={form.promoPrice}
                    onChange={handle("promoPrice")}
                  />
                  {form.pricePerDay && form.promoPrice && (
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-2">
                      -{Math.round((1 - form.promoPrice / form.pricePerDay) * 100)}% markdown applied
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Event Label</label>
                  <Input
                    className="h-11 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    placeholder="e.g. FLASH SALE"
                    value={form.promoLabel}
                    onChange={handle("promoLabel")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Season</label>
                  <Select value={form.promoSeason} onValueChange={(val) => setForm(p => ({ ...p, promoSeason: val }))}>
                    <SelectTrigger className="h-11 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-zinc-950 dark:border-zinc-800">
                      {SEASON_OPTIONS.map(s => (
                        <SelectItem key={s.value} value={s.value} className="font-medium">{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={labelClass}>Expiry</label>
                  <Input
                    className="h-11 rounded-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 dark:text-zinc-400"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.promoExpiry}
                    onChange={handle("promoExpiry")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-zinc-900/10 dark:shadow-none mt-4"
        >
          {loading ? "Processing..." : "Deploy to Inventory"}
        </Button>
      </form>
    </div>
  );
};

export default AddCar;