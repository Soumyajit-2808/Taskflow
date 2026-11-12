# TaskFlow 📋

TaskFlow is a modern, enterprise-grade, full-stack task and workflow management platform engineered with a clean layered architecture, robust security validations, an interactive productivity dashboard, dual task views (List & Kanban), and an advanced Multi-Canvas Theming & Accent Color Studio.

---

## 🌟 Key Features

### 1. Dual-View Task Management
- **Interactive List View**: Compact, high-density table view with inline status toggles, priority badges, category chips, and due date alerts.
- **Kanban Board**: Drag-and-drop / column-based workflow categorizing tasks into **To Do**, **In Progress**, and **Completed**.
- **Dynamic Search & Filtering**: Instant fuzzy text search, category filtering, status filtering, and multi-field sorting (due date, priority, title, creation date).

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
- **Anti-Disposable Email Gate**: Blocks 100+ known disposable/burner email providers (`mailinator`, `guerrillamail`, `tempmail`, etc.).
- **Gibberish & Keyboard-Smashing Detection**: Algorithmic heuristic analysis detecting unpronounceable consonant clusters and sequence patterns.
- **Authentication & Encryption**: Secure JWT Bearer token authentication, bcrypt password hashing (10 salt rounds).
- **HTTP Protection**: Dual-window Express rate limiters (auth brute-force mitigation + API threshold), Helmet HTTP headers, CORS whitelisting, and strict Zod schema validation.

### 5. API Testing & Postman Workspace
- Built-in Postman Collection (`postman/collections/TaskFlow_API.postman_collection.json`) and environment variables (`postman/environments/TaskFlow_Local.postman_environment.json`) covering all authenticated workflows and validation edge cases.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Lucide Icons, Custom CSS Variable Design System, Context API |
| **Backend** | Node.js, Express.js (4-Tier Layered Architecture: Routes ➔ Controllers ➔ Services ➔ Repositories) |
| **Database** | PostgreSQL, `pg` connection pooling, parameterized SQL migrations |
| **Validation & Security** | Zod, JSON Web Tokens (JWT), bcryptjs, Helmet, Express Rate Limit, Custom Heuristic Email Validator |
| **Testing** | Jest, Supertest (11 unit/integration test suites), Playwright (E2E browser automation) |

---

## 🏗️ Architecture & Project Structure

TaskFlow enforces strict separation of concerns across a monorepo structure:

```
TaskFlow/
├── client/                     # React Single Page Application (Vite)
│   ├── e2e/                    # Playwright end-to-end tests
│   ├── src/
│   │   ├── components/         # UI Components (Header, TaskModal, Kanban, List, Metrics, ThemeModal)
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── services/           # Axios-based API client with JWT interceptor
│   │   └── index.css           # Design tokens, canvas themes & CSS variables
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
│   └── tests/                  # Jest & Supertest unit and integration test suites
├── postman/                    # Pre-configured Postman collection and environment specs
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

Ensure `server/.env` contains your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
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

---

## 🔌 API Endpoints Summary

All API responses adhere to standard JSON envelopes: `{ "success": true, "data": ... }` or `{ "success": false, "error": { "message": ... } }`.

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health and database connectivity check | No |
| `POST` | `/api/v1/auth/register` | Register new user with email authenticity checks | No |
| `POST` | `/api/v1/auth/login` | Login user and issue JWT bearer token | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/v1/categories` | List user's custom categories with task count | Yes |
| `POST` | `/api/v1/categories` | Create a new custom category | Yes |
| `DELETE` | `/api/v1/categories/:id` | Delete a category | Yes |
| `GET` | `/api/v1/tasks` | List tasks with filters (`status`, `category_id`, `priority`, `search`, `sortBy`) | Yes |
| `POST` | `/api/v1/tasks` | Create a new task | Yes |
| `PUT` | `/api/v1/tasks/:id` | Update an existing task | Yes |
| `PATCH` | `/api/v1/tasks/:id/status` | Quick toggle task status (`todo`, `in_progress`, `completed`) | Yes |
| `DELETE` | `/api/v1/tasks/:id` | Delete a task | Yes |

---

## 🧪 Testing Suite

### Backend Unit & Integration Tests (Jest + Supertest)
Runs 11 test suites covering authentication, services, email heuristics, validation schemas, and database operations:

```bash
npm run server:test
```

### End-to-End Browser Tests (Playwright)
Validates core user journeys including user registration, task creation, status updates, Kanban drag/view toggling, and theme switching:

```bash
npm run test:e2e
```

---

## 🛡️ Financial & Licensing Policy

TaskFlow is developed strictly using **100% Free and Open-Source Software (FOSS)**. No external paid APIs, billable cloud tiers, or proprietary services are required.
