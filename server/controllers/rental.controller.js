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

    const rentals = await Rental.find()
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
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'renter') {
      return res.status(403).json({ message: 'Renter access only' });
    }

    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    rental.status = status;
    await rental.save();

    if (status === 'completed' || status === 'cancelled') {
      const car = await Car.findById(rental.car);
      if (car) {
        car.isAvailable    = true;
        car.currentRenter  = null;
        car.rentalStartDate = null;
        car.rentalEndDate   = null;
        await car.save();
      }
    }

    res.json({ success: true, rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};