import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
          <FileText className="text-white" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Terms & Conditions</h1>
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
              <CheckCircle className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acceptance of Terms</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            By accessing or using InterviewTwin AI, you agree to be bound by these Terms and Conditions. If you do not 
            agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, 
            and your continued use of the platform constitutes acceptance of any changes.
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
              <FileText className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Use of Services</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Use the service in any way that violates any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to any portion of the service</li>
            <li>Interfere with or disrupt the service or servers connected to the service</li>
            <li>Use the service to transmit any malicious code, viruses, or harmful content</li>
            <li>Impersonate any person or entity or falsely state your affiliation</li>
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
              <AlertTriangle className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Intellectual Property</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            The content, features, and functionality of InterviewTwin AI are owned by us and are protected by 
            international copyright, trademark, and other intellectual property laws. You may not reproduce, 
            distribute, modify, or create derivative works without our express written permission.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            InterviewTwin AI is provided "as is" without warranties of any kind. We shall not be liable for any 
            indirect, incidental, special, consequential, or punitive damages resulting from your use or inability 
            to use the service. Our total liability shall not exceed the amount you paid us in the twelve months 
            preceding the claim.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If you have any questions about these Terms & Conditions, please contact us at legal@interviewtwin.ai.
          </p>
        </motion.div>
      </div>
    </div>
  );
}