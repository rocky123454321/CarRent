import { Car } from '../models/cars.model.js';

// Add new car (Admin)
export const addCar = async (req, res) => {
  const { brand, model, year, color, pricePerDay, uploadedBy, mileage, fuelType, transmission, licensePlate } = req.body;

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
      isAvailable: true,
      currentRenter: null,
      rentalStartDate: null,
      rentalEndDate: null
    });


    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update car






export const updateCar = async (req, res) => {
  try {
    
    const carId = req.params.id;

   
    if (!carId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Car ID" });
    }

    
    const car = await Car.findByIdAndUpdate(carId, req.body, { new: true });

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// Delete car
export const deleteCar = async (req, res) => {
  try {
 
   
    const car = await Car.findByIdAndDelete(req.params.id)

    if (!car){
       return res.status(404).json({ success: false, message: "Car not found" });
    }
       res.status(200).json({
      success: true,
      message: "Car delete successfully",
      car
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rent a car
export const rentCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || !car.isAvailable) return res.status(400).json({ message: "Car not available" });

    car.isAvailable = false;
    car.currentRenter = req.body.userId || "Guest"; // simple testing
    car.rentalStartDate = new Date();
    car.rentalEndDate = new Date(Date.now() + 24*60*60*1000); // 1 day rental
    await car.save();

    res.json({ message: "Car rented", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Return a car
export const returnCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.isAvailable) return res.status(400).json({ message: "Car is not rented" });

    car.isAvailable = true;
    car.currentRenter = null;
    car.rentalStartDate = null;
    car.rentalEndDate = null;
    await car.save();

    res.json({ message: "Car returned", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};