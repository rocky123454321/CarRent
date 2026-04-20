import { Car } from '../models/cars.model.js';
import { User } from '../models/user.model.js';
import { cloudinary } from '../config/cloudinary.js';

const getUploadedFiles = (req) => {
  if (req.files) {
    const mainFile = req.files.image?.[0] || null;
    const extraFiles = req.files.images || [];
    return [mainFile, ...extraFiles].filter(Boolean).slice(0, 3);
  }

  return req.file ? [req.file] : [];
};

const normalizeCarImages = (carDoc) => {
  const car = typeof carDoc?.toObject === 'function' ? carDoc.toObject() : { ...carDoc };
  const storedImages = Array.isArray(car.images) ? car.images.filter(Boolean) : [];
  const mainImage = car.image || storedImages[0] || '';
  const images = [mainImage, ...storedImages.filter((img) => img && img !== mainImage)].slice(0, 3);

  return {
    ...car,
    image: mainImage,
    images,
  };
};

const destroyCloudinaryAssets = async (publicIds = []) => {
  const uniqueIds = [...new Set(publicIds.filter(Boolean))];
  await Promise.all(uniqueIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
};

export const addCar = async (req, res) => {
  try {
    const {
      brand, model, year, color, pricePerDay,
      uploadedBy, mileage, fuelType, transmission,
      licensePlate, isAvailable,
      isPromo, promoPrice, promoLabel, promoSeason, promoExpiry
    } = req.body;

    if (!brand || !model || !year || !pricePerDay || !licensePlate || !uploadedBy) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const uploadedFiles = getUploadedFiles(req);
    const imageUrls = uploadedFiles.map((file) => file.path);
    const imageIds = uploadedFiles.map((file) => file.filename);

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
      image: imageUrls[0] || '',
      images: imageUrls,
      imageId: imageIds[0] || '',
      imageIds,
      currentRenter: null,
      rentalStartDate: null,
      rentalEndDate: null,
      isPromo: isPromo === 'true' || isPromo === true,
      promoPrice: promoPrice ? Number(promoPrice) : null,
      promoLabel: promoLabel || null,
      promoSeason: (promoSeason === '' || promoSeason === 'null') ? null : promoSeason,
      promoExpiry: promoExpiry || null,
    });

    res.status(201).json({ success: true, message: 'Car added successfully', car: normalizeCarImages(car) });
  } catch (err) {
    console.error('ADD CAR ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

    const { image, images, imageId, imageIds, ...otherData } = req.body;

    const updateData = {
      ...otherData,
      isPromo: req.body.isPromo === 'true' || req.body.isPromo === true,
      promoPrice: req.body.promoPrice ? Number(req.body.promoPrice) : null,
    };

    if (req.file) {
      if (car.imageId) {
        await cloudinary.uploader.destroy(car.imageId);
      }

      const existingImages = Array.isArray(car.images) ? [...car.images] : [];
      const existingImageIds = Array.isArray(car.imageIds) ? [...car.imageIds] : [];

      existingImages[0] = req.file.path;
      existingImageIds[0] = req.file.filename;

      updateData.image = req.file.path;
      updateData.images = existingImages.filter(Boolean).slice(0, 3);
      updateData.imageId = req.file.filename;
      updateData.imageIds = existingImageIds.filter(Boolean).slice(0, 3);
    }

    const updated = await Car.findByIdAndUpdate(
      carId,
      { $set: updateData },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, car: normalizeCarImages(updated) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

    await destroyCloudinaryAssets([...(car.imageIds || []), car.imageId]);

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const today = new Date();

    const cars = await Car.find()
      .populate('uploadedBy', 'name email profileImage')
      .sort({ createdAt: -1 });

    const updatedCars = cars.map((car) => {
      const carObj = normalizeCarImages(car);

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

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('uploadedBy', 'name email profileImage');

    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(normalizeCarImages(car));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rentCar = async (req, res) => {
  try {
    const { userId, rentalStartDate, rentalEndDate } = req.body;
    if (!userId || !rentalStartDate || !rentalEndDate) {
      return res.status(400).json({ message: 'userId, rentalStartDate, and rentalEndDate are required' });
    }

    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (!car.isAvailable) return res.status(400).json({ message: 'Car is currently not available' });

    const start = new Date(rentalStartDate);
    const end = new Date(rentalEndDate);
    if (end <= start) return res.status(400).json({ message: 'Return date must be after pick-up date' });

    car.isAvailable = false;
    car.currentRenter = userId;
    car.rentalStartDate = start;
    car.rentalEndDate = end;
    await car.save();

    res.status(200).json({ success: true, message: 'Car booked successfully', car: normalizeCarImages(car) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const returnCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.isAvailable) return res.status(400).json({ message: 'Car is not currently rented' });

    car.isAvailable = true;
    car.currentRenter = null;
    car.rentalStartDate = null;
    car.rentalEndDate = null;
    await car.save();

    res.json({ success: true, message: 'Car returned successfully', car: normalizeCarImages(car) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCarbyAdmin = async (req, res) => {
  try {
    const cars = await Car.find({ uploadedBy: req.params.adminId });
    res.status(200).json({ success: true, cars: cars.map(normalizeCarImages) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const Settings = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const expirePromo = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

    if (!car.isPromo) {
      return res.status(400).json({ success: false, message: 'This car has no active promo.' });
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

    res.status(200).json({ success: true, message: 'Promo expired. Car reset to normal listing.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
