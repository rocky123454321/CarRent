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

  // ✅ 3-slot image state — each slot: { file: File|null, preview: string|null }
  const [imageSlots, setImageSlots] = useState([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
  ]);
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (user?._id) getAdminCars(user._id);
  }, [user?._id, getAdminCars]);

  const handleDelete = async (id) => await deleteCar(id);

  // ✅ Open dialog — pre-fill image slots from existing car images
  const openEdit = (car) => {
    setEditingCar(car);
    setOpenDialogId(car._id);

    const existingImages = Array.isArray(car.images) && car.images.length > 0
      ? car.images
      : [car.image || null, null, null];

    setImageSlots([
      { file: null, preview: existingImages[0] || null },
      { file: null, preview: existingImages[1] || null },
      { file: null, preview: existingImages[2] || null },
    ]);
  };

  const closeEdit = () => {
    setOpenDialogId(null);
    setEditingCar(null);
    setImageSlots([
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
    ]);
  };

  // ✅ Handle image change per slot
  const handleImageChange = (slotIndex) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSlots(prev => {
        const updated = [...prev];
        updated[slotIndex] = { file, preview: reader.result };
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  // ✅ Remove image from slot
  const removeImage = (slotIndex) => {
    setImageSlots(prev => {
      const updated = [...prev];
      updated[slotIndex] = { file: null, preview: null };
      return updated;
    });
    if (fileInputRefs[slotIndex].current) {
      fileInputRefs[slotIndex].current.value = "";
    }
  };

  // ✅ Submit update with FormData
  const handleUpdate = async () => {
    if (!editingCar) return;

    const formData = new FormData();

    // Append all text fields — skip image-related keys (handled separately)
    const skipKeys = ["image", "images", "imageId", "imageIds", "__v", "createdAt", "updatedAt", "id"];
    Object.keys(editingCar).forEach((key) => {
      if (!skipKeys.includes(key) && editingCar[key] !== null && editingCar[key] !== undefined) {
        formData.append(key, editingCar[key]);
      }
    });

    // ✅ Slot 0 → "image" (main, backward-compatible)
    // ✅ Slots 1-2 → "images" (extra photos)
    if (imageSlots[0].file) formData.append("image",  imageSlots[0].file);
    if (imageSlots[1].file) formData.append("images", imageSlots[1].file);
    if (imageSlots[2].file) formData.append("images", imageSlots[2].file);

    await updateCar(editingCar._id, formData);
    closeEdit();
  };

  const slotLabels = ["Main Photo", "Side View", "Interior / Detail"];

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
                  if (open) openEdit(car);
                  else closeEdit();
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
                      <div className="my-6 space-y-4">

                        {/* ✅ 3-Slot Image Upload */}
                        <div>
                          <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Vehicle Photos · Up to 3
                          </Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {[0, 1, 2].map((slot) => (
                              <div key={slot} className="space-y-1">
                                <div
                                  onClick={() => !imageSlots[slot].preview && fileInputRefs[slot].current?.click()}
                                  className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all
                                    ${slot === 0 ? 'h-36' : 'h-28'}
                                    ${imageSlots[slot].preview
                                      ? 'border-zinc-200 dark:border-zinc-800'
                                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500'
                                    }`}
                                >
                                  {imageSlots[slot].preview ? (
                                    <>
                                      <img
                                        src={imageSlots[slot].preview}
                                        alt={`Slot ${slot + 1}`}
                                        className="h-full w-full object-contain p-2"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(slot); }}
                                        className="absolute top-1.5 right-1.5 p-1 bg-zinc-900 text-white rounded-full hover:bg-red-500 transition-colors"
                                      >
                                        <X size={10} />
                                      </button>
                                      <div className="absolute bottom-1.5 left-1.5 bg-zinc-900/70 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                        {slot === 0 ? 'Main' : `#${slot + 1}`}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-center px-1">
                                      <ImagePlus className="text-zinc-300 dark:text-zinc-700 mx-auto mb-1" size={slot === 0 ? 20 : 16} />
                                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                                        {slot === 0 ? 'Main' : 'Add'}
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
                        </div>

                        {/* Text Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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