// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, CheckCircle, Menu, ChevronLeft, ChevronRight, PlayCircle, XCircle, HelpCircle, Download, BarChart2, Code, Calculator, GraduationCap, X, Zap, Lightbulb, Sparkles, Sun, Moon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { sampleCourse } from '../data/sampleCourse';
import { useNavigate } from 'react-router-dom';

const SampleCourseViewer = () => {
    const navigate = useNavigate();
    const [course, setCourse] = useState(sampleCourse);
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const [quizState, setQuizState] = useState({});
    const [showFinalAssessment, setShowFinalAssessment] = useState(false);
    const [finalAssessmentState, setFinalAssessmentState] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        setQuizState({});
        setShowFinalAssessment(false);
    }, [activeModule, activeLesson]);

    const handleDownloadPDF = () => {
        window.print();
    };

    const currentModule = course.modules[activeModule];
    const currentLesson = currentModule?.lessons[activeLesson];

    // Custom Tooltip for Graphs
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-indigo-500/30 p-4 rounded-xl shadow-xl text-slate-800 dark:text-slate-100">
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-mono font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Render Graph Helper
    const renderGraph = (graph) => {
        if (!graph || !graph.data) return null;
        const COLORS = ['#6366f1', '#ec4899', '#eab308', '#14b8a6'];

        return (
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-indigo-500/20 my-10 h-96 shadow-xl print:break-inside-avoid relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <h4 className="text-center font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 text-lg">{graph.title}</h4>
                <ResponsiveContainer width="100%" height="100%">
                    {graph.type === 'bar' ? (
                        <BarChart data={graph.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} vertical={false} />
                            <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fill: darkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fill: darkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? '#1e293b' : '#f1f5f9' }} />
                            <Bar dataKey="value" fill="url(#colorGradientBarSample)" radius={[8, 8, 0, 0]} animationDuration={1500} />
                            <defs>
                                <linearGradient id="colorGradientBarSample" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    ) : graph.type === 'line' ? (
                        <AreaChart data={graph.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} vertical={false} />
                            <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fill: darkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fill: darkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={3} fill="url(#colorGradientLineSample)" animationDuration={1500} />
                            <defs>
                                <linearGradient id="colorGradientLineSample" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    ) : (
                        <PieChart>
                            <Pie data={graph.data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {graph.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className={`${darkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans print:bg-white print:text-black selection:bg-indigo-500/20 transition-colors duration-300">

                {/* Intro Modal */}
                <AnimatePresence>
                    {showIntro && course.intro && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-indigo-500/30"
                            >
                                <div className="relative h-48 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 opacity-20">
                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                                        </svg>
                                    </div>
                                    <Sparkles className="w-20 h-20 text-white animate-pulse" />
                                    {course.intro.videoUrl && (
                                        <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1">
                                            <PlayCircle className="w-3 h-3" /> Video Intro
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">{course.intro.title}</h2>
                                    <div className="prose prose-sm dark:prose-invert max-w-none mb-8 text-slate-600 dark:text-slate-300">
                                        <ReactMarkdown>{course.intro.content}</ReactMarkdown>
                                    </div>
                                    <button
                                        onClick={() => setShowIntro(false)}
                                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Let's Go! 🚀
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 z-50 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setMobileMenuOpen(true)} className="text-slate-600 dark:text-slate-400">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">{course.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button onClick={() => navigate('/')} className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider">EXIT</button>
                    </div>
                </div>

                {/* Sidebar (Desktop) */}
                <aside className="hidden md:flex w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col h-screen sticky top-0 overflow-y-auto print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-colors duration-300">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h1 className="font-bold text-xl text-indigo-600 dark:text-indigo-400 tracking-tight">Sample Track</h1>
                        </div>
                        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors line-clamp-2">{course.title}</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-bold group-hover:text-indigo-500 transition-colors">← RETURN TO HOME</p>
                    </div>

                    {/* Dark Mode Toggle in Sidebar */}
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Theme</span>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {darkMode ? <><Sun className="w-3 h-3" /> Light</> : <><Moon className="w-3 h-3" /> Dark</>}
                        </button>
                    </div>

                    <div className="flex-1 py-4 px-2">
                        {course.modules.map((mod, mIdx) => (
                            <div key={mod.id} className="mb-6">
                                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                    Module {mIdx + 1}
                                </div>
                                <h3 className="px-4 font-semibold mb-2 text-slate-700 dark:text-slate-300">{mod.title}</h3>
                                <div className="space-y-1">
                                    {mod.lessons.map((lesson, lIdx) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => { setActiveModule(mIdx); setActiveLesson(lIdx); setShowFinalAssessment(false); }}
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 ${activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                                                }`}
                                        >
                                            {activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment ? (
                                                <PlayCircle className="w-4 h-4 shrink-0 fill-indigo-600/20 dark:fill-indigo-400/20" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 shrink-0" />
                                            )}
                                            <span className="text-sm truncate">{lesson.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {course.finalAssessment && (
                            <button
                                onClick={() => setShowFinalAssessment(true)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl transition-all mt-4 mx-2 ${showFinalAssessment
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span className="font-bold text-sm">Final Assessment</span>
                            </button>
                        )}
                    </div>
                </aside>

                {/* Mobile Sidebar Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="md:hidden fixed inset-0 bg-slate-900/20 z-40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="md:hidden fixed top-0 left-0 w-4/5 h-full bg-white dark:bg-slate-900 z-50 overflow-y-auto shadow-2xl"
                            >
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                    <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">MENU</span>
                                    <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
                                </div>
                                <div className="py-4 px-2">
                                    {course.modules.map((mod, mIdx) => (
                                        <div key={mod.id} className="mb-6">
                                            <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                                Module {mIdx + 1}
                                            </div>
                                            <h3 className="px-4 font-semibold mb-2 text-slate-700 dark:text-slate-300">{mod.title}</h3>
                                            <div className="space-y-1">
                                                {mod.lessons.map((lesson, lIdx) => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => {
                                                            setActiveModule(mIdx);
                                                            setActiveLesson(lIdx);
                                                            setShowFinalAssessment(false);
                                                            setMobileMenuOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl transition-all ${activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                                                            }`}
                                                    >
                                                        {activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment ? (
                                                            <PlayCircle className="w-4 h-4 shrink-0 fill-indigo-600/20 dark:fill-indigo-400/20" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 shrink-0" />
                                                        )}
                                                        <span className="text-sm truncate">{lesson.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {course.finalAssessment && (
                                        <button
                                            onClick={() => { setShowFinalAssessment(true); setMobileMenuOpen(false); }}
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl transition-all mt-4 ${showFinalAssessment
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                                                }`}
                                        >
                                            <CheckCircle className="w-4 h-4 shrink-0" />
                                            <span className="font-bold text-sm">Final Assessment</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 relative print:h-auto print:overflow-visible print:bg-white pt-16 md:pt-0 transition-colors duration-300">
                    <div className="max-w-5xl mx-auto p-8 md:p-12 print:p-0 print:max-w-none" ref={contentRef}>
                        {showFinalAssessment ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
                                    <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 print:text-black">Final Challenge! 🏆</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg print:text-gray-600">Show off what you've learned.</p>
                                </div>

                                {course.finalAssessment.map((q, i) => {
                                    const state = finalAssessmentState[i] || {};
                                    const isCorrect = state.selected === q.correct;

                                    return (
                                        <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all print:bg-white print:border-gray-300 print:break-inside-avoid">
                                            <p className="font-bold mb-6 text-xl text-slate-800 dark:text-slate-100 print:text-black"><span className="text-indigo-500 font-mono mr-2">Q{i + 1}.</span> {q.question}</p>
                                            <div className="space-y-3">
                                                {q.options.map((opt, oi) => (
                                                    <button
                                                        key={oi}
                                                        onClick={() => !state.submitted && setFinalAssessmentState(prev => ({ ...prev, [i]: { selected: oi } }))}
                                                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center group ${state.selected === oi
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
                                                            } ${state.submitted && oi === q.correct ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' : ''}
                                                          ${state.submitted && state.selected === oi && !isCorrect ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400' : ''}
                                                        `}
                                                    >
                                                        <span className="font-medium">{opt}</span>
                                                        {state.submitted && oi === q.correct && <CheckCircle className="w-6 h-6 text-green-500" />}
                                                        {state.submitted && state.selected === oi && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                                                    </button>
                                                ))}
                                            </div>
                                            {!state.submitted && state.selected !== undefined && (
                                                <button
                                                    onClick={() => setFinalAssessmentState(prev => ({ ...prev, [i]: { ...prev[i], submitted: true } }))}
                                                    className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/25 print:hidden"
                                                >
                                                    Check It!
                                                </button>
                                            )}
                                            {state.submitted && (
                                                <div className={`mt-6 p-6 rounded-2xl text-sm border-2 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
                                                    <p className="font-bold mb-2 flex items-center gap-2 text-lg">
                                                        {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                        {isCorrect ? 'You got it!' : 'Oops!'}
                                                    </p>
                                                    <p className="opacity-90 leading-relaxed text-base">{q.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : currentLesson ? (
                            <motion.div
                                key={currentLesson.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <div className="flex justify-between items-start mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
                                    <div>
                                        <span className="text-indigo-500 dark:text-indigo-400 font-bold text-xs tracking-widest mb-3 block uppercase bg-indigo-50 dark:bg-indigo-900/30 inline-block px-3 py-1 rounded-full">
                                            Module {activeModule + 1} • Lesson {activeLesson + 1}
                                        </span>
                                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white tracking-tight print:text-black">{currentLesson.title}</h2>
                                    </div>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm transition text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm print:hidden"
                                    >
                                        <Download className="w-4 h-4" /> Save PDF
                                    </button>
                                </div>

                                {/* Content Rendering */}
                                <div className="prose prose-lg max-w-none dark:prose-invert print:prose-neutral prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 prose-a:text-indigo-500 dark:prose-a:text-indigo-400">
                                    {/* Explanation */}
                                    <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-12 shadow-xl shadow-slate-200/50 dark:shadow-black/50 print:bg-white print:border-none print:p-0 transition-colors duration-300">
                                        <div className="text-slate-600 dark:text-slate-300 leading-relaxed print:text-black">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath, remarkGfm]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            <div className="rounded-2xl overflow-hidden my-8 border border-slate-200 dark:border-slate-700 shadow-lg print:border-gray-300">
                                                                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                                                    <Code className="w-4 h-4 text-indigo-500" /> {match[1].toUpperCase()}
                                                                </div>
                                                                <SyntaxHighlighter
                                                                    style={atomDark}
                                                                    language={match[1]}
                                                                    PreTag="div"
                                                                    customStyle={{ margin: 0, borderRadius: 0 }}
                                                                    {...props}
                                                                >
                                                                    {String(children).replace(/\n$/, '')}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        ) : (
                                                            <code className={`${className} bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-md text-indigo-600 dark:text-indigo-300 font-mono text-sm font-bold print:bg-gray-200 print:text-black`} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    },
                                                    p: ({ node, ...props }) => {
                                                        return <p className="mb-6 leading-8 text-slate-600 dark:text-slate-300" {...props} />
                                                    },
                                                    h1: ({ node, ...props }) => (
                                                        <h1 className="text-3xl font-black mt-10 mb-6 text-slate-900 dark:text-white border-b-4 border-indigo-100 dark:border-indigo-900 pb-4 inline-block" {...props} />
                                                    ),
                                                    h2: ({ node, ...props }) => (
                                                        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-3" {...props} />
                                                    ),
                                                    h3: ({ node, ...props }) => (
                                                        <h3 className="text-xl font-bold mt-8 mb-3 text-indigo-600 dark:text-indigo-400" {...props} />
                                                    ),
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-x-auto my-10 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                                                            <table className="w-full text-left border-collapse" {...props} />
                                                        </div>
                                                    ),
                                                    thead: ({ node, ...props }) => (
                                                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider" {...props} />
                                                    ),
                                                    tbody: ({ node, ...props }) => (
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700" {...props} />
                                                    ),
                                                    tr: ({ node, ...props }) => (
                                                        <tr className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors" {...props} />
                                                    ),
                                                    th: ({ node, ...props }) => (
                                                        <th className="p-5 font-bold border-b border-slate-200 dark:border-slate-700" {...props} />
                                                    ),
                                                    td: ({ node, ...props }) => (
                                                        <td className="p-5 align-top text-slate-600 dark:text-slate-300" {...props} />
                                                    ),
                                                    strong: ({ node, ...props }) => (
                                                        <strong className="font-black text-indigo-600 dark:text-indigo-400" {...props} />
                                                    ),
                                                    ul: ({ node, ...props }) => (
                                                        <ul className="list-disc list-inside mb-6 space-y-2 text-slate-600 dark:text-slate-300 marker:text-indigo-400" {...props} />
                                                    ),
                                                    ol: ({ node, ...props }) => (
                                                        <ol className="list-decimal list-inside mb-6 space-y-2 text-slate-600 dark:text-slate-300 marker:text-indigo-600 dark:marker:text-indigo-400 font-bold" {...props} />
                                                    ),
                                                    li: ({ node, ...props }) => (
                                                        <li className="pl-2" {...props} />
                                                    ),
                                                    blockquote: ({ node, ...props }) => (
                                                        <blockquote className="border-l-8 border-indigo-400 pl-6 py-4 my-8 italic text-slate-600 dark:text-slate-400 bg-indigo-50 dark:bg-indigo-900/10 rounded-r-2xl shadow-sm" {...props} />
                                                    )
                                                }}
                                            >
                                                {currentLesson.content.explanation}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Graphs */}
                                    {currentLesson.content.graphs && currentLesson.content.graphs.map((graph, i) => (
                                        <div key={i}>{renderGraph(graph)}</div>
                                    ))}

                                    {/* Analogies */}
                                    {currentLesson.content.analogies && (
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 mb-10 print:bg-gray-50 print:border-gray-200 print:break-inside-avoid relative overflow-hidden shadow-sm">
                                            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10">
                                                <Lightbulb className="w-32 h-32 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 flex items-center gap-3 print:text-indigo-700 relative z-10">
                                                <Lightbulb className="w-6 h-6 fill-yellow-400 text-yellow-500" /> Think About It Like This...
                                            </h3>
                                            <ul className="space-y-4 relative z-10">
                                                {currentLesson.content.analogies.map((a, i) => (
                                                    <li key={i} className="flex gap-4 text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-sm">
                                                        <span className="text-2xl">💡</span>
                                                        <span className="font-medium">{typeof a === 'string' ? a : a.description || a.content || a.text || JSON.stringify(a)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Examples */}
                                    {currentLesson.content.examples && (
                                        <div className="mb-12 print:break-inside-avoid">
                                            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                                <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Real World Magic
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {currentLesson.content.examples.map((ex, i) => (
                                                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-xl group">
                                                        <p className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">
                                                            {typeof ex === 'string' ? ex : ex.description || ex.content || ex.text || JSON.stringify(ex)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Interactive Quiz */}
                                    {currentLesson.content.quiz && (
                                        <div className="mt-16 p-8 md:p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-100 dark:shadow-black/50 print:bg-white print:border-gray-300 print:break-inside-avoid">
                                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 print:text-black text-slate-800 dark:text-slate-100">
                                                <HelpCircle className="w-8 h-8 text-indigo-500 fill-indigo-100 dark:fill-indigo-900/50" /> Quick Quiz
                                            </h3>
                                            {currentLesson.content.quiz.map((q, i) => {
                                                const state = quizState[i] || {};
                                                const isCorrect = state.selected === q.correct;

                                                return (
                                                    <div key={i} className="mb-10 last:mb-0">
                                                        <p className="font-bold mb-6 text-lg text-slate-700 dark:text-slate-200 print:text-black">{q.question}</p>
                                                        <div className="space-y-3">
                                                            {q.options.map((opt, oi) => (
                                                                <button
                                                                    key={oi}
                                                                    onClick={() => !state.submitted && setQuizState(prev => ({ ...prev, [i]: { selected: oi } }))}
                                                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${state.selected === oi
                                                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                                                                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                                                        } ${state.submitted && oi === q.correct ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' : ''}
                                                                      ${state.submitted && state.selected === oi && !isCorrect ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400' : ''}
                                                                    `}
                                                                >
                                                                    <span>{opt}</span>
                                                                    {state.submitted && oi === q.correct && <CheckCircle className="w-6 h-6 text-green-500" />}
                                                                    {state.submitted && state.selected === oi && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {!state.submitted && state.selected !== undefined && (
                                                            <button
                                                                onClick={() => setQuizState(prev => ({ ...prev, [i]: { ...prev[i], submitted: true } }))}
                                                                className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/25 print:hidden"
                                                            >
                                                                Check Answer
                                                            </button>
                                                        )}
                                                        {state.submitted && (
                                                            <div className={`mt-6 p-6 rounded-2xl text-sm border-2 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
                                                                <p className="font-bold mb-2 text-lg">{isCorrect ? 'You got it! 🎉' : 'Not quite! 😅'}</p>
                                                                <p className="text-base">{q.explanation}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Navigation Footer */}
                                <div className="flex justify-between mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 print:hidden">
                                    <button
                                        disabled={activeModule === 0 && activeLesson === 0}
                                        onClick={() => {
                                            if (activeLesson > 0) setActiveLesson(activeLesson - 1);
                                            else if (activeModule > 0) {
                                                setActiveModule(activeModule - 1);
                                                setActiveLesson(course.modules[activeModule - 1].lessons.length - 1);
                                            }
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Previous
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (activeLesson < currentModule.lessons.length - 1) setActiveLesson(activeLesson + 1);
                                            else if (activeModule < course.modules.length - 1) {
                                                setActiveModule(activeModule + 1);
                                                setActiveLesson(0);
                                            } else {
                                                setShowFinalAssessment(true);
                                            }
                                        }}
                                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
                                    >
                                        {activeModule === course.modules.length - 1 && activeLesson === currentModule.lessons.length - 1 ? 'Final Challenge' : 'Next Lesson'} <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="text-center py-20 text-slate-400">Select a lesson to start your journey! 🚀</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SampleCourseViewer;
