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
    if (file.size * 1024 * 1024 > 5242880) return alert("Image must be under 5MB");
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cars.map(car => (
        <div key={car._id} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-zinc-500/5 transition-all duration-300">

          {/* Header Status Badge */}
          <div className="flex items-start justify-between p-4 pb-0">
            <span className={`text-[9px] uppercase tracking-[0.15em] font-bold px-3 py-1 rounded-full border ${
              car.isAvailable 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50" 
                : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800"
            }`}>
              {car.isAvailable ? "● Available" : "○ Rented Out"}
            </span>

            <div className="flex gap-2">
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
                  <button className="w-8 h-8 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all shadow-sm">
                    <Pencil size={14} />
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900">
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold tracking-tighter dark:text-white text-zinc-900">Vehicle Profile</DialogTitle>
                      <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">Update the specifications for this listing.</DialogDescription>
                    </DialogHeader>

                    {editingCar && (
                      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Listing Cover</Label>
                          <div
                            onClick={() => !preview && fileInputRef.current?.click()}
                            className={`relative h-44 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden mt-1.5 transition-all
                              ${preview ? 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                          >
                            {preview ? (
                              <>
                                <img src={preview} alt="Preview" className="h-full w-full object-contain p-4" />
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                  className="absolute top-3 right-3 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 shadow-xl transition-all">
                                  <X size={14} />
                                </button>
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-zinc-950/90 text-zinc-900 dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                                  <CheckCircle size={10} /> Image Set
                                </div>
                              </>
                            ) : (
                              <div className="text-center group">
                                <ImagePlus className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2 group-hover:text-zinc-900 transition-colors" size={32} />
                                <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">Upload PNG / JPG</p>
                              </div>
                            )}
                          </div>
                          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                        </div>

                        <InputField label="Brand" value={editingCar.brand} onChange={(val) => setEditingCar({ ...editingCar, brand: val })} />
                        <InputField label="Model" value={editingCar.model} onChange={(val) => setEditingCar({ ...editingCar, model: val })} />
                        <InputField label="Color" value={editingCar.color} onChange={(val) => setEditingCar({ ...editingCar, color: val })} />
                        <InputField label="Year" type="number" value={editingCar.year} onChange={(val) => setEditingCar({ ...editingCar, year: parseInt(val) || 0 })} />
                        <InputField label="Daily Rate (₱)" type="number" value={editingCar.pricePerDay} onChange={(val) => setEditingCar({ ...editingCar, pricePerDay: parseFloat(val) || 0 })} />
                        <InputField label="Mileage (km)" type="number" value={editingCar.mileage || ""} onChange={(val) => setEditingCar({ ...editingCar, mileage: parseFloat(val) || 0 })} />

                        <SelectField label="Fuel" value={editingCar.fuelType} options={["Petrol","Diesel","Electric","Hybrid"]} onChange={(val) => setEditingCar({ ...editingCar, fuelType: val })} />
                        <SelectField label="Gearbox" value={editingCar.transmission} options={["Automatic","Manual"]} onChange={(val) => setEditingCar({ ...editingCar, transmission: val })} />
                        
                        <div className="md:col-span-2">
                           <SelectField 
                            label="Status" 
                            value={editingCar.isAvailable} 
                            options={[true, false]} 
                            onChange={(val) => setEditingCar({ ...editingCar, isAvailable: val })} 
                          />
                        </div>
                      </div>
                    )}

                    <DialogFooter className="gap-3 sm:justify-between">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="flex-1 rounded-xl border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-all">Update</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Delete Alert */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-8 h-8 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-all shadow-sm group">
                    <Trash2Icon size={14} className="group-hover:scale-110 transition-transform" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold tracking-tighter dark:text-white">Delete Listing?</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
                      This will remove <span className="font-bold text-zinc-900 dark:text-white">{car.brand} {car.model}</span> from your public inventory permanently.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-xl border-zinc-200 dark:border-zinc-800 dark:text-zinc-400 font-bold text-[10px] uppercase tracking-widest">Keep It</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(car._id)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest">Confirm Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Vehicle Image Display */}
          <div className="mx-4 my-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl flex justify-center items-center p-6 h-40 group/img">
            <img 
              src={car.image || carImage} 
              alt={`${car.brand} ${car.model}`} 
              className="max-h-full w-auto object-contain transition-all duration-500 group-hover/img:scale-110 group-hover/img:-rotate-2" 
            />
          </div>

          {/* Main Info */}
          <div className="px-5 pt-2">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white tracking-tighter">{car.brand} {car.model}</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">{car.color} • {car.year}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                <Fuel size={12} className="text-zinc-400" /> {car.fuelType}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                <Cog size={12} className="text-zinc-400" /> {car.transmission}
              </span>
            </div>
          </div>

          {/* Pricing & License Footer */}
          <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 px-5 py-4 mt-5 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Rate</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-zinc-900 dark:text-white">₱{car.pricePerDay.toLocaleString()}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">/day</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">Plate</span>
                <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded shadow-sm">
                {car.licensePlate}
                </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text", min, max }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</Label>
    <Input 
      type={type} 
      min={min} 
      max={max} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="h-10 rounded-xl focus-visible:ring-zinc-950 dark:focus-visible:ring-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white font-medium"
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</Label>
    <select 
      value={value} 
      onChange={e => {
        const val = e.target.value;
        onChange(val === "true" ? true : val === "false" ? false : val);
      }}
      className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl h-10 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all bg-white dark:bg-zinc-900 dark:text-white appearance-none"
    >
      {options.map(opt => (
        <option key={opt.toString()} value={opt}>
          {opt === true ? "Available for Rent" : opt === false ? "Rented / Maintenance" : opt}
        </option>
      ))}
    </select>
  </div>
);