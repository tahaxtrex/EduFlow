# AI Course Foundry 🧠

A powerful AI-driven platform that generates custom, adaptive courses on any topic. Built with React, Node.js, OpenAI, and Supabase.

## 🚀 Features

- **Adaptive Learning**: Tailors content to your level (Beginner to Expert) and style (Visual, Practical, etc.).
- **Instant Course Generation**: Creates modules, lessons, examples, and quizzes in seconds.
- **Rich Content**: Includes analogies, real-world examples, and ASCII graphs.
- **Duolingo-style UI**: Engaging, interactive questionnaire and progress tracking.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, OpenAI API
- **Database**: Supabase (PostgreSQL)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd ai-course-foundry
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file (see .env.example)
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Database Setup**
    - Create a Supabase project.
    - Run the SQL script located in `backend/db/schema.sql` in the Supabase SQL Editor.

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🧬 AI Pipeline

The course generation follows a 10-step pipeline:
1.  **Persona Analysis**: AI analyzes user answers to determine learning style and complexity.
2.  **Structure Generation**: Creates modules and lesson titles.
3.  **Content Expansion**: Generates detailed explanations, examples, and analogies for each lesson.
4.  **Quiz Generation**: Creates assessment questions.
5.  **Final Project**: Generates a capstone project.
6.  **Glossary**: Extracts key terms.
7.  **Usage Report**: Calculates token usage and generation time.

## 📄 License

MIT
