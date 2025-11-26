import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QRCodePage = () => {
    const navigate = useNavigate();
    const url = "https://edu-flow-unbe.vercel.app";
    // const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&color=ffffff&bgcolor=0f172a`; 

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md w-full"
            >
                <div className="mb-8 p-4 bg-slate-800 rounded-full border border-slate-700">
                    <Smartphone className="w-8 h-8 text-indigo-400" />
                </div>

                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    Scan to Visit
                </h1>
                <p className="text-slate-400 mb-8">
                    Open the camera on your phone to view the live project.
                </p>

                <div className="p-4 bg-white rounded-2xl shadow-lg mb-8">
                    {/* Using a standard QR code API that returns an image */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`}
                        alt="QR Code"
                        className="w-64 h-64"
                    />
                </div>

                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition mb-8 font-mono text-sm"
                >
                    {url} <ExternalLink className="w-4 h-4" />
                </a>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700 text-slate-300"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
            </motion.div>
        </div>
    );
};

export default QRCodePage;
