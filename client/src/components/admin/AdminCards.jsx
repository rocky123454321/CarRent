import React, { useEffect, useState } from "react";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Pencil, Trash2 as Trash2Icon } from "lucide-react";
import { useAdminCarStore } from "../../store/AdminCarStore.js";
import { useAuthStore } from "../../store/authStore.js";
import {
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter,
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const AdminCards = () => {
  const { cars, getAdminCars, deleteCar, updateCar } = useAdminCarStore();
  const { user } = useAuthStore();
  const [editingCar, setEditingCar ] = useState(null);
  const [openDialogId, setOpenDialogId ] = useState(null);

  useEffect(() => {
    if (user?._id) {
      getAdminCars(user._id);
    }
  }, [user?._id, getAdminCars]);

  const handleDelete = async (id) => {
    await deleteCar(id);
  };

  const handleUpdate = async () => {
    if (editingCar) {
      await updateCar(editingCar._id, editingCar);
    }
    setEditingCar(null);
    setOpenDialogId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map((car) => (
        <div key={car._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
          {/* Header */}
          <div className="flex items-start justify-between p-3 pb-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              car.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
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
                  } else {
                    setOpenDialogId(null);
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
                      <DialogTitle>Edit car</DialogTitle>
                      <DialogDescription>
                        Update the details below and click save when done.
                      </DialogDescription>
                    </DialogHeader>
                    {editingCar && (
                      <div className="my-4 flex flex-col gap-3">
                        <div>
                          <Label htmlFor="brand">Brand</Label>
                          <Input 
                            id="brand" 
                            value={editingCar.brand}
                            onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <Input 
                            id="model" 
                            value={editingCar.model}
                            onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price / day (₱)</Label>
                          <Input 
                            id="price" 
                            type="number" 
                            value={editingCar.pricePerDay}
                            onChange={(e) => setEditingCar({ ...editingCar, pricePerDay: parseFloat(e.target.value) || 0 })} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="avail">Availability</Label>
                          <select 
                            id="avail" 
                            value={editingCar.isAvailable}
                            onChange={(e) => setEditingCar({ ...editingCar, isAvailable: e.target.value === "true" })}
                            className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                          >
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                          </select>
                        </div>
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
                    <AlertDialogDescription>
                      This will permanently delete this car from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(car._id)}>
                      Delete
                    </AlertDialogAction>
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
              ₱{car.pricePerDay}
              <span className="text-xs text-gray-400 font-normal"> /day</span>
            </p>
            <span className="text-xs text-gray-400 font-mono bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
              {car.licensePlate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

