# 🚀 Oftsy Deployment Guide: Spaceship Shared Hosting

Deploying an Express + React + PostgreSQL app to shared hosting requires a few specific steps since shared hosting is optimized for PHP. Follow this guide to get your "Spaceship" online.

---

## 1. The Database (The Most Important Part)
Spaceship shared hosting typically supports **MySQL**, but your app uses **PostgreSQL**. To avoid rewriting your code, the best path is to use a free external PostgreSQL provider.

### Recommended: [Supabase](https://supabase.com) or [Neon.db](https://neon.tech)
1.  Create a free account.
2.  Create a new project/database.
3.  Copy the **Connection String** (it should look like `postgresql://user:pass@host:5432/db`).
4.  **Important**: In your `DATABASE_URL`, ensure you add `?pgbouncer=true` if using Supabase or Neon with Prisma connections to avoid connection limits.

---

## 2. Prepare the Project Locally
Before uploading, you must build the project on your computer.

1.  **Update `.env`**: Make sure your local `server/.env` (or a copy) has the production `DATABASE_URL` you just got.
2.  **Build All**:
    Run this from the project root:
    ```bash
    # Build the Prisma-free Production Server
    cd server-prod && npm install && npm run build
    
    # Build the Client
    cd ../client && npm install && npm run build
    ```
    *This creates `server-prod/dist` and `client/dist`.*

---

## 3. Uploading Files (Prisma-Free Version)
Since we are using the lightweight `server-prod` for your host:

1.  **Server Files**: Open `/home/vkzfxaotdq/server` on your host and upload the **contents** of your local `server-prod/` folder (specifically `dist` and `package.json`).
2.  **Client Files**: Go to `/home/vkzfxaotdq/` and create a `client` folder. Inside it, upload your local `client/dist` folder.
3.  **Final structure on host should look like this**:
    ```text
    /home/vkzfxaotdq/
      ├── server/  <-- (Contains your Prisma-Free Backend)
      │    ├── dist/ 
      │    └── package.json
      └── client/
           └── dist/ (Your built UI)
    ```

---

## 4. Server Configuration (Spaceship / Launchpad)
In your Spaceship dashboard, first create the subdomain **frosted.ahsawwn.com** and then configure the Node.js app:

1.  Go to **Node.js Setup**.
2.  **Create Application**:
    -   **Node.js Version**: 20.x or higher.
    -   **Application Root**: `/home/vkzfxaotdq/server`
    -   **Application URL**: `frosted.ahsawwn.com`
    -   **Startup File**: `dist/index.js`
3.  **Environment Variables**: Add these in the dashboard:
    -   `NODE_ENV`: `production`
    -   `DATABASE_URL`: (Your Supabase/Neon link)
    -   `CLIENT_URL`: `https://frosted.ahsawwn.com`
    -   `JWT_SECRET`: (Generate a long random string)
    -   `PORT`: `3000`

---

## 5. Deployment Checklist
- [ ] Run `npm run build` locally.
- [ ] Upload files to host.
- [ ] Set environment variables in Spaceship dashboard.
- [ ] Run `npm run db:setup` via the host terminal (inside `/server`).
- [ ] "Start" the Node.js application.

> [!IMPORTANT]
> Since shared hosting has limited RAM, ensure you are not running `npm install` on the server itself if possible; use FTP to upload your local `node_modules` OR run it via the dashboard's "Run NPM Install" button if available.
