# Sales CRM — MERN Stack

A simple Sales CRM (Client Management System) built with MongoDB, Express, React, and Node.js.

## Features

- **Authentication**: Register, Login with JWT + bcrypt
- **Roles**: Admin and Sales user roles
- **Leads**: Add, Edit, Delete, Search, Filter by status
- **Deals**: Manage deals per lead with stages (Prospect, Negotiation, Won, Lost)
- **Activities**: Log Calls, Meetings, Notes, Follow-ups per lead
- **Admin**: View all users and all leads
- **Sales**: Manage only their own leads, deals, and activities

---

## Project Structure

```
sparse-chromosphere/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── leadController.js
│   │   ├── dealController.js
│   │   └── activityController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Lead.js
│   │   ├── Deal.js
│   │   └── Activity.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── dealRoutes.js
│   │   └── activityRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── PrivateRoute.js
        │   └── AdminRoute.js
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Dashboard.js
        │   ├── LeadList.js
        │   ├── LeadForm.js
        │   ├── LeadDetail.js
        │   └── UserList.js
        ├── services/
        │   └── api.js
        ├── App.js
        └── index.css
```

---

## Prerequisites

- Node.js v16+
- MongoDB running locally (or MongoDB Atlas URI)
- npm

---

## Setup Instructions

### 1. Clone / Navigate to project

```bash
cd sparse-chromosphere
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/sales_crm
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Start the backend:

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

The `.env` file is already set:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | Endpoint             | Description       | Access  |
| ------ | -------------------- | ----------------- | ------- |
| POST   | `/api/auth/register` | Register new user | Public  |
| POST   | `/api/auth/login`    | Login user        | Public  |
| GET    | `/api/auth/me`       | Get current user  | Private |

### Users (Admin only)

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/users`     | Get all users  |
| GET    | `/api/users/:id` | Get user by ID |

### Leads

| Method | Endpoint         | Description                             |
| ------ | ---------------- | --------------------------------------- |
| GET    | `/api/leads`     | Get leads (supports `?search=&status=`) |
| GET    | `/api/leads/:id` | Get single lead                         |
| POST   | `/api/leads`     | Create lead                             |
| PUT    | `/api/leads/:id` | Update lead                             |
| DELETE | `/api/leads/:id` | Delete lead                             |

### Deals

| Method | Endpoint                  | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| GET    | `/api/deals/lead/:leadId` | Get deals by lead (supports `?stage=`) |
| POST   | `/api/deals`              | Create deal                            |
| PUT    | `/api/deals/:id`          | Update deal stage                      |
| DELETE | `/api/deals/:id`          | Delete deal                            |

### Activities

| Method | Endpoint                       | Description                   |
| ------ | ------------------------------ | ----------------------------- |
| GET    | `/api/activities/lead/:leadId` | Get activity history for lead |
| POST   | `/api/activities`              | Log new activity              |
| DELETE | `/api/activities/:id`          | Delete activity               |

---

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator
- **Frontend**: React (Hooks), React Router v6, Axios, Context API
- **Auth**: JWT tokens stored in localStorage

---

## Default Test Users

After registering, you can create an admin and a sales user:

1. Register with role **admin**
2. Register with role **sales**

Login and test role-based access.
