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
        <div key={car._id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-gray-200 dark:hover:border-slate-700 transition-colors shadow-sm">

          {/* Header Status Badge */}
          <div className="flex items-start justify-between p-3 pb-0">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${
              car.isAvailable 
                ? "bg-green-50 text-green-700 border-green-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                : "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
            }`}>
              {car.isAvailable ? "● Available" : "○ Unavailable"}
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
                  <button className="w-7 h-7 flex items-center justify-center border border-gray-100 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                    <Pencil size={13} className="text-gray-500 dark:text-slate-400" />
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Edit Vehicle Details</DialogTitle>
                      <DialogDescription className="dark:text-slate-400">Make changes to the car listing here.</DialogDescription>
                    </DialogHeader>

                    {editingCar && (
                      <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label className="text-xs font-semibold text-gray-600 dark:text-slate-400">Vehicle Photo</Label>
                          <div
                            onClick={() => !preview && fileInputRef.current?.click()}
                            className={`relative h-40 w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden mt-1
                              ${preview ? 'border-indigo-200 bg-gray-50 dark:bg-slate-800/50' : 'border-gray-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30'}`}
                          >
                            {preview ? (
                              <>
                                <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition">
                                  <X size={14} />
                                </button>
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                  <CheckCircle size={10} /> Photo ready
                                </div>
                              </>
                            ) : (
                              <div className="text-center">
                                <ImagePlus className="mx-auto text-gray-300 dark:text-slate-600 mb-2" size={28} />
                                <p className="text-[11px] font-medium text-gray-500 dark:text-slate-500">Click to upload</p>
                              </div>
                            )}
                          </div>
                          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                        </div>

                        <InputField label="Brand" value={editingCar.brand} onChange={(val) => setEditingCar({ ...editingCar, brand: val })} />
                        <InputField label="Model" value={editingCar.model} onChange={(val) => setEditingCar({ ...editingCar, model: val })} />
                        <InputField label="Color" value={editingCar.color} onChange={(val) => setEditingCar({ ...editingCar, color: val })} />
                        <InputField label="Year" type="number" value={editingCar.year} onChange={(val) => setEditingCar({ ...editingCar, year: parseInt(val) || 0 })} />
                        <InputField label="Price / day (₱)" type="number" value={editingCar.pricePerDay} onChange={(val) => setEditingCar({ ...editingCar, pricePerDay: parseFloat(val) || 0 })} />
                        <InputField label="Mileage (km)" type="number" value={editingCar.mileage || ""} onChange={(val) => setEditingCar({ ...editingCar, mileage: parseFloat(val) || 0 })} />

                        <SelectField label="Fuel Type" value={editingCar.fuelType} options={["Petrol","Diesel","Electric","Hybrid"]} onChange={(val) => setEditingCar({ ...editingCar, fuelType: val })} />
                        <SelectField label="Transmission" value={editingCar.transmission} options={["Automatic","Manual"]} onChange={(val) => setEditingCar({ ...editingCar, transmission: val })} />
                        
                        <div className="md:col-span-2">
                           <SelectField 
                            label="Current Availability" 
                            value={editingCar.isAvailable} 
                            options={[true, false]} 
                            onChange={(val) => setEditingCar({ ...editingCar, isAvailable: val })} 
                          />
                        </div>
                      </div>
                    )}

                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="flex-1 md:flex-none dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Delete Alert */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-7 h-7 flex items-center justify-center border border-gray-100 dark:border-slate-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shadow-sm group">
                    <Trash2Icon size={13} className="text-gray-400 group-hover:text-red-500 dark:text-slate-500" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-slate-900 dark:border-slate-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-slate-400">
                      This will permanently delete <strong className="dark:text-white">{car.brand} {car.model}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(car._id)} className="bg-red-600 hover:bg-red-700 text-white">Delete Vehicle</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Vehicle Image Display */}
          <div className="mx-3 my-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl flex justify-center items-center p-4 h-32">
            <img 
              src={car.image || carImage} 
              alt={`${car.brand} ${car.model}`} 
              className="max-h-full w-auto object-contain transition-transform hover:scale-110 duration-300" 
            />
          </div>

          {/* Main Info */}
          <div className="px-4 pb-2">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{car.brand} {car.model}</h3>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium uppercase tracking-tight mt-0.5">{car.color} • {car.year}</p>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="flex items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-slate-300 bg-gray-100/80 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Fuel size={10} /> {car.fuelType}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-slate-300 bg-gray-100/80 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Cog size={10} /> {car.transmission}
              </span>
              <span className="text-[10px] font-medium text-gray-600 dark:text-slate-300 bg-gray-100/80 dark:bg-slate-800 px-2 py-1 rounded-md">
                {car.mileage.toLocaleString()} km
              </span>
            </div>
          </div>

          {/* Pricing & License Footer */}
          <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800/50 px-4 py-3 mt-2 bg-gray-50/30 dark:bg-slate-800/30">
            <div>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">₱{car.pricePerDay}</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500 font-normal"> / day</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-2 py-1 rounded shadow-sm">
              {car.licensePlate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

/** * UI Helper Components 
 */
const InputField = ({ label, value, onChange, type = "text", min, max }) => (
  <div className="space-y-1">
    <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-tight">{label}</Label>
    <Input 
      type={type} 
      min={min} 
      max={max} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="h-9 focus-visible:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div className="space-y-1">
    <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-tight">{label}</Label>
    <select 
      value={value} 
      onChange={e => {
        const val = e.target.value;
        onChange(val === "true" ? true : val === "false" ? false : val);
      }}
      className="w-full border border-gray-200 dark:border-slate-700 rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-800 dark:text-white"
    >
      {options.map(opt => (
        <option key={opt.toString()} value={opt}>
          {opt === true ? "Available for Rent" : opt === false ? "Currently Unavailable" : opt}
        </option>
      ))}
    </select>
  </div>
);