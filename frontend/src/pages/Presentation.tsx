import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Brain, Layout, Cpu, Database, Sparkles, Palette, CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
    {
        id: 'intro',
        title: "Project Highlights",
        subtitle: "CourseFoundry: AI-Native Education",
        icon: Brain,
        color: "from-indigo-400 to-cyan-400",
        content: (
            <div className="space-y-6 text-center">
                <p className="text-xl text-slate-300">
                    A deep dive into the technical and design decisions behind the platform.
                </p>
                <div className="flex justify-center gap-4">
                    <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="text-indigo-400 font-bold">Topic:</span> Machine Learning
                    </div>
                    <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="text-purple-400 font-bold">Engine:</span> GPT-4o
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'course',
        title: "The Course",
        subtitle: "Why Machine Learning?",
        icon: Database,
        color: "from-blue-400 to-indigo-400",
        content: (
            <div className="space-y-6">
                <p className="text-lg text-slate-300 leading-relaxed">
                    We chose <strong className="text-white">Machine Learning</strong> as our showcase topic to demonstrate the power of our <strong>Meta-Prompting</strong> strategy.
                </p>
                <ul className="space-y-4 text-left bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                        <span>It requires structured, academic rigor (math, definitions).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                        <span>It needs creative analogies to be accessible.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                        <span><strong>Verdict:</strong> If the AI can teach ML, it can teach anything.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 'platform',
        title: "The Platform",
        subtitle: "Custom-Built Experience",
        icon: Layout,
        color: "from-purple-400 to-pink-400",
        content: (
            <div className="space-y-6">
                <p className="text-lg text-slate-300">
                    We didn't use a template. We built <strong>CourseFoundry</strong> from scratch to blend the best of EdTech.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <h3 className="font-bold text-green-400 mb-2">Duolingo Style</h3>
                        <p className="text-sm text-slate-400">Adaptive questionnaires & gamified progression.</p>
                    </div>
                    <div className="p-4 bg-white/10 border border-white/20 rounded-xl">
                        <h3 className="font-bold text-white mb-2">Brilliant Style</h3>
                        <p className="text-sm text-slate-400">Clean, distraction-free visuals & interactive concepts.</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500 italic">
                    Did we use an existing course? <strong>No.</strong> The content is 100% AI-generated on the fly.
                </p>
            </div>
        )
    },
    {
        id: 'process-overview',
        title: "The Process",
        subtitle: "5-Stage Generative Pipeline",
        icon: Cpu,
        color: "from-cyan-400 to-blue-400",
        content: (
            <div className="space-y-6">
                <p className="text-lg text-slate-300">
                    We don't just ask for a course. We use a <strong>Multi-Stage Sequential Reasoning Flow</strong> to build it piece by piece.
                </p>
                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="block font-bold text-indigo-400">1. Persona</span>
                        <span className="text-slate-500">Tone & Level</span>
                    </div>
                    <div className="flex items-center justify-center text-slate-600">→</div>
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="block font-bold text-indigo-400">2. Structure</span>
                        <span className="text-slate-500">Modules & Lessons</span>
                    </div>
                    <div className="flex items-center justify-center text-slate-600">→</div>
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="block font-bold text-indigo-400">3. Content</span>
                        <span className="text-slate-500">Multimodal Lessons</span>
                    </div>
                </div>
                <div className="flex justify-center gap-2 text-xs text-center mt-2">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 w-1/4">
                        <span className="block font-bold text-indigo-400">4. Extras</span>
                        <span className="text-slate-500">Glossary & Quiz</span>
                    </div>
                    <div className="flex items-center justify-center text-slate-600">→</div>
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 w-1/4">
                        <span className="block font-bold text-green-400">5. Assembly</span>
                        <span className="text-slate-500">Final JSON</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'step-1-2',
        title: "Steps 1 & 2",
        subtitle: "Persona & Structure",
        icon: Brain,
        color: "from-purple-400 to-pink-400",
        content: (
            <div className="grid grid-cols-2 gap-6 text-left">
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-purple-400 mb-2">1. Persona Generation</h3>
                    <p className="text-sm text-slate-300 mb-2">
                        We first ask the AI to analyze the user and create a "Pedagogical Persona".
                    </p>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                        <li>Extracts learner summary</li>
                        <li>Defines recommended tone</li>
                        <li>Sets complexity level</li>
                    </ul>
                </div>
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-purple-400 mb-2">2. Structure Generation</h3>
                    <p className="text-sm text-slate-300 mb-2">
                        We generate the blueprint <em>before</em> writing any content.
                    </p>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                        <li>Max 3 modules</li>
                        <li>Max 3 lessons/module</li>
                        <li>Prevents rambling & inconsistency</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'step-3',
        title: "Step 3",
        subtitle: "Lesson Expansion",
        icon: Database,
        color: "from-indigo-400 to-cyan-400",
        content: (
            <div className="space-y-6">
                <p className="text-lg text-slate-300">
                    This is the heavy lifting. We transform titles into full, rich content using <strong>Iterative Deepening</strong>.
                </p>
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-left">
                    <p className="text-slate-500 mb-2">// What we generate for EACH lesson:</p>
                    <ul className="space-y-2 text-green-400">
                        <li>+ Explanation (Markdown + LaTeX)</li>
                        <li>+ 2 Concrete Examples</li>
                        <li>+ 2 Conceptual Analogies</li>
                        <li>+ Image Prompts (for generation)</li>
                        <li>+ Graph Data (for Recharts)</li>
                        <li>+ Interactive Quiz Items</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'strategies',
        title: "Technical Strategies",
        subtitle: "How we ensure quality",
        icon: Sparkles,
        color: "from-amber-400 to-orange-400",
        content: (
            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-amber-400 mb-1">Iterative Deepening</h3>
                    <p className="text-xs text-slate-300">
                        Each stage feeds structured data into the next. The "Persona" is injected into every subsequent prompt to prevent context drift.
                    </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-amber-400 mb-1">JSON Enforcement</h3>
                    <p className="text-xs text-slate-300">
                        We force <code>response_format: "json_object"</code>. This eliminates hallucinations and ensures the frontend never breaks.
                    </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-amber-400 mb-1">Pedagogical Constraints</h3>
                    <p className="text-xs text-slate-300">
                        Explicit instructions for "scaffolded progression" and "multimodal explanations" (text + visual + interactive).
                    </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-amber-400 mb-1">Meta-Prompting</h3>
                    <p className="text-xs text-slate-300">
                        We asked GPT-4o to write its own system prompts first, ensuring maximum alignment with the model's capabilities.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'design',
        title: "Aesthetics",
        subtitle: "Looking Nice",
        icon: Palette,
        color: "from-pink-400 to-rose-400",
        content: (
            <div className="space-y-6">
                <p className="text-lg text-slate-300">
                    We believe education should be beautiful.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-slate-800 rounded-xl">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full mx-auto mb-2 animate-pulse" />
                        <span className="text-xs font-bold">Animations</span>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl">
                        <div className="w-8 h-8 bg-slate-900 border border-slate-600 rounded-lg mx-auto mb-2" />
                        <span className="text-xs font-bold">Dark Mode</span>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mx-auto mb-2" />
                        <span className="text-xs font-bold">Gradients</span>
                    </div>
                </div>
                <p className="text-sm text-slate-400">
                    Powered by <strong>Framer Motion</strong> and <strong>Tailwind CSS</strong>.
                </p>
            </div>
        )
    }
];

const Presentation = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
    };

    const SlideIcon = slides[currentSlide].icon;

    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-400">
                    <Brain className="w-6 h-6" />
                    <span>CourseFoundry Presentation</span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-full transition border border-slate-800 text-sm"
                >
                    <Home className="w-4 h-4" /> Exit
                </button>
            </header>

            {/* Main Slide Area */}
            <main className="flex-1 flex items-center justify-center p-6 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="max-w-4xl w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-12 rounded-3xl shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Gradient Blob */}
                        <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${slides[currentSlide].color} opacity-20 blur-3xl rounded-full pointer-events-none`} />
                        <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br ${slides[currentSlide].color} opacity-10 blur-3xl rounded-full pointer-events-none`} />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${slides[currentSlide].color} shadow-lg`}>
                                    <SlideIcon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white">{slides[currentSlide].title}</h1>
                                    <p className={`text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r ${slides[currentSlide].color}`}>
                                        {slides[currentSlide].subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="min-h-[300px] flex flex-col justify-center">
                                {slides[currentSlide].content}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer / Controls */}
            <footer className="p-8 flex justify-center items-center gap-8 z-10">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-4 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition group"
                >
                    <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </button>

                <div className="flex gap-2">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? `bg-gradient-to-r ${slides[currentSlide].color} w-8` : 'bg-slate-800'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="p-4 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition group"
                >
                    <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </button>
            </footer>
        </div>
    );
};

export default Presentation;
