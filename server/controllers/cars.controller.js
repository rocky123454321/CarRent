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
      isPromo, promoPrice, promoLabel, promoSeason, promoExpiry
    } = req.body;

    if (!brand || !model || !year || !pricePerDay || !licensePlate || !uploadedBy) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const car = await Car.create({
      brand, model, year, color, pricePerDay, mileage, fuelType, transmission,
      licensePlate, uploadedBy,
      isAvailable: isAvailable ?? true,
      image: req.file?.path || "",
      imageId: req.file?.filename || "",
      currentRenter: null,
      rentalStartDate: null,
      rentalEndDate: null,
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
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    // I-extract lahat ng fields mula sa body maliban sa image fields
    const { image, imageId, ...otherData } = req.body;

    const updateData = {
      ...otherData,
      isPromo: req.body.isPromo === "true" || req.body.isPromo === true,
      promoPrice: req.body.promoPrice ? Number(req.body.promoPrice) : null,
    };

    // LOGIC CHECK: Dito natin malalaman kung pumasok ang file
    if (req.file) {
      console.log("New file detected:", req.file.path);
      
      // I-delete ang lumang image sa Cloudinary kung may bago
      if (car.imageId) {
        await cloudinary.uploader.destroy(car.imageId);
      }
      
      // I-set ang bagong image details
      updateData.image = req.file.path;
      updateData.imageId = req.file.filename;
    } else {
      console.log("No new file, keeping old image.");
      // IMPORTANT: Huwag maglagay ng updateData.image dito para hindi ma-overwrite ang luma
    }

    const updated = await Car.findByIdAndUpdate(
      carId,
      { $set: updateData },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, car: updated });
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
    const today = new Date();

    const cars = await Car.find()
      .populate('uploadedBy', 'name email profileImage')
      .sort({ createdAt: -1 });

    // I-map ang results para i-check ang expiry on the fly
    const updatedCars = cars.map(car => {
      const carObj = car.toObject();
      
      // Kung ang promo ay expired na, i-force natin ang isPromo sa false sa response
      if (carObj.isPromo && carObj.promoExpiry && new Date(carObj.promoExpiry) < today) {
        carObj.isPromo = false;
      }
      
      return carObj;
    });

    res.json(updatedCars);
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

// ✅ DELETE USER ACCOUNT
export const Settings = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ EXPIRE PROMO (manual force-expire by admin)
export const expirePromo = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (!car.isPromo) {
      return res.status(400).json({ success: false, message: "This car has no active promo." });
    }

    await Car.findByIdAndUpdate(req.params.id, {
      $set: {
        isPromo: false,
        promoPrice: null,
        promoLabel: null,
        promoSeason: null,
        promoExpiry: null,
      },
    });

    res.status(200).json({ success: true, message: "Promo expired. Car reset to normal listing." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};