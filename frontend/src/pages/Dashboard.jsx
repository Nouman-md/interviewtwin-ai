import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  performanceAPI,
  interviewAPI,
  resumeAPI,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

import {
  BarChart3,
  FileText,
  Brain,
  Code,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Target,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  Play,
  Flame,
  Trophy,
  ChevronRight,
  Activity,
} from 'lucide-react';


/* =========================================================
   ANIMATIONS
========================================================= */

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const fadeInLeft = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const fadeInRight = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const staggerContainer = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};


/* =========================================================
   HELPERS
========================================================= */

const getScore = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(0, Math.min(number, 100));
};


const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Needs Attention';
};


const getScoreColor = (score) => {
  if (score >= 80) {
    return 'text-emerald-400';
  }

  if (score >= 60) {
    return 'text-cyan-400';
  }

  if (score >= 40) {
    return 'text-amber-400';
  }

  return 'text-rose-400';
};


const formatDate = (date) => {
  if (!date) return '';

  try {
    return new Date(date).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};


/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [performance, setPerformance] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);


  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  useEffect(() => {
    loadDashboardData();
  }, []);


  const loadDashboardData = async () => {
    const debug = {
      performance: null,
      sessions: null,
      resumes: null,
      errors: [],
    };

    try {
      const [
        perfRes,
        sessionsRes,
        resumesRes,
      ] = await Promise.allSettled([
        performanceAPI.getPerformance(),
        interviewAPI.getUserSessions(),
        resumeAPI.getResumes(),
      ]);


      /* PERFORMANCE */

      if (perfRes.status === 'fulfilled') {
        setPerformance(perfRes.value?.data || null);
        debug.performance = 'success';
      } else {
        console.error(
          'Failed to load performance data:',
          perfRes.reason
        );

        debug.performance =
          'failed: ' +
          (perfRes.reason?.message || perfRes.reason);

        debug.errors.push('Performance API failed');
      }


      /* INTERVIEWS */

      if (sessionsRes.status === 'fulfilled') {
        const sessionsData = sessionsRes.value?.data;

        setSessions(
          Array.isArray(sessionsData)
            ? sessionsData
            : []
        );

        debug.sessions = 'success';
      } else {
        console.error(
          'Failed to load sessions data:',
          sessionsRes.reason
        );

        debug.sessions =
          'failed: ' +
          (sessionsRes.reason?.message || sessionsRes.reason);

        debug.errors.push('Sessions API failed');

        setSessions([]);
      }


      /* RESUMES */

      if (resumesRes.status === 'fulfilled') {
        const resumesData = resumesRes.value?.data;

        setResumes(
          Array.isArray(resumesData)
            ? resumesData
            : []
        );

        debug.resumes = 'success';
      } else {
        console.error(
          'Failed to load resumes data:',
          resumesRes.reason
        );

        debug.resumes =
          'failed: ' +
          (resumesRes.reason?.message || resumesRes.reason);

        debug.errors.push('Resumes API failed');

        setResumes([]);
      }


      setDebugInfo(debug);


      if (debug.errors.length === 3) {
        setError(
          'Unable to connect to server. Please ensure the backend is running.'
        );
      }

    } catch (err) {
      console.error(
        'Failed to load dashboard data:',
        err
      );

      setError(
        'Failed to load dashboard data. Please try again.'
      );

      setDebugInfo(debug);

    } finally {
      setLoading(false);
    }
  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">

          <div className="relative w-14 h-14 mx-auto">

            <div className="absolute inset-0 rounded-full border-4 border-primary-500/20" />

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" />

          </div>

          <p className="mt-5 text-gray-600 dark:text-gray-400">
            Preparing your dashboard...
          </p>

        </div>
      </div>
    );
  }


  /* =======================================================
     AUTH CHECK
  ======================================================= */

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">

        <div className="text-center">

          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view your dashboard
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     SCORES
  ======================================================= */

  const atsScore = getScore(
    performance?.atsScore
  );

  const technicalScore = getScore(
    performance?.technicalScore
  );

  const hrScore = getScore(
    performance?.hrScore
  );

  const codingScore = getScore(
    performance?.codingScore
  );

  const communicationScore = getScore(
    performance?.communicationScore
  );

  const overallScore = getScore(
    performance?.overallPlacementReadiness
  );


  const scoreCards = [
    {
      title: 'ATS Score',
      score: atsScore,
      icon: FileText,
      iconClass:
        'text-blue-400 bg-blue-500/10 border-blue-400/10',
    },

    {
      title: 'Technical',
      score: technicalScore,
      icon: Code,
      iconClass:
        'text-emerald-400 bg-emerald-500/10 border-emerald-400/10',
    },

    {
      title: 'HR',
      score: hrScore,
      icon: Brain,
      iconClass:
        'text-purple-400 bg-purple-500/10 border-purple-400/10',
    },

    {
      title: 'Coding',
      score: codingScore,
      icon: Zap,
      iconClass:
        'text-pink-400 bg-pink-500/10 border-pink-400/10',
    },

    {
      title: 'Communication',
      score: communicationScore,
      icon: Activity,
      iconClass:
        'text-orange-400 bg-orange-500/10 border-orange-400/10',
    },
  ];


  /* =======================================================
     STRONGEST / WEAKEST
  ======================================================= */

  const strongestArea =
    scoreCards.reduce(
      (best, item) =>
        item.score > best.score
          ? item
          : best,
      scoreCards[0]
    );

  const focusArea =
    scoreCards.reduce(
      (weakest, item) =>
        item.score < weakest.score
          ? item
          : weakest,
      scoreCards[0]
    );


  /* =======================================================
     QUICK ACTIONS
  ======================================================= */

  const quickActions = [
    {
      title: 'Upload Resume',
      description:
        'Upload or update your resume',
      icon: Upload,
      path: '/resume-upload',
      gradient:
        'from-cyan-500 to-blue-600',
      glow:
        'group-hover:shadow-cyan-500/20',
      accent:
        'text-cyan-400',
    },

    {
      title: 'Practice Interview',
      description:
        'Start a realistic mock interview',
      icon: Brain,
      path: '/interview-selection',
      gradient:
        'from-violet-500 to-purple-600',
      glow:
        'group-hover:shadow-purple-500/20',
      accent:
        'text-purple-400',
    },

    {
      title: 'Coding Practice',
      description:
        'Solve coding challenges',
      icon: Code,
      path: '/coding-round',
      gradient:
        'from-emerald-500 to-teal-600',
      glow:
        'group-hover:shadow-emerald-500/20',
      accent:
        'text-emerald-400',
    },

    {
      title: 'View Analytics',
      description:
        'Track your preparation progress',
      icon: BarChart3,
      path: '/performance',
      gradient:
        'from-orange-500 to-pink-600',
      glow:
        'group-hover:shadow-orange-500/20',
      accent:
        'text-orange-400',
    },
  ];


  /* =======================================================
     RECENT DATA
  ======================================================= */

  const recentSessions =
    sessions.slice(0, 5);

  const recentResumes =
    resumes.slice(0, 3);


  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
