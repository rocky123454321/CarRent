import { Rental } from '../models/rental.model.js';
import { Car } from '../models/cars.model.js';
import { User } from '../models/user.model.js';
import { emitToAdmins, emitToUser } from '../socket.js';

export const rentCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const { rentalStartDate, rentalEndDate, personalDetails, totalPrice: clientPrice } = req.body;
    const userId = req.userId;

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

    const diffTime = Math.abs(end - start);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const finalPrice = clientPrice || (days * car.pricePerDay);

    const rental = new Rental({
      user: userId,
      car:  carId,
      rentalStartDate: start,
      rentalEndDate:   end,
      personalDetails,
      totalPrice: finalPrice,
    });

    await rental.save();

    car.isAvailable = false;
    car.currentRenter = userId;
    car.rentalStartDate = start;
    car.rentalEndDate = end;
    await car.save();

    await rental.populate('car', 'brand model pricePerDay licensePlate');

    // Fetch renter info for notification
    const renter = await User.findById(userId).select('name email').lean();

    // ── Emit new-booking notification to all admins ──
    emitToAdmins('new-booking', {
      rentalId:        rental._id.toString(),
      userId:          userId.toString(),
      userName:        renter?.name || 'Unknown',
      userEmail:       renter?.email || '',
      carBrand:        rental.car?.brand,
      carModel:        rental.car?.model,
      licensePlate:    rental.car?.licensePlate,
      totalPrice:      finalPrice,
      rentalStartDate: start.toISOString(),
      rentalEndDate:   end.toISOString(),
      status:          'pending',
      timestamp:       new Date().toISOString(),
    });

    res.json({ success: true, rental });
  } catch (err) {
    console.error('Rent error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserRentals = async (req, res) => {
  try {
    const userId = req.userId;
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
    const userId = req.userId;

    const rental = await Rental.findById(id).populate('car').populate('user', 'name email');
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });

    const isOwner  = rental.car.uploadedBy.toString() === userId;
    const isRenter = rental.user._id.toString() === userId;

    if (isOwner) {
      rental.status = status;
    } else if (isRenter) {
      if (status !== 'cancelled') {
        return res.status(403).json({ success: false, message: 'You can only cancel your own rental' });
      }
      rental.status = 'cancelled';
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    if (['cancelled', 'completed'].includes(status)) {
      await Car.findByIdAndUpdate(rental.car._id, {
        isAvailable: true,
        currentRenter: null,
      });
    }

    await rental.save();

    // ── Emit booking-status-update to the renter (user) ──
    emitToUser(rental.user._id, 'booking-status-update', {
      rentalId:  rental._id.toString(),
      status,
      carBrand:  rental.car?.brand,
      carModel:  rental.car?.model,
      timestamp: new Date().toISOString(),
    });

    // ── Also emit to admins so their booking list updates live ──
    emitToAdmins('booking-status-update', {
      rentalId:  rental._id.toString(),
      status,
      userId:    rental.user._id.toString(),
      userName:  rental.user?.name,
      carBrand:  rental.car?.brand,
      carModel:  rental.car?.model,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental record not found' });
    }

    if (rental.status !== 'completed' && rental.status !== 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot delete an active rental' });
    }

    await Rental.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};