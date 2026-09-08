# AMEN Ride — Developer Setup & Integration Guide

Welcome to **AMEN Ride**, a modern ride-hailing platform built specifically for **Bahir Dar, Ethiopia** 🇪🇹.

---

## 🏗️ Architecture Overview

The system is structured as a full-stack monorepo:

- **`backend/`**: Node.js + Express API server with PostgreSQL database integration.
  - Dynamic surge pricing calculation engine (`estimateFareAndEta`).
  - Controllers & routes for trips, driver GPS tracking, dynamic surge pricing, and health checks.
  - In-memory rate limiting and request authorization middleware.
  - Seeder script for initial driver fleet data in Bahir Dar.
- **`mobile/`**: React Native / Expo application for riders and drivers.
  - Cross-platform support for iOS, Android, and Web (`MapScreen.web.js`).
  - Theme system tokens (`ThemeContext.js`) matching Yango Brand Red (`#FF2E2E`) and Ethio Emerald (`#00D154`).
  - Real-time GPS broadcasting hook (`useDriverGPS.js`).
  - Bilingual internationalization (`translations.js` in English & Amharic 🇪🇹).
  - Admin dispatch console, digital trip receipts, Telebirr payment modals, and vehicle fare estimation.
- **`web/`**: Vite + React 18 + TypeScript web client.
  - Accessible components, micro-interactions, responsive mobile web wrappers.

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
npm install

# Configure Environment
# Create .env with DATABASE_URL or PostgreSQL config
npm start
```
The server will start on `http://localhost:5000`. Test endpoint: `http://localhost:5000/health`.

### 2. Database Seeding (Optional)
```bash
cd backend
node db/seed.js
```

### 3. Mobile / Web App Setup
```bash
cd mobile
npm install
npm run dev
```

---

## 🗺️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server uptime, DB status, online driver count |
| `POST` | `/api/trips/estimate` | Fare and ETA dynamic surge calculator |
| `GET` | `/api/ride-options` | Available vehicles, distance fare & surge pricing |
| `GET` | `/api/driver/nearby` | Search online drivers near lat/lng coordinates |
| `POST` | `/api/driver/location` | Broadcast driver live GPS location |
| `POST` | `/api/trips` | Request a new ride |
| `GET` | `/api/trips/active` | Fetch active trips |
| `PUT` | `/api/trips/:id/status` | Transition trip status (`ACCEPTED`, `COMPLETED`, etc.) |
| `POST` | `/api/payments/verify-transfer` | Telebirr / CBE Birr transfer verification |

---

## 🎨 Theme Palette Tokens

```javascript
{
  accent: '#FF2E2E', // Yango Brand Red
  ethioGreen: '#00D154', // Ethio Emerald
  ethioGold: '#FFCC00', // Ethiopian Flag Gold
  backgroundDark: '#0F172A',
  cardDark: '#1C1C1E',
  backgroundLight: '#F5F5F7',
}
```

---

## 🌐 Amharic i18n
All user interface elements support seamless switching between English (`EN`) and Amharic (`AM`).

