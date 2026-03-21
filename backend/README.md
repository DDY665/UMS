# UMS — User & Employee Management System

UMS is a production-grade full stack User & Employee Management System built using Node.js, Express, MySQL, React, and Tailwind CSS.
It models how real enterprise platforms handle authentication, onboarding, role control, department management, security, and audit tracking.

This system implements:

- JWT based stateless authentication
- Role-Based Access Control (admin, manager, supervisor, employee, user)
- Forced onboarding for employees with temporary password
- Brute-force login protection
- Department-based team management
- Admin employee creation with automatic email of credentials
- Audit logging of all critical actions
- Clean scalable architecture (controllers, services, middleware, utils)
- Professional frontend integrated with protected routes and onboarding guards

---

## Features

### Authentication & Security

- Signup & Login
- JWT Stateless Authentication
- Password hashing using bcrypt
- Brute-force attack protection (5 attempts → 15 min lock)
- Account block / unblock by admin
- Password reuse prevention
- Email uniqueness enforcement

### Role & Access Control

- Roles: admin, manager, supervisor, employee, user
- Strict role-based route access
- Protected frontend routes
- Onboarding guard for new employees

### Employee & Department Management

- Admin can create employees
- Temporary password auto-generated
- Credentials sent via email
- Forced password change on first login
- Department-based team viewing
- Profile & email update

### Email Integration

- Gmail App Password based email sender
- Sends employee credentials
- Onboarding link to change password

### Audit System

Every major action logged in audit table:

- Signup
- Login
- Employee creation
- Profile view
- Email/password change
- Block/unblock
- Team view

### Frontend (React + Tailwind)

- Clean dashboard layout
- ProtectedRoute, RoleRoute, OnboardingGuard
- Login / Signup / Change Password / Profile / Team / Admin Users pages
- Axios interceptor with JWT
- Responsive UI

---

## Tech Stack

### Backend

- Node.js
- Express.js (v5)
- MySQL (mysql2/promise)
- JWT (jsonwebtoken)
- bcrypt
- nodemailer
- express-validator

### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- React Router

---

## Project Structure

```
UMS/
│
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   ├── .gitignore
│
│   ├── lib/
│   │   └── prisma.js
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│
│   ├── services/
│   │   ├── auth.service.js
│   │   └── user.service.js
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│
│   └── utils/
│       ├── response.util.js
│       ├── audit.util.js
│       └── mail.util.js
│
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── eslint.config.js
    ├── .gitignore
    │
    ├── public/
    │
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        │
        ├── api/
        │   └── axios.js
        │
        ├── auth/
        │   ├── AuthContext.jsx
        │   ├── AuthProvider.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── RoleRoute.jsx
        │   └── OnboardingGuard.jsx
        │
        ├── components/
        │   ├── Layout.jsx
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   └── CreateEmployeeModal.jsx
        │
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── ChangePassword.jsx
            ├── Onboard.jsx
            ├── Profile.jsx
            ├── Team.jsx
            └── AdminUsers.jsx


```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=mydb

JWT_SECRET=your_jwt_secret

MAIL_USER=yourgmail@gmail.com
MAIL_PASS=your_gmail_app_password

```

---

## Database Schema

### Users Table

```sql

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','supervisor','employee','user'),
  department_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  must_change_password BOOLEAN DEFAULT FALSE,
  onboarding_status ENUM('PENDING','ACTIVE'),
  failed_attempts INT DEFAULT 0,
  lock_until DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


```

### Departments Table

```sql

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


```

### Audit Logs Table

```sql

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_id INT,
  action VARCHAR(255),
  target_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

---

## Running the Project

### Backend

```bash
cd backend
npm install
npm run dev

```

### Frontend

```bash
cd frontend
npm install
npm run dev

```

### Server will run on:

```bash
http://localhost:3000

```

---

## API Endpoints

### Auth Routes

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | `/api/auth/signup` | Register new user   |
| POST   | `/api/auth/login`  | Login & receive JWT |

### User Routes

| Method | Endpoint                 | Access               | Description                           |
| ------ | ------------------------ | -------------------- | ------------------------------------- |
| GET    | `/api/users/me`          | Authenticated        | Get profile                           |
| PATCH  | `/api/users/me/email`    | Authenticated        | Change email                          |
| PATCH  | `/api/users/me/password` | Authenticated        | Change password / complete onboarding |
| GET    | `/api/users/team`        | Manager / Supervisor | View department team                  |
| GET    | `/api/users`             | Admin                | View all users                        |
| POST   | `/api/users/create`      | Admin                | Create employee with temp password    |
| PATCH  | `/api/users/:id/block`   | Admin                | Block user                            |
| PATCH  | `/api/users/:id/unblock` | Admin                | Unblock user                          |

---

## Security Highlights

- Passwords stored only as bcrypt hashes
- JWT stateless authentication
- Role-based authorization middleware
- Forced onboarding using JWT payload flag
- Brute-force protection using failed attempt tracking
- Email uniqueness enforcement
- Password reuse prevention
- Centralized error handling
- Complete audit logging of actions

---

## Testing

All endpoints were tested using Postman for authentication flows, JWT protection, role-based access control, onboarding enforcement, account locking behavior, admin operations, error handling, and audit logging.
