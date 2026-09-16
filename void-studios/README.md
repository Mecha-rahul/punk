# PUNK.IN — Heavyweight Streetwear & Archival Thrift Studios (Delhi, India)

[![React](https://img.shields.io/badge/React-18-black?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-black?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-black?style=flat&logo=vite)](https://vitejs.dev/)
[![GitHub](https://img.shields.io/badge/Repository-piyushpant--rgb%2FPUNK.in-black?style=flat&logo=github)](https://github.com/piyushpant-rgb/PUNK.in)

An architectural, editorial e-commerce platform engineered for **PUNK.IN / PUNK THRIFT STUDIOS**, based in **New Delhi, India**.

---

## 🇮🇳 Features Tailored for PUNK.IN

1. **INR Default Currency (₹)**:
   - Full Indian Rupee integration with standard `₹` pricing (`₹1,399`, `₹2,899`, etc.).
   - Multi-currency switcher supported for international clients (`USD $`, `EUR €`, `GBP £`).
   - Free Pan-India express delivery milestone progress meter (Free shipping on orders above ₹2,499).

2. **Image Gallery with Next / Prev (`<` `>`) Swipe Buttons**:
   - Easily cycle through all product angles with interactive swipe/slide buttons on the main view.
   - Keyboard arrow (`←` `→`) navigation & horizontal thumbnail strip.

3. **Realistic 200–340 GSM Heavyweight Specs**:
   - 240 GSM organic combed cotton graphic tees.
   - 280 GSM cotton twill pleated parachute pants.
   - 340 GSM custom knit loopback French Terry boxy hoodies.

4. **Delhi Streetwear & Archival Thrift Lookbook**:
   - Smooth horizontal swipe lookbook gallery with interactive *"Shop the Look"* hotspots.

5. **Slide-Over Bag & Checkout**:
   - Promo coupon code system (`PUNK10` for 10% Delhi VIP discount).
   - UPI / Cards / NetBanking checkout simulation.

6. **Drop Countdown & VIP List**:
   - Live timer for **Drop 02 // Delhi Underground**.

---

## 🖼️ How to Use Your Own Images (Free Hosting)

You can host your custom product photos for free using any of these services and plug the URLs into `src/data/products.js`:

### 1. **Firebase Storage (Google)**
- Create a free project at [console.firebase.google.com](https://console.firebase.google.com).
- Go to **Storage**, create a bucket, and upload your high-res product photos.
- Copy the public image URLs directly into `PRODUCTS_DATA` in `src/data/products.js`!

### 2. **Cloudinary (Free Tier)**
- Sign up at [cloudinary.com](https://cloudinary.com) (free 25 GB storage & automated WebP compression).
- Upload photos and copy image URLs into `products.js`.

### 3. **Netlify / GitHub Assets**
- Place your image files directly in the `public/images/` folder inside this repository.
- Reference them in `products.js` as `/images/hoodie-black-1.jpg`.

---

## 🚀 Quick Start & Deployment

### 1. Instant Preview
Double-click [index.html](file:///C:/Users/vipin%20Pant/.gemini/antigravity/scratch/void-studios/index.html) to open the website in Chrome, Edge, or Firefox.

### 2. Run with Vite
```bash
npm install
npm run dev
```

### 3. Push to GitHub
```bash
git add .
git commit -m "feat: PUNK.in Delhi streetwear store with INR, 200-340 GSM, and image swipe"
git push origin main
```

---

© 2026 **PUNK THRIFT STUDIOS (PUNK.IN)**. Developed by [piyushpant-rgb](https://github.com/piyushpant-rgb).
