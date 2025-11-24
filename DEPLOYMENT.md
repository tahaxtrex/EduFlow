# Deployment Guide 🚀

## 1. Database (Supabase)

1.  Log in to [Supabase](https://supabase.com/).
2.  Create a new project.
3.  Go to the **SQL Editor**.
4.  Copy the content of `backend/db/schema.sql` and run it.
5.  Go to **Project Settings > API** and copy the `Project URL` and `anon` public key.

## 2. Backend (Render / Railway)

We recommend **Render** for the Node.js backend.

1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  Set the **Root Directory** to `backend`.
4.  Set the **Build Command** to `npm install`.
5.  Set the **Start Command** to `npm start`.
6.  Add Environment Variables:
    - `SUPABASE_URL`
    - `SUPABASE_ANON_KEY`
    - `OPENAI_API_KEY`
    - `PORT` (Render sets this automatically, but you can set 5000)

## 3. Frontend (Vercel)

We recommend **Vercel** for the React frontend.

1.  Install Vercel CLI or go to the Vercel dashboard.
2.  Import your repository.
3.  Set the **Root Directory** to `frontend`.
4.  Add Environment Variables:
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).
5.  Deploy!

## 4. Verification

1.  Open your Vercel URL.
2.  Enter a topic and generate a course.
3.  Check if the course is saved in Supabase.
