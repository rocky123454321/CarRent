import { 
  Star, Gift, Megaphone, AlertCircle, ShoppingBag, Heart, Coffee, Zap, 
  Truck, MapPin, Clock, Shield, Award, Percent, Calendar, Sun, 
  CloudRain, Wind, Snowflake, Music, BookOpen, Briefcase, Home, 
  Phone, Camera, Umbrella, Anchor, Moon, Sunrise, Sunset, Map,
  Navigation, Battery, Fuel, Gauge, Key, UserCheck, HelpCircle,
  Sparkles, Smile, PenTool, Layers, Rocket, Globe, LifeBuoy, Ghost
} from 'lucide-react';

/**
 * Utility to check if current date is within a specific range.
 * Handles year-wrapping (e.g., Dec 25 to Jan 5).
 */
const isWithin = (month, day, startMonth, startDay, endMonth, endDay) => {
  const current = month * 100 + day;
  const start   = startMonth * 100 + startDay;
  const end     = endMonth * 100 + endDay;
  if (start <= end) return current >= start && current <= end;
  return current >= start || current <= end;
};

/**
 * Main function to generate dynamic announcements based on date, time, and season.
 * Tailored for the Philippine market and 2026 Calendar.
 */
export const getSeasonalAnnouncements = () => {
  const now   = new Date();
  const month = now.getMonth() + 1;
  const day   = now.getDate();
  const hour  = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

  const check = (sm, sd, em, ed) => isWithin(month, day, sm, sd, em, ed);
  const announcements = [];

  // ─── Q1: BEGINNING OF YEAR (JAN - MAR) ─────────────────────────────────────

  // [JAN 1] New Year's Day
  if (check(1, 1, 1, 1)) {
    announcements.push({
      id: 'newyear-day', type: 'promo', icon: Star,
      title: 'Happy 2026!',
      desc: 'Start the year on the road. 20% off all rentals today only.',
      color: 'bg-violet-600', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-500',
    });
  }

  // [JAN 2 - JAN 15] Post-Holiday Recovery
  if (check(1, 2, 1, 15)) {
    announcements.push({
      id: 'post-holiday-detox', type: 'promo', icon: Coffee,
      title: 'New Year, New Drive',
      desc: 'Beat the post-holiday blues with a relaxing weekend getaway.',
      color: 'bg-emerald-600', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-500',
    });
  }

  // [FEB 1 - FEB 13] Valentine's Pre-game
  if (check(2, 1, 2, 13)) {
    announcements.push({
      id: 'vday-early', type: 'promo', icon: Heart,
      title: 'Plan Your Date Early',
      desc: 'Reserve a luxury sedan for Feb 14 and get a free car fragrance.',
      color: 'bg-pink-600', textColor: 'text-white', subColor: 'text-pink-100', tagBg: 'bg-pink-500',
    });
  }

  // [FEB 14] Valentine's Day
  if (check(2, 14, 2, 14)) {
    announcements.push({
      id: 'valentines-day', type: 'promo', icon: Heart,
      title: "Happy Valentine's Day",
      desc: 'Book a car now and get a free couple photo voucher with your rental.',
      color: 'bg-red-500', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-400',
    });
  }

  // [FEB 17] Chinese New Year 2026 (Year of the Horse)
  if (check(2, 17, 2, 17)) {
    announcements.push({
      id: 'cny-2026', type: 'promo', icon: Zap,
      title: 'Kung Hei Fat Choi!',
      desc: 'Lucky 8% discount on all SUV rentals today.',
      color: 'bg-red-700', textColor: 'text-white', subColor: 'text-yellow-200', tagBg: 'bg-yellow-600',
    });
  }

  // [FEB 25] EDSA Revolution Anniversary
  if (check(2, 25, 2, 25)) {
    announcements.push({
      id: 'edsa-day', type: 'notice', icon: Shield,
      title: 'EDSA Anniversary',
      desc: 'Commemorating People Power. We are open for normal operations.',
      color: 'bg-yellow-500', textColor: 'text-black', subColor: 'text-yellow-900', tagBg: 'bg-yellow-600',
    });
  }

  // [MAR 1 - MAR 31] Graduation Season / Summer Kickoff
  if (check(3, 1, 3, 31)) {
    announcements.push({
      id: 'grad-season', type: 'promo', icon: Award,
      title: 'Congratulations, Graduates!',
      desc: 'Special group rates for graduation outings and family dinners.',
      color: 'bg-blue-900', textColor: 'text-white', subColor: 'text-blue-200', tagBg: 'bg-blue-700',
    });
  }

  // ─── Q2: THE HOT SEASON (APR - JUN) ────────────────────────────────────────

  // [APR 2 - APR 5] Holy Week Peak (Maundy Thursday to Easter)
  if (check(4, 2, 4, 5)) {
    announcements.push({
      id: 'holy-week-peak', type: 'notice', icon: AlertCircle,
      title: 'Holy Week Schedule',
      desc: 'Limited staff available. Please book at least 24 hours in advance.',
      color: 'bg-stone-800', textColor: 'text-white', subColor: 'text-stone-300', tagBg: 'bg-stone-600',
    });
  }

  // [APR 5 - APR 12] Holy Week 2026 Roadtrip
  if (check(4, 5, 4, 11)) {
    announcements.push({
      id: 'holy-week', type: 'promo', icon: MapPin,
      title: 'Holy Week Road Trip',
      desc: 'Travel safely this holiday season. Free GPS included on all rentals.',
      color: 'bg-stone-700', textColor: 'text-white', subColor: 'text-stone-200', tagBg: 'bg-stone-600',
    });
  }

  // [APR 9] Araw ng Kagitingan
  if (check(4, 9, 4, 9)) {
    announcements.push({
      id: 'day-of-valor', type: 'notice', icon: Shield,
      title: 'Araw ng Kagitingan',
      desc: 'Honoring our heroes. We are open for 24/7 roadside assistance.',
      color: 'bg-red-800', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-700',
    });
  }

  // [MAY 1] Labor Day
  if (check(5, 1, 5, 1)) {
    announcements.push({
      id: 'labor-day', type: 'promo', icon: Briefcase,
      title: "Labor Day Special",
      desc: "You've earned it. Enjoy the holiday with a smooth ride.",
      color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600',
    });
  }

  // [MAY 10] Mother's Day (Second Sunday)
  if (check(5, 10, 5, 10)) {
    announcements.push({
      id: 'mothers-day', type: 'promo', icon: Smile,
      title: "Treat Mom Today",
      desc: "Free chauffeur upgrade for Mother's Day bookings.",
      color: 'bg-rose-500', textColor: 'text-white', subColor: 'text-rose-100', tagBg: 'bg-rose-400',
    });
  }

  // [JUNE 12] Independence Day
  if (check(6, 12, 6, 12)) {
    announcements.push({
      id: 'indep-day', type: 'promo', icon: Star,
      title: '128th Independence Day',
      desc: 'Freedom to travel! Get ₱612 off on bookings 3 days or longer.',
      color: 'bg-blue-800', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-red-600',
    });
  }

  // [JUNE 21] Father's Day (Third Sunday)
  if (check(6, 21, 6, 21)) {
    announcements.push({
      id: 'fathers-day', type: 'promo', icon: Award,
      title: "Dad's Day Out",
      desc: "15% off on Pickup Trucks and big SUVs for Dad.",
      color: 'bg-slate-700', textColor: 'text-white', subColor: 'text-slate-200', tagBg: 'bg-slate-600',
    });
  }

  // ─── Q3: MONSOON & WIKA (JUL - SEP) ────────────────────────────────────────

  // [JUL 1 - AUG 31] Rainy Season Safety
  if (check(7, 1, 8, 31)) {
    announcements.push({
      id: 'rainy-season', type: 'notice', icon: CloudRain,
      title: 'Rainy Day Ready',
      desc: 'All units checked for tire grip and wiper health. Drive safe!',
      color: 'bg-sky-900', textColor: 'text-white', subColor: 'text-sky-200', tagBg: 'bg-sky-700',
    });
  }

  // [AUG 12 - SEP 10] Ghost Month 2026 (Approximate Lunar)
  if (check(8, 12, 9, 10)) {
    announcements.push({
      id: 'ghost-month', type: 'notice', icon: Ghost,
      title: 'Ghost Month Safety',
      desc: 'Drive extra carefully this month. Check your headlights before every trip.',
      color: 'bg-zinc-800', textColor: 'text-zinc-100', subColor: 'text-zinc-400', tagBg: 'bg-zinc-700',
    });
  }

  // [AUG 21] Ninoy Aquino Day
  if (check(8, 21, 8, 21)) {
    announcements.push({
      id: 'ninoy-day', type: 'notice', icon: Calendar,
      title: 'Ninoy Aquino Day',
      desc: 'Special long-weekend rates are now active.',
      color: 'bg-yellow-500', textColor: 'text-black', subColor: 'text-yellow-900', tagBg: 'bg-yellow-600',
    });
  }

  // [AUG 21 - AUG 31] Buwan ng Wika
  if (check(8, 21, 8, 31)) {
    announcements.push({
      id: 'buwan-ng-wika', type: 'notice', icon: BookOpen,
      title: 'Buwan ng Wika',
      desc: 'Ipagdiwang ang wikang Filipino sa bawat byahe.',
      color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600',
    });
  }

  // [AUG 31] National Heroes Day
  if (check(8, 31, 8, 31)) {
    announcements.push({
      id: 'heroes-day', type: 'promo', icon: Shield,
      title: 'National Heroes Day',
      desc: 'Discounted rates for our frontliners and modern-day heroes.',
      color: 'bg-orange-800', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-700',
    });
  }

  // ─── Q4: THE BER MONTHS (OCT - DEC) ────────────────────────────────────────

  // [SEP 1 - OCT 24] Early Xmas
  if (check(9, 1, 10, 24)) {
    announcements.push({
      id: 'early-ber', type: 'promo', icon: Music,
      title: 'Paskong Pinoy Begins',
      desc: 'Early bird rates for December. Book 2 months ahead and save 25%.',
      color: 'bg-emerald-800', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-600',
    });
  }

  // [OCT 25 - OCT 31] Halloween Special
  if (check(10, 25, 10, 31)) {
    announcements.push({
      id: 'halloween-special', type: 'promo', icon: Ghost,
      title: 'Spooky Deals!',
      desc: 'No tricks, just treats. Get a "frighteningly" low rate on all black cars.',
      color: 'bg-orange-600', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-zinc-900',
    });
  }

  // [OCT 30 - NOV 2] Undas Period (All Saints & All Souls)
  if (check(10, 30, 11, 2)) {
    announcements.push({
      id: 'undas-rush', type: 'notice', icon: AlertCircle,
      title: 'Undas Travel Advisory',
      desc: 'Visiting loved ones? Plan your route to avoid cemetery traffic zones.',
      color: 'bg-zinc-900', textColor: 'text-white', subColor: 'text-zinc-400', tagBg: 'bg-zinc-700',
    });
  }

  // [NOV 11] 11.11 Mega Sale
  if (check(11, 11, 11, 11)) {
    announcements.push({
      id: 'mega-11-11', type: 'promo', icon: ShoppingBag,
      title: '11.11 Flash Sale',
      desc: '₱1,111 flat rate for 24-hour sedan rentals. Limited slots!',
      color: 'bg-orange-600', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-500',
    });
  }

  // [NOV 30] Bonifacio Day
  if (check(11, 30, 11, 30)) {
    announcements.push({
      id: 'bonifacio-day', type: 'promo', icon: Map,
      title: 'Bonifacio Day',
      desc: 'Explore historic sites with our specialized tour vans.',
      color: 'bg-red-900', textColor: 'text-white', subColor: 'text-red-200', tagBg: 'bg-red-700',
    });
  }

  // [DEC 8] Feast of the Immaculate Conception
  if (check(12, 8, 12, 8)) {
    announcements.push({
      id: 'immaculate-conception', type: 'notice', icon: Shield,
      title: 'Holy Day Holiday',
      desc: 'Special family-sized van rentals available for church groups.',
      color: 'bg-blue-600', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-500',
    });
  }

  // [DEC 1 - DEC 24] Christmas Rush
  if (check(12, 1, 12, 24)) {
    announcements.push({
      id: 'xmas-rush', type: 'promo', icon: Gift,
      title: 'Holiday Rush',
      desc: 'Bringing gifts? Our SUVs have the trunk space you need.',
      color: 'bg-red-700', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-600',
    });
  }

  // [DEC 25] Christmas Day
  if (check(12, 25, 12, 25)) {
    announcements.push({
      id: 'xmas-day', type: 'promo', icon: Gift,
      title: 'Maligayang Pasko!',
      desc: 'Enjoy a special holiday treat with your rental today.',
      color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500',
    });
  }

  // [DEC 30] Rizal Day
  if (check(12, 30, 12, 30)) {
    announcements.push({
      id: 'rizal-day', type: 'notice', icon: BookOpen,
      title: 'Rizal Day',
      desc: 'Remembering our national hero. Regular operations today.',
      color: 'bg-blue-900', textColor: 'text-white', subColor: 'text-blue-200', tagBg: 'bg-blue-700',
    });
  }

  // [DEC 31] New Year's Eve
  if (check(12, 31, 12, 31)) {
    announcements.push({
      id: 'nye', type: 'promo', icon: Star,
      title: 'New Years Eve Ride',
      desc: "Ring in the new year in style. 10% off for tonight's bookings.",
      color: 'bg-violet-700', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-600',
    });
  }

  // ─── DYNAMIC TIME-BASED TRIGGERS ───────────────────────────────────────────

  // [5 AM - 8 AM] Early Bird
  if (hour >= 5 && hour <= 8) {
    announcements.push({
      id: 'morning-rush', type: 'promo', icon: Sunrise,
      title: 'Early Bird Special',
      desc: 'Book before 9 AM and get a free brewed coffee voucher.',
      color: 'bg-amber-100', textColor: 'text-amber-900', subColor: 'text-amber-700', tagBg: 'bg-amber-200',
    });
  }

  // [12 PM - 1 PM] Lunch Break Flash Sale
  if (hour === 12) {
    announcements.push({
      id: 'lunch-flash', type: 'promo', icon: Zap,
      title: 'Lunch Break Flash!',
      desc: 'Quick! 50% off insurance fees for the next 60 minutes.',
      color: 'bg-yellow-400', textColor: 'text-yellow-950', subColor: 'text-yellow-800', tagBg: 'bg-yellow-300',
    });
  }

  // [10 PM - 4 AM] Night Owl
  if (hour >= 22 || hour <= 4) {
    announcements.push({
      id: 'night-owl', type: 'promo', icon: Moon,
      title: 'Night Owl Special',
      desc: 'Booking late? Get 5% off for graveyard shift rentals.',
      color: 'bg-slate-900', textColor: 'text-slate-100', subColor: 'text-slate-400', tagBg: 'bg-slate-700',
    });
  }

  // ─── RECURRING WEEKLY / MONTHLY ────────────────────────────────────────────

  // [Friday, Saturday, Sunday] Weekend
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    announcements.push({
      id: 'weekend-warrior', type: 'promo', icon: Sun,
      title: 'Weekend Warrior',
      desc: 'Escape the city. Special rates for weekend long-drives.',
      color: 'bg-orange-600', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-500',
    });
  }

  // [Monday] Monday Blues
  if (dayOfWeek === 1) {
    announcements.push({
      id: 'monday-blues', type: 'promo', icon: Coffee,
      title: 'Monday Motivation',
      desc: 'Start your work week right. Low weekday rates apply.',
      color: 'bg-blue-600', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-500',
    });
  }

  // [13th-16th & 28th-2nd] Payday
  if ((day >= 13 && day <= 16) || (day >= 28 || day <= 2)) {
    announcements.push({
      id: 'payday-sale', type: 'promo', icon: ShoppingBag,
      title: 'Payday Treats',
      desc: 'The salary is in! Treat your family to a road trip.',
      color: 'bg-indigo-700', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-600',
    });
  }

  // ─── OPERATIONAL & UTILITY (ALWAYS ON) ─────────────────────────────────────

  announcements.push({
    id: 'student-discount', type: 'promo', icon: BookOpen,
    title: 'Student Discount',
    desc: 'Show your PLV or any valid student ID for 10% off.',
    color: 'bg-indigo-700', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-600',
  });

  announcements.push({
    id: 'safety-first', type: 'notice', icon: Shield,
    title: 'Sanitized Units',
    desc: 'Every car is deep-cleaned and sanitized before turnover.',
    color: 'bg-emerald-700', textColor: 'text-white', subColor: 'text-emerald-100', tagBg: 'bg-emerald-600',
  });

  // ─── FALLBACK ──────────────────────────────────────────────────────────────

  if (announcements.length < 3) {
    announcements.push({
      id: 'default-luxury', type: 'notice', icon: Megaphone,
      title: 'Premium Fleet',
      desc: 'Check out our 2026 SUV models for your next trip.',
      color: 'bg-slate-800', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-600',
    });
  }

  // Sorting: Promo (1) > Notice (2)
  return announcements.sort((a, b) => {
    const priority = { promo: 1, notice: 2 };
    return priority[a.type] - priority[b.type];
  });
};

