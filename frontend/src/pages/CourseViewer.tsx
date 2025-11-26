// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, CheckCircle, Menu, ChevronLeft, ChevronRight, PlayCircle, XCircle, HelpCircle, Download, BarChart2, Code, Calculator, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const CourseViewer = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizState, setQuizState] = useState({});
    const [showFinalAssessment, setShowFinalAssessment] = useState(false);
    const [finalAssessmentState, setFinalAssessmentState] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const contentRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`);
                const data = await res.json();
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    useEffect(() => {
        setQuizState({});
        setShowFinalAssessment(false);
    }, [activeModule, activeLesson]);

    const handleDownloadPDF = () => {
        window.print();
    };

    if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
    if (!course) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Course not found</div>;

    const currentModule = course.modules[activeModule];
    const currentLesson = currentModule?.lessons[activeLesson];

    // Render Graph Helper
    const renderGraph = (graph) => {
        if (!graph || !graph.data) return null;
        const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

        return (
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 my-8 h-80 print:break-inside-avoid">
                <h4 className="text-center font-bold mb-4 text-slate-300">{graph.title}</h4>
                <ResponsiveContainer width="100%" height="100%">
                    {graph.type === 'bar' ? (
                        <BarChart data={graph.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                            <Bar dataKey="value" fill="#6366f1" />
                        </BarChart>
                    ) : graph.type === 'line' ? (
                        <LineChart data={graph.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    ) : (
                        <PieChart>
                            <Pie data={graph.data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                                {graph.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex font-sans print:bg-white print:text-black">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-slate-950 border-b border-slate-800 p-4 z-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => setMobileMenuOpen(true)} className="text-slate-300">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-indigo-400 truncate max-w-[200px]">{course.title}</span>
                </div>
                <button onClick={() => navigate('/')} className="text-xs text-slate-500">Exit</button>
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-80 bg-slate-950 border-r border-slate-800 flex-col h-screen sticky top-0 overflow-y-auto print:hidden">
                <div className="p-6 border-b border-slate-800 cursor-pointer" onClick={() => navigate('/')}>
                    <h1 className="font-bold text-xl text-indigo-400">{course.title}</h1>
                    <p className="text-sm text-slate-500 mt-1">{course.modules.length} Modules</p>
                    <p className="text-xs text-slate-600 mt-2 hover:text-indigo-400 transition">← Back to Home</p>
                </div>
                <div className="flex-1 py-4">
                    {course.modules.map((mod, mIdx) => (
                        <div key={mod.id} className="mb-6">
                            <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Module {mIdx + 1}
                            </div>
                            <h3 className="px-6 font-semibold mb-2">{mod.title}</h3>
                            <div>
                                {mod.lessons.map((lesson, lIdx) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => { setActiveModule(mIdx); setActiveLesson(lIdx); setShowFinalAssessment(false); }}
                                        className={`w-full text-left px-6 py-3 flex items-center gap-3 transition ${activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment
                                            ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                            }`}
                                    >
                                        {activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment ? (
                                            <PlayCircle className="w-4 h-4" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-slate-600" />
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
                            className={`w-full text-left px-6 py-3 flex items-center gap-3 transition mt-4 ${showFinalAssessment
                                ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                }`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-bold">Final Assessment</span>
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
                            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 w-4/5 h-full bg-slate-950 z-50 overflow-y-auto border-r border-slate-800"
                        >
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                <span className="font-bold text-slate-300">Course Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-slate-500" /></button>
                            </div>
                            <div className="py-4">
                                {course.modules.map((mod, mIdx) => (
                                    <div key={mod.id} className="mb-6">
                                        <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Module {mIdx + 1}
                                        </div>
                                        <h3 className="px-6 font-semibold mb-2">{mod.title}</h3>
                                        <div>
                                            {mod.lessons.map((lesson, lIdx) => (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => {
                                                        setActiveModule(mIdx);
                                                        setActiveLesson(lIdx);
                                                        setShowFinalAssessment(false);
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className={`w-full text-left px-6 py-3 flex items-center gap-3 transition ${activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment
                                                        ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500'
                                                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                                        }`}
                                                >
                                                    {activeModule === mIdx && activeLesson === lIdx && !showFinalAssessment ? (
                                                        <PlayCircle className="w-4 h-4" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-slate-600" />
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
                                        className={`w-full text-left px-6 py-3 flex items-center gap-3 transition mt-4 ${showFinalAssessment
                                            ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                            }`}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="font-bold">Final Assessment</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto bg-slate-900 relative print:h-auto print:overflow-visible print:bg-white pt-16 md:pt-0">
                <div className="max-w-4xl mx-auto p-12 print:p-0 print:max-w-none" ref={contentRef}>
                    {showFinalAssessment ? (
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold mb-6 text-indigo-400 print:text-black">Final Assessment</h2>
                            <p className="text-slate-400 mb-8 print:text-gray-600">Test your knowledge of the entire course.</p>

                            {course.finalAssessment.map((q, i) => {
                                const state = finalAssessmentState[i] || {};
                                const isCorrect = state.selected === q.correct;

                                return (
                                    <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 print:bg-white print:border-gray-300 print:break-inside-avoid">
                                        <p className="font-medium mb-4 text-lg print:text-black">{i + 1}. {q.question}</p>
                                        <div className="space-y-3">
                                            {q.options.map((opt, oi) => (
                                                <button
                                                    key={oi}
                                                    onClick={() => !state.submitted && setFinalAssessmentState(prev => ({ ...prev, [i]: { selected: oi } }))}
                                                    className={`w-full text-left p-4 rounded-xl border transition flex justify-between items-center ${state.selected === oi
                                                        ? 'bg-indigo-600/20 border-indigo-500 text-white print:border-black print:font-bold'
                                                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 print:bg-white print:text-black print:border-gray-300'
                                                        } ${state.submitted && oi === q.correct ? 'bg-green-500/20 border-green-500' : ''}
                                                      ${state.submitted && state.selected === oi && !isCorrect ? 'bg-red-500/20 border-red-500' : ''}
                                                    `}
                                                >
                                                    <span>{opt}</span>
                                                    {state.submitted && oi === q.correct && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                    {state.submitted && state.selected === oi && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                                </button>
                                            ))}
                                        </div>
                                        {!state.submitted && state.selected !== undefined && (
                                            <button
                                                onClick={() => setFinalAssessmentState(prev => ({ ...prev, [i]: { ...prev[i], submitted: true } }))}
                                                className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium print:hidden"
                                            >
                                                Check Answer
                                            </button>
                                        )}
                                        {state.submitted && (
                                            <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                                                <p className="font-bold mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                                                <p>{q.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : currentLesson ? (
                        <motion.div
                            key={currentLesson.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-indigo-400 font-medium mb-2 block print:text-indigo-600">
                                        Module {activeModule + 1} • Lesson {activeLesson + 1}
                                    </span>
                                    <h2 className="text-4xl font-bold mb-6 print:text-black">{currentLesson.title}</h2>
                                </div>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition border border-slate-700 print:hidden"
                                >
                                    <Download className="w-4 h-4" /> PDF
                                </button>
                            </div>

                            {/* Content Rendering */}
                            <div className="prose prose-invert prose-lg max-w-none print:prose-neutral">
                                {/* Explanation */}
                                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 mb-8 print:bg-white print:border-none print:p-0">
                                    <div className="text-slate-300 leading-relaxed print:text-black">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath, remarkGfm]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <div className="rounded-lg overflow-hidden my-6 border border-slate-700 print:border-gray-300">
                                                            <div className="bg-slate-950 px-4 py-2 text-xs text-slate-500 border-b border-slate-800 flex items-center gap-2 print:bg-gray-100 print:border-gray-300">
                                                                <Code className="w-3 h-3" /> {match[1]}
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
                                                        <code className={`${className} bg-slate-700 px-1 py-0.5 rounded text-indigo-300 print:bg-gray-200 print:text-black`} {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                p: ({ node, ...props }) => {
                                                    return <p className="mb-4" {...props} />
                                                },
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-8 rounded-lg border border-slate-700">
                                                        <table className="w-full text-left border-collapse" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => (
                                                    <thead className="bg-slate-900/50 text-indigo-300" {...props} />
                                                ),
                                                tbody: ({ node, ...props }) => (
                                                    <tbody className="divide-y divide-slate-700" {...props} />
                                                ),
                                                tr: ({ node, ...props }) => (
                                                    <tr className="hover:bg-slate-800/30 transition-colors" {...props} />
                                                ),
                                                th: ({ node, ...props }) => (
                                                    <th className="p-4 font-semibold border-b border-slate-700" {...props} />
                                                ),
                                                td: ({ node, ...props }) => (
                                                    <td className="p-4 align-top" {...props} />
                                                ),
                                                strong: ({ node, ...props }) => (
                                                    <strong className="font-bold text-indigo-300" {...props} />
                                                ),
                                                ul: ({ node, ...props }) => (
                                                    <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
                                                ),
                                                ol: ({ node, ...props }) => (
                                                    <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
                                                ),
                                                li: ({ node, ...props }) => (
                                                    <li className="text-slate-300" {...props} />
                                                ),
                                                blockquote: ({ node, ...props }) => (
                                                    <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 italic text-slate-400 bg-slate-800/30 rounded-r-lg" {...props} />
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
                                    <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30 mb-8 print:bg-gray-50 print:border-gray-200 print:break-inside-avoid">
                                        <h3 className="text-lg font-bold text-indigo-300 mb-2 flex items-center gap-2 print:text-indigo-700">
                                            <Book className="w-5 h-5" /> Analogy
                                        </h3>
                                        <ul className="list-disc list-inside text-indigo-200 print:text-black">
                                            {currentLesson.content.analogies.map((a, i) => (
                                                <li key={i}>
                                                    {typeof a === 'string' ? a : a.description || a.content || a.text || JSON.stringify(a)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Examples */}
                                {currentLesson.content.examples && (
                                    <div className="mb-8 print:break-inside-avoid">
                                        <h3 className="text-2xl font-bold mb-4 print:text-black">Real-World Examples</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {currentLesson.content.examples.map((ex, i) => (
                                                <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 print:bg-white print:border-gray-300">
                                                    <p className="text-slate-300 print:text-black">
                                                        {typeof ex === 'string' ? ex : ex.description || ex.content || ex.text || JSON.stringify(ex)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Quiz */}
                                {currentLesson.content.quiz && (
                                    <div className="mt-12 p-8 bg-slate-950 rounded-2xl border border-slate-800 print:bg-white print:border-gray-300 print:break-inside-avoid">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 print:text-black">
                                            <HelpCircle className="w-6 h-6 text-indigo-500" /> Quick Check
                                        </h3>
                                        {currentLesson.content.quiz.map((q, i) => {
                                            const state = quizState[i] || {};
                                            const isCorrect = state.selected === q.correct;

                                            return (
                                                <div key={i} className="mb-8 last:mb-0">
                                                    <p className="font-medium mb-4 text-lg print:text-black">{q.question}</p>
                                                    <div className="space-y-3">
                                                        {q.options.map((opt, oi) => (
                                                            <div
                                                                key={oi}
                                                                className={`w-full text-left p-4 rounded-xl border transition flex justify-between items-center ${state.selected === oi
                                                                    ? 'bg-indigo-600/20 border-indigo-500 text-white print:border-black print:font-bold'
                                                                    : 'bg-slate-900 border-slate-800 text-slate-300 print:bg-white print:text-black print:border-gray-300'
                                                                    }`}
                                                            >
                                                                <span>{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex justify-between mt-16 pt-8 border-t border-slate-800 print:hidden">
                                <button
                                    disabled={activeModule === 0 && activeLesson === 0}
                                    onClick={() => {
                                        if (activeLesson > 0) setActiveLesson(activeLesson - 1);
                                        else if (activeModule > 0) {
                                            setActiveModule(activeModule - 1);
                                            setActiveLesson(course.modules[activeModule - 1].lessons.length - 1);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
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

export default CourseViewer;
