import { Rating } from "../models/review.model.js";
import { Car } from "../models/cars.model.js";

// POST - Add a rating
export const addRating = async (req, res) => {
  try {
    const { carId, rating, review } = req.body;
    const userId = req.user._id;


    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

   
    const existing = await Rating.findOne({ car: carId, user: userId });
    if (existing) return res.status(400).json({ message: "Already rated this car" });

    const newRating = await Rating.create({
      car: carId,
      user: userId,
      rating,
      review,
    });

    res.status(201).json({ message: "Rating added", data: newRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCarRatings = async (req, res) => {
  try {
    const { carId } = req.params;

    const ratings = await Rating.find({ car: carId })
      .populate("car", "brand model year")   // ← pulls car details
      .populate("user", "name email");        // ← pulls user details

    res.status(200).json({ data: ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};