export const getTopAnnouncement = () => {
  const all = getSeasonalAnnouncements();
  return all[0];
};

export const PHILIPPINE_HOLIDAYS = [
  { name: "New Year's Day", date: "Jan 1" },
  { name: "Chinese New Year", date: "Feb 17" },
  { name: "EDSA Revolution Anniversary", date: "Feb 25" },
  { name: "Maundy Thursday", date: "Apr 2" },
  { name: "Good Friday", date: "Apr 3" },
  { name: "Black Saturday", date: "Apr 4" },
  { name: "Easter Sunday", date: "Apr 5" },
  { name: "Araw ng Kagitingan", date: "Apr 9" },
  { name: "Labor Day", date: "May 1" },
  { name: "Independence Day", date: "Jun 12" },
  { name: "Ninoy Aquino Day", date: "Aug 21" },
  { name: "National Heroes Day", date: "Aug 31" },
  { name: "Ghost Month Starts", date: "Aug 12" },
  { name: "Halloween", date: "Oct 31" },
  { name: "All Saints' Day", date: "Nov 1" },
  { name: "All Souls' Day", date: "Nov 2" },
  { name: "Bonifacio Day", date: "Nov 30" },
  { name: "Immaculate Conception", date: "Dec 8" },
  { name: "Christmas Day", date: "Dec 25" },
  { name: "Rizal Day", date: "Dec 30" },
  { name: "Last Day of the Year", date: "Dec 31" }
];