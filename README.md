# Frosted | Intelligent ERP & POS Ecosystem 🍦🍰

[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-Oxygen_Engine-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React_19-TypeScript-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Deployment](https://img.shields.io/badge/Live_Demo-Frosted_Cloud-db2777?style=for-the-badge)](https://frosted.ahsawwn.com)

**Frosted** is a professional-grade Enterprise Resource Planning (ERP) suite and Point of Sale (POS) system specifically architected for high-volume creameries and bakeries. Designed with a premium aesthetic, Frosted prioritizes high-speed operational workflows, hardware-accurate thermal printing, and zero-latency state management.

![Dashboard](https://res.cloudinary.com/dyp1ylpbc/image/upload/v1777463332/Screenshot_2026-04-25_182017_rdpq3h.png)

---

## 🌐 Live Deployment
**Production URL:** [https://frosted.ahsawwn.com](https://frosted.ahsawwn.com)

---

## 🏗 Enterprise Architecture (Dual-Engine Strategy)

Frosted uses a specialized dual-backend architecture to ensure both development speed and production stability on shared hosting environments:

### 1. Development Engine (`/server`)
* **Technology:** Prisma ORM + PostgreSQL.
* **Purpose:** Rapid feature iteration and schema management.
* **Best for:** Local development and high-resource dedicated servers.

### 2. Production Engine (`/server-prod`)
* **Technology:** Raw SQL (`pg`) + Neon Serverless (WebSockets).
* **Architecture:** Completely Prisma-free to reduce memory overhead.
* **Purpose:** Optimized for Shared Hosting (cPanel/Spaceship) where port 5432 is often blocked.
* **Connectivity:** Uses the Neon Serverless driver to tunnel database queries over HTTPS (Port 443).

### 3. Frontend Terminal (`/client`)
* **Technology:** React 19 + Vite + Tailwind CSS v4.
* **Design System:** Oxygen Engine (CSS-variable driven for instant theme swapping).
* **Optimization:** 1080p Viewport-locked for dedicated Kiosk terminals.

---

## 📂 Project Structure

```text
Frosted/
├── client/           # React 19 Frontend (Vite)
├── server/           # Development Backend (Prisma + PostgreSQL)
├── server-prod/      # Production Backend (Raw SQL + Neon Serverless)
└── _legacy/          # Archived codebase versions
```

---

## 🗺 System Modules

*   **Sales Terminal (POS):** High-velocity transaction interface with intelligent tax mapping (5% Card / 15% Cash).
*   **Kitchen Display (KDS):** Digital order orchestration with real-time status tracking (`PENDING` → `READY`).
*   **Inventory Pulse:** Real-time stock monitoring with visual threshold alerts.
*   **Production Logic (Recipes):** Automated Bill of Materials (BOM) linking products to raw ingredients.
*   **Customer Display:** Synchronized secondary display for customer order verification.

---

## 🎓 Contact & Support

**Frosted** is engineered for excellence. For inquiries regarding custom deployments, enterprise licensing, or technical support, please contact:

*   **Developer:** [ahsawwn](https://github.com/ahsawwn)
*   **Email:** [me@ahsawwn.com](mailto:me@ahsawwn.com)
*   **Website:** [ahsawwn.com](https://ahsawwn.com)

---
**©** 2026 Oftsy (SMC-Private) Limited. Built with passion for the bakery industry. 🚀🏁🧤
