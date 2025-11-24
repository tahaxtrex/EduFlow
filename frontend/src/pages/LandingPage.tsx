// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Brain, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const [topic, setTopic] = useState('');
    const navigate = useNavigate();

    const handleStart = (e) => {
        e.preventDefault();
        if (topic.trim()) {
            navigate(`/questionnaire?topic=${encodeURIComponent(topic)}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Navbar */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    <Brain className="w-8 h-8 text-indigo-400" />
                    <span>CourseFoundry</span>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition border border-indigo-500/20"
                    >
                        Dashboard
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Master any topic with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                            AI-Generated Courses
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Enter a topic, answer a few questions, and get a personalized, interactive course tailored exactly to your level and goals.
                    </p>
                </motion.div>

                {/* Input Section */}
                <motion.form
                    onSubmit={handleStart}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative flex items-center bg-slate-800 rounded-xl p-2 shadow-2xl border border-slate-700">
                        <div className="pl-4 text-slate-400">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="What do you want to learn? (e.g. Quantum Physics)"
                            className="flex-1 bg-transparent border-none outline-none text-lg px-4 py-3 text-white placeholder-slate-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                        >
                            Start
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.form>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
                    {[
                        { icon: BookOpen, title: "Adaptive Learning", desc: "Content that evolves with your progress and understanding." },
                        { icon: Brain, title: "Smart Analogies", desc: "Complex concepts explained through relatable real-world examples." },
                        { icon: Sparkles, title: "Instant Generation", desc: "From zero to full curriculum in under 60 seconds." }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition"
                        >
                            <feature.icon className="w-10 h-10 text-indigo-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
