# Whisper

A lightweight chat app (client + server).

This repository contains two main parts:

-  `client/` — React + Vite frontend (TailwindCSS)
-  `server/` — Express + MongoDB backend (ESM modules)

## Quick overview

-  Frontend: React (client/src) with contexts for Auth and Chat, uses Vite dev server.
-  Backend: Express API (server/) with Mongoose models and Socket.IO integration.
-  Database: MongoDB. Both `User` and `Message` models are stored in a single shared collection named `whisper`.

## Requirements

-  Node.js >= 18 (this repo uses ESM imports)
-  npm or yarn
-  MongoDB (local or Atlas)

## Environment

Create env files for client and server as needed. Examples:

server/.env

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/whisper-db
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_URL=...   # optional, required if uploading images
```

client/.env

```
VITE_BACKEND_URL=http://localhost:5000
```

Note: frontend expects the backend URL in `VITE_BACKEND_URL`. If not provided it falls back to `http://localhost:5000`.

## Run (development)

Start server (from repo root):

```bash
cd server
npm install
npm run dev    # uses nodemon
```

Start client (separate terminal):

```bash
cd client
npm install
npm run dev    # starts Vite dev server (default: http://localhost:5173)
```

Open the client URL shown by Vite in your browser.

## API endpoints (high level)

-  Auth

   -  POST /api/auth/signUp — create account (body: fullName, email, password, bio)
   -  POST /api/auth/login — login (body: email, password)
   -  GET /api/auth/check — checks token (protected)
   -  PUT /api/auth/update-profile — update profile (protected)

-  Messages
   -  GET /api/messages/users — fetch users for sidebar (protected)
   -  GET /api/messages/:id — fetch conversation with a user (protected)
   -  PUT /api/messages/mark/:id — mark a message as seen (protected)
   -  POST /api/messages/send/:id — send message to user (protected)

Protected endpoints expect a header named `token` containing the JWT. Many clients use `Authorization: Bearer <token>`; if you prefer that, update `server/middleware/auth.js` accordingly.

## Notes & Known issues (quick)

-  The server stores both users and messages in a single MongoDB collection named `whisper` (this is intentional in this project). Models are configured with an explicit collection name.
-  If you see "Converting circular structure to JSON" errors it usually means a Promise or a driver object was passed to `res.json()` (lib code has been updated to avoid that). Restart the server after pulling changes.
-  If signup/login fails with bcrypt-related errors, ensure dependencies are installed and the server is restarted; `bcrypt.genSalt` is used.

## Troubleshooting

-  Backend failing to import modules: make sure `type: "module"` is present in `server/package.json` (it is) and Node.js is recent enough to support ESM.
-  If the client shows a blank page but console has no errors: confirm `AuthProvider` returns the provider (in `client/context/AuthContext.jsx`) and that `main.jsx` mounts to `#root` in `client/index.html`.
-  If `req.user` is undefined on protected routes: ensure the request includes the token header and the route is protected with `protectRoute`.

## Tests / Next steps

-  Add end-to-end or unit tests for auth and messages.
-  Optionally extract Socket.IO `io` and `userSocketMap` into a small module to allow controllers to emit events without circular imports.
