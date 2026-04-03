import React, { useEffect, useState, useRef } from "react";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Pencil, Trash2 as Trash2Icon, ImagePlus, X, CheckCircle } from "lucide-react";
import { useAdminCarStore } from "../../store/AdminCarStore.js";
import { useAuthStore } from "../../store/authStore.js";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const AdminCards = () => {
  const { cars, getAdminCars, deleteCar, updateCar } = useAdminCarStore();
  const { user } = useAuthStore();
  const [editingCar, setEditingCar] = useState(null);
  const [openDialogId, setOpenDialogId] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?._id) getAdminCars(user._id);
  }, [user?._id, getAdminCars]);

  const handleDelete = async (id) => await deleteCar(id);

  const handleUpdate = async () => {
    if (editingCar) {
      await updateCar(editingCar._id, editingCar, preview);
    }
    setEditingCar(null);
    setOpenDialogId(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image must be under 5MB");
    setEditingCar(prev => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setEditingCar(prev => ({ ...prev, image: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map(car => (
        <div key={car._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">

          {/* Header */}
          <div className="flex items-start justify-between p-3 pb-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${car.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {car.isAvailable ? "Available" : "Unavailable"}
            </span>

            <div className="flex gap-1.5">
              {/* Edit Dialog */}
              <Dialog
                open={openDialogId === car._id}
                onOpenChange={(open) => {
                  if (open) {
                    setEditingCar(car);
                    setOpenDialogId(car._id);
                    setPreview(car.image || null);
                  } else {
                    setOpenDialogId(null);
                    setPreview(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button className="w-7 h-7 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <Pencil size={13} className="text-gray-500" />
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                    <DialogHeader>
                      <DialogTitle>Edit Car</DialogTitle>
                      <DialogDescription>Update all details below and click save when done.</DialogDescription>
                    </DialogHeader>

                    {editingCar && (
                      <div className="my-4 flex flex-col gap-3">

                        {/* Image Upload */}
                        <div>
                          <Label>Vehicle Photo</Label>
                          <div
                            onClick={() => !preview && fileInputRef.current?.click()}
                            className={`relative h-48 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden
                              ${preview ? 'border-indigo-200 bg-gray-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
                          >
                            {preview ? (
                              <>
                                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition">
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
                          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                        </div>

                        {/* Editable Fields */}
                        <InputField label="Brand" value={editingCar.brand} onChange={(val) => setEditingCar({ ...editingCar, brand: val })} />
                        <InputField label="Model" value={editingCar.model} onChange={(val) => setEditingCar({ ...editingCar, model: val })} />
                        <InputField label="Color" value={editingCar.color} onChange={(val) => setEditingCar({ ...editingCar, color: val })} />
                        <InputField label="Year" type="number" min={1990} max={new Date().getFullYear()+1} value={editingCar.year} onChange={(val) => setEditingCar({ ...editingCar, year: parseInt(val) || 0 })} />
                        <InputField label="Mileage (km)" type="number" min={0} value={editingCar.mileage || ""} onChange={(val) => setEditingCar({ ...editingCar, mileage: parseFloat(val) || 0 })} />
                        <InputField label="Price / day (₱)" type="number" min={0} value={editingCar.pricePerDay} onChange={(val) => setEditingCar({ ...editingCar, pricePerDay: parseFloat(val) || 0 })} />

                        <SelectField label="Fuel Type" value={editingCar.fuelType} options={["Petrol","Diesel","Electric","Hybrid"]} onChange={(val) => setEditingCar({ ...editingCar, fuelType: val })} />
                        <SelectField label="Transmission" value={editingCar.transmission} options={["Automatic","Manual"]} onChange={(val) => setEditingCar({ ...editingCar, transmission: val })} />
                        <SelectField label="Availability" value={editingCar.isAvailable} options={[true,false]} onChange={(val) => setEditingCar({ ...editingCar, isAvailable: val })} />

                      </div>
                    )}

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Delete Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-7 h-7 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <Trash2Icon size={13} className="text-red-500" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete car?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete this car from the system.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(car._id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Image */}
          <div className="mx-3 my-3 bg-gray-50 rounded-xl flex justify-center p-3">
            <img src={car.image || carImage} alt={`${car.brand} ${car.model}`} className="h-20 object-contain" />
          </div>

          {/* Info */}
          <div className="px-3 pb-2">
            <p className="font-medium text-sm text-gray-900">{car.brand} {car.model}</p>
            <p className="text-xs text-gray-400 mt-0.5">{car.color} · {car.year}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                <Fuel size={11} /> {car.fuelType}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                <Cog size={11} /> {car.transmission}
              </span>
              <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                {car.mileage} km
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2.5 mt-1">
            <p className="text-sm font-medium text-gray-900">
              ₱{car.pricePerDay}<span className="text-xs text-gray-400 font-normal"> /day</span>
            </p>
            <span className="text-xs text-gray-400 font-mono bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">{car.licensePlate}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper Components for cleaner code
const InputField = ({ label, value, onChange, type = "text", min, max }) => (
  <div>
    <Label>{label}</Label>
    <Input type={type} min={min} max={max} value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div>
    <Label>{label}</Label>
    <select value={value} onChange={e => onChange(e.target.value === "true" ? true : e.target.value === "false" ? false : e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400">
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);