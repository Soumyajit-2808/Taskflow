# TaskFlow 📋

TaskFlow is a modern, enterprise-grade, full-stack task and workflow management platform engineered with a clean layered architecture, robust security validations, an interactive productivity dashboard, dual task views (List & Kanban), and an advanced Multi-Canvas Theming & Accent Color Studio.

---

## 🌟 Key Features

### 1. Dual-View Task Management
- **Interactive List View**: High-density table view with inline status toggles, priority badges, category chips, and due date alerts.
- **Column-Based Kanban Board**: Stage-driven workflow categorizing tasks into **To Do** (`pending`), **In Progress** (`in_progress`), and **Completed** (`completed`) with one-click stage advancement buttons.
- **Dynamic Search & Filtering**: Instant fuzzy text search, category filtering, status filtering (`pending`, `in_progress`, `completed`, `archived`), and multi-field sorting (due date, priority, title, creation date).

### 2. Live Productivity & Metrics Dashboard
- Real-time KPIs calculated dynamically:
  - **Total Tasks**: Total count across all categories.
  - **Completed**: Total tasks successfully completed.
  - **Overdue**: Immediate alert highlighting past-due tasks.
  - **Completion Rate**: Visual progress indicator and percentage bar.

### 3. Multi-Canvas Theming & Independent Accent Color Studio
- **6 Canvas Themes**:
  - `Dark Slate`: Balanced midnight charcoal canvas with slate undertones.
  - `Clean Light`: Crisp daylight palette for daylight focus and high readability.
  - `OLED Pitch`: Pure true-black (`#000000`) canvas with ultra contrast.
  - `Evergreen Nocturne`: Botanical deep pine aesthetic with emerald undertones.
  - `Cyberpunk Twilight`: Neon midnight atmosphere with rich violet glow.
  - `Nordic Frost`: Cold arctic navy and steel gray surfaces.
- **8 Accent Color Presets**:
  - `Electric Indigo` (`#6366f1`), `Ocean Sapphire` (`#0ea5e9`), `Emerald Mint` (`#10b981`), `Neon Rose` (`#f43f5e`), `Sunset Amber` (`#f59e0b`), `Amethyst Purple` (`#8b5cf6`), `Teal Horizon` (`#14b8a6`), `Crimson Ruby` (`#ef4444`).
- **Accent Color Studio**: Custom hex color picker with real-time WCAG 2.1 contrast calculation and instant `localStorage` persistence.

### 4. Advanced Security & Email Authenticity Verification
- **Anti-Disposable Email Gate**: Blocks 37+ known disposable/burner email providers (`mailinator`, `guerrillamail`, `tempmail`, `10minutemail`, `yopmail`, etc.).
- **DNS Mail Exchange (MX) Verification**: Active DNS lookup (`node:dns.promises.resolveMx`) ensuring the domain has valid mail routing records.
- **Gibberish & Keyboard-Smashing Detection**: Algorithmic heuristic analysis detecting unpronounceable consonant clusters, keyboard walks, and character repetition.
- **Authentication & Encryption**: Secure JWT Bearer token authentication (with HTTP-only cookie support), native `bcrypt` password hashing (default 12 salt rounds, configurable via `BCRYPT_SALT_ROUNDS`).
- **HTTP Protection**: Dual-window Express rate limiters (auth brute-force mitigation: 15 req / 15 min; general API: 300 req / 15 min), Helmet HTTP headers, CORS origin whitelisting (`CLIENT_URL` / `CORS_ORIGIN`), and strict Zod schema validation.

### 5. API Testing & Postman Workspace
- Built-in Postman Collection (`postman/collections/TaskFlow_API.postman_collection.json`) and environment variables (`postman/environments/TaskFlow_Local.postman_environment.json`) covering all authenticated workflows, health checks, categories, and task management edge cases.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18.3.1, Vite 5, Lucide Icons, Custom CSS Variable Design System, Context API, Native Fetch API Client |
| **Backend** | Node.js, Express.js (4-Tier Layered Architecture: Routes ➔ Controllers ➔ Services ➔ Repositories) |
| **Database** | PostgreSQL, `pg` connection pooling (max 20, 30s idle timeout), parameterized SQL migrations |
| **Validation & Security** | Zod, JSON Web Tokens (`jsonwebtoken`), native `bcrypt` (12 rounds), Helmet, Express Rate Limit, Email Heuristics & DNS MX Validation |
| **Testing** | Jest, Supertest (9 unit/integration test suites, 76 tests), Playwright (E2E browser automation) |

---

## 🏗️ Architecture & Project Structure

TaskFlow enforces strict separation of concerns across a monorepo structure:

