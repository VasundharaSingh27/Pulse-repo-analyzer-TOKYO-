#Pulse Engineering Intelligence Dashboard Documentation

> **TOKYO Team-03**

A high-performance engineering intelligence dashboard that analyzes GitHub repositories and provides actionable insights into team contributions, code activity, and engineering patterns using AI.

---

## Project Overview

Pulse is a full-stack AI-powered dashboard that connects to GitHub repositories and uses the Gemini AI API to:

- Classify commits by impact and type
- Visualize developer contribution patterns
- Score engineering activity across a team
- Track repository health and code evolution over time

This project was built as part of the **Ampcus Cyber HBTU Campus Drive** — a 7-day collaborative systems engineering assessment evaluated on real-world engineering discipline, AI/ML integration, and team collaboration.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│         React + Vite + Tailwind CSS + Recharts          │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│   │  Pages   │  │Components│  │   Context (Auth)      │ │
│   └──────────┘  └──────────┘  └──────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP REST API
┌───────────────────────▼─────────────────────────────────┐
│                      BACKEND                            │
│              Node.js + Express.js                       │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│   │  Routes  │  │  Models  │  │   Middleware (JWT)    │ │
│   └──────────┘  └──────────┘  └──────────────────────┘ │
│        │                              │                  │
│        ▼                              ▼                  │
│   ┌──────────┐              ┌─────────────────┐         │
│   │ Gemini   │              │  MongoDB Atlas  │         │
│   │   API    │              │   (Database)    │         │
│   └──────────┘              └─────────────────┘         │
│        │                                                 │
│        ▼                                                 │
│   ┌──────────┐                                          │
│   │  GitHub  │                                          │
│   │   API    │                                          │
│   └──────────┘                                          │
└─────────────────────────────────────────────────────────┘
```

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Lucide React, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI/ML** | Google Gemini API (`@google/genai`) |
| **Auth** | JWT + Bcrypt |
| **Version Control** | Git + GitHub |

---

##  Setup Instructions

### Prerequisites

- Node.js v16+
- MongoDB Atlas account
- Gemini API Key ([get here](https://ai.google.dev/))
- GitHub Personal Access Token (optional, for higher rate limits)

---

### 1. Clone the Repository

```bash
git clone https://github.com/VasundharaSingh27/Pulse-repo-analyzer-TOKYO-.git
cd Pulse-repo-analyzer-TOKYO-
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token_optional
```

Start the backend server:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 👥 Team Roles

| Member | Role | Contribution |
|--------|------|-------------|
| **Shivendra Pal** | Team Leader & Frontend Developer | Frontend project setup, config files, public assets, entry point and AI integration |
| **Vasundhara Singh** | Frontend Developer | Frontend src structure, repo management, components, pages, context, PR reviews |
| **Suraj Maurya** | Schema Development,Testing & Documentation | Database models (User, Repo, Contributor, Commit), config setup, documentation |
| **Amit Tripathi** | Backend Developer | Express server setup, Controllers, Routes, core API routes |
| **Ankit Tiwari** | Backend Developer | Auth routes, auth middleware, services including geminiService and githubService |

---

##  API Documentation

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Repository Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/repos` | Get all tracked repositories |
| POST | `/api/repos` | Add a new repository to track |
| GET | `/api/repos/:id` | Get single repository details |
| DELETE | `/api/repos/:id` | Remove a repository |

### Insights Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/insights/:repoId` | Get AI-analyzed commit insights |
| GET | `/api/insights/:repoId/contributors` | Get contributor breakdown |
| GET | `/api/insights/:repoId/heatmap` | Get activity heatmap data |

### AI Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/classify` | Classify commits using Gemini AI |
| POST | `/api/ai/score` | Get impact score for a commit |

---

##  Key Design Decisions (ADR)

### ADR-01: MongoDB Atlas over SQL
**Decision:** Used MongoDB Atlas instead of PostgreSQL.  
**Reason:** GitHub data (commits, contributors, repos) is hierarchical and semi-structured — MongoDB's document model fits naturally without complex joins.  
**Trade-off:** No strict schema enforcement, but Mongoose ODM provides validation.

---

### ADR-02: Gemini API for AI Classification
**Decision:** Used Google Gemini API for commit classification and impact scoring.  
**Reason:** Gemini handles natural language well — commit messages are unstructured text, and Gemini classifies them into meaningful categories (feat, fix, chore, refactor, etc.) with impact scores.  
**Trade-off:** API rate limits exist; we handle failures gracefully with fallback classification.

---

### ADR-03: JWT for Authentication
**Decision:** Used JWT (JSON Web Tokens) with Bcrypt for auth.  
**Reason:** Stateless auth fits REST API design — no session storage needed on server.  
**Trade-off:** Token revocation requires extra logic; acceptable for this scope.

---

### ADR-04: Vite over Create React App
**Decision:** Used Vite as the frontend build tool.  
**Reason:** Vite is significantly faster in dev mode with HMR (Hot Module Replacement) compared to CRA.  
**Trade-off:** Slightly different config patterns, but well-documented.

---

### ADR-05: Separate Frontend and Backend
**Decision:** Decoupled frontend and backend as separate services.  
**Reason:** Clean separation of concerns — frontend can be deployed independently, backend can scale separately.  
**Trade-off:** CORS configuration needed, but standard practice in production systems.

---

## 📁 Project Structure

```
Pulse-repo-analyzer-TOKYO-/
├── backend/
│   ├── config/          → Database connection
│   ├── models/          → Mongoose schemas (User, Repo, Contributor, Commit)
│   ├── routes/          → API endpoints
│   ├── middleware/       → JWT auth middleware
│   ├── server.js        → Express app entry point
│   └── .env             → Environment variables (not committed)
├── frontend/
│   ├── public/          → Static assets (favicon, icons)
│   ├── src/
│   │   ├── components/  → Reusable UI components
│   │   ├── pages/       → Application pages/routes
│   │   ├── context/     → Global auth state
│   │   ├── lib/         → Utility functions
│   │   ├── assets/      → Images and static files
│   │   ├── App.jsx      → Root component
│   │   └── main.jsx     → React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## 📄 License

Distributed under the MIT License.

---

*Built with ❤️ by Team TOKYO T03 — HBTU Kanpur*
