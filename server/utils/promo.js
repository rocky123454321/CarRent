import { Promo } from "../models/promo.model.js";

const toPlainObject = (value) =>
  typeof value?.toObject === "function" ? value.toObject() : { ...value };

export const calculateDiscountedPrice = (price, discount) => {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discount || 0);
  const discounted = numericPrice - (numericPrice * numericDiscount) / 100;
  return Math.max(0, Math.round((discounted + Number.EPSILON) * 100) / 100);
};

export const getPromoStatus = (promo, currentDate = new Date()) => {
  if (!promo?.startDate || !promo?.endDate) return "invalid";

  const now = new Date(currentDate);
  const startDate = new Date(promo.startDate);
  const endDate = new Date(promo.endDate);

  if (now < startDate) return "upcoming";
  if (now > endDate) return "expired";
  return "active";
};

export const serializePromo = (promo, carOverride = null, currentDate = new Date()) => {
  if (!promo) return null;

  const promoObject = toPlainObject(promo);
  const resolvedCar = carOverride || promoObject.carId || null;
  const resolvedCarId =
    resolvedCar?._id?.toString?.() ||
    promoObject.carId?._id?.toString?.() ||
    promoObject.carId?.toString?.() ||
    null;
  const basePrice = Number(resolvedCar?.pricePerDay || 0);
  const discountedPrice = basePrice
    ? calculateDiscountedPrice(basePrice, promoObject.discount)
    : null;

  return {
    _id: promoObject._id?.toString?.() || promoObject._id,
    carId: resolvedCarId,
    title: promoObject.title,
    discount: Number(promoObject.discount),
    startDate: promoObject.startDate,
    endDate: promoObject.endDate,
    discountedPrice,
    status: getPromoStatus(promoObject, currentDate),
    createdBy: promoObject.createdBy,
    car:
      resolvedCar && resolvedCar.brand
        ? {
            _id: resolvedCar._id,
            brand: resolvedCar.brand,
            model: resolvedCar.model,
            year: resolvedCar.year,
            color: resolvedCar.color,
            pricePerDay: resolvedCar.pricePerDay,
            isAvailable: resolvedCar.isAvailable,
            image: resolvedCar.image,
            transmission: resolvedCar.transmission,
            fuelType: resolvedCar.fuelType,
            mileage: resolvedCar.mileage,
          }
        : null,
  };
};

export const applyPromoToCar = (car, promo, currentDate = new Date()) => {
  const carObject = toPlainObject(car);
  const serializedPromo = promo ? serializePromo(promo, carObject, currentDate) : null;
  const isActivePromo = serializedPromo?.status === "active";

  return {
    ...carObject,
    activePromo: isActivePromo ? serializedPromo : null,
    promoId: isActivePromo ? serializedPromo._id : null,
    promoDiscount: isActivePromo ? serializedPromo.discount : null,
    discountedPrice: isActivePromo ? serializedPromo.discountedPrice : null,
    isPromo: isActivePromo,
    promoPrice: isActivePromo ? serializedPromo.discountedPrice : null,
    promoLabel: isActivePromo ? serializedPromo.title : null,
    promoStartDate: isActivePromo ? serializedPromo.startDate : null,
    promoExpiry: isActivePromo ? serializedPromo.endDate : null,
  };
};

export const enrichCarsWithActivePromos = async (cars, currentDate = new Date()) => {
  if (!Array.isArray(cars) || cars.length === 0) return [];

  const carIds = cars
    .map((car) => car?._id)
    .filter(Boolean)
    .map((id) => id.toString());

  if (carIds.length === 0) return cars.map((car) => applyPromoToCar(car, null, currentDate));

  const activePromos = await Promo.find({
    carId: { $in: carIds },
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  }).sort({ startDate: -1, createdAt: -1 });

  const activePromoMap = new Map();
  activePromos.forEach((promo) => {
    const key = promo.carId?.toString();
    if (key && !activePromoMap.has(key)) {
      activePromoMap.set(key, promo);
    }
  });

  return cars.map((car) =>
    applyPromoToCar(car, activePromoMap.get(car._id?.toString()), currentDate)
  );
};
