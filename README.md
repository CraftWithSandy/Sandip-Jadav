# OPD Management System

A full-stack Outpatient Department (OPD) management demo for registering patients, booking appointments, recording consultations, and viewing patient history.

## Features

- Patient registration with name, gender, age, and phone validation
- Patient search by name or phone number
- Patient consultation history
- Doctor and patient selection for appointments
- Today's appointment queue
- Scheduled and completed appointment statuses
- Consultation recording with temperature, blood pressure, and notes
- Transaction-safe consultation completion
- Responsive hospital-style React interface

## Tech stack

### Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL with `mysql2`
- CommonJS JavaScript
- `dotenv` and `cors`

### Frontend

- React with Vite
- JavaScript
- `react-router-dom`
- `axios`
- Plain CSS

## Project structure

```text
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   └── README.md
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── App.css
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 18 or newer
- npm
- MySQL 8 or newer

## Database setup

Create the MySQL database:

```sql
CREATE DATABASE opd_db;
```

Create `backend/.env` from the example file:

```powershell
Set-Location "D:\Study\Sandip Jadav\backend"
Copy-Item .env.example .env
```

Update `backend/.env` with your local MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=opd_db
PORT=5000
```

The backend automatically creates the tables with Sequelize and seeds three doctors and three patients when the tables are empty.

## Run the application

Start the backend in one terminal:

```powershell
Set-Location "D:\Study\Sandip Jadav\backend"
npm install
npm start
```

The backend runs at:

```text
http://localhost:5000
```

Start the frontend in a second terminal:

```powershell
Set-Location "D:\Study\Sandip Jadav\frontend"
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

For frontend development with a production build check:

```powershell
Set-Location "D:\Study\Sandip Jadav\frontend"
npm run build
```

For backend development with automatic restart:

```powershell
Set-Location "D:\Study\Sandip Jadav\backend"
npm run dev
```

## User flow

1. Open the Patients screen and register a patient.
2. Open Appointments and select the patient, doctor, and appointment time.
3. Start the consultation from a scheduled appointment.
4. Enter temperature, blood pressure, and required consultation notes.
5. Complete the consultation. The appointment becomes `COMPLETED`.
6. Return to Patients and open View history to see the completed consultation.

## API overview

All backend APIs use JSON and are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/patients` | Register a patient |
| `GET` | `/api/patients?search=xyz` | List or search patients |
| `GET` | `/api/doctors` | List doctors |
| `POST` | `/api/appointments` | Book an appointment |
| `GET` | `/api/appointments/today` | Get today's appointments |
| `GET` | `/api/appointments/:id` | Get appointment details |
| `POST` | `/api/appointments/:id/consultation` | Complete a consultation |
| `GET` | `/api/patients/:id/consultations` | Get completed patient history |

Full API samples are available in [backend/README.md](backend/README.md).

## Common issues

### MySQL access denied

Check `backend/.env`, especially `DB_USER` and `DB_PASSWORD`. Confirm that MySQL is running and that the `opd_db` database exists.

### Port 5000 already in use

Stop the existing Node process using port 5000, or change `PORT` in `backend/.env` and update the frontend API base URL in `frontend/src/api/axiosConfig.js`.

### Frontend shows an API error

Make sure the backend is running first. The frontend expects the API at:

```text
http://localhost:5000/api
```

The backend allows the Vite development origins `http://localhost:5173` and `http://localhost:5174`.

### Browser page looks too small

Reset browser zoom with `Ctrl + 0` and confirm the browser is using 100% zoom.

## GitHub

Repository:

https://github.com/CraftWithSandy/Sandip-Jadav
