# Deploying the frontend to Vercel

This project uses Create React App. The frontend is located in the `frontend/` folder.

Prerequisites

- A GitHub repository with this project (or other git provider that Vercel supports).
- A Vercel account.

Quick steps (recommended)

1. Push your repo to GitHub (if not already).
2. In Vercel, create a new project and connect the repository.
   - When asked for the Root Directory, set it to `frontend` (if you keep a monorepo).
   - Framework Preset: Create React App (Vercel usually detects this automatically).
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Add an Environment Variable in Vercel Dashboard for production API URL:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend.example.com` (replace with your backend domain)
4. Deploy. Vercel will show build logs and the public URL when finished.

Local test

1. From `frontend/` run:

```powershell
npm install
npm run build
npx serve -s build    # optional: serve the static build locally for quick check
```

Notes

- The app reads `process.env.REACT_APP_API_URL` at build time. Make sure this is set in Vercel.
- The frontend will call the backend endpoints (e.g. `/predict`, `/save_detection`) — ensure CORS is allowed on the backend.
- Do not commit large model weights into the frontend repository; weights belong on the backend host or cloud storage.
