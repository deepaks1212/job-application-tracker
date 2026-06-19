# 🎯 Job Application Tracker - Quick Reference Card

## One-Command Startup

### Windows (PowerShell) - Most Recommended
```powershell
.\Launch-Project.ps1
```
Interactive menu with color output • Auto-setup everything

### Windows (Command Prompt)
```cmd
.\Launch-Project.bat
```
Simple launcher • Direct startup

### Manual Commands
```bash
npm install     # Install dependencies (first time)
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Run production build
```

---

## Quick Facts

| Aspect | Value |
|--------|-------|
| **Frontend Port** | `http://localhost:5005` |
| **API Base URL** | `http://localhost:5005/api` |
| **Health Check** | `http://localhost:5005/api/health` |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Frontend** | React 19 + TypeScript + Vite |
| **Backend** | Express.js + Node.js |
| **Sample Data** | Auto-seeded on first run (4 companies) |

---

## Common Tasks

```bash
# Install all dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Check TypeScript errors
npm run lint

# Run tests
npm run test

# Clean build files
npm run clean

# Build for production
npm run build

# Run production server
npm start
```

---

## .env Configuration

**Required file**: `.env` (copy from `.env.example`)

```env
PORT=5005
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/job_tracker
NODE_ENV=development
```

---

## API Endpoints Summary

```
GET    /api/applications/stats          → Dashboard statistics
GET    /api/applications               → List all applications
GET    /api/applications/:id           → Get single application
POST   /api/applications               → Create new application
PATCH  /api/applications/:id           → Update application
DELETE /api/applications/:id           → Delete application
GET    /api/health                     → Server health check
```

---

## Project Structure

```
📁 job-application-tracker/
  📄 Launch-Project.ps1    ← ⭐ Use this to start!
  📄 Launch-Project.bat    ← Alt: Windows batch version
  📄 .env.example          ← Copy to .env
  📄 README.md             ← Full documentation
  📄 SETUP-GUIDE.md        ← Detailed setup guide
  
  src/
    ├── components/        ← React components
    ├── pages/            ← Page components
    ├── services/         ← API client
    ├── types/            ← TypeScript types
    └── backend/          ← Express API
        ├── routes/
        ├── controllers/
        ├── services/
        ├── middleware/
        └── validators/
```

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "node not found" | Install Node.js v18+ from nodejs.org |
| "Database connection refused" | Check PostgreSQL running & .env DATABASE_URL |
| "Port 5005 in use" | Change PORT in .env or kill process on port |
| "Module not found" | Run `npm install` |
| "TypeScript errors" | Run `npm run lint` to see all errors |

---

## Performance Tips

- **Development**: Use `npm run dev` (hot reload enabled)
- **Production**: Use `npm run build` then `npm start` (optimized)
- **Testing**: Use `npm run test` (run as needed)

---

## First Time Setup Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL installed & running
- [ ] Run `.\Launch-Project.ps1`
- [ ] Server starts without errors
- [ ] Open http://localhost:5005 in browser
- [ ] See sample job applications on dashboard

---

**Pro Tip**: The smart launcher handles everything automatically! Just run it and select your startup mode.

**Status**: Ready to launch 🚀
