# MindVault

> **Your personal AI that builds a working model of you over time — so every conversation starts from where you left off, not from zero.**

MindVault is a full-stack AI chat application built around a single architectural idea: conversations should produce *persistent, structured knowledge*, not disappear the moment you close a tab. Every chat you close is processed by a background Memory Extraction Engine that distills it into typed Memory Nodes — decisions, preferences, learnings, goals — stored permanently in a searchable Knowledge Vault. When you open a new conversation, relevant memories are silently injected as context so the AI already knows your stack, your goals, and what you've already decided.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Reference](#api-reference)
- [Key Concepts](#key-concepts)
- [Documentation](#documentation)
- [Roadmap](#roadmap)

---

## Features

### Core (MVP)

| Feature | Description |
|---|---|
| **Memory Extraction Engine** | Background job that runs after every closed chat. Calls Groq with a structured prompt to extract 1–5 Memory Nodes — decisions, preferences, learnings, goals, and facts — specific to the user. |
| **Knowledge Vault** | Dedicated `/vault` page: browse, filter (by category + type), inline-edit, archive, and delete memory nodes. Your accumulated AI knowledge in one place. |
| **Context Injection** | On the first message of any new chat, the server fetches the top 5 relevant memories and prepends them as a hidden system context block. The AI starts informed without the user re-explaining anything. |
| **Quick Capture** | Global modal (`⌘/Ctrl + Shift + M`) to dump a thought directly into the vault in under 3 seconds. AI auto-classifies category and type. |
| **Four Life Categories** | **Coding**, **Deen**, **Admin**, **Life** — memories and chats are scoped to these domains, enabling category-specific context injection. |

### Phase 2 (Planned)

- **Context Pills** — visible bar in chat showing which memories were injected, with the ability to remove individual ones
- **Semantic Search** — vector-based search using Gemini `text-embedding-004` and in-process cosine similarity (no Atlas Vector Search required)
- **Memory De-duplication** — similarity threshold check on write; near-duplicates reinforce rather than create new nodes
- **Dashboard Redesign** — knowledge-first home screen with vault highlights and memory counts per category
- **Weekly AI Digest** — in-app synthesis of your last 7 days of decisions and learnings
- **Memory Timeline** — chronological view of how your knowledge base grew over time

---

## Architecture Overview

MindVault follows a **three-tier monolith with async intelligence** pattern:

```
┌───────────────────────────────────────────────────────┐
│               CLIENT (Browser)                        │
│  React 19 · Redux Toolkit · RTK Query · Tailwind v4   │
└──────────────────────┬────────────────────────────────┘
                       │  REST (HTTP) + WebSocket
┌──────────────────────▼────────────────────────────────┐
│              APPLICATION SERVER                       │
│           Node.js + Express 5 + Socket.io             │
│                                                       │
│  Routes → Controllers → Services → Job Queue          │
│  Auth MW · Context Injection MW · Joi Validation MW   │
│                                                       │
│  Agenda.js (MongoDB-backed job queue)                 │
│  └── extract-memories job (fires 5 min after close)   │
└──────────────────────┬────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────┐
│             DATA TIER (MongoDB Atlas)                 │
│   users · chats · messages · memories · agendaJobs    │
└──────────────────────┬────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────┐
│              EXTERNAL SERVICES                        │
│  Groq (llama-3.3-70b-versatile) — chat + extraction   │
│  Gemini (text-embedding-004) — semantic embeddings    │
│  Brevo/SMTP — email verification + password reset     │
└───────────────────────────────────────────────────────┘
```

**The key data flow:**

1. User closes a chat → `chat:closed` socket event fires
2. Agenda.js schedules an `extract-memories` job (5-minute delay)
3. Job calls Groq with the full conversation + extraction prompt
4. Valid Memory Nodes are written to the `memories` collection
5. `vault:updated` socket event notifies the client — vault refreshes live

---

## Tech Stack

### Backend

| Technology | Role |
|---|---|
| Node.js + Express 5 | HTTP server and REST API |
| Socket.io | Real-time chat and vault update events |
| MongoDB + Mongoose | Primary data store (users, chats, messages, memories) |
| Agenda.js | MongoDB-backed async job queue for memory extraction |
| Groq SDK (`llama-3.3-70b-versatile`) | Chat completions, memory extraction, quick capture classification |
| Google Gemini SDK (`text-embedding-004`) | Vector embeddings for semantic search (Phase 2) |
| bcryptjs | Password hashing (cost factor 12) |
| JWT (jsonwebtoken) | Access + refresh token authentication |
| Joi | Request body validation |
| Winston + Morgan | Structured application logging + HTTP request logging |
| express-rate-limit | Rate limiting on auth and AI routes |
| Nodemailer / Brevo | Transactional email (verification, password reset) |

### Frontend

| Technology | Role |
|---|---|
| React 19 + Vite 6 | SPA framework and build tooling |
| Redux Toolkit + RTK Query | State management and declarative data fetching with caching |
| React Router v7 | Client-side routing (`/`, `/vault`, `/chat/:id`, etc.) |
| Tailwind CSS v4 | Utility-first styling |
| Socket.io-client | Real-time connection to the backend |
| react-markdown + remark-gfm | Rendering AI markdown responses |
| react-hot-toast | Toast notifications (extraction complete, memory vaulted, etc.) |
| Lucide React | Icon library |

### Infrastructure

| Service | Role |
|---|---|
| Render | Hosting (backend + frontend, same process) |
| MongoDB Atlas M0 | Free-tier database. Note: M0 does not support Atlas Vector Search — semantic similarity is computed in-process. |

---

## Project Structure

```
MindVault/
├── Backend/
│   ├── src/
│   │   ├── config/          # DB connection, Agenda setup, Gemini client
│   │   ├── controllers/     # Thin request handlers (parse → service → respond)
│   │   ├── jobs/            # Agenda job definitions (memoryExtraction.job.js)
│   │   ├── middlewares/     # JWT auth, context injection, Joi validation, error handler
│   │   ├── models/          # Mongoose schemas: User, Chat, Message, Memory
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic: ai, extraction, context, embedding, search, email
│   │   ├── socket/          # Socket.io event handlers (chat, vault)
│   │   ├── utils/           # prompts.js, cosineSimilarity.js, tokenCounter.js, logger.js
│   │   ├── validators/      # Joi schemas per resource
│   │   └── app.js           # Express app setup
│   └── server.js            # Entry point: HTTP server + Socket.io + Agenda start
│
├── Frontend/
│   └── src/
│       ├── app/             # Redux store, root App.jsx, router config
│       ├── constants/       # CATEGORIES, MEMORY_TYPES, API_BASE_URL
│       ├── features/
│       │   ├── auth/        # Login, Signup, VerifyEmail + authSlice + authApi
│       │   ├── chat/        # ChatPage, MessageList, MessageComposer + chatSlice + chatApi
│       │   ├── vault/       # VaultPage, MemoryCard, VaultFilters + vaultSlice + vaultApi
│       │   ├── capture/     # QuickCaptureModal + captureSlice
│       │   └── digest/      # Weekly digest (Phase 2)
│       └── shared/          # Sidebar, Dashboard, Button, Badge, Modal, hooks (useSocket, useAuth)
│
├── mindvault-v2-prd.md          # Full Product Requirements Document
├── mindvault-v2-architecture.md # Technical Architecture Document
├── mindvault-v2-security.md     # Security model, error handling, pre-launch checklist
├── mindvault-v2-frontend-spec.md# Frontend component and UX specification
└── mindvault-v2-ticket-list.md  # Full engineering ticket breakdown
```

**Design principle:** Controllers are intentionally thin. All business logic lives in services. All AI prompts live in `utils/prompts.js` as the single source of truth — iterable without touching service code.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster (M0 free tier works)
- A [Groq](https://console.groq.com) API key
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini, for Phase 2 embeddings)
- SMTP credentials or a [Brevo](https://brevo.com) API key for email

### Environment Variables

Copy `.env.example` to `.env` in the `Backend/` directory:

```bash
cp Backend/.env.example Backend/.env
```

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: `3000`) |
| `CLIENT_URL` | Frontend URL for CORS (e.g., `http://localhost:5173`) |
| `DB_URI` / `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Access token signing secret (min 64 chars) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `GROQ_API_KEY` | Groq API key for chat + extraction |
| `GEMINI_API_KEY` | Gemini API key for embeddings |
| `SENDER_EMAIL` | From address for transactional email |
| `BREVO_API_KEY` | Brevo API key for email delivery |
| `EXTRACTION_MIN_MESSAGES` | Minimum user messages before extraction runs (default: `3`) |
| `EXTRACTION_DELAY_MINUTES` | Delay after chat close before extraction fires (default: `5`) |
| `CONTEXT_MAX_MEMORIES` | Max memory nodes injected per chat (default: `5`) |
| `CONTEXT_MAX_TOKENS` | Hard cap on injected context size (default: `1000`) |
| `SIMILARITY_MERGE_THRESHOLD` | Cosine similarity above which a new memory is merged (default: `0.90`) |
| `SIMILARITY_WARN_THRESHOLD` | Similarity above which a \"possible duplicate\" warning is shown (default: `0.75`) |
| `AGENDA_COLLECTION` | MongoDB collection for Agenda jobs (default: `agendaJobs`) |
| `AGENDA_PROCESS_EVERY` | Job polling interval (default: `30 seconds`) |

> **Never commit `.env`.** It is in `.gitignore`. Production secrets go in Render's environment settings.

### Running Locally

**Backend:**

```bash
cd Backend
npm install
npm run dev        # NODE_ENV=development + nodemon
```

**Frontend:**

```bash
cd Frontend
npm install
npm run dev        # Vite dev server at http://localhost:5173
```

The backend runs at `http://localhost:3000`. The frontend proxies API calls to it via the `CLIENT_URL` setting.

---

## API Reference

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <access_token>`.

### Auth — `/api/auth`

| Method | Path | Description |
|---|---|---|
| `POST` | `/signup` | Create account. Body: `{ email, password }` |
| `POST` | `/login` | Login. Returns access token + sets HttpOnly refresh cookie |
| `GET` | `/verify/:token` | Email verification |
| `POST` | `/forgot-password` | Trigger password reset email |
| `POST` | `/reset-password/:token` | Set new password |
| `POST` | `/logout` | Invalidate refresh token |

### Chats — `/api/chats` *(protected)*

| Method | Path | Description |
|---|---|---|
| `GET` | `/chats` | List all user chats, sorted by `updatedAt` desc |
| `POST` | `/chats` | Create chat. Body: `{ category, title? }` |
| `GET` | `/chats/:id` | Get chat with injected memories populated |
| `PATCH` | `/chats/:id` | Update title |
| `DELETE` | `/chats/:id` | Delete chat + all messages (cascade) |
| `GET` | `/chats/:id/messages` | All messages ordered by `createdAt` asc |
| `POST` | `/chats/:id/messages` | **Send message.** Triggers context injection middleware on first message. |

### Memories — `/api/memories` *(protected)*

| Method | Path | Description |
|---|---|---|
| `GET` | `/memories` | List memories. Query: `category`, `type`, `isArchived`, `page`, `limit` |
| `POST` | `/memories/capture` | Quick Capture. Body: `{ content, category?, type? }` |
| `GET` | `/memories/search` | Search vault. Query: `q` |
| `GET` | `/memories/stats` | Category counts: `{ coding, deen, admin, life }` |
| `GET` | `/memories/:id` | Get single memory |
| `PATCH` | `/memories/:id` | Update `content`, `category`, `type`, or `tags` |
| `PATCH` | `/memories/:id/archive` | Toggle `isArchived` |
| `DELETE` | `/memories/:id` | Hard delete with confirmation |

### Socket Events

| Event | Direction | Description |
|---|---|---|
| `chat:closed` | Client → Server | User navigated away from a chat; triggers extraction scheduling |
| `vault:updated` | Server → Client | Extraction completed; payload includes new memory count |

---

## Key Concepts

### Memory Node

The atomic unit of the knowledge vault. Each node has:

- **`content`** — first-person statement about the user (max 500 chars)
- **`category`** — `coding | deen | admin | life`
- **`type`** — `decision | preference | learning | goal | fact`
- **`confidence`** — `high | medium | low` (assigned by the extraction AI)
- **`source`** — `extraction | quick_capture | manual`
- **`tags`** — 2–4 topic tags auto-assigned by the AI
- **`reinforcementCount`** — incremented when a near-duplicate is detected instead of creating a new node
- **`embedding`** — 768-float vector for semantic search (Phase 2)

### Context Injection

When a user sends the **first message** of a new chat:

1. `contextInjection.middleware.js` intercepts the request
2. Queries the `memories` collection for the user's top 5 most recent memories in that category
3. Builds a formatted system context block and prepends it to the Groq API call
4. Stores the injected memory IDs on the chat record (`injectedMemoryIds`)

The user never sees the raw context. In Phase 2, Context Pills surface it transparently in the chat UI.

### Memory Extraction Pipeline

```
chat:closed event
  → Agenda schedules extract-memories job (delay: EXTRACTION_DELAY_MINUTES)
  → Job fetches full message history
  → Checks messageCount >= EXTRACTION_MIN_MESSAGES
  → Calls Groq with extraction prompt → JSON array of Memory Nodes
  → Validates each node (enum values, content length, required fields)
  → De-duplication check (cosine similarity against existing vault)
  → Writes valid, non-duplicate nodes to `memories` collection
  → Updates user.memorySummary counts
  → Emits vault:updated to the user's private socket room
```

Extraction is **fully async and never blocks the UI.** Failures log silently and are retryable. The user's vault continues to work even if extraction fails on a specific chat.

### Authentication Model

- **Access tokens** — JWT, 15-minute expiry, stored in app memory
- **Refresh tokens** — JWT, 30-day expiry, stored in HttpOnly `Secure` `SameSite=Strict` cookie
- All database queries filter by `userId: req.user.id` — cross-user data access is architecturally impossible, not just policy

---

## Documentation

The `docs/` equivalent for this project lives at the root as versioned markdown files:

| File | Contents |
|---|---|
| [`mindvault-v2-prd.md`](./mindvault-v2-prd.md) | Product Requirements Document — feature specs, user flows, MVP scope, success metrics |
| [`mindvault-v2-architecture.md`](./mindvault-v2-architecture.md) | Technical Architecture — database schema, API design, socket events, data flows, ADL |
| [`mindvault-v2-security.md`](./mindvault-v2-security.md) | Security model, error handling strategy, edge cases, pre-launch checklist |
| [`mindvault-v2-frontend-spec.md`](./mindvault-v2-frontend-spec.md) | Frontend component spec, UX flows, design system |
| [`mindvault-v2-ticket-list.md`](./mindvault-v2-ticket-list.md) | Full engineering ticket breakdown |

---

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| **Phase 1 — Foundation** | Memory Extraction Engine, Memory Schema, Knowledge Vault UI | 🔨 In Progress |
| **Phase 2 — Intelligence** | Context Injection, Quick Capture, Semantic Search, De-duplication | 📋 Planned |
| **Phase 3 — Synthesis** | Dashboard Redesign, Weekly Digest, Memory Timeline, Global Chat | 📋 Planned |

---

*Built by [Abdul Kareem](https://github.com/abdulkareem25). Personal AI memory for coding, deen, admin, and life.*