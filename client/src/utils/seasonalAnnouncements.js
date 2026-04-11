import { Star, Gift, Megaphone, AlertCircle, ShoppingBag, Heart, Coffee, Zap, Truck, MapPin, Clock, Shield, Award, Percent, Calendar, Sun, CloudRain, Wind, Snowflake, Music, BookOpen, Briefcase, Home, Phone, Camera } from 'lucide-react';

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
  const hour  = now.getHours();
  const check = (sm, sd, em, ed) => isWithin(month, day, sm, sd, em, ed);

  const announcements = [];

  // ─── JANUARY ───────────────────────────────────────────────────────────────

  if (check(1, 1, 1, 1)) announcements.push({
    id: 'newyear-day', type: 'promo', icon: Star,
    title: 'Happy New Year',
    desc: 'Start the year on the road. 20% off all rentals today only.',
    color: 'bg-violet-600', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-500',
  });

  if (check(1, 2, 1, 7)) announcements.push({
    id: 'newyear-week', type: 'promo', icon: Percent,
    title: 'New Year Flash Week',
    desc: 'First week of the year, first big savings. 15% off on all bookings.',
    color: 'bg-violet-700', textColor: 'text-white', subColor: 'text-violet-200', tagBg: 'bg-violet-600',
  });

  if (check(1, 8, 1, 14)) announcements.push({
    id: 'jan-mid', type: 'notice', icon: Megaphone,
    title: 'Fleet Refreshed for 2026',
    desc: 'New vehicles just added to our lineup. Check out the latest models now.',
    color: 'bg-slate-700', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-600',
  });

  if (check(1, 15, 1, 24)) announcements.push({
    id: 'jan-staycation', type: 'promo', icon: MapPin,
    title: 'Staycation Escape',
    desc: 'Rent a car this long weekend and explore nearby provinces. Free toll sticker.',
    color: 'bg-teal-600', textColor: 'text-white', subColor: 'text-teal-100', tagBg: 'bg-teal-500',
  });

  if (check(1, 25, 2, 5)) announcements.push({
    id: 'cny', type: 'promo', icon: Gift,
    title: 'Kung Hei Fat Choi',
    desc: 'Lucky 8% discount on all sedan rentals this Lunar New Year.',
    color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500',
  });

  // ─── FEBRUARY ──────────────────────────────────────────────────────────────

  if (check(2, 1, 2, 6)) announcements.push({
    id: 'feb-kickoff', type: 'promo', icon: Heart,
    title: 'Love Month Begins',
    desc: 'February is here. Enjoy 10% off on all weekend rentals all month.',
    color: 'bg-pink-600', textColor: 'text-white', subColor: 'text-pink-100', tagBg: 'bg-pink-500',
  });

  if (check(2, 7, 2, 14)) announcements.push({
    id: 'valentines', type: 'promo', icon: Heart,
    title: "Valentine's Date Ride",
    desc: 'Impress your date. 15% off on Luxury and Premium cars this week.',
    color: 'bg-rose-500', textColor: 'text-white', subColor: 'text-rose-100', tagBg: 'bg-rose-400',
  });

  if (check(2, 14, 2, 14)) announcements.push({
    id: 'valentines-day', type: 'promo', icon: Heart,
    title: 'Today is the Day',
    desc: 'Book a car now and get a free couple photo voucher with your rental.',
    color: 'bg-red-500', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-400',
  });

  if (check(2, 15, 2, 28)) announcements.push({
    id: 'post-valentine', type: 'promo', icon: Percent,
    title: 'Post-Love Month Deals',
    desc: 'Valentine is over but the savings are not. 12% off until end of February.',
    color: 'bg-pink-700', textColor: 'text-white', subColor: 'text-pink-200', tagBg: 'bg-pink-600',
  });

  // ─── MARCH ─────────────────────────────────────────────────────────────────

  if (check(3, 1, 3, 10)) announcements.push({
    id: 'march-kickoff', type: 'notice', icon: Megaphone,
    title: 'March Into Savings',
    desc: 'New month, new deals. SUV and van rentals now available at reduced rates.',
    color: 'bg-green-700', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-600',
  });

  if (check(3, 8, 3, 8)) announcements.push({
    id: 'womens-day', type: 'promo', icon: Award,
    title: "Women's Day Special",
    desc: 'Celebrating every woman on the road. 10% off for female primary renters today.',
    color: 'bg-purple-600', textColor: 'text-white', subColor: 'text-purple-100', tagBg: 'bg-purple-500',
  });

  if (check(3, 15, 4, 10)) announcements.push({
    id: 'grad-season', type: 'promo', icon: Star,
    title: 'Graduation Blowout',
    desc: 'Reward yourself or your grad. Special rates for new graduates this season.',
    color: 'bg-blue-800', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-700',
  });

  if (check(3, 15, 5, 31)) announcements.push({
    id: 'summer', type: 'promo', icon: Sun,
    title: 'Summer Getaway',
    desc: 'Barkada roadtrip? 15% off on SUVs and Vans all summer long.',
    color: 'bg-amber-500', textColor: 'text-white', subColor: 'text-amber-100', tagBg: 'bg-amber-400',
  });

  if (check(3, 20, 3, 31)) announcements.push({
    id: 'holy-week-prep', type: 'notice', icon: Megaphone,
    title: 'Holy Week Booking Open',
    desc: 'Heading to the province? Reserve your car early before slots run out.',
    color: 'bg-stone-600', textColor: 'text-white', subColor: 'text-stone-200', tagBg: 'bg-stone-500',
  });

  // ─── APRIL ─────────────────────────────────────────────────────────────────

  if (check(4, 1, 4, 1)) announcements.push({
    id: 'april-fools', type: 'notice', icon: Zap,
    title: 'Not a Joke — Real Savings',
    desc: 'Yes it is April 1 and yes this deal is real. 10% off on all bookings today.',
    color: 'bg-yellow-500', textColor: 'text-white', subColor: 'text-yellow-100', tagBg: 'bg-yellow-400',
  });

  if (check(4, 5, 4, 15)) announcements.push({
    id: 'holy-week', type: 'promo', icon: MapPin,
    title: 'Holy Week Road Trip',
    desc: 'Travel safely this holiday season. Free GPS included on all 3-day rentals.',
    color: 'bg-stone-700', textColor: 'text-white', subColor: 'text-stone-200', tagBg: 'bg-stone-600',
  });

  if (check(4, 16, 4, 30)) announcements.push({
    id: 'post-holywk', type: 'promo', icon: Percent,
    title: 'After-Holiday Deals',
    desc: 'Back from the beach? Extend your vacation at 10% off for 2-day bookings.',
    color: 'bg-cyan-700', textColor: 'text-white', subColor: 'text-cyan-100', tagBg: 'bg-cyan-600',
  });

  // ─── MAY ───────────────────────────────────────────────────────────────────

  if (check(5, 1, 5, 1)) announcements.push({
    id: 'labor-day', type: 'promo', icon: Briefcase,
    title: "Labor Day Long Weekend",
    desc: "You've earned it. Book a car today and take the day off the right way.",
    color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600',
  });

  if (check(5, 5, 5, 12)) announcements.push({
    id: 'mothers-day', type: 'promo', icon: Gift,
    title: "Mothers Day Special",
    desc: 'Treat Mom to a comfortable ride. 10% off on family SUVs this week.',
    color: 'bg-rose-400', textColor: 'text-white', subColor: 'text-rose-100', tagBg: 'bg-rose-300',
  });

  if (check(5, 13, 5, 31)) announcements.push({
    id: 'may-endmonth', type: 'promo', icon: ShoppingBag,
    title: 'End of May Sale',
    desc: 'May is wrapping up. Get 10% off on bookings made before June.',
    color: 'bg-emerald-600', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-500',
  });

  // ─── JUNE ──────────────────────────────────────────────────────────────────

  if (check(6, 1, 6, 9)) announcements.push({
    id: 'june-independence-prep', type: 'notice', icon: Megaphone,
    title: 'Independence Month',
    desc: 'June is Philippine Independence Month. Mabuhay! Enjoy special local rates.',
    color: 'bg-blue-800', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-700',
  });

  if (check(6, 6, 6, 6)) announcements.push({
    id: '66sale', type: 'promo', icon: ShoppingBag,
    title: '6.6 Mid-Year Sale',
    desc: 'Today only. Flat 666 pesos off on all 3-day bookings.',
    color: 'bg-orange-600', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-500',
  });

  if (check(6, 10, 6, 18)) announcements.push({
    id: 'fathers-day', type: 'promo', icon: Coffee,
    title: "Fathers Day Special",
    desc: "Let Dad drive his dream car. Special weekend discounts all week.",
    color: 'bg-blue-900', textColor: 'text-white', subColor: 'text-blue-200', tagBg: 'bg-blue-800',
  });

  if (check(6, 19, 6, 30)) announcements.push({
    id: 'june-end', type: 'promo', icon: Percent,
    title: 'Mid-Year Push',
    desc: 'Half the year done. Save big on your next road trip with 12% off.',
    color: 'bg-indigo-600', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-500',
  });

  // ─── JULY ──────────────────────────────────────────────────────────────────

  if (check(7, 1, 7, 6)) announcements.push({
    id: 'july-kickoff', type: 'notice', icon: CloudRain,
    title: 'Rainy Season, Safe Rides',
    desc: 'All our cars are fully serviced for the wet season. Book with confidence.',
    color: 'bg-sky-700', textColor: 'text-white', subColor: 'text-sky-100', tagBg: 'bg-sky-600',
  });

  if (check(7, 7, 7, 7)) announcements.push({
    id: '77sale', type: 'promo', icon: ShoppingBag,
    title: '7.7 Lucky Sale',
    desc: 'Flash Sale! 17% off all rentals booked today.',
    color: 'bg-emerald-600', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-500',
  });

  if (check(7, 8, 7, 20)) announcements.push({
    id: 'july-mid', type: 'promo', icon: Zap,
    title: 'Weekend Warrior Deal',
    desc: 'Rent from Friday to Sunday and get Monday for free on select cars.',
    color: 'bg-lime-600', textColor: 'text-white', subColor: 'text-lime-100', tagBg: 'bg-lime-500',
  });

  if (check(7, 21, 7, 31)) announcements.push({
    id: 'july-end', type: 'notice', icon: Shield,
    title: 'Full Insurance Coverage',
    desc: 'All rentals now come with comprehensive coverage. Drive worry-free.',
    color: 'bg-slate-700', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-600',
  });

  // ─── AUGUST ────────────────────────────────────────────────────────────────

  if (check(8, 1, 8, 7)) announcements.push({
    id: 'aug-kickoff', type: 'promo', icon: Award,
    title: 'August Loyalty Rewards',
    desc: 'Returning customers get an extra 5% off on top of all ongoing promos.',
    color: 'bg-amber-600', textColor: 'text-white', subColor: 'text-amber-100', tagBg: 'bg-amber-500',
  });

  if (check(8, 8, 8, 8)) announcements.push({
    id: '88sale', type: 'promo', icon: ShoppingBag,
    title: '8.8 Mega Sale',
    desc: 'Giant discounts today! Up to 25% off on select units.',
    color: 'bg-cyan-600', textColor: 'text-white', subColor: 'text-cyan-100', tagBg: 'bg-cyan-500',
  });

  if (check(8, 9, 8, 20)) announcements.push({
    id: 'aug-mid', type: 'promo', icon: Truck,
    title: 'Van and Truck Special',
    desc: 'Moving? Transporting goods? 20% off on vans and pick-up trucks this week.',
    color: 'bg-stone-600', textColor: 'text-white', subColor: 'text-stone-200', tagBg: 'bg-stone-500',
  });

  if (check(8, 21, 8, 31)) announcements.push({
    id: 'buwan-ng-wika', type: 'notice', icon: BookOpen,
    title: 'Buwan ng Wika',
    desc: 'Ipagdiwang ang wikang Filipino! Special rates para sa lahat ng lokal na byahe.',
    color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600',
  });

  // ─── SEPTEMBER ─────────────────────────────────────────────────────────────

  if (check(9, 1, 9, 10)) announcements.push({
    id: 'ber-kickoff', type: 'notice', icon: Megaphone,
    title: 'Christmas is Near',
    desc: 'The Ber months are here. Early holiday bookings now open.',
    color: 'bg-green-700', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-600',
  });

  if (check(9, 9, 9, 9)) announcements.push({
    id: '99sale', type: 'promo', icon: ShoppingBag,
    title: '9.9 Super Sale',
    desc: '9.9 deals are here! 19% off on bookings made today.',
    color: 'bg-pink-600', textColor: 'text-white', subColor: 'text-pink-100', tagBg: 'bg-pink-500',
  });

  if (check(9, 11, 9, 25)) announcements.push({
    id: 'sep-mid', type: 'promo', icon: Calendar,
    title: 'Long Weekend Ready',
    desc: 'September long weekends are a great time to explore. Book yours now.',
    color: 'bg-teal-700', textColor: 'text-white', subColor: 'text-teal-100', tagBg: 'bg-teal-600',
  });

  if (check(9, 26, 9, 30)) announcements.push({
    id: 'sep-end', type: 'notice', icon: Phone,
    title: '24/7 Customer Hotline',
    desc: 'We are always available. Call or chat us anytime for roadside assistance.',
    color: 'bg-slate-600', textColor: 'text-white', subColor: 'text-slate-200', tagBg: 'bg-slate-500',
  });

  // ─── OCTOBER ───────────────────────────────────────────────────────────────

  if (check(10, 1, 10, 9)) announcements.push({
    id: 'oct-kickoff', type: 'promo', icon: Wind,
    title: 'October Cool Breeze Deals',
    desc: 'Weather is getting cooler. Perfect time for a road trip. 10% off all cars.',
    color: 'bg-amber-700', textColor: 'text-white', subColor: 'text-amber-100', tagBg: 'bg-amber-600',
  });

  if (check(10, 10, 10, 10)) announcements.push({
    id: '1010', type: 'promo', icon: ShoppingBag,
    title: '10.10 Spooky Sale',
    desc: 'No tricks, just treats! 20% off all rentals today.',
    color: 'bg-orange-700', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-600',
  });

  if (check(10, 11, 10, 25)) announcements.push({
    id: 'undas-prep', type: 'notice', icon: MapPin,
    title: 'Undas Travel Promo',
    desc: 'Planning to visit loved ones this Undas? Book your car early and save.',
    color: 'bg-stone-700', textColor: 'text-white', subColor: 'text-stone-200', tagBg: 'bg-stone-600',
  });

  if (check(10, 26, 10, 31)) announcements.push({
    id: 'halloween', type: 'promo', icon: Zap,
    title: 'Halloween Weekend Flash',
    desc: 'Spooky savings alert! 13% off on all overnight and weekend rentals.',
    color: 'bg-orange-800', textColor: 'text-white', subColor: 'text-orange-200', tagBg: 'bg-orange-700',
  });

  // ─── NOVEMBER ──────────────────────────────────────────────────────────────

  if (check(11, 1, 11, 2)) announcements.push({
    id: 'undas', type: 'notice', icon: Home,
    title: 'Safe Travels This Undas',
    desc: 'Drive safely and arrive in time. Our cars are fully maintained and ready.',
    color: 'bg-stone-800', textColor: 'text-white', subColor: 'text-stone-300', tagBg: 'bg-stone-700',
  });

  if (check(11, 3, 11, 10)) announcements.push({
    id: 'nov-early', type: 'promo', icon: Clock,
    title: 'Early Bird December Promo',
    desc: 'Book your December trips now and lock in November prices.',
    color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600',
  });

  if (check(11, 11, 11, 11)) announcements.push({
    id: '1111', type: 'promo', icon: ShoppingBag,
    title: '11.11 Ultimate Sale',
    desc: 'BIGGEST SALE of the year! 30% discount for the first 11 bookings today.',
    color: 'bg-red-700', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-600',
  });

  if (check(11, 12, 11, 20)) announcements.push({
    id: 'nov-mid', type: 'promo', icon: Gift,
    title: 'Gift of the Road',
    desc: 'Give the gift of adventure this holiday season. Car rental gift cards now available.',
    color: 'bg-rose-700', textColor: 'text-white', subColor: 'text-rose-100', tagBg: 'bg-rose-600',
  });

  if (check(11, 21, 11, 30)) announcements.push({
    id: 'nov-end', type: 'notice', icon: Megaphone,
    title: 'Christmas Fleet Expansion',
    desc: 'We added 30 new vehicles to the fleet just in time for the holidays.',
    color: 'bg-green-800', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-700',
  });

  // ─── DECEMBER ──────────────────────────────────────────────────────────────

  if (check(12, 1, 12, 7)) announcements.push({
    id: 'dec-kickoff', type: 'promo', icon: Star,
    title: 'December Grand Opening',
    desc: 'Holiday season is officially here. 15% off all rentals this first week.',
    color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500',
  });

  if (check(12, 8, 12, 11)) announcements.push({
    id: 'immaculada', type: 'notice', icon: Megaphone,
    title: 'Immaculate Conception Holiday',
    desc: 'Holiday coming up. Plan your long weekend road trip now.',
    color: 'bg-blue-800', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-700',
  });

  if (check(12, 12, 12, 12)) announcements.push({
    id: '1212', type: 'promo', icon: ShoppingBag,
    title: '12.12 Holiday Sale',
    desc: 'Last big sale of the year! 25% off on all car models today.',
    color: 'bg-blue-600', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-500',
  });

  if (check(12, 13, 12, 14)) announcements.push({
    id: 'dec-midweek', type: 'promo', icon: Percent,
    title: 'Midweek Holiday Prep',
    desc: 'Beat the holiday rush. Book mid-week and get 10% off any car class.',
    color: 'bg-emerald-700', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-600',
  });

  if (check(12, 15, 12, 25)) announcements.push({
    id: 'xmas', type: 'promo', icon: Gift,
    title: 'Paskong Pinoy Promo',
    desc: 'Home for Christmas? Get a free gas voucher for 3-day or longer rentals.',
    color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500',
  });

  if (check(12, 22, 12, 24)) announcements.push({
    id: 'xmas-eve-prep', type: 'notice', icon: Clock,
    title: 'Noche Buena Drive',
    desc: 'Last pickups available before December 24. Reserve your car today.',
    color: 'bg-green-700', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-600',
  });

  if (check(12, 26, 12, 30)) announcements.push({
    id: 'post-xmas', type: 'promo', icon: ShoppingBag,
    title: 'Post-Christmas Clearance',
    desc: 'Holiday not over yet! 20% off on remaining December bookings.',
    color: 'bg-rose-700', textColor: 'text-white', subColor: 'text-rose-100', tagBg: 'bg-rose-600',
  });

  if (check(12, 31, 12, 31)) announcements.push({
    id: 'nye', type: 'promo', icon: Star,
    title: 'New Years Eve Ride',
    desc: 'Ring in the new year in style. Book a car tonight and get 10% off.',
    color: 'bg-violet-700', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-600',
  });

  // ─── PAYDAY (END AND START OF MONTH) ───────────────────────────────────────

  if (day >= 28 || day <= 2) announcements.push({
    id: 'payday', type: 'promo', icon: Gift,
    title: 'Payday Promo',
    desc: 'Sweldo na! Treat yourself to a weekend drive with 10% off.',
    color: 'bg-indigo-700', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-600',
  });

  if (day >= 13 && day <= 16) announcements.push({
    id: 'mid-payday', type: 'promo', icon: Percent,
    title: 'Mid-Month Pay Day Sale',
    desc: 'Your kinsenas just came in. Use it wisely — 8% off on any car today.',
    color: 'bg-indigo-600', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-500',
  });

  // ─── WEEKEND SPECIALS ───────────────────────────────────────────────────────

  const dayOfWeek = now.getDay();
  if (dayOfWeek === 5) announcements.push({
    id: 'friday-rush', type: 'promo', icon: Zap,
    title: 'Friday Flash Deal',
    desc: 'TGIF! Book a car for the weekend today and get free airport pickup.',
    color: 'bg-yellow-600', textColor: 'text-white', subColor: 'text-yellow-100', tagBg: 'bg-yellow-500',
  });

  if (dayOfWeek === 6) announcements.push({
    id: 'saturday-special', type: 'promo', icon: Sun,
    title: 'Saturday Ride Special',
    desc: 'Perfect day for a drive. Book a car now and enjoy same-day pickup.',
    color: 'bg-orange-500', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-400',
  });

  if (dayOfWeek === 0) announcements.push({
    id: 'sunday-deal', type: 'promo', icon: Coffee,
    title: 'Sunday Funday Drive',
    desc: 'Sunday is not for staying in. Rent a car and explore somewhere new.',
    color: 'bg-amber-600', textColor: 'text-white', subColor: 'text-amber-100', tagBg: 'bg-amber-500',
  });

  // ─── TIME-BASED PROMOS ──────────────────────────────────────────────────────

  if (hour >= 6 && hour < 10) announcements.push({
    id: 'early-bird', type: 'promo', icon: Clock,
    title: 'Early Bird Booking',
    desc: 'You are up early! Book before 10 AM and get an extra 5% off your rental.',
    color: 'bg-sky-600', textColor: 'text-white', subColor: 'text-sky-100', tagBg: 'bg-sky-500',
  });

  if (hour >= 22 || hour < 2) announcements.push({
    id: 'midnight-promo', type: 'promo', icon: Zap,
    title: 'Midnight Deal',
    desc: 'Still up? So are we. Midnight bookings get 7% off any available car.',
    color: 'bg-slate-800', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-700',
  });

  // ─── ALWAYS-ON OPERATIONAL NOTICES ─────────────────────────────────────────

  announcements.push({
    id: 'new-vehicles', type: 'notice', icon: Truck,
    title: 'New Vehicles Available',
    desc: 'Freshly added to our fleet — 2025 and 2026 model units now up for rent.',
    color: 'bg-zinc-700', textColor: 'text-white', subColor: 'text-zinc-300', tagBg: 'bg-zinc-600',
  });

  announcements.push({
    id: 'insurance-update', type: 'notice', icon: Shield,
    title: 'Full Insurance Included',
    desc: 'All rentals include comprehensive coverage. No hidden fees, ever.',
    color: 'bg-blue-900', textColor: 'text-white', subColor: 'text-blue-200', tagBg: 'bg-blue-800',
  });

  announcements.push({
    id: 'loyalty-program', type: 'notice', icon: Award,
    title: 'Join Our Loyalty Program',
    desc: 'Earn points with every rental. Redeem for free days and upgrades.',
    color: 'bg-amber-700', textColor: 'text-white', subColor: 'text-amber-100', tagBg: 'bg-amber-600',
  });

  announcements.push({
    id: 'app-exclusive', type: 'promo', icon: Phone,
    title: 'App Exclusive Discount',
    desc: 'Booking through our app? Get an extra 5% off not available anywhere else.',
    color: 'bg-violet-700', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-600',
  });

  announcements.push({
    id: 'refer-friend', type: 'promo', icon: Gift,
    title: 'Refer a Friend',
    desc: 'Share your referral code and get 500 pesos off your next rental.',
    color: 'bg-pink-700', textColor: 'text-white', subColor: 'text-pink-100', tagBg: 'bg-pink-600',
  });

  announcements.push({
    id: 'long-term', type: 'promo', icon: Calendar,
    title: 'Long-Term Rental Deals',
    desc: 'Renting for a week or more? Get up to 30% off on extended bookings.',
    color: 'bg-teal-700', textColor: 'text-white', subColor: 'text-teal-100', tagBg: 'bg-teal-600',
  });

  announcements.push({
    id: 'group-booking', type: 'promo', icon: Truck,
    title: 'Group Booking Promo',
    desc: 'Need 3 or more cars? We offer group rates for corporate and events.',
    color: 'bg-slate-700', textColor: 'text-white', subColor: 'text-slate-200', tagBg: 'bg-slate-600',
  });

  announcements.push({
    id: 'zero-deposit', type: 'promo', icon: Zap,
    title: 'Zero Deposit Option',
    desc: 'Verified renters can now book with zero cash deposit. Apply now.',
    color: 'bg-green-800', textColor: 'text-white', subColor: 'text-green-100', tagBg: 'bg-green-700',
  });

  announcements.push({
    id: 'first-time', type: 'promo', icon: Star,
    title: 'First-Time Renter Deal',
    desc: 'New to the platform? Your first rental gets a guaranteed 15% discount.',
    color: 'bg-emerald-700', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-600',
  });

  announcements.push({
    id: 'driver-available', type: 'notice', icon: Briefcase,
    title: 'With-Driver Option',
    desc: 'Not comfortable driving? Book with a professional driver for a small fee.',
    color: 'bg-blue-800', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-700',
  });

  announcements.push({
    id: 'gps-tracking', type: 'notice', icon: MapPin,
    title: 'Live GPS Tracking',
    desc: 'All cars are GPS-equipped for your safety. Track your rental in real time.',
    color: 'bg-cyan-800', textColor: 'text-white', subColor: 'text-cyan-100', tagBg: 'bg-cyan-700',
  });

  announcements.push({
    id: 'carbon-offset', type: 'notice', icon: Wind,
    title: 'Eco-Friendly Fleet',
    desc: 'We now offer hybrid and electric vehicles. Help reduce carbon emissions.',
    color: 'bg-lime-700', textColor: 'text-white', subColor: 'text-lime-100', tagBg: 'bg-lime-600',
  });

  announcements.push({
    id: 'student-discount', type: 'promo', icon: BookOpen,
    title: 'Student Discount',
    desc: 'Show your valid student ID and get 10% off any rental anytime.',
    color: 'bg-indigo-700', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-600',
  });

  announcements.push({
    id: 'senior-promo', type: 'promo', icon: Heart,
    title: 'Senior Citizen Promo',
    desc: 'Senior citizens enjoy priority service and 20% off on all bookings.',
    color: 'bg-rose-700', textColor: 'text-white', subColor: 'text-rose-100', tagBg: 'bg-rose-600',
  });

  announcements.push({
    id: 'corporate-rate', type: 'notice', icon: Briefcase,
    title: 'Corporate Account Rates',
    desc: 'Register your company for exclusive monthly rates and invoice billing.',
    color: 'bg-gray-800', textColor: 'text-white', subColor: 'text-gray-200', tagBg: 'bg-gray-700',
  });

  announcements.push({
    id: 'clean-guarantee', type: 'notice', icon: Shield,
    title: 'Cleanliness Guarantee',
    desc: 'Every vehicle is sanitized and inspected before each rental. Always.',
    color: 'bg-teal-800', textColor: 'text-white', subColor: 'text-teal-100', tagBg: 'bg-teal-700',
  });

  announcements.push({
    id: 'photo-shoot', type: 'promo', icon: Camera,
    title: 'Content Creator Package',
    desc: 'Book a car for photo or video shoots at special hourly rates.',
    color: 'bg-fuchsia-700', textColor: 'text-white', subColor: 'text-fuchsia-100', tagBg: 'bg-fuchsia-600',
  });

  announcements.push({
    id: 'music-festival', type: 'promo', icon: Music,
    title: 'Festival Season Rides',
    desc: 'Going to a concert or festival? Book a van for your whole crew.',
    color: 'bg-purple-700', textColor: 'text-white', subColor: 'text-purple-100', tagBg: 'bg-purple-600',
  });

  // ─── FALLBACK ───────────────────────────────────────────────────────────────

  if (announcements.length === 0) {
    announcements.push({
      id: 'default', type: 'notice', icon: Megaphone,
      title: 'Drive in Style',
      desc: 'Check out our 2026 SUV models. Perfect for family trips and road trips.',
      color: 'bg-slate-800', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-600',
    });
  }

  return announcements;
};