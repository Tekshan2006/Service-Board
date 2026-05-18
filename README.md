# Service Request Board

A full-stack web application for posting and browsing home service requests. Users can create, view, search, and manage service job listings with real-time status updates. Built with modern web technologies including Next.js for the frontend, Node.js/Express for the backend, and MongoDB Atlas for cloud database management.

### Key Features:
- **Job Listings**: Browse all available service requests
- **Advanced Search**: Search by keywords across job titles and descriptions
- **Smart Filtering**: Filter jobs by category (Plumbing, Electrical, Painting, Joinery, Other) and status (Open, In Progress, Closed)
- **Job Management**: Create new service requests, update statuses, and delete completed jobs
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant synchronization between frontend and backend

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
npm run install-all
```

This installs dependencies for:
- Root directory
- Backend directory
- Frontend directory

### Setup Environment Variables

**Backend - create `backend/.env`:**
```
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?appName=service-board
PORT=5050
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

**Frontend - create `frontend/.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5050
```

> **Note:** For the MongoDB URI, use MongoDB Atlas (cloud database). Get your connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

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
| `npm run install-all` | Install all dependencies for root, frontend, and backend |
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
| `npm test` | Run unit tests for API endpoints (backend only) |

---

## Authentication & Security

### JWT Authentication
The application uses **JWT (JSON Web Token)** for secure authentication:

- **Protected Routes**: POST, PATCH, and DELETE endpoints require authentication
- **Login Endpoint**: `POST /api/auth/login` - Get a JWT token
- **Token Usage**: Include token in Authorization header: `Authorization: Bearer <token>`

### How to Use JWT:
1. Login to get a token:
```bash
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

2. Use the token to create/update/delete jobs:
```bash
curl -X POST http://localhost:5050/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "New Job", "description": "Job details", "category": "Plumbing"}'
```

---

## Testing

### Unit Tests
The backend includes comprehensive unit tests using **Jest** and **Supertest**:

**Run tests:**
```bash
cd backend && npm test
```

**Test Coverage:**
- GET all jobs
- GET single job by ID
- POST create job (with JWT protection)
- PATCH update job status (with JWT protection)
- DELETE job (with JWT protection)
- POST login endpoint
- Error handling and validation

**Sample Test Results:**
```
Test Suites: 1 passed
Tests:       15 passed
```

---

## API Endpoints

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (requires JWT)
- `PATCH /api/jobs/:id` - Update job status (requires JWT)
- `DELETE /api/jobs/:id` - Delete job (requires JWT)
- `POST /api/auth/login` - Login and get JWT token

---

## API Testing with cURL

Test the API endpoints using cURL commands:

### Get all jobs
```bash
curl http://localhost:5050/api/jobs
```

### Get all jobs with filters
```bash
# Filter by category
curl "http://localhost:5050/api/jobs?category=Plumbing"

# Filter by status
curl "http://localhost:5050/api/jobs?status=Open"

# Search by keyword
curl "http://localhost:5050/api/jobs?search=leak"

# Combine filters
curl "http://localhost:5050/api/jobs?category=Electrical&status=In%20Progress"
```

### Get a single job by ID
```bash
curl http://localhost:5050/api/jobs/YOUR_JOB_ID
```

### Create a new job (requires JWT token)
```bash
# First, get a JWT token:
TOKEN=$(curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}' | jq -r '.token')

# Then create the job:
curl -X POST http://localhost:5050/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Leaky tap repair needed",
    "description": "Kitchen tap is dripping constantly",
    "category": "Plumbing",
    "location": "123 Main St",
    "contactName": "John Doe",
    "contactEmail": "john@example.com"
  }'
```

### Update job status (requires JWT token)
```bash
# First, get a JWT token:
TOKEN=$(curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}' | jq -r '.token')

# Then update the job:
curl -X PATCH http://localhost:5050/api/jobs/YOUR_JOB_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "In Progress"}'
```

### Delete a job (requires JWT token)
```bash
# First, get a JWT token:
TOKEN=$(curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}' | jq -r '.token')

# Then delete the job:
curl -X DELETE http://localhost:5050/api/jobs/YOUR_JOB_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Project Structure

```
Service-Board/
├── backend/
│   ├── models/
│   │   └── JobRequest.js          # MongoDB schema for jobs
│   ├── routes/
│   │   └── jobs.js                # API endpoint handlers
│   ├── middleware/
│   │   └── errorHandler.js        # Global error handler
│   ├── .env                       # Backend environment variables
│   ├── .env.example               # Example environment file
│   ├── server.js                  # Express server setup
│   ├── seed.js                    # Database seeding script
│   └── package.json               # Backend dependencies
│
├── frontend/
│   ├── app/
│   │   ├── page.js                # Home page - list all jobs
│   │   ├── layout.js              # Root layout
│   │   ├── globals.css            # Global styles
│   │   └── jobs/
│   │       ├── [id]/
│   │       │   └── page.js        # Job detail page
│   │       └── new/
│   │           └── page.js        # Create new job page
│   ├── components/                # Reusable React components
│   ├── lib/
│   │   └── api.js                 # API client functions
│   ├── next.config.js             # Next.js configuration
│   ├── package.json               # Frontend dependencies
│   └── .env.local.example         # Example environment file
│
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI/CD pipeline - testing & build
│       └── cd.yml                 # CD pipeline - deployment
│
├── package.json                   # Root package.json with scripts
├── README.md                       # This file
└── .gitignore                     # Git ignore rules
```

---

## Author

**Tekshan Thaksara**

---

## Local Development URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5050

---

## License

This project is licensed under the **MIT License** - see the LICENSE file for details.

You are free to:
- Use this project for personal or commercial purposes
- Modify and distribute the code
- Include it in other projects

The only requirement is to include the original license notice.

---

## Support

If you have any questions or issues, feel free to open a GitHub issue or contact the author.
