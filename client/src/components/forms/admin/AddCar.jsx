import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useAdminCarStore } from "../../../store/AdminCarStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagePlus, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { getSeasonalAnnouncements } from "../../../utils/seasonalAnnouncements";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddCar = () => {
  const initialState = {
    brand: "", model: "", year: "", color: "",
    pricePerDay: "", mileage: "", fuelType: "Petrol",
    transmission: "Automatic", licensePlate: "",
    isAvailable: true,
    isPromo: false, promoPrice: "", promoLabel: "",
    promoSeason: "",
    promoExpiry: "",
  };

  const [form, setForm]       = useState(initialState);
  const [loading, setLoading] = useState(false);

  // ✅ Support up to 3 images — each slot has a file + preview
  const [images, setImages] = useState([null, null, null]);       // File objects
  const [previews, setPreviews] = useState([null, null, null]);   // Base64 strings

  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  const { user } = useAuthStore();
  const fetchAdminCars = useAdminCarStore((s) => s.fetchAdminCars);

  // --- AUTOMATIC SEASON SYNC ---
  useEffect(() => {
    if (form.isPromo) {
      const announcements = getSeasonalAnnouncements();
      const currentPromo  = announcements.find(a => a.type === 'promo');

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      const expiryString = expiryDate.toISOString().split('T')[0];

      setForm(prev => ({
        ...prev,
        promoSeason: currentPromo ? currentPromo.id : "general-sale",
        promoExpiry: prev.promoExpiry || expiryString,
        promoLabel:  prev.promoLabel  || (currentPromo ? currentPromo.title.toUpperCase() : "SPECIAL DEAL")
      }));
    } else {
      setForm(prev => ({ ...prev, promoSeason: "", promoPrice: "", promoLabel: "" }));
    }
  }, [form.isPromo]);

  const handle = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  // ✅ Handle image upload for a specific slot (0, 1, or 2)
  const handleImageChange = (slotIndex) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    const newImages = [...images];
    newImages[slotIndex] = file;
    setImages(newImages);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...previews];
      newPreviews[slotIndex] = reader.result;
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Remove image from a specific slot
  const removeImage = (slotIndex) => {
    const newImages   = [...images];
    const newPreviews = [...previews];
    newImages[slotIndex]   = null;
    newPreviews[slotIndex] = null;
    setImages(newImages);
    setPreviews(newPreviews);
    if (fileInputRefs[slotIndex].current) fileInputRefs[slotIndex].current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) { toast.error("Please login first"); return; }

    // Must have at least 1 image (slot 0 = main image)
    if (!images[0]) { toast.error("Please upload at least the main vehicle photo"); return; }

    if (form.isPromo && Number(form.promoPrice) >= Number(form.pricePerDay)) {
      return toast.error("Promo price must be lower than daily rate");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append("uploadedBy", user._id);

      // ✅ Append images: slot 0 → "image" (main, backward-compatible), slots 1-2 → "images"
      if (images[0]) formData.append("image",  images[0]);
      if (images[1]) formData.append("images", images[1]);
      if (images[2]) formData.append("images", images[2]);

      const res  = await fetch(`${API_URL}/api/cars`, { method: "POST", body: formData, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add car");

      toast.success("Car added successfully!");
      fetchAdminCars();
      setForm(initialState);
      setImages([null, null, null]);
      setPreviews([null, null, null]);
    } catch (error) {
      toast.error(error.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 mb-2 block";

  // ✅ Slot labels for the 3 image upload areas
  const slotLabels = ["Main Photo", "Side View", "Interior / Detail"];

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

        {/* ✅ 3-Slot Image Upload */}
        <div>
          <label className={labelClass}>Vehicle Showcase · Up to 3 Photos</label>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[0, 1, 2].map((slot) => (
              <div key={slot} className="space-y-1.5">
                <div
                  onClick={() => !previews[slot] && fileInputRefs[slot].current?.click()}
                  className={`relative rounded-[1.5rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
                    ${slot === 0 ? 'h-40' : 'h-32'}
                    ${previews[slot]
                      ? 'border-zinc-200 dark:border-zinc-800'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500'
                    }`}
                >
                  {previews[slot] ? (
                    <>
                      <img src={previews[slot]} alt={`Preview ${slot + 1}`} className="h-full w-full object-contain p-3" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(slot); }}
                        className="absolute top-2 right-2 p-1.5 bg-zinc-900 text-white rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                      {/* Slot number badge */}
                      <div className="absolute bottom-2 left-2 bg-zinc-900/70 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {slot === 0 ? 'Main' : `#${slot + 1}`}
                      </div>
                    </>
                  ) : (
                    <div className="text-center px-2">
                      <div className={`${slot === 0 ? 'w-12 h-12' : 'w-9 h-9'} bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <ImagePlus className="text-zinc-400" size={slot === 0 ? 22 : 16} />
                      </div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">
                        {slot === 0 ? 'Add Main' : 'Add Photo'}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest text-center truncate">
                  {slotLabels[slot]}
                  {slot === 0 && <span className="text-rose-400 ml-0.5">*</span>}
                </p>
                <input
                  type="file"
                  ref={fileInputRefs[slot]}
                  onChange={handleImageChange(slot)}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            ))}
          </div>
          <p className="text-[9px] text-zinc-400 mt-2 text-center">* Main photo is required. Side & detail photos are optional.</p>
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

        {/* Promo Section */}
        <div className={`rounded-[2rem] border-2 transition-all p-6 ${form.isPromo ? 'border-zinc-900 bg-zinc-50 dark:bg-zinc-900/20' : 'border-zinc-100 dark:border-zinc-900'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className={form.isPromo ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-300"} size={20} />
              <h4 className="text-sm font-bold uppercase">Promo Settings</h4>
            </div>
            <Checkbox checked={form.isPromo} onCheckedChange={(v) => setForm(p => ({ ...p, isPromo: !!v }))} />
          </div>

          {form.isPromo && (
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Promo Price</label>
                  <Input className="h-11 rounded-xl text-emerald-600 font-bold" type="number" value={form.promoPrice} onChange={handle("promoPrice")} />
                </div>
                <div>
                  <label className={labelClass}>Promo Label</label>
                  <Input className="h-11 rounded-xl" placeholder="e.g. 20% OFF" value={form.promoLabel} onChange={handle("promoLabel")} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Expiry Date</label>
                  <Input className="h-11 rounded-xl" type="date" value={form.promoExpiry} onChange={handle("promoExpiry")} />
                </div>
              </div>
              <p className="text-[9px] text-zinc-400 italic text-center">
                *System ID "{form.promoSeason}" will be linked to this promo automatically.
              </p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-white dark:text-black text-white font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
        >
          {loading ? "Deploying..." : "Add to Inventory"}
        </Button>
      </form>
    </div>
  );
};

export default AddCar;