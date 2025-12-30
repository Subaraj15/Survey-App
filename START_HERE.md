# START_HERE — Quick Start (Read first)

This file gets you running the Survey/Feedback application fast.

Prereqs

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

1. Backend

```bash
cd Server
npm install
# create .env with:
# MONGO_URI=mongodb://localhost:27017/survey-app
# JWT_SECRET=your_jwt_secret_here
# PORT=5000
npm run dev
```

Server will run on http://localhost:5000 (health: `/api/health`).

2. Frontend (new terminal)

```bash
cd Client
npm install
npm run dev
```

Frontend will run on http://localhost:3000.

Key docs (root of repo)

- README.md — full project documentation
- QUICKSTART.md — step-by-step setup
- API_DOCUMENTATION.md — API endpoints and examples
- DEPLOYMENT_GUIDE.md — production deployment instructions
- SETUP_VERIFICATION.md — setup checklist

If `npm run dev` errors, check logs, ensure MongoDB is running, and verify `.env` values.

Need me to recreate `FILE_INDEX.md` or any other doc? Reply and I’ll restore them next.
