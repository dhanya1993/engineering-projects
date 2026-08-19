# Mini CRM

A full-stack CRM — contacts, a drag-and-drop deal pipeline, an activity timeline, and task
reminders. React + Node/Express + MongoDB, JWT authentication.

## Why this exists

Most of my other portfolio projects (RBAC dashboard, IoT-style admin console) need a paragraph of
explanation before a reviewer understands what they do. A CRM doesn't — everyone who's ever used
Salesforce, HubSpot, or Pipedrive already knows the shape of this product, so it's a fast way to
show full-stack range without spending the reviewer's attention on domain explanation first.

## What it does

- **Contacts** — create, search, and view a full activity history for each person
- **Deal pipeline** — a Kanban board across six stages (Lead → Contacted → Proposal →
  Negotiation → Won/Lost), with real drag-and-drop that persists the new stage and position to
  the database, plus an optimistic UI update so cards move instantly instead of waiting on the
  round-trip
- **Activity timeline** — notes, calls, emails, and meetings logged against a contact or a deal;
  moving a deal between pipeline stages automatically logs a `stage_change` entry, so the timeline
  reads as a real history rather than a manual log
- **Tasks** — due-date reminders linked to a contact or deal, filterable by overdue/today/upcoming/
  completed
- **Dashboard** — open pipeline value, deals won, contact count, and task counts at a glance

## Project structure

```
server/
  src/
    models/       User, Contact, Deal, Activity, Task
    controllers/  Route handlers — dealController.js is worth reading first
    routes/
    middleware/auth.js   JWT verification
    seed/seed.js          Realistic demo data: 4 contacts, 8 deals across every stage, activity
                          history, and tasks (including one intentionally overdue)
client/
  src/
    pages/         Dashboard, Deals (kanban), Contacts, Tasks, Login
    components/
      DealCard.tsx, DealDetailModal.tsx     Kanban card + detail/timeline modal
      ContactDetailModal.tsx                Contact detail + timeline modal
      Sidebar.tsx, AppLayout.tsx, ProtectedRoute.tsx
    context/AuthContext.tsx
    types/index.ts   Shared types mirroring the server's schema
```

## How the kanban drag-and-drop works

`DealsPage.tsx` uses the native HTML5 drag-and-drop API (`draggable`, `onDragStart`,
`onDragOver`, `onDrop`) — no drag-and-drop library — with two things worth calling out:

1. **Optimistic updates.** The card's `stage` and `position` update in local state immediately on
   drop, before the API call resolves, so the board feels instant. If the request fails, the UI
   reloads from the server instead of leaving a card in a state the backend never actually saved.
2. **Position tracking.** Each deal has a `position` field scoped to its stage, so manually
   reordering cards within (or between) columns is preserved instead of the board always
   re-sorting by creation date.

## Running it locally

You'll need a MongoDB instance (local, Docker, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env — set MONGO_URI and a real JWT_SECRET
npm run seed   # creates one demo user, 4 contacts, 8 deals, activity history, and tasks
npm run dev    # starts the API on http://localhost:5001
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev    # starts the app on http://localhost:5175
```

Sign in with the seeded demo account: **demo@minicrm.com** / **Passw0rd!**

## API overview

| Method | Route | Notes |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | — |
| GET | `/api/dashboard/summary` | Pipeline value, contact/task counts |
| GET/POST | `/api/contacts` | `?search=` filters by name/company/email |
| GET/PATCH/DELETE | `/api/contacts/:id` | |
| GET/POST | `/api/deals` | |
| PATCH | `/api/deals/:id` | Handles both field edits and kanban drag-drop (`stage`, `position`) |
| GET/POST | `/api/activities` | `?contactId=` or `?dealId=` |
| GET/POST | `/api/tasks` | `?status=overdue\|today\|upcoming\|completed` |

## Tech stack

- **Backend:** Node.js, Express 4, MongoDB + Mongoose, JWT, `bcryptjs`, `helmet` + `cors`
- **Frontend:** React 18 + TypeScript, React Router v6, Tailwind CSS, Axios

## What I'd add next

- [ ] Email/calendar integration for tasks
- [ ] Bulk contact import (CSV)
- [ ] Deal-value forecasting / reporting charts
- [ ] Automated tests (Jest + Supertest for the API)

## Author

**Dhanyashree H P** — Senior Software Engineer (React.js, React Native, Mobile)
[linkedin.com/in/dhanya-chinivar-773b37115](https://linkedin.com/in/dhanya-chinivar-773b37115)
