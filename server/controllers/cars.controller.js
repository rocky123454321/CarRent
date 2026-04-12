import { Car } from '../models/cars.model.js';
import { User } from '../models/user.model.js';
import { cloudinary } from '../config/cloudinary.js';

// ✅ ADD NEW CAR
export const addCar = async (req, res) => {
  try {
    const {
      brand, model, year, color, pricePerDay,
      uploadedBy, mileage, fuelType, transmission,
      licensePlate, isAvailable,
      // Promo Fields from Frontend
      isPromo, promoPrice, promoLabel, promoSeason, promoExpiry
    } = req.body;

    // Validate required fields
    if (!brand || !model || !year || !pricePerDay || !licensePlate || !uploadedBy) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

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
      image: req.file?.path || "", 
      imageId: req.file?.filename || "",
      currentRenter: null,
      rentalStartDate: null,
      rentalEndDate: null,
      // ✅ Integrated Promo Logic
      isPromo: isPromo === "true" || isPromo === true,
      promoPrice: promoPrice ? Number(promoPrice) : null,
      promoLabel: promoLabel || null,
      promoSeason: (promoSeason === "" || promoSeason === "null") ? null : promoSeason,
      promoExpiry: promoExpiry || null,
    });

    res.status(201).json({ success: true, message: "Car added successfully", car });
  } catch (err) {
    console.error("ADD CAR ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ UPDATE CAR
export const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    if (!carId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Car ID" });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    // Handle Image Update
    if (req.file && car.imageId) {
      await cloudinary.uploader.destroy(car.imageId);
    }

    const updateData = { 
      ...req.body,
      // Convert specific fields from FormData strings
      isPromo: req.body.isPromo === "true" || req.body.isPromo === true,
      promoPrice: req.body.promoPrice ? Number(req.body.promoPrice) : null,
      promoSeason: req.body.promoSeason === "" ? null : req.body.promoSeason,
      ...(req.file && {
        image: req.file.path,
        imageId: req.file.filename,
      }),
    };

    const updated = await Car.findByIdAndUpdate(carId, updateData, { new: true });

    res.status(200).json({ success: true, message: "Car updated successfully", car: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ DELETE CAR
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (car.imageId) await cloudinary.uploader.destroy(car.imageId);

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL CARS (Public Explore)
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('uploadedBy', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE CAR
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('uploadedBy', 'name email profileImage');
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ RENT A CAR
export const rentCar = async (req, res) => {
  try {
    const { userId, rentalStartDate, rentalEndDate } = req.body;
    if (!userId || !rentalStartDate || !rentalEndDate) {
      return res.status(400).json({ message: "userId, rentalStartDate, and rentalEndDate are required" });
    }

    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (!car.isAvailable) return res.status(400).json({ message: "Car is currently not available" });

    const start = new Date(rentalStartDate);
    const end = new Date(rentalEndDate);
    if (end <= start) return res.status(400).json({ message: "Return date must be after pick-up date" });

    car.isAvailable = false;
    car.currentRenter = userId;
    car.rentalStartDate = start;
    car.rentalEndDate = end;
    await car.save();

    res.status(200).json({ success: true, message: "Car booked successfully", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ RETURN A CAR
export const returnCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.isAvailable) return res.status(400).json({ message: "Car is not currently rented" });

    car.isAvailable = true;
    car.currentRenter = null;
    car.rentalStartDate = null;
    car.rentalEndDate = null;
    await car.save();

    res.json({ success: true, message: "Car returned successfully", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ADMIN'S INVENTORY
export const getAllCarbyAdmin = async (req, res) => {
  try {
    const cars = await Car.find({ uploadedBy: req.params.adminId });
    res.status(200).json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ ACCOUNT SETTINGS (DELETE USER)
export const Settings = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    // Clean up all cars uploaded by this user if needed (optional)
    // await Car.deleteMany({ uploadedBy: req.userId });

    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};