# AI Learning Assistant (MERN)

Full-stack AI-powered study assistant with chat, document understanding, flashcards, quizzes, and progress tracking. Inspired by the YouTube build video: [Build a Full-Stack AI-Powered Learning Assistant App | MERN, React, Node.js, MongoDB, Express](https://www.youtube.com/watch?v=iaAdWmAu0TE&t=107s).

## Features
- AI chat grounded in user documents and chat history
- PDF ingestion with chunking, search, and summarization
- Flashcard and quiz generation with scoring and review flows
- Progress tracking per user session
- Authenticated workspace with protected routes and clean UI

## Tech Stack
- Frontend: React + Vite, Tailwind, React Router, React Markdown
- Backend: Node.js, Express, JWT auth, Multer uploads
- Data/AI: MongoDB Atlas (online), Gemini API for generation

## Environment
Create backend/.env with your keys (MongoDB runs on Atlas/another online cluster):
```
MONGO_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_google_generative_ai_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=10485760
PORT=8000
NODE_ENV=development
```

## Run Locally
- Install frontend deps: from project root run `npm install`.
- Install backend deps: `cd backend && npm install`.
- Start backend API: `npm run dev` inside backend (uses nodemon).
- Start frontend: from root `npm run dev` and open the shown Vite URL.

## Deploy (high level)
- Provision a MongoDB Atlas cluster and keep its connection string ready.
- Set the backend environment variables above on your host (Render/Heroku/Vercel serverless/VM).
- Build and serve the frontend (`npm run build`) from a static host or reverse-proxy to the Vite dev server during testing.
- Point the frontend `axios` base URL to your deployed backend API.
