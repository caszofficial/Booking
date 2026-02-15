# Mini Booking (React + Node + PostgreSQL)

## Features
- Create bookings
- Prevent overlaps (enforced at DB level via `EXCLUDE` constraint)
- List bookings by date (and by resource)

## Requirements
- Node.js 18+
- PostgreSQL 13+

## 1) Database setup (PostgreSQL)
Create a database and user (example):

```sql
CREATE USER booking_user WITH PASSWORD 'booking_pass';
CREATE DATABASE mini_booking OWNER booking_user;
```

Enable the extension and create tables/constraints:

```bash
cd server
# copy env
cp .env.example .env
# edit .env with your DB credentials
npm install
npm run migrate
npm run dev
```


## 2) Run backend
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:4000`.

## 3) Run frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.


