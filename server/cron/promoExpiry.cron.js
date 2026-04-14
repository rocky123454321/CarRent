import cron from "node-cron";
import { Car } from "../models/cars.model.js";

export const startPromoExpiryCron = () => {
  
  // --- 1. PROMO EXPIRY CHECK ---
  // Tumatakbo tuwing 12:00 AM para i-check kung tapos na ang promo period
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const result = await Car.updateMany(
        { 
          isPromo: true, 
          promoExpiry: { $lte: now } // Kung ang expiry date ay nakalipas na o ngayon na
        },
        { 
          $set: { 
            isPromo: false, 
            promoPrice: null, 
            promoExpiry: null 
          } 
        }
      );

    } catch (err) {
      console.error("[Promo Cron] ❌ Error:", err.message);
    }
  });

  // --- 2. 24-HOUR ROLLING FLASH DEALS ---
  // Dito mangyayari yung rotation ng "Top 7 Selected Cars" every midnight
  cron.schedule("0 0 * * *", async () => {
    try {
     
      // Step A: I-reset lahat ng Flash Deals (Para malinis ang slate bago pumili ng bago)
      await Car.updateMany({}, { 
        $set: { 
          "flashDeal.isActive": false 
        } 
      });

      // Step B: Kumuha ng 7 random na available cars
      const availableCars = await Car.find({ isAvailable: true });

      if (availableCars.length > 0) {
        // Shuffle at kumuha lang ng 7 cars
        const selected = availableCars
          .sort(() => 0.5 - Math.random())
          .slice(0, 7); 

        const updatePromises = selected.map(car => {
          return Car.findByIdAndUpdate(car._id, {
            $set: {
              "flashDeal.isActive": true,
              "flashDeal.discountedPrice": Math.round(car.pricePerDay * 0.85), // Ginawa nating 15% OFF para mas solid
              "flashDeal.lastSelected": new Date()
            }
          });
        });

        await Promise.all(updatePromises);
   
      }
    } catch (err) {
      console.error("[Flash Deal Error]:", err.message);
    }
  });

 
};