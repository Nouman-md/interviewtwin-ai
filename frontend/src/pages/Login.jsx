import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { motion } from 'framer-motion';

import {
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Moon,
  Sun,
  ArrowRight,
} from 'lucide-react';


export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    isDark,
    toggleTheme,
  } = useTheme();


  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });


  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    setLoading(true);


    try {

      await login(
        formData.email,
        formData.password
      );

      navigate('/dashboard');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">


      {/* =====================================================
          BACKGROUND ORBS
          ===================================================== */}

      <div
        className="
          absolute
          top-20
          left-10
          w-64
          h-64
          bg-primary-500/20
          rounded-full
          blur-3xl
          animate-float
        "
      />


      <div
        className="
          absolute
          bottom-20
          right-10
          w-80
          h-80
          bg-secondary-500/20
          rounded-full
          blur-3xl
          animate-float
        "
        style={{
          animationDelay: '1s',
        }}
      />


      {/* =====================================================
          THEME TOGGLE
          ===================================================== */}

      <button
        onClick={toggleTheme}
        className="
          absolute
          top-6
          right-6
          p-2.5
          rounded-xl
          glass
          text-gray-700
          dark:text-white
          hover:scale-110
          transition-transform
          z-10
        "
        aria-label="Toggle theme"
      >

        {isDark ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}

      </button>


      {/* =====================================================
          LOGIN CARD
          ===================================================== */}

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
        className="
          w-full
          max-w-md
          relative
          z-10
        "
      >

        <div className="glass-card p-8 md:p-10 shadow-2xl">


          {/* =================================================
              LOGO
              ================================================= */}

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
              className="
                w-16
                h-16
                rounded-2xl
                bg-gradient-to-r
                from-primary-500
                to-secondary-500
                flex
                items-center
                justify-center
                mx-auto
                mb-4
                shadow-glow
              "
            >

              <Sparkles
                className="text-white"
                size={28}
              />

            </motion.div>


            <h1 className="
              text-3xl
              font-bold
              text-gray-900
              dark:text-white
              mb-2
            ">
              Welcome Back
            </h1>


            <p className="
              text-gray-600
              dark:text-gray-300
            ">
              Login to your InterviewTwin account
            </p>

          </div>


          {/* =================================================
              ERROR
              ================================================= */}

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
              className="
                mb-6
                p-4
                bg-red-50
                dark:bg-red-900/20
                backdrop-blur-sm
                border
                border-red-200
                dark:border-red-400/30
                rounded-xl
                flex
                gap-3
              "
            >

              <AlertCircle
                className="
                  text-red-600
                  dark:text-red-300
                  flex-shrink-0
                "
                size={20}
              />

              <p className="
                text-red-700
                dark:text-red-100
                text-sm
              ">
                {error}
              </p>

            </motion.div>

          )}


          {/* =================================================
              LOGIN FORM
              ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* EMAIL */}

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.3,
              }}
            >

              <label className="
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
                mb-2
              ">
                Email Address
              </label>


              <div className="relative">

                <Mail
                  className="
                    absolute
                    left-3.5
                    top-3.5
                    text-gray-500
                    dark:text-gray-400
                  "
                  size={20}
                />


                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
                    rounded-xl
                    bg-white
                    dark:bg-gray-800
                    border
                    border-gray-200
                    dark:border-gray-700
                    text-gray-900
                    dark:text-white
                    placeholder-gray-400
                    dark:placeholder-gray-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary-400
                    focus:border-transparent
                    transition-all
                  "
                  required
                />

              </div>

            </motion.div>


            {/* PASSWORD */}

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.4,
              }}
            >

              <div className="
                flex
                items-center
                justify-between
                mb-2
              ">

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                ">
                  Password
                </label>


                <Link
                  to="/forgot-password"
                  className="
                    text-sm
                    font-semibold
                    text-primary-600
                    dark:text-primary-400
                    hover:underline
                    transition-colors
                  "
                >
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <Lock
                  className="
                    absolute
                    left-3.5
                    top-3.5
                    text-gray-500
                    dark:text-gray-400
                  "
                  size={20}
                />


                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="
                    w-full
                    pl-11
                    pr-12
                    py-3
                    rounded-xl
                    bg-white
                    dark:bg-gray-800
                    border
                    border-gray-200
                    dark:border-gray-700
                    text-gray-900
                    dark:text-white
                    placeholder-gray-400
                    dark:placeholder-gray-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary-400
                    focus:border-transparent
                    transition-all
                  "
                  required
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-3.5
                    top-3.5
                    text-gray-500
                    dark:text-gray-400
                    hover:text-gray-700
                    dark:hover:text-gray-200
                    transition-colors
                  "
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}

                </button>

              </div>

            </motion.div>


            {/* LOGIN BUTTON */}

            <motion.button
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
              }}
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={loading}
              className="
                w-full
                btn
                bg-white
                dark:bg-gray-800
                text-primary-700
                dark:text-primary-400
                py-3.5
                text-lg
                font-bold
                hover:bg-gray-50
                dark:hover:bg-gray-700
                hover:shadow-2xl
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-all
                border
                border-gray-200
                dark:border-gray-700
              "
            >

              {loading ? (

                <span className="
                  flex
                  items-center
                  justify-center
                  gap-2
                ">

                  <div className="
                    spinner
                    h-5
                    w-5
                    border-white/30
                    border-t-primary-700
                  " />

                  Logging in...

                </span>

              ) : (

                <span className="
                  flex
                  items-center
                  justify-center
                  gap-2
                ">

                  Login

                  <ArrowRight size={20} />

                </span>

              )}

            </motion.button>

          </form>


          {/* =================================================
              REGISTER
              ================================================= */}

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.6,
            }}
            className="
              text-center
              text-gray-600
              dark:text-gray-300
              mt-6
            "
          >

            Don't have an account?{' '}

            <Link
              to="/register"
              className="
                text-primary-600
                dark:text-primary-400
                font-semibold
                hover:underline
              "
            >
              Sign up
            </Link>

          </motion.p>

        </div>

      </motion.div>

    </div>
  );
}