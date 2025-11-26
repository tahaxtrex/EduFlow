// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, CheckCircle, Menu, ChevronLeft, ChevronRight, PlayCircle, XCircle, HelpCircle, Download, BarChart2, Code, Calculator, GraduationCap, X, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { advancedCourse } from '../data/advancedCourse';
import { useNavigate } from 'react-router-dom';

const AdvancedCourseViewer = () => {
    const navigate = useNavigate();
    const [course, setCourse] = useState(advancedCourse);
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const [quizState, setQuizState] = useState({});
    const [showFinalAssessment, setShowFinalAssessment] = useState(false);
    const [finalAssessmentState, setFinalAssessmentState] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                <div className="bg-slate-900/90 backdrop-blur-md border border-purple-500/30 p-4 rounded-xl shadow-xl">
                    <p className="text-purple-300 font-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
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
        const COLORS = ['#8b5cf6', '#14b8a6', '#06b6d4', '#f472b6'];

        return (
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 my-10 h-96 shadow-2xl print:break-inside-avoid relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <h4 className="text-center font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-lg">{graph.title}</h4>
                <ResponsiveContainer width="100%" height="100%">
                    {graph.type === 'bar' ? (
                        <BarChart data={graph.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
                            <Bar dataKey="value" fill="url(#colorGradientBar)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                            <defs>
                                <linearGradient id="colorGradientBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    ) : graph.type === 'line' ? (
                        <AreaChart data={graph.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fill="url(#colorGradientLine)" animationDuration={1500} />
                            <defs>
                                <linearGradient id="colorGradientLine" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
        <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex font-sans print:bg-white print:text-black selection:bg-purple-500/30">
            {/* Intro Modal */}
            <AnimatePresence>
                {showIntro && course.intro && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f1115] border border-purple-500/30 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl shadow-purple-900/20"
                        >
                            <div className="relative h-32 bg-gradient-to-r from-purple-900/50 to-slate-900 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                <GraduationCap className="w-16 h-16 text-purple-400 relative z-10" />
                            </div>
                            <div className="p-8">
                                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">{course.intro.title}</h2>
                                <div className="prose prose-invert prose-purple max-w-none mb-8">
                                    <ReactMarkdown>{course.intro.content}</ReactMarkdown>
                                </div>
                                <button
                                    onClick={() => setShowIntro(false)}
                                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                                >
                                    Enter the Lab <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-[#0f1115]/90 backdrop-blur-md border-b border-white/5 p-4 z-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => setMobileMenuOpen(true)} className="text-slate-300">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-purple-400 truncate max-w-[200px]">{course.title}</span>
                </div>
                <button onClick={() => navigate('/')} className="text-xs text-slate-500 font-mono">EXIT</button>
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-80 bg-[#0f1115] border-r border-white/5 flex-col h-screen sticky top-0 overflow-y-auto print:hidden">
                <div className="p-6 border-b border-white/5 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                            <GraduationCap className="w-6 h-6 text-purple-400" />
                        </div>
                        <h1 className="font-bold text-xl text-purple-400 tracking-tight">Advanced Track</h1>
                    </div>
                    <h2 className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors line-clamp-2">{course.title}</h2>
                    <p className="text-xs text-slate-600 mt-4 font-mono group-hover:text-purple-400 transition-colors">← RETURN TO BASE</p>
                </div>
                <div className="flex-1 py-4 px-2">
                    {course.modules.map((mod, mIdx) => (
                        <div key={mod.id} className="mb-6">
                            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                Module {mIdx + 1}
                            </div>
                            <h3 className="px-4 font-semibold mb-2 text-slate-200">{mod.title}</h3>
                            <div className="space-y-1">
                                {mod.lessons.map((lesson, lIdx) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => { setActiveModule(mIdx); setActiveLesson(lIdx); setShowFinalAssessment(false); }}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-200 ${activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment
                                            ? 'bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                            }`}
                                    >
                                        {activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment ? (
                                            <PlayCircle className="w-4 h-4 shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                                        )}
                                        <span className="text-sm truncate font-medium">{lesson.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {course.finalAssessment && (
                        <button
                            onClick={() => setShowFinalAssessment(true)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition-all mt-4 mx-2 ${showFinalAssessment
                                ? 'bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
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
                            className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 w-4/5 h-full bg-[#0f1115] z-50 overflow-y-auto border-r border-white/10"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <span className="font-bold text-slate-300 font-mono">NAVIGATION</span>
                                <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-slate-500" /></button>
                            </div>
                            <div className="py-4 px-2">
                                {course.modules.map((mod, mIdx) => (
                                    <div key={mod.id} className="mb-6">
                                        <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                            Module {mIdx + 1}
                                        </div>
                                        <h3 className="px-4 font-semibold mb-2 text-slate-200">{mod.title}</h3>
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
                                                    className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition-all ${activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment
                                                        ? 'bg-purple-500/10 text-purple-300'
                                                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                                        }`}
                                                >
                                                    {activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment ? (
                                                        <PlayCircle className="w-4 h-4 shrink-0" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                                                    )}
                                                    <span className="text-sm truncate font-medium">{lesson.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {course.finalAssessment && (
                                    <button
                                        onClick={() => { setShowFinalAssessment(true); setMobileMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition-all mt-4 ${showFinalAssessment
                                            ? 'bg-purple-500/10 text-purple-300'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
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
            <main className="flex-1 h-screen overflow-y-auto bg-[#0a0a0c] relative print:h-auto print:overflow-visible print:bg-white pt-16 md:pt-0">
                <div className="max-w-5xl mx-auto p-8 md:p-12 print:p-0 print:max-w-none" ref={contentRef}>
                    {showFinalAssessment ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-b border-white/10 pb-6">
                                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 print:text-black">Final Assessment</h2>
                                <p className="text-slate-400 text-lg print:text-gray-600">Validate your understanding of the core theorems.</p>
                            </div>

                            {course.finalAssessment.map((q, i) => {
                                const state = finalAssessmentState[i] || {};
                                const isCorrect = state.selected === q.correct;

                                return (
                                    <div key={i} className="bg-[#0f1115] p-8 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors print:bg-white print:border-gray-300 print:break-inside-avoid">
                                        <p className="font-medium mb-6 text-xl text-slate-200 print:text-black"><span className="text-purple-500 font-mono mr-2">0{i + 1}.</span> {q.question}</p>
                                        <div className="space-y-3">
                                            {q.options.map((opt, oi) => (
                                                <button
                                                    key={oi}
                                                    onClick={() => !state.submitted && setFinalAssessmentState(prev => ({ ...prev, [i]: { selected: oi } }))}
                                                    className={`w-full text-left p-5 rounded-xl border transition-all flex justify-between items-center group ${state.selected === oi
                                                        ? 'bg-purple-500/10 border-purple-500 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                                                        : 'bg-[#16181d] border-white/5 hover:bg-[#1c1e24] text-slate-400 hover:text-slate-200'
                                                        } ${state.submitted && oi === q.correct ? 'bg-green-500/10 border-green-500/50 text-green-200' : ''}
                                                      ${state.submitted && state.selected === oi && !isCorrect ? 'bg-red-500/10 border-red-500/50 text-red-200' : ''}
                                                    `}
                                                >
                                                    <span className="font-medium">{opt}</span>
                                                    {state.submitted && oi === q.correct && <CheckCircle className="w-5 h-5 text-green-400" />}
                                                    {state.submitted && state.selected === oi && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                                </button>
                                            ))}
                                        </div>
                                        {!state.submitted && state.selected !== undefined && (
                                            <button
                                                onClick={() => setFinalAssessmentState(prev => ({ ...prev, [i]: { ...prev[i], submitted: true } }))}
                                                className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-purple-500/25 print:hidden"
                                            >
                                                Verify Answer
                                            </button>
                                        )}
                                        {state.submitted && (
                                            <div className={`mt-6 p-6 rounded-xl text-sm border ${isCorrect ? 'bg-green-500/5 border-green-500/20 text-green-300' : 'bg-red-500/5 border-red-500/20 text-red-300'}`}>
                                                <p className="font-bold mb-2 flex items-center gap-2">
                                                    {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    {isCorrect ? 'Correct Analysis' : 'Incorrect Analysis'}
                                                </p>
                                                <p className="opacity-90 leading-relaxed">{q.explanation}</p>
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
                            <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-8">
                                <div>
                                    <span className="text-purple-400 font-mono text-xs tracking-widest mb-3 block uppercase">
                                        Module {activeModule + 1} • Lesson {activeLesson + 1}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight print:text-black">{currentLesson.title}</h2>
                                </div>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition text-slate-400 hover:text-white border border-white/5 print:hidden"
                                >
                                    <Download className="w-4 h-4" /> PDF
                                </button>
                            </div>

                            {/* Content Rendering */}
                            <div className="prose prose-invert prose-lg max-w-none print:prose-neutral prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-300 prose-strong:text-purple-300 prose-code:text-purple-200">
                                {/* Explanation */}
                                <div className="bg-[#0f1115] p-8 md:p-10 rounded-3xl border border-white/5 mb-12 shadow-xl print:bg-white print:border-none print:p-0">
                                    <div className="text-slate-300 leading-relaxed print:text-black">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath, remarkGfm]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <div className="rounded-xl overflow-hidden my-8 border border-white/10 shadow-2xl print:border-gray-300">
                                                            <div className="bg-[#1a1d24] px-4 py-3 text-xs font-mono text-slate-400 border-b border-white/5 flex items-center gap-2">
                                                                <Code className="w-3 h-3" /> {match[1].toUpperCase()}
                                                            </div>
                                                            <SyntaxHighlighter
                                                                style={atomDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, borderRadius: 0, background: '#0f1115' }}
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className={`${className} bg-purple-500/10 px-1.5 py-0.5 rounded text-purple-300 font-mono text-sm print:bg-gray-200 print:text-black`} {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                p: ({ node, ...props }) => {
                                                    return <p className="mb-6 leading-7 text-slate-300" {...props} />
                                                },
                                                h1: ({ node, ...props }) => (
                                                    <h1 className="text-3xl font-bold mt-10 mb-6 text-white border-b border-white/10 pb-4" {...props} />
                                                ),
                                                h2: ({ node, ...props }) => (
                                                    <h2 className="text-2xl font-bold mt-10 mb-4 text-white flex items-center gap-3" {...props} />
                                                ),
                                                h3: ({ node, ...props }) => (
                                                    <h3 className="text-xl font-bold mt-8 mb-3 text-purple-200" {...props} />
                                                ),
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-10 rounded-xl border border-white/10 shadow-2xl bg-[#0f1115]">
                                                        <table className="w-full text-left border-collapse" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => (
                                                    <thead className="bg-gradient-to-r from-purple-900/20 to-slate-900/50 text-purple-200 font-bold uppercase text-xs tracking-wider" {...props} />
                                                ),
                                                tbody: ({ node, ...props }) => (
                                                    <tbody className="divide-y divide-white/5" {...props} />
                                                ),
                                                tr: ({ node, ...props }) => (
                                                    <tr className="hover:bg-white/5 transition-colors" {...props} />
                                                ),
                                                th: ({ node, ...props }) => (
                                                    <th className="p-5 font-semibold border-b border-white/10" {...props} />
                                                ),
                                                td: ({ node, ...props }) => (
                                                    <td className="p-5 align-top text-slate-400" {...props} />
                                                ),
                                                strong: ({ node, ...props }) => (
                                                    <strong className="font-bold text-purple-300" {...props} />
                                                ),
                                                ul: ({ node, ...props }) => (
                                                    <ul className="list-disc list-inside mb-6 space-y-2 text-slate-300 marker:text-purple-500" {...props} />
                                                ),
                                                ol: ({ node, ...props }) => (
                                                    <ol className="list-decimal list-inside mb-6 space-y-2 text-slate-300 marker:text-purple-500" {...props} />
                                                ),
                                                li: ({ node, ...props }) => (
                                                    <li className="pl-2" {...props} />
                                                ),
                                                blockquote: ({ node, ...props }) => (
                                                    <blockquote className="border-l-4 border-purple-500 pl-6 py-2 my-8 italic text-slate-400 bg-purple-500/5 rounded-r-xl" {...props} />
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
                                    <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 p-8 rounded-2xl border border-purple-500/20 mb-10 print:bg-gray-50 print:border-gray-200 print:break-inside-avoid relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Book className="w-24 h-24 text-purple-500" />
                                        </div>
                                        <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2 print:text-purple-700 relative z-10">
                                            <Book className="w-5 h-5" /> Conceptual Analogy
                                        </h3>
                                        <ul className="space-y-4 relative z-10">
                                            {currentLesson.content.analogies.map((a, i) => (
                                                <li key={i} className="flex gap-3 text-slate-300">
                                                    <span className="text-purple-500 font-bold">•</span>
                                                    <span>{typeof a === 'string' ? a : a.description || a.content || a.text || JSON.stringify(a)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Examples */}
                                {currentLesson.content.examples && (
                                    <div className="mb-12 print:break-inside-avoid">
                                        <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                            <Info className="w-6 h-6 text-cyan-400" /> Theoretical Applications
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {currentLesson.content.examples.map((ex, i) => (
                                                <div key={i} className="bg-[#0f1115] p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all hover:-translate-y-1 hover:shadow-xl group">
                                                    <p className="text-slate-300 group-hover:text-slate-100 transition-colors">
                                                        {typeof ex === 'string' ? ex : ex.description || ex.content || ex.text || JSON.stringify(ex)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Quiz */}
                                {currentLesson.content.quiz && (
                                    <div className="mt-16 p-8 md:p-10 bg-[#0f1115] rounded-3xl border border-white/5 shadow-2xl print:bg-white print:border-gray-300 print:break-inside-avoid">
                                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 print:text-black">
                                            <HelpCircle className="w-8 h-8 text-purple-500" /> Knowledge Check
                                        </h3>
                                        {currentLesson.content.quiz.map((q, i) => {
                                            const state = quizState[i] || {};
                                            const isCorrect = state.selected === q.correct;

                                            return (
                                                <div key={i} className="mb-10 last:mb-0">
                                                    <p className="font-medium mb-6 text-lg text-slate-200 print:text-black">{q.question}</p>
                                                    <div className="space-y-3">
                                                        {q.options.map((opt, oi) => (
                                                            <button
                                                                key={oi}
                                                                onClick={() => !state.submitted && setQuizState(prev => ({ ...prev, [i]: { selected: oi } }))}
                                                                className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${state.selected === oi
                                                                    ? 'bg-purple-500/10 border-purple-500 text-purple-100'
                                                                    : 'bg-[#16181d] border-white/5 hover:bg-[#1c1e24] text-slate-400'
                                                                    } ${state.submitted && oi === q.correct ? 'bg-green-500/10 border-green-500/50 text-green-200' : ''}
                                                                  ${state.submitted && state.selected === oi && !isCorrect ? 'bg-red-500/10 border-red-500/50 text-red-200' : ''}
                                                                `}
                                                            >
                                                                <span>{opt}</span>
                                                                {state.submitted && oi === q.correct && <CheckCircle className="w-5 h-5 text-green-400" />}
                                                                {state.submitted && state.selected === oi && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {!state.submitted && state.selected !== undefined && (
                                                        <button
                                                            onClick={() => setQuizState(prev => ({ ...prev, [i]: { ...prev[i], submitted: true } }))}
                                                            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors print:hidden"
                                                        >
                                                            Check Answer
                                                        </button>
                                                    )}
                                                    {state.submitted && (
                                                        <div className={`mt-4 p-4 rounded-xl text-sm border ${isCorrect ? 'bg-green-500/5 border-green-500/20 text-green-300' : 'bg-red-500/5 border-red-500/20 text-red-300'}`}>
                                                            <p className="font-bold mb-1">{isCorrect ? 'Correct' : 'Incorrect'}</p>
                                                            <p>{q.explanation}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex justify-between mt-20 pt-10 border-t border-white/10 print:hidden">
                                <button
                                    disabled={activeModule === 0 && activeLesson === 0}
                                    onClick={() => {
                                        if (activeLesson > 0) setActiveLesson(activeLesson - 1);
                                        else if (activeModule > 0) {
                                            setActiveModule(activeModule - 1);
                                            setActiveLesson(course.modules[activeModule - 1].lessons.length - 1);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition text-slate-400 hover:text-white"
                                >
                                    <ChevronLeft className="w-5 h-5" /> Previous Lesson
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
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-900/20 hover:shadow-purple-500/20"
                                >
                                    {activeModule === course.modules.length - 1 && activeLesson === currentModule.lessons.length - 1 ? 'Final Assessment' : 'Next Lesson'} <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                        </motion.div>
                    ) : (
                        <div className="text-center py-20 text-slate-500">Select a lesson to start</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdvancedCourseViewer;