<div className="w-full max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 pb-12">

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4"
        >

          <div className="flex items-start gap-3">

            <AlertCircle
              className="text-red-400 mt-0.5"
              size={20}
            />

            <div className="flex-1">

              <p className="text-sm font-medium text-red-300">
                {error}
              </p>

              {debugInfo && (
                <details className="mt-2">

                  <summary className="text-xs text-red-400 cursor-pointer">
                    Show Debug Info
                  </summary>

                  <pre className="mt-2 text-xs bg-black/20 p-3 rounded-xl overflow-auto">
                    {JSON.stringify(
                      debugInfo,
                      null,
                      2
                    )}
                  </pre>

                </details>
              )}

            </div>

          </div>

        </motion.div>
      )}


      {/* =====================================================
          WELCOME HEADER
      ===================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative overflow-hidden rounded-[28px] mb-8"
      >

        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />

        <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-purple-300/10 blur-3xl" />

        <div className="absolute top-10 right-1/3 w-32 h-32 rounded-full bg-white/5 blur-2xl" />


        <div className="relative z-10 p-7 md:p-9 lg:p-10">

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">


            {/* LEFT */}

            <div>

              <div className="flex items-center gap-2 mb-4">

                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 border border-white/10">

                  <Sparkles
                    size={16}
                    className="text-cyan-200"
                  />

                </div>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  InterviewTwin
                </span>

              </div>


              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Welcome back,{' '}
                {user?.firstName || 'User'}! 👋
              </h1>


              <p className="mt-3 max-w-2xl text-sm md:text-base text-white/70 leading-relaxed">
                Your personalized interview preparation hub.
                Keep practicing, track your progress, and get
                closer to placement readiness.
              </p>


              <div className="flex flex-wrap gap-3 mt-7">

                <button
                  onClick={() =>
                    navigate('/interview-selection')
                  }
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-all"
                >

                  <Play
                    size={17}
                    fill="currentColor"
                  />

                  Start New Interview

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />

                </button>


                <button
                  onClick={() =>
                    navigate('/performance')
                  }
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition-all"
                >

                  <BarChart3 size={17} />

                  View Progress

                </button>

              </div>

            </div>


            {/* READINESS */}

            <div className="flex justify-center lg:justify-end">

              <div className="relative w-40 h-40 md:w-48 md:h-48">

                <svg
                  className="absolute inset-0 w-full h-full -rotate-90"
                  viewBox="0 0 120 120"
                >

                  <circle
                    cx="60"
                    cy="60"
                    r="49"
                    fill="none"
                    stroke="rgba(255,255,255,0.16)"
                    strokeWidth="8"
                  />

                  <motion.circle
                    cx="60"
                    cy="60"
                    r="49"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={307.88}
                    initial={{
                      strokeDashoffset: 307.88,
                    }}
                    animate={{
                      strokeDashoffset:
                        307.88 -
                        (307.88 * overallScore) /
                          100,
                    }}
                    transition={{
                      duration: 1.2,
                      ease: 'easeOut',
                    }}
                  />

                </svg>


                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">

                  <Award
                    size={20}
                    className="text-white/70 mb-1"
                  />

                  <span className="text-3xl md:text-4xl font-black">
                    {overallScore.toFixed(1)}
                  </span>

                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                    Readiness
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* STATUS STRIP */}

          <div className="grid sm:grid-cols-3 gap-3 mt-8">

            <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">

              <p className="text-xs text-white/50 uppercase tracking-wider">
                Overall Status
              </p>

              <p className="mt-1 font-bold text-white">
                {getScoreLabel(overallScore)}
              </p>

            </div>


            <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">

              <p className="text-xs text-white/50 uppercase tracking-wider">
                Strongest Area
              </p>

              <p className="mt-1 font-bold text-white">
                {strongestArea.title}
              </p>

            </div>


            <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">

              <p className="text-xs text-white/50 uppercase tracking-wider">
                Focus Area
              </p>

              <p className="mt-1 font-bold text-white">
                {focusArea.title}
              </p>

            </div>

          </div>

        </div>

      </motion.section>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-9"
      >

        <div className="flex items-end justify-between mb-5">

          <div>

            <div className="flex items-center gap-2">

              <Zap
                size={19}
                className="text-cyan-400"
              />

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h2>

            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Jump straight into your preparation
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {quickActions.map(
            (action, index) => {

              const Icon = action.icon;

              return (
                <motion.button
                  key={action.title}
                  variants={fadeInUp}
                  whileHover={{
                    y: -6,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() =>
                    navigate(action.path)
                  }
                  className={`group relative overflow-hidden text-left rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 p-6 shadow-sm hover:shadow-xl ${action.glow} transition-all duration-300`}
                >

                  {/* top accent */}

                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient}`}
                  />


                  <div className="flex items-start justify-between">

                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                    >

                      <Icon
                        size={26}
                        className="text-white"
                      />

                    </div>


                    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center">

                      <ArrowUpRight
                        size={17}
                        className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />

                    </div>

                  </div>


                  <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>


                  <div
                    className={`mt-5 flex items-center gap-1 text-sm font-semibold ${action.accent}`}
                  >

                    Get started

                    <ChevronRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />

                  </div>

                </motion.button>
              );
            }
          )}

        </div>

      </motion.section>


      {/* =====================================================
          PERFORMANCE SNAPSHOT
      ===================================================== */}

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-9"
      >

        <div className="flex items-end justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance Snapshot
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              A quick look at your interview preparation
            </p>

          </div>


          <button
            onClick={() =>
              navigate('/performance')
            }
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-400"
          >
            Full analytics
            <ArrowRight size={15} />
          </button>

        </div>


        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

          {scoreCards.map(
            (item) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.iconClass}`}
                    >

                      <Icon size={19} />

                    </div>


                    <span
                      className={`text-xs font-bold ${getScoreColor(item.score)}`}
                    >
                      {getScoreLabel(item.score)}
                    </span>

                  </div>


                  <p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>


                  <div className="flex items-end gap-1 mt-1">

                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {item.score.toFixed(0)}
                    </span>

                    <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      /100
                    </span>

                  </div>


                  <div className="mt-4 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${item.score}%`,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                    />

                  </div>

                </motion.div>
              );
            }
          )}

        </div>

      </motion.section>


      {/* =====================================================
          RECOMMENDED NEXT STEP
      ===================================================== */}

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-9"
      >

        <div className="relative overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 p-6">

          <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">

                <Target
                  size={22}
                  className="text-white"
                />

              </div>


              <div>

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={15}
                    className="text-purple-400"
                  />

                  <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Recommended Next Step
                  </p>

                </div>


                <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  Practice {focusArea.title}
                </h3>


                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xl">

                  {focusArea.score === 0
                    ? `You haven't built a score for ${focusArea.title} yet. Start practicing to build your performance.`
                    : `Your ${focusArea.title} score is ${focusArea.score.toFixed(0)}. Improving this area can strengthen your overall readiness.`
                  }

                </p>

              </div>

            </div>


            <button
              onClick={() => {
                if (
                  focusArea.title ===
                  'Coding'
                ) {
                  navigate('/coding-round');
                } else if (
                  focusArea.title ===
                  'ATS Score'
                ) {
                  navigate('/ats-checker');
                } else {
                  navigate('/interview-selection');
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:-translate-y-0.5 transition-all flex-shrink-0"
            >

              Start Practice

              <ArrowRight size={16} />

            </button>

          </div>

        </div>

      </motion.section>


      {/* =====================================================
          LOWER GRID
      ===================================================== */}

      <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-6">


        {/* ===================================================
            RECENT INTERVIEWS
        =================================================== */}

        <motion.section
          variants={fadeInLeft}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 overflow-hidden"
        >

          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700/70">

            <div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Interviews
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your latest practice sessions
              </p>

            </div>


            <button
              onClick={() =>
                navigate('/reports')
              }
              className="flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-400"
            >
              View All
              <ArrowRight size={15} />
            </button>

          </div>


          {recentSessions.length > 0 ? (

            <div className="p-4">

              {recentSessions.map(
                (session, index) => {

                  const completed =
                    session.status ===
                    'COMPLETED';

                  return (
                    <motion.div
                      key={
                        session.sessionId ||
                        index
                      }
                      whileHover={{
                        x: 3,
                      }}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all"
                    >

                      <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/10 flex items-center justify-center flex-shrink-0">

                        <Brain
                          size={20}
                          className="text-purple-400"
                        />

                      </div>


                      <div className="min-w-0 flex-1">

                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {session.sessionTitle ||
                            'Interview Session'}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-1">

                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Score:{' '}
                            {session.overallScore !==
                            undefined &&
                            session.overallScore !==
                            null
                              ? Number(
                                  session.overallScore
                                ).toFixed(1)
                              : 'N/A'}
                          </span>

                          {session.createdAt && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">
                                •
                              </span>

                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(
                                  session.createdAt
                                )}
                              </span>
                            </>
                          )}

                        </div>

                      </div>


                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 ${
                          completed
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >

                        {completed ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}

                        {completed
                          ? 'Completed'
                          : 'In Progress'}

                      </span>

                    </motion.div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="p-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center">

                <Brain
                  size={27}
                  className="text-purple-400"
                />

              </div>

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                No interviews yet
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start your first mock interview.
              </p>

              <button
                onClick={() =>
                  navigate(
                    '/interview-selection'
                  )
                }
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
              >
                Start Interview
                <ArrowRight size={15} />
              </button>

            </div>

          )}

        </motion.section>


        {/* ===================================================
            RESUMES
        =================================================== */}

        <motion.section
          variants={fadeInRight}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 overflow-hidden"
        >

          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700/70">

            <div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Resume
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your preparation resume
              </p>

            </div>


            <button
              onClick={() =>
                navigate('/resume-upload')
              }
              className="flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-400"
            >
              Upload New
              <Upload size={15} />
            </button>

          </div>


          {recentResumes.length > 0 ? (

            <div className="p-4">

              {recentResumes.map(
                (resume, index) => (

                  <motion.div
                    key={
                      resume.resumeId ||
                      index
                    }
                    whileHover={{
                      y: -2,
                    }}
                    className="p-4 mb-3 last:mb-0 rounded-xl border border-gray-200 dark:border-gray-700/70 bg-gray-50/80 dark:bg-gray-700/30"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">

                        <FileText
                          size={21}
                          className="text-cyan-400"
                        />

                      </div>


                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">

                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {resume.fileName}
                          </p>

                          {resume.isPrimary && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold flex-shrink-0">
                              PRIMARY
                            </span>
                          )}

                        </div>


                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(
                            resume.uploadedAt
                          )}
                        </p>

                      </div>


                      <button
                        onClick={() =>
                          navigate(
                            '/ats-checker'
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors flex-shrink-0"
                      >
                        Analyze
                      </button>

                    </div>

                  </motion.div>

                )
              )}

            </div>

          ) : (

            <div className="p-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 flex items-center justify-center">

                <FileText
                  size={27}
                  className="text-cyan-400"
                />

              </div>

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                No resume uploaded
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload your resume to unlock ATS analysis.
              </p>

              <button
                onClick={() =>
                  navigate('/resume-upload')
                }
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
              >
                <Upload size={15} />
                Upload Resume
              </button>

            </div>

          )}

        </motion.section>

      </div>


      {/* =====================================================
          PRODUCTIVITY STRIP
      ===================================================== */}

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">

              <Flame
                size={20}
                className="text-orange-400"
              />

            </div>

            <div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Interviews Completed
              </p>

              <p className="text-xl font-black text-gray-900 dark:text-white">
                {sessions.filter(
                  (session) =>
                    session.status ===
                    'COMPLETED'
                ).length}
              </p>

            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

              <Trophy
                size={20}
                className="text-emerald-400"
              />

            </div>

            <div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Strongest Category
              </p>

              <p className="text-xl font-black text-gray-900 dark:text-white">
                {strongestArea.title}
              </p>

            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/90 p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">

              <Target
                size={20}
                className="text-rose-400"
              />

            </div>

            <div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Focus Category
              </p>

              <p className="text-xl font-black text-gray-900 dark:text-white">
                {focusArea.title}
              </p>

            </div>

          </div>

        </div>

      </motion.section>

    </div>
  );
}