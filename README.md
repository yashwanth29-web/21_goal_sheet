# 📅 Daily Goal Tracker — Multi-User Cloud Application

A production-ready **Daily Goal & Work Routine Tracker** web application featuring a horizontal spreadsheet timetable interface, multi-user authentication (bcrypt + JWT), and private PostgreSQL persistence with Prisma ORM.

---

## 🚀 Architecture Overview

```text
React 19 + TypeScript + Vite + Tailwind CSS
                    ↓
        JWT Authentication (Bearer Token)
                    ↓
        Node.js + Express API (TypeScript)
                    ↓
          Prisma ORM (PostgreSQL)
                    ↓
       User-Isolated Persistent Data
```

### 🔒 User Isolation & Security
- **Derivation from JWT**: User IDs are always derived from the authenticated JWT (`req.user.id`). Never trusted from client requests.
- **Strict Data Ownership**: User A cannot view, modify, or delete User B's goals or daily status records.
- **Encrypted Credentials**: Passwords hashed with bcrypt (salt factor 10); plain-text passwords and database secrets are never exposed to the frontend.

---

## 📁 Project Structure

```text
21_goal_sheet/
├── src/                          # React + TypeScript Frontend
│   ├── api/                      # REST API Client (JWT injection & endpoints)
│   ├── components/               # UI Components (Horizontal Timetable, Modals, Forms)
│   ├── context/                  # AuthContext (login, register, session management)
│   ├── types/                    # TypeScript interfaces & domain models
│   ├── utils/                    # Date & calendar utilities
│   ├── App.tsx                   # Main Dashboard & Timetable View
│   └── main.tsx                  # React Entry Point with AuthProvider
├── backend/                      # Node.js + Express + PostgreSQL Backend
│   ├── prisma/
│   │   └── schema.prisma         # Prisma Schema (User, Goal, DailyStatus models)
│   ├── src/
│   │   ├── config/               # Environment & Prisma client initialization
│   │   ├── controllers/          # Auth & Goal controllers (strict userId checks)
│   │   ├── middleware/           # JWT Authentication middleware
│   │   ├── routes/               # Express API routes (/api/auth, /api/goals)
│   │   ├── utils/                # Password hashing & JWT signing helpers
│   │   └── server.ts             # Express Server with CORS & Error Handlers
│   ├── package.json
│   └── .env.example
├── package.json                  # Root npm workspace & runner scripts
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL Database](https://neon.tech/) (Free serverless PostgreSQL from Neon, Supabase, or local PostgreSQL)

---

### 2. Configure Backend Environment Variables

In the `backend/` directory, create a `.env` file (copied from `.env.example`):

```env
PORT=5000
DATABASE_URL="postgresql://username:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your_long_random_jwt_secret_key_change_in_production"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```

> **Important**: Never commit `.env` to Git. It is automatically ignored in `.gitignore`.

---

### 3. Database Migration with Prisma

Run Prisma migrations to set up the tables in your PostgreSQL database:

```bash
# In the backend directory:
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

Or from the root directory:
```bash
npm run prisma:generate
npm run prisma:migrate
```

---

### 4. Running Locally

#### Start the Backend API (Port 5000):
```bash
cd backend
npm run dev
```

#### Start the Frontend (Port 5173):
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing Multi-User Verification & Flow

1. **User Registration**:
   - Open [http://localhost:5173](http://localhost:5173)
   - Click **"Create account"**
   - Register User A (`alice@example.com`)
   - You are automatically authenticated and redirected to your private dashboard.

2. **Goal & Status Persistence**:
   - Add new goals or edit existing time slots.
   - Change daily statuses (🟢 Completed, 🟡 Partially Completed, 🔴 Missed).
   - Refresh the browser — all data is loaded directly from PostgreSQL.

3. **Multi-User Isolation**:
   - Log out of User A.
   - Register User B (`bob@example.com`).
   - Notice User B has their own separate timetable and zero access to User A's data.
   - Any API request attempting to modify another user's goal ID returns `404 Not Found / Unauthorized`.

4. **Theme Switcher**:
   - Toggle between **Dark Mode** (OLED / Black) and **Light Mode** (White / Clean) using the sun/moon icon in the header.

---

## 🚢 Production Deployment

### 1. Database
- Create a production database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
- Copy the Connection String.

### 2. Backend (Render / Railway / Vercel Serverless)
- Deploy `backend/`
- Set Environment Variables:
  - `DATABASE_URL`: Your production Neon PostgreSQL connection string
  - `JWT_SECRET`: A secure 64-character random string
  - `JWT_EXPIRES_IN`: `7d`
  - `FRONTEND_URL`: Your frontend production URL (e.g. `https://your-app.vercel.app`)

### 3. Frontend (Vercel)
- Deploy root project to Vercel.
- Set Environment Variable:
  - `VITE_API_URL`: `https://your-backend-domain.com/api`
