# OPD Backend

A demo-ready outpatient department API built with Node.js, Express, Sequelize, and MySQL.

## Prerequisites

- Node.js 18 or newer
- MySQL 8 or newer
- npm

## Database setup

Open MySQL and run:

```sql
CREATE DATABASE opd_db;
```

Copy `.env.example` to `.env` and set your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=opd_db
PORT=5000
```

## Run

```bash
cd backend
npm install
npm start
```

For development with automatic restart:

```bash
npm run dev
```

The API runs at `http://localhost:5000` and allows requests from `http://localhost:5173`.
Tables are created automatically on startup and sample doctors and patients are inserted when their tables are empty.

## API endpoints

All endpoints return JSON.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/patients` | Create a patient |
| GET | `/api/patients?search=9876` | List or search patients |
| GET | `/api/doctors` | List doctors |
| POST | `/api/appointments` | Create an appointment |
| GET | `/api/appointments/today` | List today's appointments |
| GET | `/api/appointments/:id` | Get one appointment with patient and doctor |
| POST | `/api/appointments/:id/consultation` | Complete appointment with consultation |
| GET | `/api/patients/:id/consultations` | List completed patient consultations |

### Sample requests and responses

Create patient:

```json
POST /api/patients
{
  "name": "Meera Joshi",
  "gender": "FEMALE",
  "age": 35,
  "phone": "9123456789"
}
```

```json
{
  "id": 4,
  "name": "Meera Joshi",
  "gender": "FEMALE",
  "age": 35,
  "phone": "9123456789",
  "createdAt": "2026-10-07T08:00:00.000Z"
}
```

Create appointment:

```json
POST /api/appointments
{
  "patientId": 1,
  "doctorId": 1,
  "appointmentDateTime": "2026-10-07T10:30:00"
}
```

```json
{
  "id": 1,
  "patientId": 1,
  "doctorId": 1,
  "appointmentDateTime": "2026-10-07T10:30:00.000Z",
  "status": "SCHEDULED"
}
```

Complete consultation:

```json
POST /api/appointments/1/consultation
{
  "temperature": "98.6 F",
  "bloodPressure": "120/80",
  "notes": "Hydration advised; follow-up in one week."
}
```

```json
{
  "id": 1,
  "appointmentId": 1,
  "patientId": 1,
  "temperature": "98.6 F",
  "bloodPressure": "120/80",
  "notes": "Hydration advised; follow-up in one week.",
  "completedAt": "2026-10-07T10:45:00.000Z"
}
```

Successful list responses are arrays. Validation errors return `400`, missing resources return `404`, duplicate phones or completed appointments return `409`, and unexpected failures return `500`, for example:

```json
{ "message": "Patient not found" }
```

## Request flow: POST consultation

1. `appointmentRoutes.js` matches `POST /api/appointments/:id/consultation` and delegates to `createConsultation`.
2. `consultationController.js` opens a Sequelize transaction and locks the appointment row.
3. It verifies that the appointment exists and is still `SCHEDULED`.
4. It inserts a `Consultation`, changes the appointment status to `COMPLETED`, and saves the completion time.
5. The transaction commits both database changes together. Any error rolls the transaction back and reaches the central error handler.
