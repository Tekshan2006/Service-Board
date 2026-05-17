# Service Request Board

A full-stack web app for posting and browsing home service requests.

---

## Tech Stack

- **Frontend:** Next.js 14
- **Backend:** Node.js + Express
- **Database:** MongoDB

---

## Setup

### Install Dependencies

From root directory:

```bash
npm install
```

### Setup Environment Variables

**Backend - create `backend/.env`:**
```
MONGO_URI=mongodb://127.0.0.1:27017/service-board
PORT=5050
FRONTEND_URL=http://localhost:3000
```

**Frontend - create `frontend/.env`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5050
```

---

## How to Run

From root directory:

**Start everything:**
```bash
npm run dev
```

**Start backend only:**
```bash
npm run dev:backend
```

**Start frontend only:**
```bash
npm run dev:frontend
```

**Build for production:**
```bash
npm run build
```

**Start production servers:**
```bash
npm run start
```

**Seed database with sample data:**
```bash
npm run seed
```

---

## All Available Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies for both frontend and backend |
| `npm run dev:frontend` | Start frontend dev server (port 3000/3001) |
| `npm run dev:backend` | Start backend dev server (port 5050) with hot-reload |
| `npm run dev` | Start both frontend and backend |
| `npm run build:frontend` | Build frontend for production |
| `npm run build:backend` | Build backend |
| `npm run build` | Build both frontend and backend |
| `npm run start:frontend` | Start frontend production server |
| `npm run start:backend` | Start backend production server |
| `npm run start` | Start both in production mode |
| `npm run seed` | Seed database with sample data |

---

## Features

- View all job requests
- Search by keyword
- Filter by category and status
- Create new job
- Update job status
- Delete job
- View job details

---

## API Endpoints

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job
- `PATCH /api/jobs/:id` - Update job status
- `DELETE /api/jobs/:id` - Delete job

---

## Access

- Frontend: http://localhost:3000
- Backend: http://localhost:5050
