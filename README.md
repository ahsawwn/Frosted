# Frosted | Intelligent ERP & POS Ecosystem 🍦🍰

[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-Oxygen_Engine-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React_18-TypeScript-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Optimization](https://img.shields.io/badge/Layout-1080p_Optimized-db2777?style=for-the-badge)](https://github.com/Ahsawn)

**Frosted** is a professional-grade Enterprise Resource Planning (ERP) suite and Point of Sale (POS) system specifically architected for high-volume creameries and bakeries. Designed with a **Neo-Brutalist** aesthetic, Frosted prioritizes high-speed operational workflows, hardware-accurate thermal printing, and zero-latency state management.

---

## 🏗 Engineering Excellence

### 1. Zero-Latency Design System (Oxygen Engine)
Frosted utilizes a **CSS-first variable architecture** powered by **Tailwind CSS v4**. This allows the entire enterprise suite to undergo a complete visual identity shift without expensive React re-renders.
* **Classic Frosted:** The signature Pink/White high-contrast identity.
* **Midnight Glaze:** A premium, low-light Dark/Gold aesthetic for high-end retail.
* **Emerald Mint:** Focused on stability and financial oversight.
* **Arctic Blue:** A calm, SaaS-standard workspace for corporate administration.
* **Terminal Night:** A deep navy high-contrast mode for late-night inventory management.

### 2. Viewport-Locked "Kiosk" Architecture
Engineered specifically for **1920x1080** touch-terminals, Frosted eliminates browser-native scrolling in favor of a dedicated viewport management strategy:
* **Smart Navigation:** A toggle-capable bottom navigation bar that slides to maximize operational real estate.
* **Touch-Optimized Targets:** Oversized interactive elements designed for fast-paced, high-pressure environments.
* **Zero-Scroll Modules:** Every core interface (POS, Stock, Finance) fits precisely within a 1080p frame to keep all mission-critical data visible.

### 3. Hardware-Accurate Thermal Printing
Unlike standard web printing, Frosted includes a specialized **Thermal Graphics Engine**:
* **Thermal Rasterization:** Custom CSS `@media print` rules designed for 80mm hardware.
* **Fiscal Logic Integration:** Automated GST mapping (5% for Card / 15% for Cash) embedded into the print stream.
* **Audit Protection:** Native "DUPLICATE" watermarking logic for reprinted historical logs to ensure fiscal compliance.

---

## 🛠 Functional Documentation

### **POS Terminal Intelligence**
* **Atomic Cart Engine:** A memoized state-driven order engine capable of handling complex modifiers and discounts with sub-100ms calculation latency.
* **Session Persistence:** State is synchronized with `localStorage` to ensure zero data loss during power fluctuations or accidental terminal resets.

### **Warehouse & Supply Chain Logic**
* **Critical Stock Pulse:** Automated monitoring that triggers visual pulse animations when key ingredients (Milk, Flour, Sugar) fall below safety thresholds.
* **Multi-Unit Scaling:** Support for complex bakery conversions (Liters to Milliliters, Kilograms to Grams) with real-time stock patching.

---

## 💻 Tech Stack & Pattern Design

| Layer | Technology / Pattern |
| :--- | :--- |
| **Frontend** | React 18, TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 (Oxygen Engine) |
| **State** | Context API (Themes/Auth), LocalState (POS Logic) |
| **Icons** | Lucide React (Optimized Vectors) |
| **Export** | react-to-print, jsPDF, html2canvas |
| **Architecture** | Modular ERP Viewport Pattern |

---

## 📂 Project Structure

```text
Frosted/
├── src/
│   ├── context/      # Global Identity & Identity Management
│   ├── modules/      # POS, Warehouse, Staff, & CRM Logic
│   ├── layouts/      # 1080p Viewport Skeleton & Navigation
│   ├── services/     # Printing Engine & PDF Generation
│   ├── hooks/        # Custom Hardware & Theme Interaction Hooks
│   └── styles/       # Tailwind 4 CSS Variables & Design Tokens
```
---

## 🛡 Security & Reliability

* **Administrative Guardrails:** High-level security alerts required for all transaction reversals or stock deletions.

* **Input Sanitization:** All fiscal and inventory inputs are strictly parsed to prevent database inconsistencies.

* **Theme Pre-fetching:** Prevents "Style Flashing" by applying CSS variables before the initial React mount.

---

## 🎓 The Developer

**Frosted** was engineered by **ahsawwn**, Founder of **Oftsy Systems**.

I am a Full-Stack Developer and Entrepreneur dedicated to building high-performance, business-centric software solutions that bridge the gap between complex data and intuitive design.


---
**©** 2026 Frosted (SMC-Private) Limited. Built by **ahsawwn**.