```
TaskFlow/
├── client/                     # React Single Page Application (Vite)
│   ├── e2e/                    # Playwright end-to-end user journey tests
│   ├── src/
│   │   ├── components/         # UI Components (Header, TaskModal, Kanban, List, Metrics, ThemeModal, etc.)
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── services/           # Native fetch-based API client with JWT bearer handling
│   │   └── index.css           # Design tokens, canvas themes & CSS variables
│   ├── playwright.config.js    # Playwright browser testing configuration
│   ├── vite.config.js          # Vite bundler configuration (dev proxy to port 5000)
│   └── DESIGN_SPEC.md          # Complete design system & wireframe specifications
├── server/                     # Express.js REST API
│   ├── src/
│   │   ├── config/             # Environment variable validation & database pool
│   │   ├── database/           # SQL migration files & migration runner
│   │   ├── middlewares/        # Auth guard, error handler, rate limiters, validation
│   │   ├── modules/            # Domain modules (auth, categories, tasks, health)
│   │   │   ├── *.controller.js # HTTP request extraction & envelope formatting
│   │   │   ├── *.service.js    # Core business rules & analytical computation
│   │   │   ├── *.repository.js # Raw parameterized PostgreSQL queries
│   │   │   └── *.validation.js # Zod schemas
│   │   └── utils/              # Email authenticity validator, custom errors, responses
│   └── tests/                  # Jest & Supertest unit and integration test suites (9 suites)
├── postman/                    # Pre-configured Postman collection and environment specs
│   ├── collections/            # TaskFlow_API.postman_collection.json
│   └── environments/           # TaskFlow_Local.postman_environment.json
└── package.json                # Monorepo orchestration scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher running on port `5432`

---

### 1. Database Setup

Create a PostgreSQL database for TaskFlow:

```sql
CREATE DATABASE taskflow_db;
```

---

### 2. Environment Configuration

Copy the example environment files for both server and client:

```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```

Ensure `server/.env` contains your PostgreSQL credentials and server settings:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/taskflow_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_POOL_MAX=20
DB_IDLE_TIMEOUT_MILLIS=30000

# Authentication & Security
JWT_SECRET=supersecret_taskflow_jwt_key_change_in_production_123456
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

---

### 3. Installation & Database Migration

Install dependencies and run database migrations from the root directory:

```bash
# Install server & client dependencies
npm --prefix server install
npm --prefix client install

# Run database migrations
npm run server:migrate
```

---

### 4. Running the Application

You can run both backend and frontend using root scripts:

```bash
# Start backend server (starts on http://localhost:5000)
npm run server:dev

# In a separate terminal, start frontend client (starts on http://localhost:5173)
npm run client:dev
```

*Note: The Vite dev server proxies `/api` requests directly to `http://localhost:5000`.*

---

## 🔌 API Endpoints Summary

All API responses adhere to standardized JSON envelopes:
- **Success**: `{ "success": true, "data": ... }`
- **Error**: `{ "success": false, "error": { "code": "...", "message": "...", "details": [...] } }`

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/` | Root API welcome route and endpoint catalog | No |
| `GET` | `/api/v1/health` | Health check & database connection probe | No |
| `POST` | `/api/v1/auth/register` | Register new user with email authenticity checks | No |
| `POST` | `/api/v1/auth/login` | Login user, issue JWT bearer token & set cookie | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes |
| `POST` | `/api/v1/auth/logout` | Logout user & clear authentication cookie | Yes |
| `GET` | `/api/v1/categories` | List user custom categories with task count | Yes |
| `POST` | `/api/v1/categories` | Create a new custom category | Yes |
| `PUT` | `/api/v1/categories/:id` | Update category name and color | Yes |
| `DELETE` | `/api/v1/categories/:id` | Delete a category | Yes |
| `GET` | `/api/v1/tasks/stats/summary` | Retrieve aggregated task KPI summary metrics | Yes |
| `GET` | `/api/v1/tasks` | List tasks with filters (`status`, `categoryId`, `priority`, `search`, `sortBy`) | Yes |
| `POST` | `/api/v1/tasks` | Create a new task (default status: `pending`) | Yes |
| `GET` | `/api/v1/tasks/:id` | Retrieve single task details by UUID | Yes |
| `PUT` | `/api/v1/tasks/:id` | Full update of an existing task | Yes |
| `PATCH` | `/api/v1/tasks/:id` | Partial update of a task (`status`, `priority`, `title`, `description`, `categoryId`, `dueDate`) | Yes |
| `DELETE` | `/api/v1/tasks/:id` | Soft-delete a task | Yes |

*Valid task status enum values:* `pending` (displays as "To Do" in UI), `in_progress`, `completed`, and `archived`.  
*Valid task priority enum values:* `low`, `medium`, `high`, and `urgent`.

---

## 🧪 Testing Suite

### Backend Unit & Integration Tests (Jest + Supertest)
Runs 9 test suites (76 tests) covering domain services, email heuristics, validation schemas, and database operations:

```bash
npm run server:test
```

### End-to-End Browser Tests (Playwright)
Executes end-to-end browser journeys covering user registration, task creation, status advancement, Kanban column views, and theme switching:

```bash
npm run test:e2e
```
*(Or navigate to `client/` and run `npm test` / `npx playwright test`).*

---

## 🛡️ Financial & Licensing Policy

TaskFlow is developed strictly using **100% Free and Open-Source Software (FOSS)**. No external paid APIs, billable cloud tiers, or proprietary services are required.
