# Bolt AI - Smart Agricultural Companion (by Team 11)

An intelligent, mobile-first agricultural operating system built with React, Vite, Tailwind CSS, Google Maps Geocoding & Satellite Imagery, and Recharts.

---

## 🚀 Quick Start Guide (Run Locally on Your Laptop)

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your laptop.
- Check with: `node -v` and `npm -v`
- Download if needed: https://nodejs.org/

---

### Step 1: Extract the ZIP
Extract `bolt-ai-project.zip` into a folder on your computer.

### Step 2: Open Terminal / Command Prompt
Open your terminal (PowerShell, Command Prompt, or Terminal on macOS/Linux) and navigate into the extracted folder:
```bash
cd bolt-ai-project
```

### Step 3: Install Dependencies
Run:
```bash
npm install
```

### Step 4: (Optional) Set your Google Maps API Key
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`, verify `VITE_GOOGLE_MAPS_API_KEY`:
```env
VITE_GOOGLE_MAPS_API_KEY="AIzaSyDBH_ph0zXv9MgNSwqQI8pBXfEwmh1evPc"
```

### Step 5: Start the Development Server
Run:
```bash
npm run dev
```

Your app will start at:
👉 **`http://localhost:3000`** (or the port shown in your terminal).
Open that URL in your browser (Chrome, Edge, Safari, Firefox).

---

## 🌟 Key Features
- **⚡ Bolt Daily Audio Dispatch (Kisan Radio)**: 30-sec instant regional farm bulletin in English, Hindi, and Telugu.
- **📍 Live GPS & Google Maps Geocoding**: Real-time GPS detection, Google Maps verified address, and interactive satellite farm view.
- **🌾 Live APMC Mandi Rates**: Real-time trading prices, 5-day trend line charts, nearest market distance calculation, and WhatsApp sharing.
- **🌧️ Micro-Climate & Smart Irrigation**: 3 PM rainfall warning radar, soil moisture telemetry, and smart pump automation.
- **✨ 1-Tap Quick Question Palette**: Instant agronomic answers without flaky speech recognition.
- **🛠️ Interactive Visual Edit Mode**: Live presentation editor to adjust prices, locations, and parameters directly.
- **Team Credit**: Proudly built by **Team 11**.
