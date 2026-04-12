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
import { ImagePlus, X, CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SEASON_OPTIONS = [
  { value: "summer",    label: "☀️ Summer" },
  { value: "christmas",  label: "🎄 Christmas" },
  { value: "valentines", label: "💝 Valentine's" },
  { value: "halloween",  label: "🎃 Halloween" },
  { value: "new_year",   label: "🎆 New Year" },
  { value: "payday",     label: "💸 Payday" },
  { value: "sale",       label: "🛍️ General Sale" },
];

const AddCar = () => {
  const initialState = {
    brand: "", model: "", year: "", color: "",
    pricePerDay: "", mileage: "", fuelType: "Petrol",
    transmission: "Automatic", licensePlate: "",
    isAvailable: true, image: null,
    isPromo: false, promoPrice: "", promoLabel: "",
    promoSeason: "", promoExpiry: "",
  };

  const [form, setForm] = useState(initialState);
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

    // Logic Check: Promo Price vs Original Price
    if (form.isPromo && Number(form.promoPrice) >= Number(form.pricePerDay)) {
      return toast.error("Promo price must be lower than daily rate");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      Object.keys(form).forEach(key => {
        const value = form[key];

        if (key === 'image') {
          if (value) formData.append("image", value);
        } 
        else if (key === 'licensePlate') {
          formData.append(key, value.toUpperCase().trim());
        }
        // CLEANUP: Huwag magpasa ng empty string sa Mongoose for non-string fields
        else if (['promoPrice', 'promoSeason', 'promoExpiry'].includes(key)) {
          if (form.isPromo && value !== "") {
            formData.append(key, value);
          } else {
            // I-append lang kung kailangan, otherwise hayaan ang backend/DB mag-default to null
          }
        }
        else {
          formData.append(key, value);
        }
      });

      formData.append("uploadedBy", user._id);

      const res = await fetch(`${API_URL}/api/cars`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add car");

      toast.success("Car added successfully!");
      fetchAdminCars();
      setForm(initialState);
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div>
          <label className={labelClass}>Vehicle Showcase</label>
          <div
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`relative h-56 w-full rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
              ${preview ? 'border-zinc-200 dark:border-zinc-800' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-900'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="h-full w-full object-contain p-6" />
                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="absolute top-4 right-4 p-2 bg-zinc-900 text-white rounded-full hover:bg-red-500 transition-colors">
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="text-center group">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImagePlus className="text-zinc-400" size={28} />
                </div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Add Photo</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Brand</label>
            <Input className="h-12 rounded-xl" placeholder="BMW" value={form.brand} onChange={handle("brand")} required />
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <Input className="h-12 rounded-xl" placeholder="M4" value={form.model} onChange={handle("model")} required />
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <Input className="h-12 rounded-xl" type="number" value={form.year} onChange={handle("year")} required />
          </div>
          <div>
            <label className={labelClass}>License Plate</label>
            <Input className="h-12 rounded-xl font-mono uppercase" placeholder="ABC-123" value={form.licensePlate} onChange={handle("licensePlate")} required />
          </div>
        </div>

        {/* Pricing & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Daily Rate</label>
            <Input className="h-12 rounded-xl" type="number" value={form.pricePerDay} onChange={handle("pricePerDay")} required />
          </div>
          <div>
            <label className={labelClass}>Fuel</label>
            <Select value={form.fuelType} onValueChange={(v) => setForm(p => ({ ...p, fuelType: v }))}>
              <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelClass}>Mileage</label>
            <Input className="h-12 rounded-xl" type="number" value={form.mileage} onChange={handle("mileage")} />
          </div>
        </div>

        {/* Promo Card */}
        <div className={`rounded-[2rem] border-2 transition-all p-6 ${form.isPromo ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className={form.isPromo ? "text-zinc-900" : "text-zinc-300"} size={20} />
              <h4 className="text-sm font-bold uppercase">Promo Settings</h4>
            </div>
            <Checkbox checked={form.isPromo} onCheckedChange={(v) => setForm(p => ({ ...p, isPromo: !!v }))} />
          </div>

          {form.isPromo && (
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Promo Price</label>
                  <Input className="h-11 rounded-xl text-emerald-600 font-bold" type="number" value={form.promoPrice} onChange={handle("promoPrice")} />
                </div>
                <div>
                  <label className={labelClass}>Label</label>
                  <Input className="h-11 rounded-xl" placeholder="20% OFF" value={form.promoLabel} onChange={handle("promoLabel")} />
                </div>
                <div>
                  <label className={labelClass}>Season</label>
                  <Select value={form.promoSeason} onValueChange={(v) => setForm(p => ({ ...p, promoSeason: v }))}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select Season" /></SelectTrigger>
                    <SelectContent>
                      {SEASON_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={labelClass}>Expiry Date</label>
                  <Input className="h-11 rounded-xl" type="date" value={form.promoExpiry} onChange={handle("promoExpiry")} />
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-zinc-900 text-white font-bold uppercase tracking-[0.2em]"
        >
          {loading ? "Deploying..." : "Add to Inventory"}
        </Button>
      </form>
    </div>
  );
};

export default AddCar;