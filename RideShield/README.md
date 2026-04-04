# 🛡️ RideShield — AI-Powered Income Protection for Delivery Partners

> Parametric income insurance for gig delivery workers. Weekly coverage, automatic payouts, zero claims.

![RideShield Demo](https://img.shields.io/badge/Status-Live-green) ![No API Keys](https://img.shields.io/badge/API%20Keys-Not%20Required-blue) ![Static App](https://img.shields.io/badge/Deploy-Static%20HTML-orange)

---

## 🚀 How to Run

### Option 1: Open Directly (Simplest)
Just double-click `index.html` — it opens in your browser. Done!

### Option 2: Local Server (Recommended)
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/RideShield.git
cd RideShield

# Run with any local server:

# Using npx (Node.js required)
npx http-server . -p 8080

# OR using Python
python -m http.server 8080

# OR using VS Code Live Server extension — right-click index.html → Open with Live Server
```
Then open **http://localhost:8080** in your browser.

### Option 3: GitHub Pages (Free Hosting)
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → select `main` → `/ (root)` → Save
4. Your app will be live at `https://YOUR_USERNAME.github.io/RideShield/`

### Option 4: Netlify / Vercel (One-Click Deploy)
1. Go to [netlify.com](https://netlify.com) → **Add new site → Import existing project**
2. Connect your GitHub repo
3. Deploy — no build settings needed!

---

## 🔑 Demo Accounts (Pre-loaded)

| Name | Email | Password | City | Plan |
|------|-------|----------|------|------|
| Ravi Kumar | ravi@sample.com | test123 | Chennai | Growth |
| Priya Sharma | priya@sample.com | test123 | Delhi | Essential |
| Arjun Reddy | arjun@sample.com | test123 | Mumbai | Shield Max |

Or **create your own account** via Sign Up!

---

## 📱 Features

- **Landing Page** — Product overview with key highlights
- **Auth** — Login / Sign Up with full registration
- **Plans** — 3 weekly tiers (₹49 / ₹69 / ₹99) with dynamic city-based pricing
- **Dashboard** — Live weather, wallet, coverage details, claims history
- **Simulate Disruptions** — Trigger rain, heat, AQI, outage events
- **Auto-Claims** — Zero-click claim pipeline with instant payout
- **AI Fraud Detection** — 5-layer simulated fraud check on every claim
- **Admin Panel** — Analytics with Chart.js charts, user management, fraud alerts
- **Wallet** — Full transaction history with running balance

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Design | Glassmorphism, Space Grotesk + Source Serif 4 (Google Fonts) |
| Charts | Chart.js (loaded via CDN) |
| Storage | localStorage (no database needed) |
| APIs | None required — all data is simulated |

---

## 📁 Project Structure

```
RideShield/
├── index.html    # Single-page app (all 5 views)
├── style.css     # Design system & responsive styles
├── script.js     # Application logic, AI simulation, Chart.js
└── README.md     # This file
```

---

## ⚡ Parametric Triggers

| Trigger | Condition | Payout |
|---------|-----------|--------|
| 🌧️ Heavy Rain | Rainfall > 50mm/day | ₹800 |
| 🔥 Extreme Heat | Temperature > 42°C | ₹600 |
| 😷 Severe AQI | AQI > 300 for 4+ hrs | ₹500 |
| 📱 App Outage | Platform down 2+ hrs | ₹400 |

---

Built with ❤️ for India's delivery workers.
