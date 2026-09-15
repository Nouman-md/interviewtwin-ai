import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles, Moon, Sun, ArrowRight,
  User, Phone, Briefcase, Target, CheckCircle2,
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    currentRole: '',
    targetRole: '',
    yearsOfExperience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const maxLengths = {
      firstName: 100,
      lastName: 100,
      email: 255,
      password: 128,
      phone: 30,
      currentRole: 100,
      targetRole: 100,
    };

    if (name === 'yearsOfExperience') {
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
      }

      const numericValue = value.replace(/\D/g, '');

      if (numericValue === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }

      const parsedValue = Number(numericValue);

      if (parsedValue > 100) {
        setFormData(prev => ({ ...prev, [name]: '100' }));
        return;
      }

      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    if (maxLengths[name] && value.length > maxLengths[name]) {
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const currentRole = formData.currentRole.trim();
    const targetRole = formData.targetRole.trim();

    if (!firstName || !lastName || !email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (firstName.length > 100 || lastName.length > 100) {
      setError('First name and last name must not exceed 100 characters.');
      return;
    }

    if (email.length > 255) {
      setError('Email must not exceed 255 characters.');
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 128) {
      setError('Password must be between 6 and 128 characters.');
      return;
    }

    if (phone.length > 30) {
      setError('Phone must not exceed 30 characters.');
      return;
    }

    if (currentRole.length > 100 || targetRole.length > 100) {
      setError('Role fields must not exceed 100 characters.');
      return;
    }

    const yearsOfExperience =
      formData.yearsOfExperience === ''
        ? 0
        : Number(formData.yearsOfExperience);

    if (
      !Number.isInteger(yearsOfExperience) ||
      yearsOfExperience < 0 ||
      yearsOfExperience > 100
    ) {
      setError('Years of experience must be between 0 and 100.');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        firstName,
        lastName,
        email,
        password: formData.password,
        phone,
        currentRole,
        targetRole,
        yearsOfExperience,
      });

      if (response.success) {
        setSuccess('Registration successful! Please verify your email.');
        setTimeout(() => {
          navigate('/verify-email', {
            state: { email },
          });
        }, 1000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-xl glass text-gray-700 dark:text-white hover:scale-110 transition-transform z-10"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass-card p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4 shadow-glow"
            >
              <Sparkles className="text-white" size={28} />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Start your interview preparation journey today
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-400/30 rounded-xl flex gap-3"
            >
              <AlertCircle
                className="text-red-600 dark:text-red-300 flex-shrink-0"
                size={20}
              />
              <p className="text-red-700 dark:text-red-100 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success */}
          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 backdrop-blur-sm border border-emerald-200 dark:border-emerald-400/30 rounded-xl flex gap-3"
            >
              <CheckCircle2
                className="text-emerald-600 dark:text-emerald-300 flex-shrink-0"
                size={20}
              />
              <p className="text-emerald-700 dark:text-emerald-100 text-sm">
                {success}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    maxLength={100}
                    autoComplete="given-name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    maxLength={100}
                    autoComplete="family-name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  maxLength={255}
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  minLength={6}
                  maxLength={128}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone (optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    maxLength={30}
                    autoComplete="tel"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="1"
                    inputMode="numeric"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Role (optional)
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    placeholder="Student"
                    maxLength={100}
                    autoComplete="organization-title"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Role (optional)
                </label>
                <div className="relative">
                  <Target className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400" size={20} />
                  <input
                    type="text"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    maxLength={100}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 py-3.5 text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200 dark:border-gray-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="spinner h-5 w-5 border-white/30 border-t-primary-700"></div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight size={20} />
                </span>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-600 dark:text-gray-300 mt-6"
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}