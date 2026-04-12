import { 
  Star, Gift, Megaphone, AlertCircle, ShoppingBag, Heart, Coffee, Zap, 
  Truck, MapPin, Clock, Shield, Award, Percent, Calendar, Sun, 
  CloudRain, Wind, Snowflake, Music, BookOpen, Briefcase, Home, 
  Phone, Camera 
} from 'lucide-react';

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
  const dayOfWeek = now.getDay();

  const check = (sm, sd, em, ed) => isWithin(month, day, sm, sd, em, ed);
  const announcements = [];

  // ─── SPECIFIC HOLIDAYS (STRICT DATES) ──────────────────────────────────────

  // [JAN 1] New Year's Day Only
  if (check(1, 1, 1, 1)) announcements.push({
    id: 'newyear-day', type: 'promo', icon: Star,
    title: 'Happy New Year',
    desc: 'Start the year on the road. 20% off all rentals today only.',
    color: 'bg-violet-600', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-500',
  });

  // [FEB 14] Valentine's Day Only
  if (check(2, 14, 2, 14)) announcements.push({
    id: 'valentines-day', type: 'promo', icon: Heart,
    title: 'Happy Valentine\'s Day',
    desc: 'Book a car now and get a free couple photo voucher with your rental.',
    color: 'bg-red-500', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-400',
  });

  // [APR 5 - APR 12] Holy Week 2026 Duration Only
  if (check(4, 5, 4, 11)) announcements.push({
    id: 'holy-week', type: 'promo', icon: MapPin,
    title: 'Holy Week Road Trip',
    desc: 'Travel safely this holiday season. Free GPS included on all rentals.',
    color: 'bg-stone-700', textColor: 'text-white', subColor: 'text-stone-200', tagBg: 'bg-stone-600',
  });

  // [MAY 1] Labor Day Only
  if (check(5, 1, 5, 1)) announcements.push({
    id: 'labor-day', type: 'promo', icon: Briefcase,
    title: "Labor Day Special",
    desc: "You've earned it. Enjoy the holiday with a smooth ride.",
    color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600',
  });

  // [DEC 25] Christmas Day Only
  if (check(12, 25, 12, 25)) announcements.push({
    id: 'xmas-day', type: 'promo', icon: Gift,
    title: 'Merry Christmas!',
    desc: 'Paskong Pinoy! Enjoy a special holiday treat with your rental today.',
    color: 'bg-red-600', textColor: 'text-white', subColor: 'text-red-100', tagBg: 'bg-red-500',
  });

  // [DEC 31] New Year's Eve Only
  if (check(12, 31, 12, 31)) announcements.push({
    id: 'nye', type: 'promo', icon: Star,
    title: 'New Years Eve Ride',
    desc: 'Ring in the new year in style. 10% off for tonight\'s bookings.',
    color: 'bg-violet-700', textColor: 'text-white', subColor: 'text-violet-100', tagBg: 'bg-violet-600',
  });

  // ─── MONTHLY/PERIODIC PROMOS ───────────────────────────────────────────────

  // [APR 16 - APR 30] Post-Holiday Sale
  if (check(4, 16, 4, 30)) announcements.push({
    id: 'post-holywk', type: 'promo', icon: Percent,
    title: 'After-Holiday Deals',
    desc: 'Back from the beach? Extend your vacation at 10% off.',
    color: 'bg-cyan-700', textColor: 'text-white', subColor: 'text-cyan-100', tagBg: 'bg-cyan-600',
  });

  // [AUG 21 - AUG 31] Buwan ng Wika
  if (check(8, 21, 8, 31)) announcements.push({
    id: 'buwan-ng-wika', type: 'notice', icon: BookOpen,
    title: 'Buwan ng Wika',
    desc: 'Ipagdiwang ang wikang Filipino sa bawat byahe.',
    color: 'bg-blue-700', textColor: 'text-white', subColor: 'text-blue-100', tagBg: 'bg-blue-600',
  });

  // ─── DYNAMIC TRIGGERS (PAYDAY & WEEKENDS) ──────────────────────────────────

  // Payday (Every 15th and End of Month)
  if ((day >= 13 && day <= 16) || (day >= 28 || day <= 2)) {
    announcements.push({
      id: 'payday-general', type: 'promo', icon: ShoppingBag,
      title: 'Payday Sale',
      desc: 'Treat yourself to a drive. Special discounts active now.',
      color: 'bg-indigo-700', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-600',
    });
  }

  // Weekend (Friday - Sunday)
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    announcements.push({
      id: 'weekend-warrior', type: 'promo', icon: Sun,
      title: 'Weekend Warrior',
      desc: 'Escape the city. Special rates for weekend long-drives.',
      color: 'bg-orange-600', textColor: 'text-white', subColor: 'text-orange-100', tagBg: 'bg-orange-500',
    });
  }

  // ─── OPERATIONAL (ALWAYS ON) ───────────────────────────────────────────────

  announcements.push({
    id: 'student-discount', type: 'promo', icon: BookOpen,
    title: 'Student Discount',
    desc: 'Show your PLV or any valid student ID for 10% off.',
    color: 'bg-indigo-700', textColor: 'text-white', subColor: 'text-indigo-100', tagBg: 'bg-indigo-600',
  });

  // ─── FALLBACK ──────────────────────────────────────────────────────────────

  if (announcements.length === 0) {
    announcements.push({
      id: 'default', type: 'notice', icon: Megaphone,
      title: 'Drive in Style',
      desc: 'Check out our 2026 SUV models for your next trip.',
      color: 'bg-slate-800', textColor: 'text-white', subColor: 'text-slate-300', tagBg: 'bg-slate-600',
    });
  }

  return announcements;
};