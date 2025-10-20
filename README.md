# Employee App Backend

This repository contains the backend for the Employee App used in CaseStudy2.

- Express + Mongoose backend
- Serves compiled frontend from `dist/FrontEnd` or `dist/Frontend`
- CRUD API endpoints for employees at `/api/employeelist`

Getting started

1. Install dependencies:

```powershell
npm install
```

2. Set your MongoDB Atlas connection string in the environment (PowerShell example):

```powershell
$plain = 'YourPlainPasswordHere'
$enc = [System.Uri]::EscapeDataString($plain)
$env:MONGODB_URI = "mongodb+srv://bristo:$enc@cluster0.wd28kn.mongodb.net/employeeDB?retryWrites=true&w=majority"
npm start
```

3. The server listens on port 3000 by default.

API

- GET /api/employeelist
- GET /api/employeelist/:id
- POST /api/employeelist
- PUT /api/employeelist/:id
- PUT /api/employeelist (body must include _id)
- DELETE /api/employeelist/:id

Notes

- Keep credentials out of source control. Use environment variables or a `.env` file with `dotenv`.
