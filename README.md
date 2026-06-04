# WealthOS — Personal Finance Analyzer

> An AI-powered financial OS that helps you clear debt faster, save smarter, and project your net worth — built with real DSA algorithms, not just CRUD.

![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

**Live demo:** https://wealthos-beta.vercel.app

---

## Features

### Debt Payoff Optimizer
Compares 3 strategies to find the fastest path out of debt:
- **Avalanche** — greedy algorithm, highest interest first (min-heap)
- **Snowball** — greedy algorithm, lowest balance first (min-heap)
- **DP Optimized** — 1D knapsack DP that maximizes total interest saved under a monthly budget constraint

### Smart Budget Allocator
Distributes monthly savings across goals using a greedy activity-selection algorithm sorted by priority.

### Spending Analysis
- Sliding window algorithm for 30/60/90-day rolling spend averages
- HashMap aggregation for category breakdown
- Subscription detector using frequency mapping over transaction history

### Net Worth Projector
Compound growth simulation with adjustable income, savings rate, and investment return sliders.

### AI Financial Advisor
Context-aware chat grounded in the user's real financial data — transactions, debts, and goals injected as system prompt context.

### Real-time Budget Alerts
Socket.IO WebSocket connection pushes instant notifications when monthly spending exceeds 90% of income.

### Trie Autocomplete
Merchant name autocomplete built from scratch — O(k) prefix search where k = query length.

### Auth System
JWT access tokens (15min) + refresh tokens (7 days) stored in httpOnly cookies. Google OAuth via Passport.js.

---

## DSA Concepts Used

| Algorithm | Where | Complexity |
|---|---|---|
| Min-heap (priority queue) | Avalanche/Snowball debt scheduler | O(log n) per operation |
| DP (1D knapsack) | Optimal debt payoff under budget cap | O(n × B) where B = budget |
| Greedy (activity selection) | Goal allocator, avalanche/snowball | O(n log n) |
| Sliding window | 30/60/90-day spend analysis | O(n) |
| HashMap | Category aggregation, subscription detection | O(1) average |
| Trie | Merchant autocomplete | O(k) lookup, k = query length |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Recharts, Socket.IO client |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, Passport.js (Google OAuth) |
| AI | Google Gemini API |
| Real-time | Socket.IO WebSockets |
| Deploy | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Architecture

```
Browser (React + Tailwind)
    │
    ├── REST API calls → Express.js routes
    │       ├── /api/auth      — JWT auth, Google OAuth
    │       ├── /api/transactions — CRUD + CSV upload + category tagger
    │       ├── /api/debts     — CRUD + JS debt optimizer (DP + heap)
    │       ├── /api/goals     — CRUD + greedy allocator
    │       ├── /api/chat      — Gemini AI with financial context
    │       └── /api/search    — Trie autocomplete
    │
    ├── WebSocket (Socket.IO) → real-time budget alerts
    │
    └── MongoDB Atlas
            ├── users
            ├── transactions
            ├── debts
            └── goals
```

---

## Local Setup

```bash
# Clone
git clone https://github.com/Vermyst/wealthos.git
cd wealthos

# Backend
cd backend
npm install
# Create .env with MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, GEMINI_API_KEY
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## What I learned

- Implementing classic DSA problems (knapsack, heaps, tries) inside a real production feature — not just on paper
- Designing a multi-schema MongoDB database with relational-style references
- JWT authentication with access/refresh token rotation
- Real-time event-driven architecture using Socket.IO pub/sub
- Integrating LLM APIs with context injection for grounded responses
- Deploying a full-stack app across Vercel + Render + MongoDB Atlas

---

Built by Tanishk · 2026
