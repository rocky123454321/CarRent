import { Car } from '../models/cars.model.js';
import { User } from '../models/user.model.js';
import { cloudinary } from '../config/cloudinary.js';

export const addCar = async (req, res) => {
  console.log("REQ.BODY:", req.body);
  console.log("REQ.FILE:", req.file);

  const {
    brand, model, year, color, pricePerDay,
    uploadedBy, mileage, fuelType, transmission,
    licensePlate, isAvailable
  } = req.body;

  // Validate required fields
  if (!brand || !model || !year || !pricePerDay || !licensePlate || !uploadedBy) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  try {
    const car = await Car.create({
      brand,
      model,
      year,
      color,
      pricePerDay,
      mileage,
      fuelType,
      transmission,
      licensePlate,
      uploadedBy,
      isAvailable: isAvailable ?? true,
      image: req.file?.path || "",    // ✅ Cloudinary URL
      imageId: req.file?.filename || "", // ✅ Cloudinary public_id
      currentRenter: null,
      rentalStartDate: null,
      rentalEndDate: null,
    });

    res.status(201).json({ success: true, message: "Car added successfully", car });
  } catch (err) {
    console.error("ADD CAR ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    if (!carId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Car ID" });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    // ✅ Delete old image sa Cloudinary kung may bagong image
    if (req.file && car.imageId) {
      await cloudinary.uploader.destroy(car.imageId);
    }

    const updated = await Car.findByIdAndUpdate(
      carId,
      {
        ...req.body,
        ...(req.file && {
          image:   req.file.path,
          imageId: req.file.filename,
        }),
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Car updated successfully", car: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    // ✅ Delete image sa Cloudinary
    if (car.imageId) await cloudinary.uploader.destroy(car.imageId);

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('uploadedBy', 'name email profileImage') // ✅ idagdag ito
      .sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('uploadedBy', 'name email profileImage'); // ✅ idagdag ito
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const rentCar = async (req, res) => {
  try {
    const { userId, rentalStartDate, rentalEndDate } = req.body;
    if (!userId || !rentalStartDate || !rentalEndDate) {
      return res.status(400).json({ message: "userId, rentalStartDate, and rentalEndDate are required" });
    }

    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (!car.isAvailable) return res.status(400).json({ message: "Car is not available" });

    const start = new Date(rentalStartDate);
    const end   = new Date(rentalEndDate);
    if (end <= start) return res.status(400).json({ message: "Return date must be after pick-up date" });

    car.isAvailable     = false;
    car.currentRenter   = userId;
    car.rentalStartDate = start;
    car.rentalEndDate   = end;
    await car.save();

    res.status(200).json({ success: true, message: "Car booked successfully", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const returnCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.isAvailable) return res.status(400).json({ message: "Car is not rented" });

    car.isAvailable     = true;
    car.currentRenter   = null;
    car.rentalStartDate = null;
    car.rentalEndDate   = null;
    await car.save();

    res.json({ message: "Car returned", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCarbyAdmin = async (req, res) => {
  try {
    const cars = await Car.find({ uploadedBy: req.params.adminId });
    res.status(200).json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const Settings = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};