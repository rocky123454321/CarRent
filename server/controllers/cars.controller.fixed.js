import { Car } from "../models/cars.model.js";
import { Promo } from "../models/promo.model.js";
import { User } from "../models/user.model.js";
import { cloudinary } from "../config/cloudinary.js";
import { enrichCarsWithActivePromos } from "../utils/promo.js";

const parseBoolean = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return Boolean(value);
};

const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sanitizeCarPayload = (body = {}) => ({
  brand: body.brand?.trim?.(),
  model: body.model?.trim?.(),
  year: parseNumber(body.year),
  color: body.color?.trim?.() || "",
  pricePerDay: parseNumber(body.pricePerDay),
  mileage: parseNumber(body.mileage),
  fuelType: body.fuelType || undefined,
  transmission: body.transmission || undefined,
  licensePlate: body.licensePlate?.trim?.()?.toUpperCase?.(),
  isAvailable: parseBoolean(body.isAvailable, true),
});

export const addCar = async (req, res) => {
  const payload = sanitizeCarPayload(req.body);
  const uploadedBy = req.userId || req.body.uploadedBy;

  if (
    !payload.brand ||
    !payload.model ||
    !payload.year ||
    !payload.pricePerDay ||
    !payload.licensePlate ||
    !uploadedBy
  ) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  try {
    const car = await Car.create({
      ...payload,
      uploadedBy,
      image: req.file?.path || "",
      imageId: req.file?.filename || "",
      currentRenter: null,
      rentalStartDate: null,
      rentalEndDate: null,
    });

    const [carWithPromo] = await enrichCarsWithActivePromos([car]);
    res.status(201).json({ success: true, message: "Car added successfully", car: carWithPromo });
  } catch (error) {
    console.error("ADD CAR ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
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

    if (req.file && car.imageId) {
      await cloudinary.uploader.destroy(car.imageId);
    }

    const payload = sanitizeCarPayload(req.body);
    const updateData = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    );

    const updated = await Car.findByIdAndUpdate(
      carId,
      {
        ...updateData,
        ...(req.file && {
          image: req.file.path,
          imageId: req.file.filename,
        }),
      },
      { new: true }
    );

    const [carWithPromo] = await enrichCarsWithActivePromos([updated]);
    res.status(200).json({ success: true, message: "Car updated successfully", car: carWithPromo });
  } catch (error) {
    console.error("UPDATE CAR ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (car.imageId) {
      await cloudinary.uploader.destroy(car.imageId);
    }

    await Promo.deleteMany({ carId: car._id });
    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("DELETE CAR ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCars = async (_req, res) => {
  try {
    const cars = await Car.find()
      .populate("uploadedBy", "name email profileImage")
      .sort({ createdAt: -1 });

    const carsWithPromos = await enrichCarsWithActivePromos(cars);
    res.status(200).json(carsWithPromos);
  } catch (error) {
    console.error("GET /cars error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const carId = req.params.id;
    if (!carId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Car ID" });
    }

    const car = await Car.findById(carId).populate("uploadedBy", "name email profileImage");
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    const [carWithPromo] = await enrichCarsWithActivePromos([car]);
    res.status(200).json(carWithPromo);
  } catch (error) {
    console.error("GET /cars/:id error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rentCar = async (req, res) => {
  try {
    const { userId, rentalStartDate, rentalEndDate } = req.body;
    if (!userId || !rentalStartDate || !rentalEndDate) {
      return res.status(400).json({
        success: false,
        message: "userId, rentalStartDate, and rentalEndDate are required",
      });
    }

    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });
    if (!car.isAvailable) {
      return res.status(400).json({ success: false, message: "Car is not available" });
    }

    const start = new Date(rentalStartDate);
    const end = new Date(rentalEndDate);
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pick-up date",
      });
    }

    car.isAvailable = false;
    car.currentRenter = userId;
    car.rentalStartDate = start;
    car.rentalEndDate = end;
    await car.save();

    res.status(200).json({ success: true, message: "Car booked successfully", car });
  } catch (error) {
    console.error("POST /cars/:id/rent error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const returnCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.isAvailable) {
      return res.status(400).json({ success: false, message: "Car is not rented" });
    }

    car.isAvailable = true;
    car.currentRenter = null;
    car.rentalStartDate = null;
    car.rentalEndDate = null;
    await car.save();

    res.status(200).json({ success: true, message: "Car returned", car });
  } catch (error) {
    console.error("POST /cars/:id/return error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCarbyAdmin = async (req, res) => {
  try {
    if (req.userId !== req.params.adminId && req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized admin car access" });
    }

    const cars = await Car.find({ uploadedBy: req.params.adminId }).sort({ createdAt: -1 });
    const carsWithPromos = await enrichCarsWithActivePromos(cars);
    res.status(200).json({ success: true, cars: carsWithPromos });
  } catch (error) {
    console.error("GET /cars/admin/:adminId error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const Settings = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE account via car settings route error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
