# StayFinder 🏡 — Production-Grade Vacation Rental & Booking Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay_Payments-0C2340?style=for-the-badge&logo=razorpay&logoColor=528FF0)](https://razorpay.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Concierge-8E75C2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

> **Live Application**: [https://stay-finder-frontend-nine.vercel.app](https://stay-finder-frontend-nine.vercel.app)  
> **Author**: [Pragyanand Patel](https://github.com/pragyanand02) (National Institute of Technology, Raipur)

---

## 🌟 Overview

**StayFinder** is a full-stack, eco-conscious vacation rental and property booking platform built with the MERN stack (React 18, Node.js, Express, MongoDB Atlas). Featuring 15+ curated luxury destinations across India (Goa, Jaipur, Udaipur, Manali, Kerala, Mumbai, Rishikesh) and International hotspots (Bali, Paris, Dubai, Santorini, Tokyo, Switzerland, Maldives), StayFinder combines modern travel booking with fintech security and autonomous AI concierges.

---

## 🚀 Key Features

### 1. 💳 Fintech & Payment Gateway Integration
- **Razorpay Checkout**: Seamless payment processing supporting Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), and Net Banking.
- **Cryptographic Security**: SHA-256 HMAC webhook signature verification for tamper-proof booking confirmations.
- **Dynamic Customer Binding**: Automated passing of authenticated user profile details to the checkout gateway.

### 2. 🤖 AI Concierge & Smart Discovery Engine
- **Database-Aware Intelligent Search**: Instant regex & full-text natural language queries (e.g. *"Show me villas in Goa"*, *"Cabins in Manali"*).
- **Gemini LLM Integration**: Multimodal conversational AI assistant for booking policies, property inquiries, and platform navigation.
- **Quick Action Chips**: Mobile-friendly prompt carousel for one-tap destination exploration.

### 3. 🛡️ 4-Step Host KYC Verification Workflow
- **Identity Document Submission**: Aadhaar and PAN card validation for prospective hosts.
- **Role-Based Access Control (RBAC)**: Strict permission tiers for `Guest`, `Host`, and `Admin`.
- **Admin Review Panel**: Live verification dashboard to inspect credentials and grant hosting privileges.

### 4. 🌱 Eco-Metrics & Carbon Footprint Calculation
- Automated **Carbon Footprint estimation** (kg CO2e per night) based on property size, room type, and energy amenities (HVAC, heated pools).

### 5. 📱 Mobile-First Responsive Design
- **Sticky Mobile Bottom Navigation**: Airbnb-style phone navigation bar with Explore, Trips, Host Dashboard, and Profile tabs.
- **One-Click Destination Filters**: Quick chips for instant city and property-type filtering.

---

## 🏗️ System Architecture

```text
StayFinder/
├── frontend/               # React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/            # Configured Axios instance with interceptors
│   │   ├── components/     # Navbar, Footer, MobileNav, SearchBar, PropertyCards, ChatWidget
│   │   ├── contexts/       # AuthContext (JWT session & user state)
│   │   ├── pages/          # Home, Details, Bookings, Dashboard, KYC, Admin
│   │   └── utils/          # Razorpay payment helpers
│   └── package.json
│
├── backend/                # Node.js + Express.js REST API Server
│   ├── src/
│   │   ├── config/         # MongoDB Atlas connection & cloud setup
│   │   ├── controllers/    # Auth, Listings, Bookings, Payments, KYC, Assistant
│   │   ├── middleware/     # JWT Auth, Role Authorization (RBAC), Error Handlers
│   │   ├── models/         # User, Listing, Booking, HostVerification schemas
│   │   ├── routes/         # Express API routes
│   │   ├── scripts/        # 15+ destination database seeder
│   │   └── services/       # Business logic (Carbon scoring, Payment verify)
│   └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide/Heroicons |
| **Backend** | Node.js, Express.js, Express Validator, Bcrypt.js, CORS |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), HttpOnly Cookies |
| **Payments** | Razorpay Node.js SDK & Checkout JS |
| **AI / LLM** | Google Gemini API (`@google/genai`), Intelligent Regex Platform Engine |
| **Cloud & Media** | Cloudinary Image CDN, Vercel Deployment |

---

## ⚡ Quickstart Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Razorpay Test Key ID & Secret

### 1. Clone the Monorepo
```bash
git clone https://github.com/pragyanand02/StayFinder.git
cd StayFinder
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/`:
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_API_KEY=your_gemini_api_key
```

Seed initial destinations and verified hosts:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the Vite development server:
```bash
npm run dev
```

---

## 📄 License & Attribution
Developed with ❤️ by [Pragyanand Patel](https://github.com/pragyanand02). Licensed under the MIT License.
