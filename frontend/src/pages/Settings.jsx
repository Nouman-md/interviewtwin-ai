import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';
import { Lock, LogOut, AlertCircle, CheckCircle2, Moon, Sun, Bell, Lightbulb, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    showTips: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setChanging(true);
    try {
      await userAPI.changePassword(user.userId, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const ToggleSwitch = ({ checked, onChange, icon: Icon, title, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Icon className="text-primary-600 dark:text-primary-400" size={20} />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex gap-3">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={20} />
            <p className="text-emerald-700 dark:text-emerald-300 text-sm">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <ToggleSwitch
          checked={isDark}
          onChange={toggleTheme}
          icon={isDark ? Moon : Sun}
          title="Dark Mode"
          description="Use dark theme for the interface"
        />
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card mb-6">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Lock className="text-primary-600 dark:text-primary-400" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="form-label">Current Password</label>
            <div className="relative">
              <input type={showPasswords.old ? 'text' : 'password'} name="oldPassword" value={passwords.oldPassword} onChange={handleChange} placeholder="Enter your current password" className="input-field pr-12" />
              <button type="button" onClick={() => togglePasswordVisibility('old')} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">New Password</label>
            <div className="relative">
              <input type={showPasswords.new ? 'text' : 'password'} name="newPassword" value={passwords.newPassword} onChange={handleChange} placeholder="At least 6 characters" className="input-field pr-12" />
              <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <div className="relative">
              <input type={showPasswords.confirm ? 'text' : 'password'} name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} placeholder="Re-enter new password" className="input-field pr-12" />
              <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleChangePassword} disabled={changing} className="btn-primary w-full disabled:opacity-50">
            {changing ? <span className="flex items-center gap-2"><div className="spinner h-4 w-4 border-white/30 border-t-white"></div>Changing...</span> : 'Change Password'}
          </motion.button>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferences</h2>
        <div className="space-y-3">
          <ToggleSwitch checked={preferences.emailNotifications} onChange={() => setPreferences(p => ({ ...p, emailNotifications: !p.emailNotifications }))} icon={Bell} title="Email Notifications" description="Get updates about your interviews and scores" />
          <ToggleSwitch checked={preferences.showTips} onChange={() => setPreferences(p => ({ ...p, showTips: !p.showTips }))} icon={Lightbulb} title="Show Tips" description="Display helpful tips and suggestions" />
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <LogOut className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Logout</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">You will be logged out and redirected to the home page.</p>
        <button onClick={handleLogout} className="btn-danger w-full">Logout from Your Account</button>
      </motion.div>
    </div>
  );
}