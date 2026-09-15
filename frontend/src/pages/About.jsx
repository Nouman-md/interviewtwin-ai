import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Award, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="text-white" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">About InterviewTwin</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Empowering students to ace their interviews with AI</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          InterviewTwin is an AI-powered interview preparation platform designed to help students and job seekers 
          master their interview skills. We combine cutting-edge artificial intelligence with proven interview 
          techniques to provide personalized, effective preparation.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our platform offers comprehensive tools including resume analysis, mock interviews across multiple 
          categories, coding challenges, and performance tracking to ensure you're fully prepared for your 
          dream job.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <Users className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">For Students</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Practice with AI-powered interviews, get instant feedback, and track your progress over time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
            <Award className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">For Job Seekers</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Optimize your resume, practice coding challenges, and prepare for technical interviews.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <Target className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Get intelligent feedback and personalized recommendations powered by advanced AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <Sparkles className="text-amber-600 dark:text-amber-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Comprehensive</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            From resume screening to coding challenges, we cover all aspects of interview preparation.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Join Thousands of Success Stories</h3>
        <p className="text-gray-700 dark:text-gray-300 text-center">
          Start your journey to interview success today with InterviewTwin AI.
        </p>
      </motion.div>
    </div>
  );
}