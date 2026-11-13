# TaskFlow 📋

TaskFlow is a modern, responsive full-stack task and workflow management application built with React, Vite, Node.js, Express, and PostgreSQL. It features dual task management views (interactive List and Kanban board), dynamic search and filtering, real-time KPI metrics, an independent multi-canvas theming studio, and multi-layered security validation.

---

## 🌐 Live Application & Repository

| Resource | Link | Description |
| :--- | :--- | :--- |
| **Live Application** | **[https://taskllow.vercel.app](https://taskllow.vercel.app)** | Publicly accessible production deployment. Visitors can create an account and explore all features. |
| **GitHub Repository** | **[https://github.com/Soumyajit-2808/Taskllow](https://github.com/Soumyajit-2808/Taskllow)** | Complete source code, automated test suites, and documentation. |

> [!NOTE]
> **Live Demo Notice:** The backend is hosted on Render's free tier. If the service has been idle for more than 15 minutes, the first API request may experience a **30–50 second cold start** while the container spins up. Subsequent requests run at normal speed.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-installation)
  - [Environment Configuration](#2-environment-configuration)
  - [Database Migrations](#3-database-migrations)
  - [Running Locally](#4-running-locally)
- [Environment Variables Reference](#-environment-variables-reference)
- [Production Deployment](#-production-deployment)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Security Model](#-security-model)
- [API Reference Summary](#-api-reference-summary)
- [License](#-license)

---

## ✨ Key Features

### 1. Dual-View Task Management
- **Interactive List View:** High-density table layout with inline status checkboxes, priority badges, custom category indicators, formatted due dates with overdue highlighting, and quick-action edit/delete triggers.
- **Stage-Driven Kanban Board:** Three workflow columns (**To Do**, **In Progress**, **Completed**) with card counters, bidirectional stage advancement buttons, and direct task creation per column.

### 2. Live Productivity & Metrics Dashboard
- Real-time aggregated KPI summary cards:
  - **Total Tasks:** Cumulative count across all user categories.
  - **In Progress:** Tasks currently under active execution.
  - **Completed:** Successfully finished tasks.
  - **Overdue:** Immediate visual alert for past-due tasks.
- **Interactive Filtering:** Clicking any metric card instantly filters the active task view.

### 3. Dynamic Search & Multi-Dimensional Filtering
- **Instant Search:** Debounced text search matching task titles and descriptions (`Ctrl+K` hotkey focus).
- **Navigation Views:** Quick sidebar views for **All Tasks**, **Due Today**, **Overdue**, and **Completed**.
- **Filter Toolbar:** Combined dropdown filtering by status (`pending`, `in_progress`, `completed`, `archived`) and priority (`low`, `medium`, `high`, `urgent`).
- **Category Filtering:** Sidebar category selection with task count badges.

### 4. Custom Category Management
- User-scoped custom category creation with color picker presets.
- Category assignment to tasks and safe deletion with foreign-key nullification (`ON DELETE SET NULL`).

### 5. Multi-Canvas Theming & Accent Color Studio
- **6 Base Canvas Themes:** `Dark Slate`, `Clean Light`, `OLED Pitch`, `Evergreen Nocturne`, `Cyberpunk Twilight`, and `Nordic Frost`.
- **8 Accent Color Presets:** Electric Indigo, Ocean Sapphire, Emerald Mint, Neon Rose, Sunset Amber, Amethyst Purple, Teal Horizon, and Crimson Ruby.
- **Custom Accent Studio:** Real-time hex color input, WCAG 2.1 contrast calculation, dynamic CSS variable derivation (`--primary-50` through `--primary-700`), and `localStorage` persistence.
- **Header Quick-Toggle:** One-click instant daylight/nightlight toggle.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18.3, Vite 5, Lucide React Icons, Context API (`AuthContext`, `ThemeContext`), CSS Custom Properties Design Tokens |
| **Backend** | Node.js (v18+), Express.js (4-Tier Layered Architecture: Routes ➔ Controllers ➔ Services ➔ Repositories) |
| **Database** | PostgreSQL 14+, `pg` (node-postgres) connection pooling, parameterized SQL migrations |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), native `bcrypt` (12 salt rounds), Helmet HTTP headers, CORS, Express Rate Limit, Zod validation |
| **Automated Testing** | Jest, Supertest (unit & integration), Playwright (end-to-end browser automation) |

---

## 🏗️ System Architecture

TaskFlow enforces strict separation of concerns across a clean monorepo layout:

```text
TaskFlow/
├── client/                     # Frontend Single Page Application (React + Vite)
│   ├── e2e/                    # Playwright end-to-end test suites & global setup
│   ├── src/
│   │   ├── components/         # Modular UI components (Auth, Header, Sidebar, Kanban, List, Modals)
│   │   ├── context/            # AuthContext (session state) & ThemeContext (design tokens)
│   │   ├── services/           # Native fetch API client with JWT Bearer handling
│   │   ├── App.jsx             # Main workspace orchestration & keyboard hotkeys
│   │   └── index.css           # Core design tokens, theme palettes & reset rules
│   ├── playwright.config.js    # Playwright configuration (ports, test DB injection, reporters)
│   └── vite.config.js          # Vite configuration with local API proxy
├── server/                     # Backend REST API (Express.js)
│   ├── src/
│   │   ├── config/             # Environment validation (env.js) & DB pool (pool.js)
│   │   ├── database/           # Transactional SQL migrations & migration runner
│   │   │   └── migrations/     # 001_create_users.sql, 002_create_categories.sql, 003_create_tasks.sql
│   │   ├── middlewares/        # JWT auth guard, centralized error handler, rate limiters, Zod validator
│   │   ├── modules/            # Domain modules (auth, categories, tasks, health)
│   │   │   ├── *.controller.js # Request parsing & standardized JSON response formatting
│   │   │   ├── *.service.js    # Business logic, KPI calculations, and authorization checks
│   │   │   ├── *.repository.js # Raw parameterized PostgreSQL queries (user-scoped)
│   │   │   └── *.validation.js # Zod validation schemas
│   │   ├── utils/              # Email authenticity validator, custom errors, responses, JWT helpers
│   │   ├── app.js              # Express application assembly & security middleware
│   │   └── server.js           # HTTP server initialization & graceful shutdown handlers
│   └── tests/                  # Jest & Supertest unit and integration test suites
├── postman/                    # Pre-configured Postman API collection and environment specs
└── package.json                # Monorepo orchestration scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher running locally or in the cloud

---

### 1. Installation

Clone the repository and install dependencies for both client and server:

```bash
git clone https://github.com/Soumyajit-2808/Taskllow.git
cd Taskllow

# Install backend dependencies
npm --prefix server install

# Install frontend dependencies
npm --prefix client install
```

---

### 2. Environment Configuration

Copy the example environment files:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

Edit `server/.env` with your PostgreSQL database credentials and server settings. See [Environment Variables Reference](#-environment-variables-reference) below.

---

### 3. Database Migrations

Run the database migration script to initialize the schema:

```bash
# Run migrations using the root script
npm run server:migrate
```

This applies all transactional SQL migration files (`001_create_users.sql`, `002_create_categories.sql`, `003_create_tasks.sql`) and records them in `schema_migrations`.

---

### 4. Running Locally

Start both the backend API and the frontend development server:

```bash
# Terminal 1: Start backend API server (runs on http://localhost:5000)
npm run server:dev

# Terminal 2: Start frontend client (runs on http://localhost:5173)
npm run client:dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite dev server automatically proxies `/api` calls to `http://localhost:5000`.

---

## 🔐 Environment Variables Reference

Never commit `.env` files containing real passwords, secret keys, or database connection strings.

### Backend (`server/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | Port on which the Express server listens. |
| `NODE_ENV` | No | `development` | Environment mode (`development`, `test`, `production`). |
| `CLIENT_URL` | Yes | `http://localhost:5173` | Allowed CORS origin (must match your frontend domain in production). |
| `DATABASE_URL` | Optional | `null` | Full PostgreSQL connection URI (preferred in cloud environments). |
| `DB_HOST` | Conditional | `localhost` | Database host (used if `DATABASE_URL` is not provided). |
| `DB_PORT` | Conditional | `5432` | Database port. |
| `DB_NAME` | Conditional | `taskflow_db` | Database name. |
| `DB_USER` | Conditional | `postgres` | Database username. |
| `DB_PASSWORD` | Conditional | `postgres` | Database password. |
| `DB_POOL_MAX` | No | `20` | Maximum connections in the `pg` pool. |
| `DB_IDLE_TIMEOUT_MILLIS` | No | `30000` | Idle connection timeout in milliseconds. |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWTs (must be a strong 32+ char string in production). |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token validity duration. |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Cost factor for password hashing. |
| `SKIP_DNS_CHECK` | No | `false` | Set to `true` to bypass outbound DNS MX checks in restricted network environments. |

### Frontend (`client/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | No | `/api/v1` | Base URL for API requests. Set to the production backend URL (e.g. `https://api.example.com/api/v1`) during production build. |

---

## ☁️ Production Deployment

TaskFlow is deployed on a free cloud architecture:

```text
┌─────────────────────────┐       HTTPS / REST       ┌─────────────────────────┐
│   Vercel (Hobby Tier)   │  ─────────────────────>  │   Render (Free Service) │
│  Frontend React 18 SPA  │                          │    Express.js Node API  │
└─────────────────────────┘                          └────────────┬────────────┘
                                                                  │  SSL (Port 5432)
                                                                  ▼
                                                     ┌─────────────────────────┐
                                                     │    Neon (Serverless)    │
                                                     │      PostgreSQL 16      │
                                                     └─────────────────────────┘
```

- **Frontend (Vercel):**
  - **Framework Preset:** Vite
  - **Root Directory:** `client`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Environment Variable:** `VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api/v1`
  - **Edge CDN:** Delivers static assets with global caching and instant response times.
- **Backend (Render):**
  - **Service Type:** Web Service (Node)
  - **Root Directory:** `server`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Environment Variables:** `NODE_ENV=production`, `DATABASE_URL=<neon-connection-string>`, `JWT_SECRET=<secure-random-secret>`, `CLIENT_URL=https://<your-vercel-domain>.vercel.app`
- **Database (Neon):**
  - Managed PostgreSQL 16 with native SSL and connection pooling.
  - Persistent storage without monthly expiration.

---

## 🧪 Testing & Quality Assurance

TaskFlow includes an automated testing suite spanning unit, integration, and end-to-end browser tests.

### Reported Verification Results

| Suite | Framework | Total Tests | Status | Scope |
| :--- | :--- | :---: | :---: | :--- |
| **Backend Unit & Integration** | Jest + Supertest | **76 / 76** | **Passed** | 9 test suites covering auth, tasks, categories, health endpoints, services, Zod schemas, and email validation heuristics. |
| **End-to-End Browser Tests** | Playwright | **15 / 15** | **Passed** | Full user journeys: registration, session rehydration, task CRUD, Kanban advancement, theme persistence, and input validation. |
| **Production Build** | Vite 5 | — | **Passed** | Zero errors, zero warnings across 1,500+ modules (build time: ~2.4s). |
| **Database Isolation** | PostgreSQL | — | **Verified** | E2E runs execute against a dedicated `taskflow_test_db` with automated pre-test table resets; development data remains untouched. |

### Running Tests Locally

```bash
# Run backend Jest unit and integration tests
npm run server:test

# Run frontend Playwright end-to-end browser tests
npm run test:e2e
```

---

## 🛡️ Security Model

- **Authentication:** Stateless JSON Web Tokens (JWT) passed via `Authorization: Bearer <token>` header with HTTP-only cookie fallback.
- **Password Protection:** Passwords hashed with native `bcrypt` using 12 salt rounds. Minimum 8 characters with alphanumeric validation enforced.
- **SQL Injection Prevention:** 100% of database queries use parameterized SQL via `pg`. Direct string interpolation into queries is prohibited.
- **Multi-Tenant User Scoping:** Every task and category query strictly enforces `WHERE user_id = $1`. Cross-user data access is structurally impossible.
- **Email Authenticity Pipeline:**
  - Blocks 37+ known disposable and burner email domains (`mailinator.com`, `guerrillamail.com`, `tempmail.com`, etc.).
  - Algorithmic gibberish detection blocks keyboard walk patterns, excessive repeated characters, and unpronounceable consonant clusters.
  - Active DNS lookup (`node:dns.promises.resolveMx`) verifies that the domain possesses active mail server records before account creation.
- **HTTP Hardening:** Helmet-configured HTTP security headers, CORS origin whitelisting, and Express rate limiting (15 req/15 min on auth routes; 300 req/15 min on API routes).
- **Production Secret Guard:** The server throws a fatal startup error in `NODE_ENV=production` if `JWT_SECRET` is missing or uses the default fallback.

---

## 🔌 API Reference Summary

All API responses follow a standardized JSON envelope structure:
- **Success:** `{ "success": true, "data": ... }`
- **Error:** `{ "success": false, "error": { "code": "...", "message": "...", "details": [...] } }`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | API status and endpoint catalog | No |
| `GET` | `/api/v1/health` | Health check & database connectivity probe | No |
| `POST` | `/api/v1/auth/register` | Register new user with email authenticity validation | No |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue JWT bearer token | No |
| `GET` | `/api/v1/auth/me` | Retrieve authenticated user profile | **Yes** |
| `POST` | `/api/v1/auth/logout` | Clear session cookie | **Yes** |
| `GET` | `/api/v1/categories` | List user custom categories with task counts | **Yes** |
| `POST` | `/api/v1/categories` | Create a new category | **Yes** |
| `PUT` | `/api/v1/categories/:id` | Update category name and color | **Yes** |
| `DELETE` | `/api/v1/categories/:id` | Delete a category | **Yes** |
| `GET` | `/api/v1/tasks/stats/summary` | Retrieve aggregated KPI metrics summary | **Yes** |
| `GET` | `/api/v1/tasks` | List tasks with filters (`status`, `categoryId`, `priority`, `search`, `sortBy`) | **Yes** |
| `POST` | `/api/v1/tasks` | Create a new task (default status: `pending`) | **Yes** |
| `GET` | `/api/v1/tasks/:id` | Retrieve single task details by UUID | **Yes** |
| `PUT` | `/api/v1/tasks/:id` | Full update of an existing task | **Yes** |
| `PATCH` | `/api/v1/tasks/:id` | Partial update of a task (`status`, `priority`, `title`, etc.) | **Yes** |
| `DELETE` | `/api/v1/tasks/:id` | Soft-delete a task (`deleted_at` timestamp) | **Yes** |

---

## 📄 License

This project is open source and available under the [MIT License](package.json).
