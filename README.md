# 🚗 AMEN Ride — Bahir Dar, Ethiopia

> A production-ready, full-stack ride-hailing application built for Bahir Dar, Ethiopia 🇪🇹.
> Inspired by Yango's design system & Ethiopian cultural aesthetics, built with React Native (Expo) + React Web + Node.js + PostgreSQL.

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-black)
![Stack](https://img.shields.io/badge/stack-React%20Native%20%7C%20React%2018%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![Theme](https://img.shields.io/badge/theme-Yango%20Red%20%23FF2E2E%20%7C%20Ethio%20Emerald%20%2300D154-red)
![City](https://img.shields.io/badge/city-Bahir%20Dar%2C%20Ethiopia%20🇪🇹-green)
![Status](https://img.shields.io/badge/status-30%2F30%20Commits%20Completed-brightgreen)

---

## ✨ 30-Commit UI/UX Overhaul Highlights

The entire AMEN Ride platform has undergone a comprehensive **30-commit atomic design system & accessibility overhaul** featuring:

1. **Ethiopian & Yango Brand Palette**: Yango Brand Red (`#FF2E2E`), Ethio Emerald (`#00D154`), Gold (`#FFCC00`), Dark Charcoal (`#111111` / `#1C1C1E`), Soft Canvas (`#F5F5F7`).
2. **Spring Physics & Micro-Interactions**: Press scale feedback (`active:scale-95`), floating card shadows, smooth backdrop blur, glowing pulse indicators for live drivers and surge zones.
3. **Accessibility (a11y)**: Screen-reader labels (`aria-label`), ARIA live status regions (`role="status"`), full keyboard navigation focus states, and high-contrast font hierarchies.
4. **Interactive Local Features**:
   - **Telebirr Direct & CBE Birr Payment**: QR code zoom modal, reference code auto-fill, and merchant code copy button.
   - **Interactive Safety & Emergency SOS**: Accordion guidance, one-tap emergency police call sequence, and live trip sharing link.
   - **Ride Class Switcher**: Real-time fare calculation comparing Bajaj TVS, Comfort Car, and Delivery Express.
   - **Interactive Saved Places**: Category tabs (Home, Work, Resort), address manager drawer, and swipe-to-delete.
   - **Driver Earnings & Dispatch**: Interactive weekly chart bars, online status pulse switch, dynamic surge multiplier controls.

---

## 📱 Core System Features

### Rider (Customer)
- **Real Bahir Dar Map** — OpenStreetMap & MapView dark tiles showing actual city streets (*Felege Hiwot, BDU Poly, Lake Tana Port*)
- **Live Driver Tracking** — See nearest available drivers on map in real time with location updates & animated pin physics
- **Ride Booking & Dynamic Surge Pricing** — Choose between Bajaj TVS, Comfort Car, and Delivery Express with live distance calculations
- **Digital Trip Receipt & Payment Gateway** — Integrated Telebirr & CBE Birr payment verification with QR code zoom
- **Post-Trip Driver Ratings** — Interactive 5-star rating system with customizable feedback chips
- **One-Tap Emergency SOS Alert** — Animated countdown press sequence & live GPS dispatch to local police lines
- **Bilingual i18n** — Full English & Amharic support (አማርኛ + English)
- **Promo Discount Codes** — Real-time ETB discount calculations (`AMENBAHIR`, `TANA50`, `ETHIO2026`)
- **Ride Scheduling** — Advance date & time picker modal with automated driver dispatch preview
- **Saved Favorite Places** — Instant one-tap booking with location category management

### Driver Partner
- **Online/Offline Pulse Switch** — Toggle status with glowing live indicator
- **Live GPS Broadcasting** — Phone location sent to backend with high accuracy tracking
- **Weekly Revenue Chart** — Interactive earnings bar chart, trip history, and instant Telebirr cashout
- **Driver Document Verification** — License, Kebele ID, and Bajaj permit registration tracking with upload status badges
- **Interactive Trip Request Alert** — 15-second animated radial countdown timer to accept or decline incoming rides

### Admin Dispatcher & Fleet Control
- **Fleet Control Console** — Real-time driver roster with search filter and status toggle
- **Dynamic Surge Multipliers** — Interactive surge zone editor across Bahir Dar sectors (BDU Poly 1.5x, Airport 1.8x)
- **Revenue Dashboard** — Live metric counters for total trips, active fleet, uptime, and Telebirr income

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Web | React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons |
| Mobile | React Native (Expo SDK 57) + Animated API |
| Navigation | React Navigation v7 + Glassmorphism Header & Dock |
| Maps | Leaflet / MapView + OpenStreetMap CartoDB Dark Tiles |
| Backend | Node.js + Express + Dynamic Surge Pricing Engine |
| Database | PostgreSQL with Haversine distance spatial queries |
| Payment | Telebirr Direct (🇪🇹) & CBE Birr Gateway |
| i18n | English + አማርኛ (Amharic) |

---

## 🚀 Getting Started

Check out [DEVELOPMENT.md](DEVELOPMENT.md) for full developer setup instructions, API specs, and seeder guides.

---

## 👨‍💻 Author

**babam49-dot** — [GitHub](https://github.com/babam49-dot)  
Built with ❤️ in Bahir Dar, Ethiopia 🇪🇹

