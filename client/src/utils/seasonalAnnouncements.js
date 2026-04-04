import { Star, Gift, Megaphone, AlertCircle, ShoppingBag, Heart, Coffee } from 'lucide-react';

const isWithin = (month, day, startMonth, startDay, endMonth, endDay) => {
  const current = month * 100 + day;
  const start   = startMonth * 100 + startDay;
  const end     = endMonth * 100 + endDay;
  if (start <= end) return current >= start && current <= end;
  return current >= start || current <= end;
};

export const getSeasonalAnnouncements = () => {
  const now   = new Date();
  const month = now.getMonth() + 1;
  const day   = now.getDate();
  const check = (sm, sd, em, ed) => isWithin(month, day, sm, sd, em, ed);

  const announcements = [];

  // --- NEW YEAR ---
  if (check(1, 1, 1, 1)) announcements.push({ id: 'newyear-day', type: 'promo', icon: Star, title: '🎆 Happy New Year!', desc: 'Start 2026 on the road — 20% off all rentals today!', color: 'bg-violet-600', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-500' });
  
  // --- CHINESE NEW YEAR (Variable, but usually Jan/Feb - let's add a generic window) ---
  if (check(1, 25, 2, 5)) announcements.push({ id: 'cny', type: 'promo', icon: Gift, title: '🧧 Kung Hei Fat Choi!', desc: 'Lucky 8% discount on all sedan rentals this Lunar New Year.', color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500' });

  // --- VALENTINES ---
  if (check(2, 7, 2, 14)) announcements.push({ id: 'valentines', type: 'promo', icon: Heart, title: "💝 Valentine's Date Ride", desc: 'Impress your date! 15% off on Luxury & Premium cars.', color: 'bg-pink-500', textColor: 'text-white', subColor: 'text-pink-100', tagBg: 'bg-pink-400' });

  // --- GRADUATION SEASON (March-May) ---
  if (check(3, 20, 4, 10)) announcements.push({ id: 'grad-season', type: 'promo', icon: Star, title: '🎓 Graduation Blowout!', desc: 'Reward yourself! Special rates for new graduates this week.', color: 'bg-blue-800', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-700' });

  // --- SUMMER & HOLY WEEK ---
  if (check(3, 15, 5, 31)) announcements.push({ id: 'summer', type: 'promo', icon: Star, title: '☀️ Summer Getaway!', desc: 'Barkada roadtrip? 15% off on SUVs and Vans.', color: 'bg-amber-500', textColor: 'text-white', subColor: 'text-amber-100', tagBg: 'bg-amber-400' });
  
  // --- MOTHER'S & FATHER'S DAY ---
  if (check(5, 5, 5, 12)) announcements.push({ id: 'mothers-day', type: 'promo', icon: Gift, title: "👩 Happy Mother's Day!", desc: 'Treat Mom to a comfortable ride. 10% off family SUVs.', color: 'bg-rose-400', textColor: 'text-white', subColor: 'text-rose-500', tagBg: 'bg-rose-300' });
  if (check(6, 10, 6, 18)) announcements.push({ id: 'fathers-day', type: 'promo', icon: Coffee, title: "👨 Happy Father's Day!", desc: 'Let Dad drive his dream car. Special weekend discounts!', color: 'bg-blue-900', textColor: 'text-white', subColor: 'text-blue-200', tagBg: 'bg-blue-800' });

  // --- DOUBLE DIGIT SALES (MID YEAR) ---
  if (check(6, 6, 6, 6)) announcements.push({ id: '66sale', type: 'promo', icon: ShoppingBag, title: '🛍️ 6.6 MID-YEAR SALE', desc: 'Today only! Flat ₱666 off on 3-day bookings.', color: 'bg-orange-600', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-500' });
  if (check(7, 7, 7, 7)) announcements.push({ id: '77sale', type: 'promo', icon: ShoppingBag, title: '🛍️ 7.7 LUCKY SALE', desc: 'Flash Sale! 17% off all rentals booked today.', color: 'bg-emerald-600', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-500' });
  if (check(8, 8, 8, 8)) announcements.push({ id: '88sale', type: 'promo', icon: ShoppingBag, title: '🛍️ 8.8 MEGA SALE', desc: 'Giant discounts today! Up to 25% off on select units.', color: 'bg-cyan-600', textColor: 'text-white', subColor: 'text-cyan-100', tagBg: 'bg-cyan-500' });

  // --- BER MONTHS & PAYDAY ---
  if (check(9, 1, 9, 30)) announcements.push({ id: 'ber-kickoff', type: 'notice', icon: Megaphone, title: '🎶 Christmas is Near!', desc: 'The "Ber" months are here. Early holiday bookings now open.', color: 'bg-green-700', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-600' });
  
  // Payday Sale (End of Month)
  if (day >= 28 || day <= 2) announcements.push({ id: 'payday', type: 'promo', icon: Gift, title: '💸 PAYDAY PROMO', desc: 'Sweldo na! Treat yourself to a weekend drive with 10% off.', color: 'bg-indigo-700', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-600' });

  // --- THE BIG THREE SALES ---
  if (check(10, 10, 10, 10)) announcements.push({ id: '1010', type: 'promo', icon: ShoppingBag, title: '🎃 10.10 SPOOKY SALE', desc: 'No tricks, just treats! 20% off all rentals today.', color: 'bg-orange-700', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-600' });
  if (check(11, 11, 11, 11)) announcements.push({ id: '1111', type: 'promo', icon: ShoppingBag, title: '🔥 11.11 ULTIMATE SALE', desc: 'BIGGEST SALE! 30% discount for the first 11 bookings.', color: 'bg-red-700', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-600' });
  if (check(12, 12, 12, 12)) announcements.push({ id: '1212', type: 'promo', icon: ShoppingBag, title: '🎄 12.12 HOLIDAY SALE', desc: 'Last big sale of the year! 25% off on all car models.', color: 'bg-blue-600', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-500' });

  // --- CHRISTMAS PROPER ---
  if (check(12, 15, 12, 25)) announcements.push({ id: 'xmas', type: 'promo', icon: Gift, title: '🎄 Paskong Pinoy Promo', desc: 'Home for Christmas? Get a free gas voucher for 3+ day rentals.', color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500' });

  // --- FALLBACK ---
  if (announcements.length === 0) {
    announcements.push({
      id: 'default', type: 'notice', icon: Megaphone,
      title: '🚀 Drive in Style',
      desc: 'Check out our new 2026 SUV models. Perfect for family trips!',
      color: 'bg-slate-800', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-600',
    });
  }

  return announcements;
};