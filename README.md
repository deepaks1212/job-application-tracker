# Job Application Tracker 💼

A pristine, high-craft, production-ready Full-Stack Web Application designed and built for an internship assessment portfolio. This platform allows applicants to track, organize, and monitor their active job & internship application timelines across varying interviewing phases on a single, responsive dashboard.

🚀 Tech Stack

### Frontend (User Interface)
* **React.js (TypeScript)** - For robust type-safe component state architecture.
* **Vite** - High-speed, modern asset bundling.
* **Tailwind CSS** - Modern, custom-crafted user interfaces emphasizing negative space, balanced grids, and beautiful typography.
* **motion/react** - Organic, soft, non-intrusive micro-interactions and route animations.
* **Lucide React** - Cohesive, pixel-perfect, light outline vector iconography.
* **Axios** - Standard client-side HTTP resource queries.

### Backend (REST API Service)
* **Node.js & Express.js** - Solid MVC architecture with separate routes, validation controllers, database services, and unified error middleware.
* **Prisma ORM** - Modern relational database connection mapping.
* **PostgreSQL Database** - Modern relational database support for production-ready backend data storage.
* **Zod** - Declarative, type-safe API request body input validation models.

---

## ✨ Core Features

1. **Stats Dashboard Overview**: Dynamic upper counters listing total tracked applications, applied statuses, active interview panels, verbal/written offers, and rejection points. 
2. **Search & Status Filtering**: Real-time server-side database matching of records based on company names, job roles, or core employment statuses.
3. **Application CRUD Flow**: Completing Full Create, Read, Update, and Delete operations for role entries.
4. **Form Validation Enforcements**: Enforces minimum characters (e.g. Company name >=2 chars) and valid enum selections on client and backend layers.
5. **Interactive Feedback System**: Micro-animated toast notifications sliding in at the bottom-right corner to celebrate successful actions or highlight input anomalies.
6. **Automatic Demo Seeding**: Auto-detects empty databases upon server boot and seeds 4 sample internship entries (Google, Apple, Stripe, Netflix) for instant review.

---

## 🗄️ Database Schema Design

model Application {
  id           String   @id @default(uuid())
  company_name String
  job_title    String
  job_type     String   // INTERNSHIP, FULL_TIME, PART_TIME
  status       String   // APPLIED, INTERVIEWING, OFFER, REJECTED
  applied_date DateTime
  notes        String?
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt

  @@map("applications")
}
```

---

## 🛠️ REST API Specification

All routes are prefixed under `/api/applications`:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/applications/stats` | None | Retrieves aggregate counts for dashboard metrics cards |
| **GET** | `/api/applications` | `?search=str&status=str&page=int&limit=int` | Retrieves paginated and filtered application list |
| **GET** | `/api/applications/:id` | Path variable `id` | Inspect detailed database record for a single role |
| **POST** | `/api/applications` | Body payload `ApplicationInput` | Create a new job application record (Validated via Zod) |
| **PATCH** | `/api/applications/:id` | Body payload `Partial<ApplicationInput>` | Partially updates an active role metadata |
| **DELETE** | `/api/applications/:id` | Path variable `id` | Permanently deletes a single role from tracking boards |

---

## 🏃‍♂️ Installation & How to Run

### ⚡ Quick Start (Recommended) - One-Click Smart Launcher

We've created **intelligent startup scripts** that handle everything automatically:

#### For Windows Users:
```powershell
# Using PowerShell (Recommended - Interactive with color output)
.\Launch-Project.ps1

# OR using Command Prompt
.\Launch-Project.bat
```

The smart launcher will:
- ✓ Check Node.js and npm prerequisites
- ✓ Create `.env` file from template if needed
- ✓ Install dependencies automatically
- ✓ Initialize the database schema on first start
- ✓ Auto-seed 4 sample job applications
- ✓ Start the development server on **http://localhost:3001**

**Pro Tip**: The PowerShell script offers an interactive menu for:
- **Development Mode** (hot reload enabled)
- **Production Mode** (optimized build)
- **Fresh Install** (clean dependency reinstall)

---

### Manual Setup (If Preferred)

#### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your workstation.

#### 2. Set Up Environment Variables
Create a `.env` file at the root of the project (or copy from `.env.example`):
```env
# Server Port Configuration
PORT=5005

# PostgreSQL Database connection
DATABASE_URL="postgresql://postgres:Kathmandu1@localhost:5432/job_tracker"

# Node Environment
NODE_ENV=development
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Start Development Server
Run the full-stack development instance (utilizing Express in front of Vite):
```bash
npm run dev
```
Open your browser to **http://localhost:3001**

**Note**: The database schema auto-initializes and seeds with sample data on first run!

#### 5. Build & Production Deployment
Compile assets and launch the packaged Node.js server:
```bash
npm run build
npm start
```

---

## 📋 Additional npm Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run TypeScript type checking
npm run test     # Run test suite (Vitest)
npm run clean    # Remove build artifacts
```

---
