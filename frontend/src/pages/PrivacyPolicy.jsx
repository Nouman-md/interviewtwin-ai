import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
          <Shield className="text-white" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Last updated: January 2024</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Eye className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            We collect information you provide directly to us, including your name, email address, phone number, 
            resume content, and any other information you choose to provide when using our services.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We also automatically collect certain information when you use our platform, including your IP address, 
            browser type, device information, and usage patterns.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Lock className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            We use the information we collect to provide, maintain, and improve our services, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Processing your interview practice sessions and providing AI-powered feedback</li>
            <li>Analyzing your resume and providing ATS scoring</li>
            <li>Tracking your performance and progress over time</li>
            <li>Communicating with you about our services</li>
            <li>Personalizing your experience on our platform</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Database className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We implement industry-standard security measures to protect your personal information. All data is 
            encrypted in transit and at rest. We do not sell or share your personal information with third parties 
            without your explicit consent, except as required by law.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            You have the right to access, correct, or delete your personal information at any time. You can also 
            request a copy of your data or withdraw your consent for data processing.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To exercise these rights, please contact us at privacy@interviewtwin.ai.
          </p>
        </motion.div>
      </div>
    </div>
  );
}