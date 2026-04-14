// ─────────────────────────────────────────────────────────────────────────────
// flashDeal.js
// Single source of truth para sa Flash Deal logic.
// I-import lang ito sa kahit saang component na kailangan ng flash deal data.
// Pag gusto mong baguhin ang discounts, dito lang sa file na ito baguhin.
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Baguhin ang array na ito para mag-iba ang possible discounts
export const FLASH_DISCOUNT_OPTIONS = [5, 8, 10, 12, 15, 20];

/**
 * Returns today's seeded flash deal data.
 * Same result for all users buong araw. Changes every midnight.
 *
 * @param {Array} cars - array of car objects from store
 * @returns {{ discountPercent: number, dailyDeals: Array, multiplier: number }}
 */
export const getFlashDealData = (cars = []) => {
  if (!cars || cars.length === 0) {
    return { discountPercent: 10, multiplier: 0.9, dailyDeals: [] };
  }

  // Seed = today's date string e.g. "2025-04-14"
  // Nagbabago every midnight — lahat ng users same result buong araw
  const today = new Date().toISOString().slice(0, 10);
  let seed = 0;
  for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);

  // Deterministic shuffle — same seed = same order
  const shuffle = (arr, s) => {
    const a = [...arr];
    let m = a.length, t, idx;
    while (m) {
      idx = Math.floor(Math.abs(Math.sin(s++)) * m--);
      t = a[m]; a[m] = a[idx]; a[idx] = t;
    }
    return a;
  };

  // Pick today's discount from the options list
  const discountIdx     = Math.floor(Math.abs(Math.sin(seed * 7)) * FLASH_DISCOUNT_OPTIONS.length);
  const discountPercent = FLASH_DISCOUNT_OPTIONS[discountIdx];
  const multiplier      = (100 - discountPercent) / 100;

  // Pick 3–8 random available cars
  const available = cars.filter(c => c.isAvailable);
  const shuffled  = shuffle(available, seed);
  const count     = Math.floor(Math.abs(Math.cos(seed)) * 6) + 3;
  const dailyDeals = shuffled.slice(0, count);

  return { discountPercent, multiplier, dailyDeals };
};

/**
 * Compute the flash price for a single car using today's discount.
 *
 * @param {number} pricePerDay
 * @param {number} [discountPercent] - optional override, defaults to today's seeded value
 * @returns {number} flash price
 */
export const getFlashPrice = (pricePerDay, discountPercent) => {
  const pct = discountPercent ?? getFlashDealData([]).discountPercent;
  return Math.round(pricePerDay * ((100 - pct) / 100));
};

/**
 * Savings amount for display (e.g. "Save ₱500 today")
 */
export const getFlashSavings = (pricePerDay, discountPercent) => {
  return pricePerDay - getFlashPrice(pricePerDay, discountPercent);
};