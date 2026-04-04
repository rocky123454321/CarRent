import { Rental } from '../models/rental.model.js';
import { Car } from '../models/cars.model.js';
import { User } from '../models/user.model.js';

export const rentCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const { rentalStartDate, rentalEndDate, personalDetails } = req.body;
    const userId = req.userId; // ✅ set by verifyToken middleware

    if (!rentalStartDate || !rentalEndDate || !personalDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const start = new Date(rentalStartDate);
    const end   = new Date(rentalEndDate);

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const car = await Car.findById(carId);
    if (!car || !car.isAvailable) {
      return res.status(400).json({ message: 'Car not available' });
    }

    const days       = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const rental = new Rental({
      user: userId,
      car:  carId,
      rentalStartDate: start,
      rentalEndDate:   end,
      personalDetails,
      totalPrice,
    });
    await rental.save();

    car.isAvailable    = false;
    car.currentRenter  = userId;
    car.rentalStartDate = start;
    car.rentalEndDate   = end;
    await car.save();

    await rental.populate('car', 'brand model pricePerDay licensePlate');
    res.json({ success: true, rental });
  } catch (err) {
    console.error('Rent error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserRentals = async (req, res) => {
  try {
    const userId = req.userId; // ✅ set by verifyToken middleware
    const rentals = await Rental.find({ user: userId })
      .populate('car', 'brand model pricePerDay licensePlate uploadedBy')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: rentals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminGetAllRentals = async (req, res) => {
  try {
    const userId = req.userId;
    const user   = await User.findById(userId);

    if (!user || user.role !== 'renter') {
      return res.status(403).json({ message: 'Renter access only' });
    }

    const rentals = await Rental.find({ car: { $in: await Car.distinct('_id', { uploadedBy: user._id }) } })
      .populate('user', 'name email phone')
      .populate('car', 'brand model licensePlate pricePerDay uploadedBy')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: rentals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId; // Galing sa verifyToken

    const rental = await Rental.findById(id).populate('car');
    if (!rental) return res.status(404).json({ success: false, message: "Rental not found" });

    // --- SMART SECURITY CHECK ---
    
    const isOwner = rental.car.uploadedBy.toString() === userId;
    const isRenter = rental.user.toString() === userId;

    if (isOwner) {
      // ADMIN/OWNER LOGIC: Pwedeng mag-approve, reject, o complete
      rental.status = status;
    } else if (isRenter) {
      // USER LOGIC: Pwedeng mag-cancel lang
      if (status !== 'cancelled') {
        return res.status(403).json({ success: false, message: "You can only cancel your own rental" });
      }
      rental.status = 'cancelled';
    } else {
      // STRANGER: Walang kinalaman sa rental
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    // --- AUTO-UPDATE CAR AVAILABILITY ---
    // Kung kinansela o natapos na, gawing available ulit ang kotse
    if (['cancelled', 'completed'].includes(status)) {
      await Car.findByIdAndUpdate(rental.car._id, { 
        isAvailable: true, 
        currentRenter: null 
      });
    }

    await rental.save();
    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: rental });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// controllers/rental.controller.js

export const deleteRental = async (req, res) => {
  try {
    const { id } = req.params; // Kinukuha ang :id mula sa route
    
    // Hanapin at i-delete (Siguraduhin na ang User ID ay tugma para sa security)
    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({ success: false, message: "Rental record not found" });
    }

    // Security: Only allow delete if status is completed or cancelled
    if (rental.status !== 'completed' && rental.status !== 'cancelled') {
      return res.status(400).json({ success: false, message: "Cannot delete an active rental" });
    }

    await Rental.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Rental deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};