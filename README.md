# 🚗 AMEN Ride — Bahir Dar, Ethiopia

> A production-ready, full-stack ride-hailing application built for Bahir Dar, Ethiopia 🇪🇹.
> Inspired by Uber's design system, built with React Native (Expo) + Node.js + PostgreSQL.

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-black)
![Stack](https://img.shields.io/badge/stack-React%20Native%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![City](https://img.shields.io/badge/city-Bahir%20Dar%2C%20Ethiopia%20🇪🇹-green)
![Status](https://img.shields.io/badge/status-Active%20%26%20Production%20Ready-brightgreen)

---

## 📱 Core System Features

### Rider (Customer)
- **Real Bahir Dar Map** — OpenStreetMap & MapView dark tiles showing actual city streets
- **Live Driver Tracking** — See nearest available drivers on map in real time with location updates
- **Ride Booking & Peak Surge Pricing** — Choose between Standard Bajaj, Executive Bajaj, and Comfort Car
- **Digital Trip Receipt & Payment Gateway** — Integrated Telebirr & CBE Birr local payment processing
- **Post-Trip Driver Ratings** — Interactive 5-star rating system, feedback tags, and reviews
- **One-Tap Emergency SOS Alert** — Live GPS dispatch to local Bahir Dar police lines
- **Amharic / English** — Full bilingual support (አማርኛ + English)

### Driver Partner
- **Online/Offline Toggle** — Go online to start receiving trip requests
- **Live GPS Broadcasting** — Phone location sent to backend every 5 seconds
- **Weekly Revenue Chart** — Bar chart showing Mon–Sun earnings breakdown
- **Trip Request Alert** — 15-second countdown to accept or decline incoming requests

### Admin Dispatcher & Fleet Control
- **Fleet Console** — Monitor all active drivers across Bahir Dar
- **Revenue Dashboard** — Today's earnings, active fleet, total trips, uptime
- **Driver Status Management** — Toggle drivers online/offline remotely & run GPS simulations

---

## 🗺️ GPS Tracking & Dispatch Architecture

```
Driver Phone (expo-location)
    │  GPS coordinates every 5s
    ▼
POST /api/driver/location
    │  lat, lng saved to PostgreSQL via DriverModel
    ▼
GET /api/driver/nearby?lat=X&lng=Y
    │  Haversine formula → sorted by distance
    ▼
Customer Map (MapView / Leaflet)
    │  Vehicle markers updated in real-time
    ▼
Nearest driver matched ⭐
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Web | React 18 + TypeScript + Vite + Tailwind CSS |
| Mobile | React Native (Expo SDK 57) |
| Navigation | React Navigation v7 + Custom Glassmorphism BottomNav |
| Maps | MapView + OpenStreetMap CartoDB Dark |
| GPS | expo-location |
| Icons | Lucide React + @expo/vector-icons |
| Backend | Node.js + Express |
| Controllers / Models | Modular DB Abstraction & Rate Limiter |
| Database | PostgreSQL |
| ORM | pg (node-postgres) |
| Payment | Telebirr (🇪🇹) & CBE Birr |
| Language | English + አማርኛ (Amharic) |

---

## 🔐 Advanced System Capabilities

- **Bank Payment Verification**: Electronic transfer reference code verification (`POST /api/payments/verify-transfer`) for Telebirr and CBE Birr.
- **In-Car Cash Confirmation**: Driver payment collection tracking (`POST /api/payments/confirm-cash`).
- **Driver Heartbeat Monitoring**: Real-time driver GPS pinging (`POST /api/driver/ping`) & active connection timeout checks (`GET /api/driver/status-check/:id`).
- **Real Bahir Dar City Geocoding**: 14+ real city landmarks (*Felege Hiwot, Grand Resort, BDU Peda, BiT, Belay Zeleke Airport, Bezawit Palace*) with exact GPS coordinates.

---

## 🚀 Getting Started

Check out [DEVELOPMENT.md](DEVELOPMENT.md) for full developer setup instructions, API specs, and database seeder guides.

---

## 👨‍💻 Author

**babam49-dot** — [GitHub](https://github.com/babam49-dot)
Built with ❤️ in Ethiopia 🇪🇹
