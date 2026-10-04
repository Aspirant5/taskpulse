# TaskPulse

Real-time Kanban boards. React (Vite, Tailwind) + Express + MongoDB (Mongoose) + Socket.io.

- First registered user becomes **admin**; later users are **members**. Admins can create/delete projects, manage project members, change roles, and delete tasks. Members can create, edit, and move tasks in projects they belong to.
- Every create/move/edit/delete is broadcast to everyone on the board and written to the activity log.

## Run locally

```bash
docker run -d --name tp-mongo -p 27017:27017 mongo:7      # or use a MongoDB Atlas URI

cd server && cp .env.example .env && npm install && npm run dev

cd ../client && cp .env.example .env && npm install && npm run dev
```

Open http://localhost:5173. To test real-time sync: register two users (one in a private window), as admin create a project and add the second user by email, open the board in both windows, and drag a card.

## Deploy

1. **Database**: create a free MongoDB Atlas cluster, add a database user, allow network access from anywhere (0.0.0.0/0), copy the connection string.
2. **Backend (Render)**: New > Web Service > connect repo > Root Directory `server` > Runtime `Docker`. Env vars: `MONGO_URI`, `JWT_SECRET` (long random string), `CLIENT_URL` (your Vercel URL; set after step 3). Deploy and copy the service URL.
   **Backend (Railway alternative)**: New Project > Deploy from GitHub > Root Directory `server` (Dockerfile is detected) > add the same env vars > Settings > Networking > Generate Domain.
3. **Frontend (Vercel)**: Import repo > Root Directory `client` > Framework Vite > Env var `VITE_API_URL=https://<your-backend-url>` > Deploy. CLI: `cd client && npx vercel --prod`.
4. Set `CLIENT_URL` on the backend to the Vercel URL (comma-separate multiple origins) and redeploy.

Render's free tier sleeps when idle, so the first request can take about 30 seconds.
