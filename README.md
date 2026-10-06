<div align="center">

# ⚡ TaskPulse

### Real-time Kanban boards where every move syncs instantly 🚀

🌐 **[Live Demo](https://taskpulse-mu.vercel.app)** · 🖥️ **[API Health](https://taskpulse-twyy.onrender.com/health)**

`React` · `Vite` · `Tailwind CSS` · `Node.js` · `Express` · `MongoDB` · `Socket.io` · `JWT` · `Docker`

</div>

---

## ✨ Features

| | Feature | Details |
|---|---|---|
| 🔐 | **JWT Authentication** | Register, login, protected routes, rate-limited auth endpoints |
| 👥 | **Dynamic Roles** | 👑 Admin and 🙋 Member with role-based access control |
| 📋 | **Kanban Board** | To Do → In Progress → Done with drag and drop |
| ⚡ | **Real-time Sync** | User A moves a card, User B sees it instantly, no refresh (Socket.io rooms per project) |
| 🧾 | **Activity Log** | Audit trail of who created, moved, edited, or deleted each task, streamed live |
| 🗂️ | **Projects and Teams** | Admins create projects and add members by email |
| 🐳 | **Deploy Ready** | Dockerfile for the backend, `vercel.json` for the frontend |

## 🔑 Roles

| Action | 👑 Admin | 🙋 Member |
|---|:---:|:---:|
| Create / delete projects | ✅ | ❌ |
| Add / remove project members | ✅ | ❌ |
| Change user roles | ✅ | ❌ |
| Create, edit, move tasks | ✅ | ✅ (own projects) |
| Delete tasks | ✅ | ❌ |
| View activity log | ✅ | ✅ (own projects) |

> 💡 The **first registered user** automatically becomes the admin.

## 🏗️ Architecture

```
taskpulse/
├── 🖥️ server/                 Express + MongoDB (MVC)
│   ├── config/                DB connection
│   ├── models/                User, Project, Task, Activity
│   ├── controllers/           auth, project, task, activity
│   ├── routes/                REST endpoints
│   ├── middleware/            JWT protect, admin guard, error handler
│   ├── utils/                 access checks, activity logger, emit helper
│   ├── socket.js              Authenticated Socket.io + project rooms
│   ├── server.js              App entry
│   └── Dockerfile
└── 🎨 client/                 React + Vite + Tailwind
    └── src/
        ├── components/        Column, TaskCard, TaskModal, ActivityLog, ...
        ├── context/           AuthContext
        ├── hooks/             useBoard, useSocket
        └── pages/             Login, Register, Projects, Board
```

## 🔌 API

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Log in, get JWT |
| GET | `/api/auth/me` | 🔒 User | Current user |
| GET / PATCH | `/api/auth/users`, `/users/:id/role` | 👑 Admin | List users, change role |
| GET / POST | `/api/projects` | 🔒 / 👑 | List projects, create project |
| GET / DELETE | `/api/projects/:id` | 🔒 / 👑 | Get or delete project |
| POST / DELETE | `/api/projects/:id/members` | 👑 Admin | Add or remove members |
| GET / POST | `/api/tasks?project=` | 🔒 Member | List or create tasks |
| PATCH | `/api/tasks/:id`, `/api/tasks/:id/move` | 🔒 Member | Edit or move a task |
| DELETE | `/api/tasks/:id` | 👑 Admin | Delete a task |
| GET | `/api/activity?project=` | 🔒 Member | Latest 50 activity entries |

### 📡 Socket.io events

`task:created` · `task:updated` · `task:moved` · `task:deleted` · `activity:new`

Clients connect with their JWT and join `project:join` to receive events for that project only.

## 🚀 Run Locally

**Prerequisites:** Node.js 18+ and MongoDB (local or Atlas)

```bash
# 1️⃣ Start MongoDB (or use an Atlas URI)
docker run -d --name tp-mongo -p 27017:27017 mongo:7

# 2️⃣ Backend
cd server
cp .env.example .env
npm install
npm run dev          # http://localhost:5000

# 3️⃣ Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev          # http://localhost:5173
```

### 🔧 Environment variables

| File | Variable | Example |
|---|---|---|
| `server/.env` | `PORT` | `5000` |
| `server/.env` | `MONGO_URI` | `mongodb://127.0.0.1:27017/taskpulse` |
| `server/.env` | `JWT_SECRET` | a long random string |
| `server/.env` | `CLIENT_URL` | `http://localhost:5173` |
| `client/.env` | `VITE_API_URL` | `http://localhost:5000` |

### 🧪 Try the real-time sync

1. Register two users (use a private window for the second one).
2. As the admin, create a project and add the second user by email.
3. Open the board in both windows and drag a card. Watch it move live! ✨

## ☁️ Deployment

| Part | Platform | Notes |
|---|---|---|
| 🗄️ Database | MongoDB Atlas | Allow network access, copy the connection string |
| 🖥️ Backend | Render / Railway | Root dir `server`, Docker runtime, set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` |
| 🎨 Frontend | Vercel | Root dir `client`, set `VITE_API_URL` to the backend URL |

> ⏳ On Render's free tier the API sleeps when idle, so the first request can take up to ~50 seconds.

## 👩‍💻 Author

**Manpreet Kaur**, B.Tech Information Technology

🔗 [LinkedIn](https://www.linkedin.com/in/manpreet-kaur-185635290) · 💻 [GitHub](https://github.com/Aspirant5)

---

<div align="center">

⭐ If you like this project, give it a star! ⭐

</div>
