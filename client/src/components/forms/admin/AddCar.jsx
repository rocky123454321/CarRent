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
import { ImagePlus, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddCar = () => {
  const [form, setForm] = useState({
    brand: "", model: "", year: "", color: "",
    pricePerDay: "", mileage: "", fuelType: "Petrol",
    transmission: "Automatic", licensePlate: "",
    isAvailable: true, image: null,
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
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
      formData.append("brand", form.brand);
      formData.append("model", form.model);
      formData.append("year", form.year);
      formData.append("color", form.color);
      formData.append("pricePerDay", form.pricePerDay);
      formData.append("mileage", form.mileage || 0);
      formData.append("fuelType", form.fuelType);
      formData.append("transmission", form.transmission);
      formData.append("licensePlate", form.licensePlate.toUpperCase());
      formData.append("isAvailable", form.isAvailable);
      formData.append("uploadedBy", user._id);
      if (form.image) formData.append("image", form.image);

      const res = await fetch(`${API_URL}/api/cars`, {
        method: "POST",
        body: formData,
        credentials: "include",
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
      });
      setPreview(null);

    } catch (error) {
      toast.error(error.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block";

  return (
    <div className="max-w-xl mx-auto mt-10 mb-10 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
      <div className="mb-6">
        <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-1">Management</p>
        <h2 className="text-2xl font-black text-gray-900">Add New Vehicle</h2>
        <p className="text-xs text-gray-400">Fill in the technical specifications below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Image Upload */}
        <div>
          <label className={labelClass}>Vehicle Photo</label>
          <div
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`relative h-48 w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden
              ${preview ? 'border-indigo-200 bg-gray-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 text-emerald-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                  <CheckCircle size={10} /> Photo ready
                </div>
              </>
            ) : (
              <div className="text-center">
                <ImagePlus className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-xs font-medium text-gray-500">Click to upload car image</p>
                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Brand</label>
            <Input className="rounded-xl" placeholder="e.g. Toyota" value={form.brand} onChange={handle("brand")} required />
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <Input className="rounded-xl" placeholder="e.g. Corolla" value={form.model} onChange={handle("model")} required />
          </div>
        </div>

        {/* Year & Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Year</label>
            <Input className="rounded-xl" type="number" min={1990} max={new Date().getFullYear()+1} placeholder="2024" value={form.year} onChange={handle("year")} required />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <Input className="rounded-xl" placeholder="Metallic Gray" value={form.color} onChange={handle("color")} />
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label className={labelClass}>Mileage (km)</label>
          <Input
            className="rounded-xl"
            type="number"
            min={0}
            placeholder="e.g. 50000"
            value={form.mileage || ""}
            onChange={handle("mileage")}
          />
        </div>

        {/* Price & License Plate */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rate per Day (₱)</label>
            <Input className="rounded-xl font-bold text-indigo-600" type="number" min={0} placeholder="1500" value={form.pricePerDay} onChange={handle("pricePerDay")} required />
          </div>
          <div>
            <label className={labelClass}>License Plate</label>
            <Input className="rounded-xl uppercase" placeholder="ABC 1234" value={form.licensePlate} onChange={handle("licensePlate")} required />
          </div>
        </div>

        {/* Fuel & Transmission */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fuel Type</label>
            <Select value={form.fuelType} onValueChange={(val) => setForm(p => ({ ...p, fuelType: val }))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelClass}>Transmission</label>
            <Select value={form.transmission} onValueChange={(val) => setForm(p => ({ ...p, transmission: val }))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <Checkbox
            id="available"
            checked={form.isAvailable}
            onCheckedChange={(checked) => setForm(p => ({ ...p, isAvailable: checked }))}
          />
          <div>
            <label htmlFor="available" className="text-sm font-bold text-gray-700 cursor-pointer">Available for rent</label>
            <p className="text-[10px] text-gray-400">If unchecked, car won't appear in search results.</p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-100"
        >
          {loading ? "Uploading..." : "List Vehicle Now"}
        </Button>
      </form>
    </div>
  );
};

export default AddCar;