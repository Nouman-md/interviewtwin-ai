import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Moon,
  Sun,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // =========================================================
  // STATE
  // =========================================================

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');

  // Six individual OTP boxes
  const [code, setCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  // Internal reset token.
  // NEVER displayed to the user.
  const [resetToken, setResetToken] = useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  // References for OTP boxes
  const codeRefs = useRef([]);

  // =========================================================
  // HELPERS
  // =========================================================

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const getCodeValue = () => {
    return code.join('');
  };

  // =========================================================
  // STEP 1
  // SEND RESET CODE
  // =========================================================

  const handleSendCode = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!email.trim()) {
      setError(
        'Please enter your email address.'
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await authAPI.forgotPassword(
          email.trim()
        );

      if (response.data.success) {
        setMessage(
          'A password reset code has been sent to your email.'
        );

        setStep(2);

        // Focus first OTP box after UI changes
        setTimeout(() => {
          codeRefs.current[0]?.focus();
        }, 100);

      } else {
        setError(
          response.data.message ||
          'Unable to send reset code.'
        );
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to send reset code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OTP CHANGE
  // =========================================================

  const handleCodeChange = (index, value) => {

    // Keep only numbers
    const digit = value
      .replace(/\D/g, '')
      .slice(-1);

    const updatedCode = [...code];

    updatedCode[index] = digit;

    setCode(updatedCode);

    // Automatically move to next box
    if (
      digit &&
      index < 5
    ) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // OTP KEYBOARD HANDLING
  // =========================================================

  const handleCodeKeyDown = (index, e) => {

    // Backspace
    if (
      e.key === 'Backspace' &&
      !code[index] &&
      index > 0
    ) {
      codeRefs.current[index - 1]?.focus();
    }

    // Arrow left
    if (
      e.key === 'ArrowLeft' &&
      index > 0
    ) {
      codeRefs.current[index - 1]?.focus();
    }

    // Arrow right
    if (
      e.key === 'ArrowRight' &&
      index < 5
    ) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // OTP PASTE
  // =========================================================

  const handleCodePaste = (e) => {

    e.preventDefault();

    const pastedCode =
      e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6);

    if (!pastedCode) {
      return;
    }

    const updatedCode = [
      '',
      '',
      '',
      '',
      '',
      '',
    ];

    pastedCode
      .split('')
      .forEach((digit, index) => {
        updatedCode[index] = digit;
      });

    setCode(updatedCode);

    const nextIndex =
      Math.min(
        pastedCode.length,
        5
      );

    codeRefs.current[nextIndex]?.focus();
  };

  // =========================================================
  // STEP 2
  // VERIFY CODE
  // =========================================================

  const handleVerifyCode = async (e) => {

    e.preventDefault();

    clearMessages();

    const completeCode =
      getCodeValue();

    if (!/^\d{6}$/.test(completeCode)) {
      setError(
        'Please enter the complete 6-digit verification code.'
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await authAPI.verifyResetCode(
          email.trim(),
          completeCode
        );

      if (response.data.success) {

        // Store reset token internally.
        // The user NEVER sees or types this.
        setResetToken(
          response.data.resetToken
        );

        setMessage(
          'Code verified successfully.'
        );

        setStep(3);

      } else {

        setError(
          response.data.message ||
          'Invalid verification code.'
        );
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Invalid or expired verification code.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND CODE
  // =========================================================

  const handleResendCode = async () => {

    clearMessages();

    try {
      setResending(true);

      const response =
        await authAPI.forgotPassword(
          email.trim()
        );

      if (response.data.success) {

        setCode([
          '',
          '',
          '',
          '',
          '',
          '',
        ]);

        setMessage(
          'A new verification code has been sent.'
        );

        setTimeout(() => {
          codeRefs.current[0]?.focus();
        }, 100);

      } else {

        setError(
          response.data.message ||
          'Failed to resend verification code.'
        );
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to resend verification code.'
      );

    } finally {
      setResending(false);
    }
  };

  // =========================================================
  // STEP 3
  // RESET PASSWORD
  // =========================================================

  const handleResetPassword = async (e) => {

    e.preventDefault();

    clearMessages();

    if (newPassword.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    if (!resetToken) {
      setError(
        'Your reset session has expired. Please request a new code.'
      );

      setStep(1);
      return;
    }

    try {
      setLoading(true);

      const response =
        await authAPI.resetPassword(
          email.trim(),
          resetToken,
          newPassword
        );

      if (response.data.success) {

        setMessage(
          'Your password has been reset successfully.'
        );

        setTimeout(() => {
          navigate('/login');
        }, 1800);

      } else {

        setError(
          response.data.message ||
          'Unable to reset password.'
        );
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Unable to reset password. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // BACK BUTTON
  // =========================================================

  const handleBack = () => {

    clearMessages();

    if (step === 1) {
      navigate('/login');
      return;
    }

    if (step === 2) {

      setCode([
        '',
        '',
        '',
        '',
        '',
        '',
      ]);

      setStep(1);

      return;
    }

    if (step === 3) {

      setNewPassword('');
      setConfirmPassword('');

      setStep(2);
    }
  };

  // =========================================================
  // TITLES
  // =========================================================

  const getTitle = () => {

    if (step === 1) {
      return 'Forgot Password?';
    }

    if (step === 2) {
      return 'Verify Your Email';
    }

    return 'Create New Password';
  };

  const getDescription = () => {

    if (step === 1) {
      return 'Enter your email and we will send you a verification code.';
    }

    if (step === 2) {
      return (
        <>
          Enter the 6-digit code sent to
          <br />
          <span className="font-medium">
            {email}
          </span>
        </>
      );
    }

    return 'Create a new password for your InterviewTwin account.';
  };

  // =========================================================
  // ICON
  // =========================================================

  const getStepIcon = () => {

    if (step === 1) {
      return (
        <Mail
          className="text-white"
          size={30}
        />
      );
    }

    if (step === 2) {
      return (
        <ShieldCheck
          className="text-white"
          size={30}
        />
      );
    }

    return (
      <Lock
        className="text-white"
        size={30}
      />
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background glow */}

      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>

      <div
        className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float"
        style={{
          animationDelay: '1s',
        }}
      ></div>

      {/* Theme */}

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-xl glass text-gray-700 dark:text-white hover:scale-110 transition-transform z-10"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}
      </button>

      {/* Main card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="w-full max-w-md relative z-10"
      >

        <div className="glass-card p-8 md:p-10 shadow-2xl">

          {/* Logo */}

          <div className="text-center mb-8">

            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
              }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-5 shadow-glow"
            >
              {getStepIcon()}
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {getTitle()}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 leading-7">
              {getDescription()}
            </p>

          </div>

          {/* Progress */}

          <div className="flex items-center justify-center gap-2 mb-8">

            {[1, 2, 3].map(
              (number) => (

                <React.Fragment
                  key={number}
                >

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step >= number
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >

                    {step > number ? (
                      <CheckCircle
                        size={20}
                      />
                    ) : (
                      number
                    )}

                  </div>

                  {number < 3 && (
                    <div
                      className={`w-12 h-1 rounded-full transition-all ${
                        step > number
                          ? 'bg-primary-500'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  )}

                </React.Fragment>
              )
            )}

          </div>

          {/* Error */}

          {error && (

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-400/30 rounded-xl flex gap-3"
            >

              <AlertCircle
                className="text-red-600 dark:text-red-300 flex-shrink-0"
                size={20}
              />

              <p className="text-red-700 dark:text-red-100 text-sm">
                {error}
              </p>

            </motion.div>

          )}

          {/* Success */}

          {message && (

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 backdrop-blur-sm border border-green-200 dark:border-green-400/30 rounded-xl flex gap-3"
            >

              <CheckCircle
                className="text-green-500 flex-shrink-0"
                size={22}
              />

              <p className="text-green-700 dark:text-green-100 text-sm">
                {message}
              </p>

            </motion.div>

          )}

          {/* =================================================
              STEP 1
          ================================================== */}

          {step === 1 && (

            <motion.form
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              onSubmit={handleSendCode}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400"
                    size={20}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 py-3.5 text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200 dark:border-gray-700"
              >

                {loading ? (
                  'Sending Code...'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send Verification Code
                    <ArrowRight size={20} />
                  </span>
                )}

              </button>

            </motion.form>

          )}

          {/* =================================================
              STEP 2 — SIX OTP BOXES
          ================================================== */}

          {step === 2 && (

            <motion.form
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              onSubmit={handleVerifyCode}
              className="space-y-6"
            >

              <div>

                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Verification Code
                </label>

                {/* SIX BOXES */}

                <div className="flex justify-between gap-2">

                  {code.map(
                    (digit, index) => (

                      <input
                        key={index}
                        ref={(element) => {
                          codeRefs.current[index] =
                            element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0
                            ? 'one-time-code'
                            : 'off'
                        }
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(
                            index,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleCodeKeyDown(
                            index,
                            e
                          )
                        }
                        onPaste={
                          index === 0
                            ? handleCodePaste
                            : undefined
                        }
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl bg-white dark:bg-gray-800 border-2 border-primary-300 dark:border-primary-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-400/30 transition-all"
                        aria-label={`Verification digit ${index + 1}`}
                      />

                    )
                  )}

                </div>

              </div>

              {/* Information */}

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">

                <ShieldCheck
                  className="text-primary-600 dark:text-primary-400 flex-shrink-0"
                  size={20}
                />

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter the 6-digit code sent to your email.
                </p>

              </div>

              {/* Verify */}

              <button
                type="submit"
                disabled={
                  loading ||
                  code.join('').length !== 6
                }
                className="w-full btn bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3.5 text-lg font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >

                {loading ? (

                  <span className="flex items-center justify-center gap-2">
                    <div className="spinner h-5 w-5 border-white/30 border-t-white"></div>
                    Verifying...
                  </span>

                ) : (

                  <span className="flex items-center justify-center gap-2">
                    Verify Code
                    <ArrowRight size={20} />
                  </span>

                )}

              </button>

              {/* Resend */}

              <div className="text-center">

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="text-primary-600 dark:text-primary-400 font-semibold hover:underline disabled:opacity-50 transition-colors"
                >
                  {resending
                    ? 'Sending...'
                    : 'Resend verification code'}
                </button>

              </div>

            </motion.form>

          )}

          {/* =================================================
              STEP 3
          ================================================== */}

          {step === 3 && (

            <motion.form
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              onSubmit={handleResetPassword}
              className="space-y-5"
            >

              {/* New password */}

              <div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>

                <div className="relative">

                  <Lock
                    className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400"
                    size={20}
                  />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="Create a new password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3.5 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm password */}

              <div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    className="absolute left-3.5 top-3.5 text-gray-500 dark:text-gray-400"
                    size={20}
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm your new password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3.5 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* Reset */}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3.5 text-lg font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="spinner h-5 w-5 border-white/30 border-t-white"></div>
                    Resetting Password...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Reset Password
                    <ArrowRight size={20} />
                  </span>
                )}

              </button>

            </motion.form>

          )}

          {/* Back */}

          <div className="mt-7 text-center">

            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >

              <ArrowLeft size={18} />

              {step === 1
                ? 'Back to Login'
                : 'Back'}

            </button>

          </div>

        </div>

      </motion.div>

    </div>
  );
}