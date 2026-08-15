# Micro Loan Tracker

A modern microfinance and SACCO-friendly loan tracking MVP built with React, Vite, Express, MongoDB, and Tailwind CSS.

## Features
- Authentication with JWT and secure cookies
- Borrower management
- Loan request creation and balance tracking
- Repayment recording with automatic status updates
- Dashboard analytics and loan history views
- Responsive, accessible UI

## Tech Stack
- Frontend: React 19, Vite, React Router, Tailwind, TanStack Query, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose, Zod, JWT, bcrypt

## Setup

### 1. Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2. Client
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### 3. Seed data
```bash
cd server
node seed.js
```

## Default login
- Email: admin@microloan.dev
- Password: password123

## API base
- Client expects the API at http://localhost:5000/api
