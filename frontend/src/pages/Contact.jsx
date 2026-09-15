import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="text-white" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">We'd love to hear from you</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">support@interviewtwin.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Address</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    123 Innovation Street<br />
                    Tech Valley, CA 94000<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Business Hours</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM PST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="form-label">Message</label>
                <textarea
                  className="input-field h-32 resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="btn-primary w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  Send Message <Send size={18} />
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}