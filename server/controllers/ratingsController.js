import { Rating } from "../models/review.model.js";
import { Car } from "../models/cars.model.js";
import mongoose from "mongoose";

// POST - Add a rating (protected)
// POST - Add a rating
export const addRating = async (req, res) => {
  try {
    const { rating, review, carId } = req.body;
    const userId = req.user._id;

    if (!carId) return res.status(400).json({ message: "carId is required" });
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be 1-5" });

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const existing = await Rating.findOne({ car: carId, user: userId });
    if (existing) return res.status(400).json({ message: "You have already rated this car" });

    const newRating = await Rating.create({ car: carId, user: userId, rating, review: review || "" });

    // Update average rating
    const avgResult = await Rating.aggregate([
      { $match: { car: car._id } },
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);
    car.averageRating = avgResult[0]?.avg || 0;
    await car.save();

    const populatedRating = await Rating.findById(newRating._id).populate("user", "name email");
    res.status(201).json({ message: "Rating added successfully", data: populatedRating });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ratings for car with average and pagination
export const getCarRatings = async (req, res) => {
  try {
    const { carId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ message: "Invalid car id" });
    }
    const carObjectId = new mongoose.Types.ObjectId(carId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find({ car: carId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Rating.countDocuments({ car: carId });
    const avgRating = await Rating.aggregate([
      { $match: { car: carObjectId } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    res.status(200).json({ 
      data: ratings, 
      averageRating: avgRating[0]?.avg || 0,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
