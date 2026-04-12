export const calculateDiscountedPrice = (price, discount) => {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discount || 0);
  const discounted = numericPrice - (numericPrice * numericDiscount) / 100;
  return Math.max(0, Math.round((discounted + Number.EPSILON) * 100) / 100);
};

export const getPromoStatus = (promo, currentDate = new Date()) => {
  if (!promo?.startDate || !promo?.endDate) return "inactive";

  const now = new Date(currentDate);
  const startDate = new Date(promo.startDate);
  const endDate = new Date(promo.endDate);

  if (now < startDate) return "upcoming";
  if (now > endDate) return "expired";
  return "active";
};

export const getActivePromo = (car, currentDate = new Date()) => {
  if (!car?.activePromo) return null;
  return getPromoStatus(car.activePromo, currentDate) === "active" ? car.activePromo : null;
};

export const getEffectivePricePerDay = (car) =>
  Number(getActivePromo(car)?.discountedPrice ?? car?.discountedPrice ?? car?.promoPrice ?? car?.pricePerDay ?? 0);

export const getSavingsAmount = (car) => {
  const originalPrice = Number(car?.pricePerDay || 0);
  const effectivePrice = getEffectivePricePerDay(car);
  if (!originalPrice || effectivePrice >= originalPrice) return 0;
  return Math.round((originalPrice - effectivePrice + Number.EPSILON) * 100) / 100;
};

export const getCountdownParts = (endDate, currentDate = new Date()) => {
  if (!endDate) {
    return { expired: true, totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = new Date(endDate).getTime() - new Date(currentDate).getTime();
  if (diff <= 0) {
    return { expired: true, totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    expired: false,
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const formatPromoCountdown = (endDate, currentDate = new Date()) => {
  const countdown = getCountdownParts(endDate, currentDate);
  if (countdown.expired) return "Expired";
  if (countdown.days > 0) return `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;
  if (countdown.hours > 0) return `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
  return `${countdown.minutes}m ${countdown.seconds}s`;
};

export const formatPeso = (value) => `₱${Number(value || 0).toLocaleString()}`;
