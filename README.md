# TaskFlow 📋

TaskFlow is a modern, secure, and scalable full-stack task management application designed for productive individuals and collaborating teams.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Modern Responsive CSS, Lucide Icons
- **Backend**: Node.js, Express.js (Layered Architecture)
- **Database**: PostgreSQL (Parameterized queries, Migrations)
- **Security**: JWT Authentication, bcrypt password hashing, Helmet, CORS, Rate Limiting, Zod Schema Validation
- **Testing**: Jest (Unit testing), Supertest (REST API Integration), Playwright (End-to-End Automation)

---

## 🏗️ Architecture Overview

TaskFlow follows a strict **Separation of Concerns** using a 4-tier backend architecture:

1. **Routes**: Defines endpoints, assigns middleware (auth, rate-limit, validation).
2. **Controllers**: Extracts HTTP parameters, orchestrates domain services, formats standardized JSON envelopes.
3. **Services**: Contains core business rules, permission checks, and analytical computations.
4. **Repositories**: Encapsulates raw database queries with parameterized SQL (`pg.Pool`), preventing SQL injection.

```
Client (React SPA) 
    ⬇️ HTTPS / JSON
Middleware Pipeline (CORS ➔ Helmet ➔ Rate Limiter ➔ JWT Guard ➔ Zod Validator)
    ⬇️
Express Router ➔ Controllers ➔ Domain Services ➔ Repositories
    ⬇️
PostgreSQL Database
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher running locally on port 5432

### 1. Database Setup

Create a PostgreSQL database for TaskFlow:

```sql
CREATE DATABASE taskflow_db;
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run dev
```

The backend server starts on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend application starts on `http://localhost:5173`.

---

## 🧪 Testing Suite

- **Backend Unit & Integration Tests**:
  ```bash
  cd server && npm test
  ```
- **End-to-End (E2E) Browser Tests**:
  ```bash
  npx playwright test
  ```

---

## 🛡️ Financial & Licensing Policy

TaskFlow is developed strictly using 100% free and open-source software (FOSS). No external paid APIs or billable cloud tiers are required.

