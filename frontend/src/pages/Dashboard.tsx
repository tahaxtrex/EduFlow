// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ChevronRight, LogOut, Plus } from 'lucide-react';

// Initialize Supabase client
// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate('/auth');
            return;
        }
        setUser(user);
        fetchCourses(user.id);
    };

    const fetchCourses = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            My Learning
                        </h1>
                        <p className="text-slate-400 mt-1">Welcome back, {user?.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition font-medium"
                        >
                            <Plus className="w-4 h-4" /> New Course
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-slate-300"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </header>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
                        <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
                        <p className="text-slate-400 mb-6">Start your learning journey by generating your first course.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition font-medium"
                        >
                            Generate Course
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">
                                            Course
                                        </span>
                                        <span className="text-slate-500 text-xs flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition">
                                        {course.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                                        {course.description}
                                    </p>

                                    <Link
                                        to={`/course/${course.id}`}
                                        className="flex items-center justify-between w-full px-4 py-3 bg-slate-900/50 hover:bg-indigo-600/10 hover:text-indigo-400 rounded-lg transition text-sm font-medium text-slate-300"
                                    >
                                        Continue Learning
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
