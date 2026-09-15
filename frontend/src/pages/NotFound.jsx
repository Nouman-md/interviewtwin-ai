import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-6 shadow-glow"
        >
          <Sparkles className="text-white" size={36} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-7xl md:text-9xl font-bold text-white mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-200 mb-8 max-w-md mx-auto"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/" className="btn bg-white text-primary-700 px-6 py-3 font-bold hover:bg-gray-50 hover:shadow-2xl transform hover:-translate-y-0.5 transition-all">
            <Home size={20} className="mr-2 inline" /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn border-2 border-white/30 text-white px-6 py-3 hover:bg-white/10 transition-all">
            <ArrowLeft size={20} className="mr-2 inline" /> Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}