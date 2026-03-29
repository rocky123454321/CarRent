import React, { useState } from "react";
import { useCarStore } from "../../../store/CarStore";
import { useAuthStore } from "../../../store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const AddCar = () => {
  const [form, setForm] = useState({
    brand: "", model: "", year: "", color: "",
    pricePerDay: "", fuelType: "Petrol",
    transmission: "Automatic", licensePlate: "",
    isAvailable: true,
  });

  const { createCar, isLoading } = useCarStore();
  const { user } = useAuthStore();

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert("Please login first as admin");
    try {
      await createCar(
        form.brand, form.model, form.year, form.color,
        form.pricePerDay, form.fuelType, form.transmission,
        form.licensePlate, form.isAvailable, user._id
      );
      setForm({
        brand: "", model: "", year: "", color: "",
        pricePerDay: "", fuelType: "Petrol",
        transmission: "Automatic", licensePlate: "",
        isAvailable: true,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add car");
    }
  };

  const labelClass = "text-xs text-gray-400 mb-1 block";

  return (
    <div className="max-w-lg mx-auto mt-13 p-6 bg-white rounded-2xl border border-gray-100">
      <p className="font-medium text-gray-900 mb-1">Add new car</p>
      <p className="text-xs text-gray-400 mb-5">Fill in the details to list a new car.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* Brand & Model */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Brand</label>
            <Input placeholder="Toyota" value={form.brand}
              onChange={handle("brand")} required />
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <Input placeholder="Corolla" value={form.model}
              onChange={handle("model")} required />
          </div>
        </div>

        {/* Year & Color */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Year</label>
            <Input type="number" placeholder="2023" value={form.year}
              onChange={handle("year")} required />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <Input placeholder="White" value={form.color}
              onChange={handle("color")} />
          </div>
        </div>

        {/* Price & License Plate */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Price / day (₱)</label>
            <Input type="number" placeholder="1500" value={form.pricePerDay}
              onChange={handle("pricePerDay")} required />
          </div>
          <div>
            <label className={labelClass}>License plate</label>
            <Input placeholder="ABC 1234" value={form.licensePlate}
              onChange={handle("licensePlate")} required />
          </div>
        </div>

        {/* Fuel Type & Transmission */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Fuel type</label>
            <Select value={form.fuelType}
              onValueChange={(val) => setForm((prev) => ({ ...prev, fuelType: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Fuel type" />
              </SelectTrigger>
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
            <Select value={form.transmission}
              onValueChange={(val) => setForm((prev) => ({ ...prev, transmission: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2.5 mt-1">
          <Checkbox
            id="available"
            checked={form.isAvailable}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, isAvailable: checked }))
            }
          />
          <label htmlFor="available" className="text-sm text-gray-600 cursor-pointer">
            Available immediately
          </label>
        </div>

        <Button type="submit" disabled={isLoading} className="mt-2 w-full">
          {isLoading ? "Adding..." : "Add car"}
        </Button>

      </form>
    </div>
  );
};

export default AddCar;