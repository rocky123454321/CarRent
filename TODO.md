# CarRent Project File Tree
```
CarRent/
├── helon.txt
├── TODO.md
├── vercel.json
├── client/
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tsconfig.json
│   ├── vercel.json
│   ├── vite.config.js
│   ├── pages/
│   │   ├── Chat/
│   │   │   └── ChatPage.jsx
│   │   └── layout/
│   │       └── AdminSidebarLayout.jsx
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── tsconfig.app.json
│   │   ├── assets/
│   │   │   ├── 1.jpg
│   │   │   ├── 1.png
│   │   │   ├── Black and White Simple Car Rental Logo (1)(1)(1).png
│   │   │   ├── brand.png
│   │   │   ├── brand2.png
│   │   │   ├── car.gif
│   │   │   ├── carpichero.png
│   │   │   ├── hero.png
│   │   │   ├── herocar1.png
│   │   │   ├── herocar2.png
│   │   │   ├── process.jpg
│   │   │   ├── react.svg
│   │   │   ├── vite.svg
│   │   │   ├── ann/
│   │   │   │   └── Graduation.png
│   │   │   └── avatars/
│   │   │       ├── Avatar1.png
│   │   │       └── Avatar2.png
│   │   ├── components/
│   │   │   ├── codefront.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AddCarPage.jsx
│   │   │   │   ├── AdminCards.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── Bookings.jsx
│   │   │   │   ├── CarsListPage.jsx
│   │   │   │   ├── CarsListPage.live.jsx
│   │   │   │   ├── PromoManagerDialog.jsx
│   │   │   │   ├── ReportsPage.jsx
│   │   │   │   └── Chats/
│   │   │   │       └── chart1.jsx
│   │   │   ├── forms/
│   │   │   │   └── admin/
│   │   │   │       └── user/
│   │   │   ├── navigations/
│   │   │   │   ├── AdminNav.jsx
│   │   │   │   ├── NonNav.jsx
│   │   │   │   └── UserNav.jsx
│   │   │   ├── public/
│   │   │   │   ├── FeaturedCarsSection.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── fsqs.jsx
│   │   │   │   ├── hero.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── navigation.jsx
│   │   │   ├── ui/
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── field.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── navigation-menu.tsx
│   │   │   │   ├── PasswordStrengthMeter.jsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── sonner.tsx
│   │   │   │   └── switch.tsx
│   │   │   └── user/
│   │   │       ├── BookingForm.jsx
│   │   │       ├── Cards.jsx
│   │   │       ├── CarLoader.jsx
│   │   │       ├── contactSupport.jsx
│   │   │       ├── FloatingShape.jsx
│   │   │       ├── PaymentDemo.jsx
│   │   │       ├── PromoSection.jsx
│   │   │       └── PromoSectionLive.jsx
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminChatPage.jsx
│   │   │   │   ├── adminPage.jsx
│   │   │   │   └── SettingsAdmin.jsx
│   │   │   ├── authentication/
│   │   │   │   ├── EmailVerificationPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── ResetPasswordPage.jsx
│   │   │   │   └── SignUpPage.jsx
│   │   │   ├── public/
│   │   │   │   └── LandingPage.jsx
│   │   │   └── Users/
│   │   │       ├── CarDetailView.jsx
│   │   │       ├── exploreNow.jsx
│   │   │       ├── Flashdealpage.jsx
│   │   │       ├── HomePage.jsx
│   │   │       ├── MyRentals.jsx
│   │   │       ├── Pupolar.jsx
│   │   │       ├── Recomended.jsx
│   │   │       ├── Searchpage.jsx
│   │   │       └── Settings.jsx
│   │   ├── store/
│   │   │   ├── AdminCarStore.js
│   │   │   ├── authStore.js
│   │   │   ├── BookingStore.js
│   │   │   ├── CarStore.js
│   │   │   ├── chatStore.js
│   │   │   ├── PromoStore.js
│   │   │   ├── RatingStore.js
│   │   │   ├── RentalStore.js
│   │   │   ├── themeStore.js
│   │   │   └── TODO.md
│   │   └── utils/
│   │       ├── date.js
│   │       ├── flashDeal.js
│   │       ├── promo.js
│   │       └── seasonalAnnouncements.js
│   └── fonts/
│       └── Caveat-VariableFont_wght.ttf
└── server/
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    ├── server.js
    ├── socket.js
    ├── config/
    │   └── cloudinary.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── cars.controller.js
    │   ├── Expirepromo.controller.js
    │   ├── ratingsController.js
    │   └── rental.controller.js
    ├── cron/
    │   └── promoExpiry.cron.js
    ├── db/
    │   └── connectDb.js
    ├── mailtrap/
    │   ├── emailTemplates.js
    │   └── sendVerificationEmail.js
    ├── middleware/
    │   └── verifyToken.js
    ├── models/
    │   ├── cars.model.js
    │   ├── Message.model.js
    │   ├── rental.model.js
    │   ├── review.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── auth.route.js
    │   ├── car.routes.js
    │   ├── explore.routes.js
    │   ├── promo.routes.js
    │   ├── ratingRoutes.js
    │   └── rental.routes.js
    └── utils/
        ├── generateTokenAndSetCookie.js
        └── promo.js
```

