# 🚗 AMEN Ride — Bahir Dar, Ethiopia

> A full-stack ride-hailing application built for Bahir Dar, Ethiopia.
> Inspired by Uber's design system, built with React Native (Expo) + Node.js + PostgreSQL.

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-black)
![Stack](https://img.shields.io/badge/stack-React%20Native%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![City](https://img.shields.io/badge/city-Bahir%20Dar%2C%20Ethiopia%20🇪🇹-green)

---

## 📱 Features

### Rider (Customer)
- **Real Bahir Dar Map** — OpenStreetMap dark tiles showing actual city streets
- **Live Driver Tracking** — See nearest available drivers on map in real time
- **Ride Booking** — Choose between Standard, Comfort, Boda, and Intercity rides
- **Digital Trip Receipt** — Itemized ETB fare breakdown with Telebirr payment info
- **Amharic / English** — Full bilingual support (አማርኛ + English)

### Driver Partner
- **Online/Offline Toggle** — Go online to start receiving trip requests
- **Live GPS Broadcasting** — Phone location sent to backend every 5 seconds
- **Weekly Revenue Chart** — Bar chart showing Mon–Sun earnings breakdown
- **Trip Request Alert** — 15-second countdown to accept or decline

### Admin Dispatcher
- **Fleet Console** — Monitor all active drivers across Bahir Dar
- **Revenue Dashboard** — Today's earnings, active fleet, total trips, uptime
- **Driver Status Management** — Toggle drivers online/offline remotely

---

## 🗺️ GPS Tracking Architecture

```
Driver Phone (expo-location)
    │  GPS coordinates every 5s
    ▼
POST /api/driver/:id/location
    │  lat, lng saved to PostgreSQL
    ▼
GET /api/driver/nearby?lat=X&lng=Y
    │  Haversine formula → sorted by distance
    ▼
Customer Map (Leaflet + OpenStreetMap)
    │  Car pins updated every 5 seconds
    ▼
Nearest driver highlighted in white ⭐
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (Expo SDK 57) |
| Web | React Native Web |
| Navigation | React Navigation v7 |
| Maps | Leaflet.js + OpenStreetMap CartoDB Dark |
| GPS | expo-location |
| Icons | @expo/vector-icons (Ionicons) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | pg (node-postgres) |
| Payment | Telebirr (🇪🇹) |
| Language | English + አማርኛ (Amharic) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Expo CLI

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # add your PostgreSQL credentials
psql -U postgres -d amen_ride -f db/schema.sql
npm start
```

### Mobile Setup
```bash
cd mobile
npm install
npx expo start --web    # web browser
npx expo start          # iOS/Android
```

---

## 📍 Bahir Dar Landmarks (Seeded)

| Location | Coordinates |
|----------|-------------|
| Bahir Dar Airport (Felege Hiwot) | 11.6041°N, 37.3724°E |
| Grand Resort Hotel (Lake Tana) | 11.5936°N, 37.3950°E |
| Bahir Dar University | 11.5880°N, 37.3812°E |
| Bahir Dar Bus Terminal | 11.5810°N, 37.3870°E |

---

## 👨‍💻 Author

**babam49-dot** — [GitHub](https://github.com/babam49-dot)
Built with ❤️ in Ethiopia 🇪🇹
