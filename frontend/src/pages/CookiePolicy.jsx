import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Shield, Settings, Info } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
          <Cookie className="text-white" size={32} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Cookie Policy
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400">
          Last updated: September 2026
        </p>
      </motion.div>

      <div className="space-y-6">

        {/* What Are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Cookie
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              What Are Cookies?
            </h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Cookies are small pieces of information stored by your
            browser when you visit a website. They help websites
            remember information and provide a consistent and secure
            experience.
          </p>
        </motion.div>


        {/* How We Use Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Shield
                className="text-emerald-600 dark:text-emerald-400"
                size={20}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              How We Use Cookies
            </h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            InterviewTwin AI may use cookies and similar browser
            technologies for purposes such as:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>
              Maintaining secure authentication sessions
            </li>

            <li>
              Remembering necessary preferences
            </li>

            <li>
              Maintaining the functionality of the platform
            </li>

            <li>
              Improving the reliability and performance of the service
            </li>
          </ul>
        </motion.div>


        {/* Authentication Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Settings
                className="text-purple-600 dark:text-purple-400"
                size={20}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Authentication Cookies
            </h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            InterviewTwin AI uses a secure authentication cookie to
            maintain your signed-in session. The refresh-token cookie
            is configured as HttpOnly so that it cannot be accessed
            directly by JavaScript running in the browser.
          </p>
        </motion.div>


        {/* Managing Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Info
                className="text-amber-600 dark:text-amber-400"
                size={20}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Managing Cookies
            </h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            You can manage or delete cookies through your browser
            settings. Disabling necessary cookies may prevent certain
            features of InterviewTwin AI, including authentication,
            from functioning correctly.
          </p>
        </motion.div>


        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Information
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If you have questions about this Cookie Policy, please
            contact us at privacy@interviewtwin.ai.
          </p>
        </motion.div>

      </div>
    </div>
  );
}