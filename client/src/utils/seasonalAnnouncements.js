// src/utils/seasonalAnnouncements.js
import { Star, Gift, Megaphone, AlertCircle } from 'lucide-react';

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

  if (check(1, 1, 1, 1))   announcements.push({ id: 'newyear-day', type: 'promo', icon: Star, title: '🎆 Happy New Year!', desc: 'Start the year on the road — 20% off all rentals today only!', color: 'bg-violet-600', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-500' });
  if (check(12, 26, 1, 3))  announcements.push({ id: 'newyear-season', type: 'promo', icon: Gift, title: '🎁 New Year Season Deals!', desc: 'Special rental rates Dec 26–Jan 3.', color: 'bg-indigo-600', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-500' });
  if (check(2, 1, 2, 6))    announcements.push({ id: 'valentines-early', type: 'notice', icon: Megaphone, title: '💘 Valentine\'s Coming! Book Early', desc: 'Secure your romantic ride before Feb 14. Slots are limited!', color: 'bg-rose-500', textColor: 'text-white', subColor: 'text-rose-100', tagBg: 'bg-rose-400' });
  if (check(2, 7, 2, 14))   announcements.push({ id: 'valentines', type: 'promo', icon: Gift, title: "💝 Valentine's Week Special!", desc: 'Romantic ride packages available Feb 7–14.', color: 'bg-pink-500', textColor: 'text-white', subColor: 'text-pink-100', tagBg: 'bg-pink-400' });
  if (check(3, 1, 3, 14))   announcements.push({ id: 'summer-early', type: 'notice', icon: Megaphone, title: '🌸 Summer is Coming — Plan Ahead!', desc: 'Book your summer road trip car now before slots fill up.', color: 'bg-amber-500', textColor: 'text-white', subColor: 'text-amber-100', tagBg: 'bg-amber-400' });
  if (check(3, 15, 5, 31))  announcements.push({ id: 'summer', type: 'promo', icon: Star, title: '☀️ Summer Road Trip Promo!', desc: 'Get 15% off SUVs and vans this summer season.', color: 'bg-yellow-500', textColor: 'text-white', subColor: 'text-yellow-100', tagBg: 'bg-yellow-400' });
  if (check(3, 25, 4, 1))   announcements.push({ id: 'holyweek-early', type: 'notice', icon: AlertCircle, title: '✝️ Holy Week is Near — Book Now!', desc: 'Limited cars for Holy Week. Reserve yours before it\'s too late.', color: 'bg-yellow-600', textColor: 'text-white', subColor: 'text-yellow-100', tagBg: 'bg-yellow-500' });
  if (check(4, 2, 4, 6))    announcements.push({ id: 'holyweek', type: 'notice', icon: Megaphone, title: '✝️ Holy Week Notice', desc: 'Some lots may have reduced hours Apr 2–6.', color: 'bg-stone-600', textColor: 'text-white', subColor: 'text-stone-200', tagBg: 'bg-stone-500' });
  if (check(4, 9, 4, 9))    announcements.push({ id: 'easter', type: 'promo', icon: Gift, title: '🐣 Happy Easter! Special Rates Today', desc: '10% off all bookings this Easter Sunday.', color: 'bg-green-500', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-400' });
  if (check(5, 1, 5, 1))    announcements.push({ id: 'laborday', type: 'promo', icon: Star, title: '👷 Happy Labor Day!', desc: '12% off all rentals today in honor of every worker.', color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600' });
  if (check(6, 12, 6, 12))  announcements.push({ id: 'indyday', type: 'promo', icon: Star, title: '🇵🇭 Happy Independence Day!', desc: 'Mabuhay! Special rates for all Filipinos today, June 12.', color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600' });
  if (check(6, 15, 9, 30))  announcements.push({ id: 'rainy', type: 'notice', icon: AlertCircle, title: '🌧️ Rainy Season Advisory', desc: '4WD and SUV units recommended this rainy season. Stay safe!', color: 'bg-slate-600', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-500' });
  if (check(8, 25, 8, 31))  announcements.push({ id: 'heroesday', type: 'promo', icon: Star, title: '🦸 National Heroes Day Promo!', desc: '10% off all bookings this week in honor of our heroes.', color: 'bg-red-700', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-600' });
  if (check(9, 9, 9, 9))    announcements.push({ id: '99sale', type: 'promo', icon: Gift, title: '🛍️ 9.9 MEGA SALE!', desc: 'Today only — up to 25% off on all car rentals!', color: 'bg-blue-600', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-500' });
  if (check(10, 1, 10, 20)) announcements.push({ id: 'halloween-early', type: 'notice', icon: AlertCircle, title: '🎃 Spooky Season is Here!', desc: '10% off all bookings this October. Book your Halloween ride!', color: 'bg-orange-500', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-400' });
  if (check(10, 21, 10, 31))announcements.push({ id: 'halloween', type: 'promo', icon: AlertCircle, title: '👻 Halloween is Almost Here!', desc: 'Last chance for October discount. Trick or treat rides available!', color: 'bg-orange-600', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-500' });
  if (check(10, 31, 11, 2)) announcements.push({ id: 'undas', type: 'notice', icon: Megaphone, title: '💀 Undas Travel Advisory', desc: 'Heading to the province? Book early — heavy traffic expected.', color: 'bg-gray-700', textColor: 'text-white', subColor: 'text-gray-300', tagBg: 'bg-gray-600' });
  if (check(11, 11, 11, 11))announcements.push({ id: '1111sale', type: 'promo', icon: Gift, title: '🛍️ 11.11 SALE — Up to 30% Off!', desc: 'Biggest single-day sale of the year on all car rentals!', color: 'bg-violet-600', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-500' });
  if (check(11, 15, 11, 30))announcements.push({ id: 'ber-season', type: 'notice', icon: Megaphone, title: '🎅 -Ber Season is ON!', desc: 'The most wonderful time of the year — early Christmas deals are here!', color: 'bg-green-600', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-500' });
  if (check(12, 1, 12, 11)) announcements.push({ id: 'christmas-early', type: 'promo', icon: Gift, title: '🎄 Christmas Season is Here!', desc: 'Early Christmas rates — book now before the holiday rush!', color: 'bg-red-500', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-400' });
  if (check(12, 12, 12, 12))announcements.push({ id: '1212sale', type: 'promo', icon: Gift, title: '🛍️ 12.12 SALE — Up to 25% Off!', desc: 'One day only! Biggest Christmas sale on all car rentals.', color: 'bg-blue-600', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-500' });
  if (check(12, 13, 12, 25))announcements.push({ id: 'christmas', type: 'promo', icon: Gift, title: '🎄 Merry Christmas! 20% Off!', desc: 'Book any car Dec 24–25 and get 20% off. Happy holidays!', color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500' });

  // ── Always visible fallback ──
  announcements.push({
    id: 'default', type: 'notice', icon: Megaphone,
    title: '🚗 New EV Units Available!',
    desc: 'Tesla Model 3 and BYD Atto 3 now in Lot B. Book yours today.',
    color: 'bg-slate-700', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-600',
  });

  return announcements;
};