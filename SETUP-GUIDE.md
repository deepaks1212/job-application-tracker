# 🚀 Job Application Tracker - Complete Setup & Launch Guide

## Overview

This guide provides multiple ways to start the **Job Application Tracker** project, from the simplest automated approach to detailed manual setup for advanced users.

---

## Quick Navigation

- [Method 1: Smart Launcher (Recommended)](#method-1-smart-launcher-recommended)
- [Method 2: Manual Setup](#method-2-manual-setup)
- [Troubleshooting](#troubleshooting)
- [Environment Configuration](#environment-configuration)

---

## Method 1: Smart Launcher (Recommended) ⭐

The smart launcher is designed to be **foolproof** - it automatically handles all setup steps.

### Windows Users (PowerShell)

```powershell
# Open PowerShell in the project directory and run:
.\Launch-Project.ps1
```

**First Run Interactive Menu:**
```
Select startup mode:
  1. Development (default - with hot reload)
  2. Production (optimized build)
  3. Fresh install (clean reinstall dependencies)
```

**What It Does Automatically:**
✓ Validates Node.js and npm installation  
✓ Creates `.env` from `.env.example` if needed  
✓ Installs npm dependencies  
✓ Initializes PostgreSQL database schema  
✓ Seeds database with 4 sample applications  
✓ Starts the development server  

### Windows Users (Command Prompt)

```cmd
# If you prefer Command Prompt, use:
.\Launch-Project.bat
```

This simpler launcher:
- Checks prerequisites
- Sets up environment
- Installs dependencies
- Starts development mode

---

## Method 2: Manual Setup

### Step 1: Prerequisites

Ensure your system has:
- **Node.js v18+** ([Download](https://nodejs.org/))
- **npm 8+** (Comes with Node.js)
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/))

Verify installation:
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 8.0.0 or higher
```

### Step 2: Clone & Navigate

```bash
cd job-application-tracker
```

### Step 3: Environment Configuration

Copy the example file and customize:
```bash
copy .env.example .env
```

Edit `.env` with your database credentials:
```env
PORT=5005
DATABASE_URL=postgresql://postgres:YourPassword@localhost:5432/job_tracker
NODE_ENV=development
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Database Initialization

The database schema automatically initializes on first server start. However, you can manually trigger it:

```bash
npm run dev
```

On first run, the server will:
1. Create the `applications` table
2. Auto-seed 4 sample job applications if the table is empty

### Step 6: Access the Application

- **Frontend**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health
- **API Docs**: See [REST API Specification](#-rest-api-specification) in README.md

---

## Environment Configuration

### .env File Template

```env
# ============================================================================
# Server Configuration
# ============================================================================
PORT=5005                    # Server port (default: 5005)
NODE_ENV=development         # Node environment (development | production)

# ============================================================================
# Database Configuration
# ============================================================================
DATABASE_URL=postgresql://postgres:password@localhost:5432/job_tracker

# Connection String Format:
# postgresql://[user]:[password]@[host]:[port]/[database]

# Example with standard PostgreSQL setup:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/job_tracker
```

### Environment Variables Explained

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `PORT` | Server listening port | `5005` | ✓ |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` | ✓ |
| `NODE_ENV` | Execution environment | `development` | Optional (defaults to development) |

---

## Project Structure Overview

```
job-application-tracker/
├── Launch-Project.ps1          # ⭐ PowerShell smart launcher
├── Launch-Project.bat          # ⭐ Batch file launcher
├── .env.example                # ⭐ Environment template
├── README.md                   # Main documentation
├── SETUP-GUIDE.md             # This file
│
├── package.json                # npm dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler config
│
├── server.ts                   # Express server entry point
├── index.html                  # HTML template
│
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Root component
│   ├── index.css              # Global styles
│   │
│   ├── components/            # Reusable React components
│   ├── pages/                 # Page-level components
│   ├── services/              # API client (axios)
│   ├── types/                 # TypeScript type definitions
│   │
│   └── backend/               # Express.js backend
│       ├── routes/            # API routes
│       ├── controllers/       # Request handlers
│       ├── services/          # Business logic
│       ├── middleware/        # Express middleware
│       ├── validators/        # Input validation (Zod)
│       ├── config/            # Database setup
│       └── __tests__/         # Unit tests
│
└── prisma/                     # Prisma ORM
    └── schema.prisma          # Database schema
```

---

## npm Scripts Reference

```bash
npm run dev      # Start development server (with hot reload)
npm run build    # Compile TypeScript and bundle for production
npm start        # Run production build (requires npm run build first)
npm run lint     # Type-check code with TypeScript
npm run test     # Run unit tests with Vitest
npm run clean    # Remove build artifacts
```

---

## Troubleshooting

### ❌ "node: command not found"

**Cause**: Node.js is not installed or not in PATH

**Fix**:
1. [Download Node.js v18+](https://nodejs.org/)
2. Install and verify:
   ```bash
   node --version
   ```

---

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Cause**: PostgreSQL is not running or connection string is incorrect

**Fix**:
1. Verify PostgreSQL is running:
   ```bash
   psql --version
   ```
2. Check `.env` DATABASE_URL matches your setup:
   ```bash
   # Test connection:
   psql -U postgres -h localhost -d job_tracker
   ```
3. If database doesn't exist, create it:
   ```bash
   createdb job_tracker
   ```

---

### ❌ "Port 5005 is already in use"

**Cause**: Another process is using port 5005

**Fix**:
Option A: Change the PORT in `.env`:
```env
PORT=5006
```

Option B: Find and close the process using port 5005:
```powershell
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5005
Stop-Process -Id <PID>
```

---

### ❌ "npm install fails"

**Cause**: Network issues or corrupted cache

**Fix**:
```bash
npm cache clean --force
npm install
```

Or for clean reinstall:
```powershell
.\Launch-Project.ps1 -Fresh
```

---

### ❌ "Cannot find module 'vite'"

**Cause**: Dependencies not installed

**Fix**:
```bash
rm -r node_modules
npm install
```

---

## First Run Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL installed and running
- [ ] `.env` file created with valid DATABASE_URL
- [ ] Run `npm install` successfully
- [ ] Server starts without errors
- [ ] Browser loads http://localhost:5005
- [ ] Sample data appears on dashboard

---

## Performance Tips

### Development Mode
- Vite hot module replacement (HMR) enabled
- Fast refresh for React components
- No production optimizations

### Production Mode
- Run: `npm run build && npm start`
- Minified and bundled assets
- Best for deployment

---

## API Health Check

Verify your server is running:

```bash
curl http://localhost:3001/api/health
# Expected response:
# {"status":"ok","time":"2024-06-19T10:30:45.123Z"}
```

---

## Getting Help

**Common Issues**:
- Check PostgreSQL connection
- Verify `.env` file exists and is readable
- Ensure port 5005 is not in use
- Try fresh install: `.\Launch-Project.ps1 -Fresh`

**Still Stuck?**
- Review error messages in console carefully
- Check database logs: `psql -U postgres -d job_tracker`
- Verify all prerequisites are installed

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Tutorials](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)

---

**Last Updated**: June 19, 2024  
**Status**: Production-Ready ✓
