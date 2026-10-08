# Mediturn

**A web application for patient registration and doctor queue management.**

Mediturn connects a public patient registration interface with a staff dashboard for doctors and assistants. Patients submit their details, assistants verify registrations and assign patients to doctors, and doctors review their assigned patient lists.

The repository contains two React applications and an Express API backed by MongoDB.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Application workflow](#application-workflow)
- [Configuration](#configuration)
- [API reference](#api-reference)
- [Development commands](#development-commands)
- [Troubleshooting](#troubleshooting)
- [Current limitations](#current-limitations)
- [Author and licensing](#author-and-licensing)

## Features

### Patient interface

- Public home, about, and instructions pages.
- Patient registration through the `/rendezvous` page.
- Collection of identity, contact, and demographic information.
- Redirection to instructions after a successful submission.

The registration flow creates a pending patient record. It does not reserve a dated appointment or a time slot.

### Staff dashboard

- Registration and login for doctor and assistant accounts.
- Role-based navigation after login.
- Assistant view of pending patients.
- Patient verification and assignment to a doctor.
- Doctor-specific patient lists and queue views.
- Patient deletion and an operation to clear all queues.
- Toast notifications for staff actions.

### Backend

- MongoDB models for staff users and patients.
- Password hashing with bcrypt.
- JWT authentication with one-day token expiry.
- Role checks on selected patient-management endpoints.
- Separate route groups for patients and users.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Patient interface | React 19, React Router 7, Create React App, Lucide |
| Staff dashboard | React 19, React Router 7, Axios, React Toastify |
| API | Node.js ES modules, Express 5, Mongoose 8 |
| Authentication | JSON Web Tokens, bcrypt |
| Database | MongoDB |
| Development server | nodemon |

## Repository structure

| Path | Purpose |
| --- | --- |
| `client/` | Public patient-facing React application |
| `client/src/pages/` | Home, about, registration, and instructions pages |
| `client/src/components/` | Shared navigation and footer components |
| `administration/` | React staff dashboard |
| `administration/src/pages/` | Staff authentication, assistant, doctor, and queue views |
| `administration/src/components/` | Dashboard navigation |
| `server/server.js` | Express startup, database connection, and route mounting |
| `server/models/` | Patient and staff Mongoose schemas |
| `server/routes/` | Patient and user API handlers |
| `server/middleware/auth.js` | JWT verification and role authorization |

## Getting started

### Prerequisites

- Git.
- A maintained Node.js release compatible with Express 5 and the React tooling; Express 5 requires Node.js 18 or newer.
- npm.
- MongoDB running locally.
- MongoDB Compass or `mongosh` to verify development staff accounts.

There is no root workspace script. Install and run each component separately.

### 1. Clone the repository

```bash
git clone https://github.com/alibouajila/Mediturn.git
cd Mediturn
```

### 2. Start MongoDB and the API

The server currently connects to:

```text
mongodb://localhost:27017/mediturn
```

Start your local MongoDB service, then run:

```bash
cd server
npm install
npm start
```

The API listens on **http://localhost:3001**. `npm start` uses nodemon.

There is no root health-check route. A request to `/` can return 404 even when the server is running. For a read-only API check:

```bash
curl http://localhost:3001/users/doctors
```

An empty database should return an empty array when the database connection is working.

### 3. Start the patient interface

In another terminal, from the repository root:

```bash
cd client
npm install
npm start
```

Open **http://localhost:3000**.

### 4. Start the staff dashboard

In another terminal, from the repository root:

```bash
cd administration
npm install
```

Use **port 3002**, since port 3001 belongs to the API.

**macOS / Linux / Git Bash**

```bash
PORT=3002 npm start
```

**Windows PowerShell**

```powershell
$env:PORT = "3002"
npm start
```

**Windows Command Prompt**

```bat
set PORT=3002
npm start
```

Open **http://localhost:3002**. You can also place `PORT=3002` in `administration/.env.local` for subsequent development sessions.

### 5. Create and verify development staff accounts

1. Open the staff dashboard's `/signup` page.
2. Register an account with the `doctor` or `assistant` role.
3. Verify that specific account in the local database.
4. Log in at `/login`.

New staff records have `isVerified: false`. Login rejects them until verification; the current API has no staff-verification endpoint.

For a disposable local development database, use MongoDB Compass to change the chosen user's `isVerified` field to `true`, or run this in `mongosh`:

```javascript
use mediturn
db.users.updateOne(
  { email: "doctor@example.com" },
  { $set: { isVerified: true } }
)
```

Replace the email with the account you registered. Repeat for an assistant account if needed. This manual procedure is a development bootstrap step.

## Application workflow

1. A patient submits the registration form.
2. The API creates a patient with `isVerified: false` and no assigned doctor.
3. An assistant opens the pending-patient list.
4. Verification assigns the patient to a doctor and adds the patient reference to that doctor's list.
5. The doctor opens their assigned patient list.
6. Staff can remove patient records through the dashboard.

**Clear all queues is destructive:** the implementation empties every doctor's patient references and deletes all patient documents, including pending registrations.

## Configuration

| Setting | Current location | Value |
| --- | --- | --- |
| MongoDB connection | `server/server.js` | `mongodb://localhost:27017/mediturn` |
| API port | `server/server.js` | `3001` |
| Frontend API requests | Page components in both React apps | `http://localhost:3001` |
| JWT signing and verification | `server/routes/user.js` and `server/middleware/auth.js` | Hardcoded shared value |
| React development port | Process environment or `.env.local` | Default `3000`; use `3002` for administration |

The backend currently does not load `.env` files or read database, port, or JWT settings from environment variables. Adding an environment file alone will not change those settings.

When changing the API host or port, update requests in both frontend applications. JWT signing and verification must use the same secret.

## API reference

Base URL: `http://localhost:3001`. There is no `/api` prefix.

Protected requests require:

```http
Authorization: Bearer <token>
```

### Patients

| Method | Endpoint | Purpose | Access enforced |
| --- | --- | --- | --- |
| POST | `/patients/register` | Create a pending patient | Public |
| GET | `/patients/unverified` | List pending patients | Valid JWT |
| GET | `/patients/verified` | List verified patients | Valid JWT |
| PATCH | `/patients/verify/:id` | Verify and assign a patient; body contains `doctorId` | Doctor or assistant |
| DELETE | `/patients/:id` | Delete a patient | Doctor or assistant |

### Staff users and queues

| Method | Endpoint | Purpose | Access enforced |
| --- | --- | --- | --- |
| POST | `/users/register` | Register a doctor or assistant | Public |
| POST | `/users/login` | Authenticate a verified staff account | Public |
| GET | `/users/doctors` | List doctor records | Public |
| GET | `/users/my-patients` | Retrieve the logged-in doctor's populated patient list | Doctor |
| GET | `/users/by-doctor/:doctorId` | Retrieve patient documents assigned to a doctor | Valid JWT |
| GET | `/users/:id` | Retrieve a doctor record | Valid JWT |
| PATCH | `/users/clear-all` | Empty all doctor queues and delete all patients | Valid JWT |

These access descriptions reflect the current middleware, rather than a proposed permission policy.

### Example patient registration

```json
{
  "fullName": "Demo Patient",
  "CIN": "12345678",
  "dateOfBirth": "1995-06-15",
  "gender": "Other",
  "phoneNumber": "12345678",
  "address": "Demo address"
}
```

Use synthetic data for development. The schema requires an eight-character, unique `CIN`, a phone number containing 8–13 digits, and a gender value of `Male`, `Female`, or `Other`.

## Development commands

Run commands inside the corresponding component directory.

| Component | Command | Purpose |
| --- | --- | --- |
| Server | `npm start` | Run the API with nodemon |
| Server | `node server.js` | Run the API directly |
| Client / administration | `npm start` | Start the React development server |
| Client / administration | `npm run build` | Generate production assets in `build/` |
| Client / administration | `npm test` | Run the React Scripts test runner |

The server's `npm test` script is a placeholder that exits with an error. The repository currently contains no application test files for the two React interfaces.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Database connection fails | Confirm MongoDB is running and the URI in `server/server.js` is reachable |
| Staff login says “User not verified” | Verify that specific development account in MongoDB |
| Port conflict on startup | Keep the client on 3000, API on 3001, and administration on 3002 |
| Registration returns a validation error | Check required fields, CIN length and uniqueness, phone format, and gender |
| Protected request is rejected | Confirm the token exists and has not expired; log in again |
| Frontend cannot reach the API | Confirm the server is running and page-level API URLs match its address |
| A doctor's populated patient list differs from the queue view | Inspect stale patient references after deletion; the two views retrieve data differently |
| React dependency installation fails | Review the peer-dependency report against React 19 and React Scripts 5; the repository does not document a validated Node/npm combination |

## Current limitations

The code provides a registration and queue-management foundation. Before deploying it with actual patient data, address these concrete implementation gaps:

- Replace the hardcoded JWT secret with securely managed configuration and rotate the existing value.
- Restrict CORS to the intended frontend origins.
- Return explicit public/user response fields: the doctor-list and doctor-detail handlers currently return full user documents, including password hashes.
- Tighten role and ownership checks; several queue and patient-read operations accept any valid staff token.
- Validate public registration fields explicitly rather than constructing a patient directly from the request body.
- Keep doctor patient references consistent when deleting patient documents.
- Implement an authorized staff-verification workflow.
- Add automated coverage for registration, login, permissions, assignment, and deletion.

The application currently has no appointment calendar, time-slot reservation, WebSocket queue updates, or clinical-record functionality.

For frontend hosting, configure fallback routing to `index.html` so React Router paths work on direct navigation. Backend and frontend deployment also require replacing localhost URLs with reachable service addresses.

## Author and licensing

Created by [Ali Bouajila](https://github.com/alibouajila).

The server package declares `ISC`, but the repository currently contains no root license file. Confirm the intended repository-wide license before redistribution.
