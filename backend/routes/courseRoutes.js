const express = require('express');
const router = express.Router();
const { generateCourse } = require('../services/aiService');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// POST /generate - Generate a new course
router.post('/generate', async (req, res) => {
    try {
        const { topic, purpose, education, level, style, userId } = req.body;
        console.log('Received generate request:', { topic, userId });

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        // 1. Generate Course Content via AI
        const courseData = await generateCourse({ topic, purpose, education, level, style });

        // 2. Save to Database (if userId is provided)
        let courseId = null;

        if (userId) {
            // Create authenticated Supabase client if token is present
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            let supabase = supabaseClient;
            if (token) {
                supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
                    global: { headers: { Authorization: `Bearer ${token}` } }
                });
            }

            // Save Course
            const { data: course, error: courseError } = await supabase
                .from('courses')
                .insert({
                    user_id: userId,
                    topic: topic,
                    title: courseData.title,
                    description: courseData.description
                })
                .select()
                .single();

            if (courseError) throw courseError;
            courseId = course.id;

            // Save Modules & Lessons
            for (const [mIndex, module] of courseData.modules.entries()) {
                const { data: mod, error: modError } = await supabase
                    .from('modules')
                    .insert({
                        course_id: courseId,
                        title: module.title,
                        order_index: mIndex
                    })
                    .select()
                    .single();

                if (modError) throw modError;

                for (const [lIndex, lesson] of module.lessons.entries()) {
                    const { data: les, error: lesError } = await supabase
                        .from('lessons')
                        .insert({
                            module_id: mod.id,
                            title: lesson.title,
                            content: lesson, // Store full lesson object including content
                            order_index: lIndex
                        })
                        .select()
                        .single();

                    if (lesError) throw lesError;
                }
            }
        }

        res.json({ courseId, course: courseData });
    } catch (error) {
        console.error('Error generating course:', error);
        res.status(500).json({ error: 'Failed to generate course', details: error.message });
    }
});

// GET /:id - Get course details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch course with modules and lessons
        const { data: course, error } = await supabaseClient
            .from('courses')
            .select(`
        *,
        modules (
          *,
          lessons (
            *
          )
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Sort modules and lessons by order_index
        if (course.modules) {
            course.modules.sort((a, b) => a.order_index - b.order_index);
            course.modules.forEach(m => {
                if (m.lessons) {
                    m.lessons.sort((a, b) => a.order_index - b.order_index);
                }
            });
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// POST /progress - Update lesson progress
router.post('/progress', async (req, res) => {
    try {
        const { userId, lessonId, completed, score } = req.body;

        if (!userId || !lessonId) {
            return res.status(400).json({ error: 'UserId and LessonId are required' });
        }

        const { data, error } = await supabaseClient
            .from('student_progress')
            .upsert({
                user_id: userId,
                lesson_id: lessonId,
                completed: completed || false,
                score: score || 0,
                last_accessed: new Date().toISOString()
            }, { onConflict: 'user_id, lesson_id' })
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

module.exports = router;
