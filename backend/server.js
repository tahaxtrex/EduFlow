const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Routes
app.get('/', (req, res) => {
    res.send('AI Course Foundry API is running');
});

// Import routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { supabase };
