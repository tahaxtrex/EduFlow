// @ts-nocheck
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';

// Initialize Supabase client
// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Check for pending course generation
                const pending = localStorage.getItem('pendingCourseGeneration');
                if (pending) {
                    navigate('/questionnaire');
                } else {
                    navigate('/dashboard');
                }
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;

                // Create profile entry
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert({
                            id: data.user.id,
                            email: email,
                            full_name: fullName
                        });
                    if (profileError) console.error('Error creating profile:', profileError);
                }

                // Check for pending course generation
                const pending = localStorage.getItem('pendingCourseGeneration');
                if (pending) {
                    navigate('/questionnaire');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700"
            >
                <h2 className="text-3xl font-bold text-white mb-2 text-center">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-400 text-center mb-8">
                    {isLogin ? 'Continue your learning journey' : 'Start mastering new topics today'}
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-slate-400 hover:text-white transition text-sm"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
