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

## 🗺 System Modules & Orchestration

Frosted is divided into specialized operational nodes, each engineered for a specific role within the enterprise.

### **1. Management Intelligence (Dashboard)**
The nerve center of the ecosystem, providing real-time telemetry into store health.
* **Metric Pulses:** Instant visibility into Sales Today, Order Volume, and Stock Alerts.
* **Stream Analytics:** A live terminal feed of the latest transactions.
* **Role-Awareness:** Automatically filters KPIs based on whether an Admin, Manager, or Chef is logged in.

### **2. Sales Terminal (POS)**
A high-velocity transaction interface built for zero-latency checkout.
* **Atomic Cart:** Sub-100ms calculation of taxes, discounts, and custom modifiers.
* **Fiscal Logic:** Intelligent tax mapping (5% Card / 15% Cash) based on payment terminal selection.
* **Voucher Integration:** One-click redemption of marketing coupons and loyalty vouchers.

### **3. Kitchen Display (KDS)**
Digital order orchestration that replaces volatile paper tickets.
* **Status Lifecycle:** High-contrast tracking through `PENDING`, `PREPARING`, and `READY` phases.
* **Lead Time Logic:** Displays preparation requirements to help chefs prioritize bottleneck items.
* **Phase Mutation:** Simple, touch-optimized "Next Phase" controls for fast-paced kitchen work.

### **4. Warehouse & Logistics (Inventory)**
Real-time monitoring of raw materials and bakery essentials.
* **Threshold Alerts:** Visual pulse animations for items falling below safety stock levels.
* **Movement History:** Historical logs of every stock addition or deduction.
* **Inventory Pulse:** Quick-glance indicators of overall warehouse health.

### **5. Production Logic (Recipes/BOM)**
The Bill of Materials (BOM) engine that links products to their raw ingredients.
* **Composition Protocol:** Define exactly how much milk, sugar, or flour goes into every scoop or cake.
* **Multi-Unit Scaling:** Automated conversion between bulk (Kgs/Ltrs) and production units (Gms/Mls).
* **Costing Awareness:** Pre-calculates production requirements for high-volume orders.

### **6. Catalog & Merchandising (Products)**
A centralized repository for all items sold at the front counter.
* **Categorization:** Logical grouping (e.g., Ice Creams, Toppings, Beverages) for fast POS navigation.
* **Identity Provisioning:** Manage pricing, imagery, and category assignments from a single terminal.
* **Prep-Time Metadata:** Set specific lead times for every product to feed the KDS engine.

### **7. Fiscal Audit (Transactions)**
Comprehensive historical ledger for financial transparency.
* **Legacy Search:** Instantly locate orders by ID or date for refunds and disputes.
* **Thermal Reprinting:** Generate "DUPLICATE" watermarked receipts for historical orders.
* **Status Audit:** Track the final financial and fulfillment status of every transaction.

### **8. Customer Relations (CRM)**
Identity management and loyalty orchestration.
* **Loyalty Ledger:** Track point balances and reward thresholds for every customer.
* **Identity Shard:** Maintain contact details and purchase history for personalized service.
* **Walk-In Support:** Seamless handling of anonymous transactions without data overhead.

### **9. Personnel & Access (Staff)**
Human Resource management with hardware-level security.
* **Role Provisioning:** Assign staff to `SUPERADMIN`, `ADMIN`, `CASHIER`, or `KITCHEN` tiers.
* **Access Control:** Enforce UI-level filtering to prevent unauthorized data access.
* **Operator Pulse:** View currently active staff nodes on the secure terminal.

### **10. Marketing Hub (Coupons)**
Dynamic campaign management for store promotions.
* **Rule Engine:** Set expiry dates, usage limits, and minimum order requirements.
* **Redemption Tracking:** See exactly how many times a voucher has been used in production.

### **11. System Engine (Settings)**
Global configuration and branding controls.
* **Receipt Customization:** Live preview of thermal fonts, sizes, and branding headers.
* **Theme Identity:** Instantly swap the entire UI between 5 professional color skins.
* **Hardware Toggles:** Activate "Kiosk Mode" or "Auto-Print" protocols for specific terminals.

---

## 💻 Tech Stack & Pattern Design

| Layer | Technology / Pattern |
| :--- | :--- |
| **Frontend** | React 18, TypeScript (Strict Mode) |
| **Database** | Prisma ORM, PostgreSQL (Singleton Logic) |
| **Styling** | Tailwind CSS v4 (Oxygen Engine) |
| **State** | Context API (Themes/Auth), LocalStorage (Persistence) |
| **API** | Express.js REST Framework |
| **Printing** | Specialized Thermal Rasterization (72mm) |

---

## 📂 Project Structure

```text
Frosted/
├── src/
│   ├── components/   # Atomic UI & Receipt Templates
│   ├── pages/        # Business Logic Shards (POS, KDS, HR)
│   ├── routes/       # API Gateway & Backend Logic
│   ├── lib/          # Prisma & Database Connectors
│   └── styles/       # Tailwind Design Tokens
```

---

## 🛡 Security & Reliability

* **Session Persistence:** State is synchronized with `localStorage` and Backend DB to ensure zero data loss during power fluctuations.
* **Input Sanitization:** All fiscal and inventory inputs are strictly parsed at the schema level.
* **Thermal Accuracy:** CSS-first print strategy ensures perfect scaling on 72mm hardware without driver overhead.

---

## 🎓 The Developer

**Frosted** was engineered by **ahsawwn**, Founder of **Oftsy Systems**.

I am a Full-Stack Developer and Entrepreneur dedicated to building high-performance, business-centric software solutions that bridge the gap between complex data and intuitive design.

---
**©** 2026 Frosted (SMC-Private) Limited. Built by **ahsawwn**. 🚀🏁🧤
