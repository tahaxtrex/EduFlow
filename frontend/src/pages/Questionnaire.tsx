// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const questions = [
    {
        id: 'purpose',
        question: "What's your main goal?",
        options: [
            { label: "Just for fun", icon: "🎈" },
            { label: "School / University", icon: "🎓" },
            { label: "Career advancement", icon: "💼" },
            { label: "Personal project", icon: "🚀" }
        ]
    },
    {
        id: 'education',
        question: "What's your education level?",
        options: [
            { label: "High School", icon: "🏫" },
            { label: "Undergraduate", icon: "📜" },
            { label: "Postgraduate", icon: "🔬" },
            { label: "Self-taught", icon: "📚" }
        ]
    },
    {
        id: 'level',
        question: "How much do you know about this topic?",
        options: [
            { label: "Total Beginner", desc: "I know nothing", icon: "🌱" },
            { label: "Some Knowledge", desc: "I know the basics", icon: "🌿" },
            { label: "Intermediate", desc: "I can apply concepts", icon: "🌳" },
            { label: "Expert", desc: "I want deep theory", icon: "🌲" }
        ]
    },
    {
        id: 'style',
        question: "How do you prefer to learn?",
        options: [
            { label: "Visual", desc: "Diagrams & Images", icon: "👁️" },
            { label: "Practical", desc: "Examples & Exercises", icon: "🛠️" },
            { label: "Theoretical", desc: "Deep explanations", icon: "📖" },
            { label: "Mixed", desc: "A bit of everything", icon: "🎨" }
        ]
    }
];

const Questionnaire = () => {
    const [searchParams] = useSearchParams();
    const topic = searchParams.get('topic');
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkPending = async () => {
            const pending = localStorage.getItem('pendingCourseGeneration');
            if (pending) {
                const { topic: pendingTopic, answers: pendingAnswers } = JSON.parse(pending);
                // Clear pending
                localStorage.removeItem('pendingCourseGeneration');
                // Trigger generation
                handleSubmit(pendingAnswers, pendingTopic);
            }
        };
        checkPending();
    }, []);

    const handleSelect = (option) => {
        const newAnswers = { ...answers, [questions[step].id]: option.label };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        } else {
            handleSubmit(newAnswers, topic);
        }
    };

    const handleSubmit = async (finalAnswers, currentTopic) => {
        setLoading(true);
        try {
            // Check for logged in user
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (!user) {
                // Save state and redirect to auth
                localStorage.setItem('pendingCourseGeneration', JSON.stringify({
                    topic: currentTopic,
                    answers: finalAnswers
                }));
                navigate('/auth');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    topic: currentTopic,
                    ...finalAnswers,
                    userId: user.id
                })
            });

            const data = await response.json();
            if (data.courseId) {
                navigate(`/course/${data.courseId}`);
            } else {
                console.error("No course ID returned", data);
            }
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Loading Stages Logic
    const [loadingStage, setLoadingStage] = useState(0);
    const stages = [
        "Analyzing your learning profile...",
        "Structuring the perfect course for you...",
        "Drafting detailed lessons and examples...",
        "Creating interactive quizzes...",
        "Finalizing your personalized learning path..."
    ];

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
            }, 3000); // Change stage every 3 seconds
            return () => clearInterval(interval);
        }
    }, [loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
                <div className="w-full max-w-md space-y-8">
                    {/* Animated Icon */}
                    <div className="flex justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
                            <Loader2 className="w-20 h-20 text-indigo-500" />
                        </motion.div>
                    </div>

                    {/* Progress Text */}
                    <div className="text-center space-y-4">
                        <AnimatePresence mode='wait'>
                            <motion.h2
                                key={loadingStage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400"
                            >
                                {stages[loadingStage]}
                            </motion.h2>
                        </AnimatePresence>

                        <p className="text-slate-400 text-sm">
                            Estimated time: ~3 minutes
                        </p>

                        {/* Progress Bar */}
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 180, ease: "linear" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[step];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-20 px-4">
            {/* Progress Bar */}
            <div className="w-full max-w-xl h-2 bg-slate-800 rounded-full mb-12 overflow-hidden">
                <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-xl"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">{currentQ.question}</h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQ.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(opt)}
                                className="flex items-center p-4 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 hover:bg-slate-750 transition group text-left"
                            >
                                <span className="text-3xl mr-4">{opt.icon}</span>
                                <div>
                                    <div className="font-bold text-lg">{opt.label}</div>
                                    {opt.desc && <div className="text-slate-400 text-sm">{opt.desc}</div>}
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition">
                                    <ChevronRight className="text-indigo-500" />
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Questionnaire;
