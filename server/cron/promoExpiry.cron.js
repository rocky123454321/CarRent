import cron from "node-cron";
import { Car } from "../models/cars.model.js";

/**
 * PROMO AUTO-EXPIRY CRON JOB
 * Runs every hour — finds all cars where:
 *   - isPromo is true
 *   - promoExpiry exists and is in the past
 * Then resets them back to a normal (non-promo) listing.
 */
export const startPromoExpiryCron = () => {
  // Runs every hour at :00
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

      const result = await Car.updateMany(
        {
          isPromo: true,
          promoExpiry: { $lte: now }, // expired promos only
        },
        {
          $set: {
            isPromo: false,
            promoPrice: null,
            promoLabel: null,
            promoSeason: null,
            promoExpiry: null,
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Promo Cron] ✅ Expired ${result.modifiedCount} promo(s) — reset to normal listing.`);
      }
    } catch (err) {
      console.error("[Promo Cron] ❌ Error expiring promos:", err.message);
    }
  });

  console.log("[Promo Cron] 🕐 Auto-expiry scheduler started (runs every hour).");
};