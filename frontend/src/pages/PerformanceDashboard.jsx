import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { performanceAPI } from '../services/api';

import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  FileText,
  Code,
  Brain,
  MessageSquare,
  Target,
  Award,
  Zap,
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';

import { Bar, Radar, Doughnut } from 'react-chartjs-2';


/* =====================================================
   CHART.JS REGISTRATION
===================================================== */

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);


/* =====================================================
   ANIMATIONS
===================================================== */

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


/* =====================================================
   COMPONENT
===================================================== */

export default function PerformanceDashboard() {

  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  /* ===================================================
     LOAD PERFORMANCE DATA
  ==================================================== */

  useEffect(() => {
    loadPerformance();
  }, []);


  const loadPerformance = async () => {

    try {

      const response =
        await performanceAPI.getPerformance();

      setPerformance(response.data);

    } catch (err) {

      console.error(
        'Failed to load performance:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Failed to load performance data'
      );

    } finally {

      setLoading(false);

    }
  };


  /* ===================================================
     LOADING
  ==================================================== */

  if (loading) {

    return (
      <div className="flex items-center justify-center h-96">

        <div className="text-center">

          <div className="spinner h-12 w-12 mx-auto"></div>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading performance data...
          </p>

        </div>

      </div>
    );
  }


  /* ===================================================
     EMPTY STATE
  ==================================================== */

  if (!performance) {

    return (
      <div className="max-w-7xl mx-auto">

        <div className="card text-center py-16">

          <div className="empty-state-icon mx-auto mb-4">

            <BarChart3 size={32} />

          </div>

          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No performance data available yet
          </p>

          <p className="text-sm text-gray-400 dark:text-gray-500">
            Complete some interviews or coding challenges
            to see your stats
          </p>

        </div>

      </div>
    );
  }


  /* =====================================================
     SCORES
  ====================================================== */

  const scores = [
    Number(performance.atsScore || 0),
    Number(performance.technicalScore || 0),
    Number(performance.hrScore || 0),
    Number(performance.codingScore || 0),
    Number(performance.communicationScore || 0),
  ];


  /* =====================================================
     INTERVIEW COUNT
  ====================================================== */

  const totalInterviews =
    Number(performance.totalInterviews || 0);

  /*
     This is only used as a visual progress target.
     It does NOT change your actual interview count.
  */

  const interviewTarget = 10;

  const interviewProgress =
    Math.min(
      (totalInterviews / interviewTarget) * 100,
      100
    );


  /* =====================================================
     CODING COUNT
  ====================================================== */

  const totalCodingProblems =
    Number(
      performance.totalCodingProblems || 0
    );

  const codingProgress =
    Math.min(
      totalCodingProblems * 10,
      100
    );


  /* =====================================================
     OVERALL SCORE
  ====================================================== */

  const overallScore =
    performance.overallPlacementReadiness
      ? Number(
          performance.overallPlacementReadiness
        )
      : 0;


  /* =====================================================
     WEAK AREAS
  ====================================================== */

  let weakAreasCount = 0;

  try {

    if (performance.weakTopics) {

      if (
        typeof performance.weakTopics ===
        'string'
      ) {

        const parsed =
          JSON.parse(
            performance.weakTopics
          );

        weakAreasCount =
          Object.keys(parsed).length;

      } else {

        weakAreasCount =
          Object.keys(
            performance.weakTopics
          ).length;

      }

    }

  } catch (err) {

    console.warn(
      'Unable to parse weak topics:',
      err
    );

    weakAreasCount = 0;
  }


  /* =====================================================
     SCORE CARDS
  ====================================================== */

  const scoreCards = [

    {
      title: 'ATS Score',
      score: performance.atsScore,
      icon: FileText,

      gradient:
        'from-blue-500 to-cyan-600',

      bg:
        'bg-blue-500/15',

      border:
        'border-blue-400/20',

      accent:
        'text-blue-400',

      progress:
        'from-blue-500 to-cyan-500',
    },

    {
      title: 'Technical',
      score: performance.technicalScore,
      icon: Code,

      gradient:
        'from-emerald-500 to-teal-600',

      bg:
        'bg-emerald-500/15',

      border:
        'border-emerald-400/20',

      accent:
        'text-emerald-400',

      progress:
        'from-emerald-500 to-teal-500',
    },

    {
      title: 'HR',
      score: performance.hrScore,
      icon: Brain,

      gradient:
        'from-purple-500 to-violet-600',

      bg:
        'bg-purple-500/15',

      border:
        'border-purple-400/20',

      accent:
        'text-purple-400',

      progress:
        'from-purple-500 to-violet-500',
    },

    {
      title: 'Coding',
      score: performance.codingScore,
      icon: Zap,

      gradient:
        'from-rose-500 to-pink-600',

      bg:
        'bg-rose-500/15',

      border:
        'border-rose-400/20',

      accent:
        'text-rose-400',

      progress:
        'from-rose-500 to-pink-500',
    },

    {
      title: 'Communication',
      score:
        performance.communicationScore,

      icon: MessageSquare,

      gradient:
        'from-amber-500 to-orange-600',

      bg:
        'bg-amber-500/15',

      border:
        'border-amber-400/20',

      accent:
        'text-amber-400',

      progress:
        'from-amber-500 to-orange-500',
    },

  ];


  /* =====================================================
     RADAR DATA
  ====================================================== */

  const radarData = {

    labels: [
      'ATS',
      'Technical',
      'HR',
      'Coding',
      'Communication',
    ],

    datasets: [

      {
        label: 'Your Score',

        data: scores,

        borderColor:
          '#22c7f2',

        backgroundColor:
          'rgba(34, 199, 242, 0.13)',

        borderWidth: 2.5,

        pointBackgroundColor:
          '#22c7f2',

        pointBorderColor:
          '#ffffff',

        pointBorderWidth: 2,

        pointRadius: 4,

        pointHoverRadius: 6,
      },

    ],
  };


  /* =====================================================
     DOUGHNUT DATA
  ====================================================== */

  const completedInterviews =
    totalInterviews;

  const remainingInterviews =
    Math.max(
      0,
      interviewTarget -
      completedInterviews
    );


  const doughnutData = {

    labels: [
      'Completed',
      'Remaining',
    ],

    datasets: [

      {
        data: [
          completedInterviews,
          remainingInterviews,
        ],

        backgroundColor: [
          '#22c7f2',
          'rgba(100,116,139,0.28)',
        ],

        borderWidth: 0,

        hoverOffset: 5,

        spacing: 3,
      },

    ],
  };


  /* =====================================================
     BAR DATA
  ====================================================== */

  const barData = {

    labels: [
      'ATS',
      'Technical',
      'HR',
      'Coding',
      'Communication',
    ],

    datasets: [

      {
        label: 'Score',

        data: scores,

        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b',
        ],

        borderRadius: 10,

        borderSkipped: false,

        maxBarThickness: 60,
      },

    ],
  };


  /* =====================================================
     RADAR OPTIONS
  ====================================================== */

  const radarOptions = {

    responsive: true,

    maintainAspectRatio: false,

    resizeDelay: 100,

    animation: {
      duration: 800,
    },

    layout: {
      padding: {
        top: 10,
        right: 18,
        bottom: 10,
        left: 18,
      },
    },

    scales: {

      r: {

        min: 0,

        max: 100,

        beginAtZero: true,

        ticks: {

          stepSize: 20,

          color:
            'rgba(148, 163, 184, 0.65)',

          backdropColor:
            'transparent',

          font: {
            size: 9,
          },

          padding: 4,
        },

        grid: {

          color:
            'rgba(148, 163, 184, 0.11)',
        },

        angleLines: {

          color:
            'rgba(148, 163, 184, 0.11)',
        },

        pointLabels: {

          color:
            '#94a3b8',

          font: {

            size: 11,

            weight: '600',
          },

          padding: 7,
        },
      },

    },

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        backgroundColor:
          '#111827',

        titleColor:
          '#ffffff',

        bodyColor:
          '#d1d5db',

        padding: 12,

        cornerRadius: 10,

        displayColors: false,

        callbacks: {

          label:
            function (context) {

              return ` Score: ${context.raw}/100`;

            },

        },

      },

    },

  };


  /* =====================================================
     DOUGHNUT OPTIONS
  ====================================================== */

  const doughnutOptions = {

    responsive: true,

    maintainAspectRatio: false,

    resizeDelay: 100,

    cutout: '74%',

    animation: {
      duration: 800,
    },

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        backgroundColor:
          '#111827',

        padding: 10,

        cornerRadius: 8,

        callbacks: {

          label:
            function (context) {

              return ` ${context.label}: ${context.raw}`;

            },

        },

      },

    },

  };


  /* =====================================================
     BAR OPTIONS
  ====================================================== */

  const barOptions = {

    responsive: true,

    maintainAspectRatio: false,

    resizeDelay: 100,

    animation: {
      duration: 800,
    },

    scales: {

      y: {

        min: 0,

        max: 100,

        ticks: {

          stepSize: 20,

          color:
            'rgba(148, 163, 184, 0.7)',

          font: {
            size: 11,
          },

        },

        grid: {

          color:
            'rgba(148, 163, 184, 0.10)',
        },

        border: {
          display: false,
        },

      },

      x: {

        ticks: {

          color:
            'rgba(148, 163, 184, 0.8)',

          font: {

            size: 11,

            weight: '600',
          },

          maxRotation: 0,

          minRotation: 0,

          autoSkip: false,
        },

        grid: {
          display: false,
        },

        border: {
          display: false,
        },

      },

    },

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        backgroundColor:
          '#111827',

        titleColor:
          '#ffffff',

        bodyColor:
          '#d1d5db',

        padding: 12,

        cornerRadius: 10,

        displayColors: false,

        callbacks: {

          label:
            function (context) {

              return ` Score: ${context.raw}/100`;

            },

        },

      },

    },

  };


  /* =====================================================
     RETURN
  ====================================================== */

  return (

    <div className="w-full max-w-[1500px] mx-auto min-w-0 px-4 md:px-6">


      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: -20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="mb-8"

      >

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">

          Performance Dashboard

        </h1>

        <p className="text-gray-600 dark:text-gray-400">

          Track your progress across all interview categories

        </p>

      </motion.div>


      {/* =================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex gap-3">

          <AlertCircle
            className="text-red-600 dark:text-red-400 flex-shrink-0"
            size={20}
          />

          <p className="text-red-700 dark:text-red-300 text-sm">
            {error}
          </p>

        </div>

      )}


      {/* =================================================
          PLACEMENT READINESS
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.6,
        }}

        className="
          relative
          overflow-hidden
          rounded-3xl
          mb-8
          p-6
          md:p-8
          bg-gradient-to-br
          from-blue-600
          via-indigo-600
          to-purple-700
          text-white
          shadow-2xl
        "

      >

        <div
          className="
            absolute
            -top-24
            -right-24
            w-72
            h-72
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-28
            left-1/3
            w-64
            h-64
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />


        <div
          className="
            relative
            z-10
            grid
            lg:grid-cols-[1fr_auto]
            gap-8
            items-center
          "
        >

          <div>

            <div className="flex items-center gap-2 mb-3">

              <div
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-cyan-300
                  shadow-lg
                  shadow-cyan-300/50
                "
              />

              <span
                className="
                  text-xs
                  md:text-sm
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/70
                "
              >
                Placement Readiness
              </span>

            </div>


            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-end
                gap-2
                sm:gap-4
                mb-3
              "
            >

              <h2
                className="
                  text-5xl
                  md:text-6xl
                  font-black
                  tracking-tight
                "
              >
                {overallScore.toFixed(1)}
              </h2>


              <div className="pb-1">

                <span className="text-lg font-semibold text-white/80">
                  / 100
                </span>

                <p className="text-xs text-white/60 mt-0.5">
                  Overall score
                </p>

              </div>

            </div>


            <h3 className="text-xl md:text-2xl font-bold mb-2">

              {overallScore >= 80

                ? "You're interview ready! 🎉"

                : overallScore >= 60

                ? "You're on the right track!"

                : "Let's strengthen your fundamentals!"

              }

            </h3>


            <p
              className="
                max-w-2xl
                text-sm
                md:text-base
                leading-relaxed
                text-white/75
              "
            >

              {overallScore >= 80

                ? "Your preparation is looking strong. Keep practicing to maintain your edge."

                : overallScore >= 60

                ? "Your fundamentals are looking good. Focus on your weaker categories to push your score higher."

                : "Build consistency across your interview categories and focus on the areas that need the most improvement."

              }

            </p>


            {/* Readiness progress */}

            <div className="mt-7 max-w-2xl">

              <div className="flex items-center justify-between mb-2">

                <span className="text-xs md:text-sm font-medium text-white/70">
                  Current readiness
                </span>

                <span className="text-xs md:text-sm font-bold text-white">
                  {overallScore.toFixed(1)}%
                </span>

              </div>


              <div
                className="
                  h-3
                  rounded-full
                  bg-white/15
                  border
                  border-white/10
                  overflow-hidden
                  backdrop-blur-sm
                "
              >

                <motion.div

                  initial={{
                    width: 0,
                  }}

                  animate={{
                    width:
                      `${Math.min(
                        overallScore,
                        100
                      )}%`,
                  }}

                  transition={{
                    duration: 1.1,
                    ease: "easeOut",
                  }}

                  className="
                    h-full
                    rounded-full
                    bg-white
                    shadow-lg
                  "

                />

              </div>


              <div
                className="
                  flex
                  justify-between
                  mt-2
                  text-[10px]
                  text-white/45
                "
              >

                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>

              </div>

            </div>

          </div>


          {/* Readiness Circle */}

          <div className="flex justify-center lg:justify-end">

            <div
              className="
                relative
                w-40
                h-40
                md:w-48
                md:h-48
              "
            >

              <svg
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  -rotate-90
                "
                viewBox="0 0 120 120"
              >

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="8"
                />


                <motion.circle

                  cx="60"
                  cy="60"
                  r="50"

                  fill="none"

                  stroke="white"

                  strokeWidth="8"

                  strokeLinecap="round"

                  strokeDasharray={314.16}

                  initial={{
                    strokeDashoffset:
                      314.16,
                  }}

                  animate={{
                    strokeDashoffset:
                      314.16 -
                      (
                        314.16 *
                        Math.min(
                          overallScore,
                          100
                        )
                      ) /
                      100,
                  }}

                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}

                />

              </svg>


              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >

                <Award
                  size={22}
                  className="text-white/80 mb-1"
                />

                <span
                  className="
                    text-3xl
                    md:text-4xl
                    font-black
                  "
                >
                  {overallScore.toFixed(1)}
                </span>

                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-widest
                    text-white/60
                    mt-1
                  "
                >
                  Readiness
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* Strongest / Focus */}

        <div
          className="
            relative
            z-10
            grid
            sm:grid-cols-2
            gap-4
            mt-7
          "
        >

          {/* Strongest */}

          <div
            className="
              rounded-2xl
              border
              border-white/15
              bg-white/10
              backdrop-blur-sm
              p-4
              hover:bg-white/15
              transition-colors
            "
          >

            <div className="flex items-center gap-2 mb-2">

              <div
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-emerald-400/15
                  flex
                  items-center
                  justify-center
                "
              >

                <TrendingUp
                  size={16}
                  className="text-emerald-300"
                />

              </div>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-white/60
                "
              >
                Strongest Area
              </span>

            </div>


            <div
              className="
                flex
                items-end
                justify-between
                gap-3
              "
            >

              <div>

                <p className="text-lg font-bold">

                  {scoreCards.reduce(
                    (best, item) =>
                      Number(item.score || 0) >
                      Number(best.score || 0)
                        ? item
                        : best,
                    scoreCards[0]
                  ).title.replace(
                    " Score",
                    ""
                  )}

                </p>

                <p className="text-xs text-white/55 mt-0.5">
                  Your highest performing category
                </p>

              </div>


              <span className="text-lg font-black text-emerald-300">

                {Math.max(
                  ...scores
                ).toFixed(0)}

              </span>

            </div>

          </div>


          {/* Focus */}

          <div
            className="
              rounded-2xl
              border
              border-white/15
              bg-white/10
              backdrop-blur-sm
              p-4
              hover:bg-white/15
              transition-colors
            "
          >

            <div className="flex items-center gap-2 mb-2">

              <div
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-amber-400/15
                  flex
                  items-center
                  justify-center
                "
              >

                <Target
                  size={16}
                  className="text-amber-300"
                />

              </div>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-white/60
                "
              >
                Focus Area
              </span>

            </div>


            <div
              className="
                flex
                items-end
                justify-between
                gap-3
              "
            >

              <div>

                <p className="text-lg font-bold">

                  {scoreCards.reduce(
                    (weakest, item) =>
                      Number(item.score || 0) <
                      Number(weakest.score || 0)
                        ? item
                        : weakest,
                    scoreCards[0]
                  ).title.replace(
                    " Score",
                    ""
                  )}

                </p>

                <p className="text-xs text-white/55 mt-0.5">
                  The category needing most attention
                </p>

              </div>


              <span className="text-lg font-black text-amber-300">

                {Math.min(
                  ...scores
                ).toFixed(0)}

              </span>

            </div>

          </div>

        </div>

      </motion.div>


      {/* =================================================
          TOP SCORE CARDS
      ================================================== */}

      <motion.div

        variants={staggerContainer}

        initial="hidden"

        animate="visible"

        className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          gap-4
          mb-8
        "

      >

        {scoreCards.map(
          (card, idx) => {

            const score =
              card.score
                ? Number(card.score)
                : 0;

            return (

              <motion.div

                key={idx}

                variants={fadeInUp}

                whileHover={{
                  y: -5,
                }}

                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  ${card.border}
                  bg-[#253246]
                  hover:bg-[#2a384d]
                  p-5
                  shadow-lg
                  shadow-black/10
                  hover:shadow-xl
                  transition-all
                  duration-300
                `}

              >

                {/* Top accent */}

                <div
                  className={`
                    absolute
                    top-0
                    left-0
                    right-0
                    h-1
                    bg-gradient-to-r
                    ${card.gradient}
                  `}
                />


                {/* Background glow */}

                <div
                  className={`
                    absolute
                    -right-10
                    -top-10
                    w-28
                    h-28
                    rounded-full
                    blur-3xl
                    opacity-10
                    bg-gradient-to-r
                    ${card.gradient}
                  `}
                />


                <div className="relative z-10">

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      mb-4
                    "
                  >

                    <div
                      className={`
                        p-2.5
                        rounded-xl
                        ${card.bg}
                      `}
                    >

                      <div
                        className={`
                          w-9
                          h-9
                          rounded-lg
                          bg-gradient-to-r
                          ${card.gradient}
                          flex
                          items-center
                          justify-center
                          shadow-lg
                        `}
                      >

                        <card.icon
                          className="text-white"
                          size={19}
                        />

                      </div>

                    </div>


                    <div
                      className={`
                        w-2
                        h-2
                        rounded-full
                        ${card.accent.replace(
                          'text-',
                          'bg-'
                        )}
                        opacity-80
                      `}
                    />

                  </div>


                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-300
                      mb-1
                    "
                  >
                    {card.title}
                  </p>


                  <h3
                    className="
                      text-3xl
                      md:text-4xl
                      font-black
                      text-white
                    "
                  >
                    {score.toFixed(1)}
                  </h3>


                  <p
                    className="
                      text-xs
                      text-gray-400
                      mt-1
                    "
                  >

                    {score >= 80

                      ? '🟢 Excellent'

                      : score >= 60

                      ? '🟡 Good'

                      : '🔴 Needs Work'

                    }

                  </p>


                  {/* Progress */}

                  <div className="mt-5">

                    <div
                      className="
                        h-2
                        rounded-full
                        bg-slate-700/70
                        overflow-hidden
                      "
                    >

                      <motion.div

                        initial={{
                          width: 0,
                        }}

                        animate={{
                          width:
                            `${Math.min(
                              score,
                              100
                            )}%`,
                        }}

                        transition={{
                          duration: 0.9,
                          delay:
                            idx * 0.06,
                        }}

                        className={`
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          ${card.progress}
                        `}

                      />

                    </div>


                    <div
                      className="
                        flex
                        justify-between
                        mt-2
                      "
                    >

                      <span
                        className={`
                          text-xs
                          font-semibold
                          ${card.accent}
                        `}
                      >
                        {score.toFixed(0)}%
                      </span>

                      <span className="text-xs text-gray-500">
                        / 100
                      </span>

                    </div>

                  </div>

                </div>

              </motion.div>

            );

          }
        )}

      </motion.div>


      {/* =================================================
          CHARTS
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-12
          gap-5
          mb-8
          min-w-0
        "
      >


        {/* =================================================
            RADAR
        ================================================= */}

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
            duration: 0.5,
          }}

          className="
            xl:col-span-7
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            border-gray-700/80
            bg-[#202c3d]
            p-5
            shadow-lg
          "

        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-4
            "
          >

            <div>

              <h3
                className="
                  text-lg
                  font-bold
                  text-white
                "
              >
                Performance Overview
              </h3>

              <p
                className="
                  text-sm
                  text-gray-400
                  mt-1
                "
              >
                Compare your strengths across interview categories
              </p>

            </div>


            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                text-gray-400
              "
            >

              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-cyan-500
                "
              />

              Your Score

            </div>

          </div>


          <div
            className="
              relative
              w-full
              h-[330px]
              sm:h-[360px]
              lg:h-[390px]
              min-w-0
            "
          >

            <Radar
              data={radarData}
              options={radarOptions}
            />

          </div>

        </motion.div>


        {/* =================================================
            INTERVIEW PROGRESS
        ================================================== */}

        <motion.div

          initial={{
            opacity: 0,
            x: 20,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="
            xl:col-span-5
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            border-gray-700/80
            bg-[#202c3d]
            p-5
            shadow-lg
          "

        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >

            <div>

              <h3
                className="
                  text-lg
                  font-bold
                  text-white
                "
              >
                Interview Progress
              </h3>

              <p
                className="
                  text-sm
                  text-gray-400
                  mt-1
                "
              >
                Your completed interviews
              </p>

            </div>


            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-cyan-500/10
                flex
                items-center
                justify-center
              "
            >

              <TrendingUp
                size={19}
                className="text-cyan-400"
              />

            </div>

          </div>


          <div
            className="
              relative
              w-full
              h-[250px]
              sm:h-[280px]
              min-w-0
            "
          >

            <Doughnut
              data={doughnutData}
              options={doughnutOptions}
            />


            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                pointer-events-none
              "
            >

              <span
                className="
                  text-4xl
                  font-black
                  text-white
                "
              >
                {totalInterviews}
              </span>

              <span
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                Completed
              </span>

            </div>

          </div>


          {/* Progress */}

          <div className="mt-2">

            <div
              className="
                flex
                items-center
                justify-between
                mb-2
              "
            >

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                Interview journey
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  text-cyan-400
                "
              >
                {interviewProgress.toFixed(0)}%
              </span>

            </div>


            <div
              className="
                h-2
                rounded-full
                bg-slate-700/70
                overflow-hidden
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width:
                    `${interviewProgress}%`,
                }}

                transition={{
                  duration: 0.9,
                }}

                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-500
                "

              />

            </div>

          </div>


          {/* Legend */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-6
              mt-5
            "
          >

            <div className="flex items-center gap-2">

              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-cyan-500
                "
              />

              <span className="text-xs text-gray-400">
                Completed
              </span>

            </div>


            <div className="flex items-center gap-2">

              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-slate-500/40
                "
              />

              <span className="text-xs text-gray-400">
                Remaining
              </span>

            </div>

          </div>

        </motion.div>

      </div>


      {/* =================================================
          CATEGORY BAR CHART
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.5,
        }}

        className="
          min-w-0
          overflow-hidden
          rounded-2xl
          border
          border-gray-700/80
          bg-[#202c3d]
          p-5
          shadow-lg
          mb-8
        "

      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <div>

            <h3
              className="
                text-lg
                font-bold
                text-white
              "
            >
              Category Scores
            </h3>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              A quick comparison of your current performance
            </p>

          </div>


          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-blue-500/10
              flex
              items-center
              justify-center
            "
          >

            <BarChart3
              size={19}
              className="text-blue-400"
            />

          </div>

        </div>


        <div
          className="
            relative
            w-full
            h-[280px]
            sm:h-[320px]
            lg:h-[350px]
            min-w-0
          "
        >

          <Bar
            data={barData}
            options={barOptions}
          />

        </div>

      </motion.div>


      {/* =================================================
          PROGRESS CARDS
      ================================================== */}

      <motion.div

        variants={staggerContainer}

        initial="hidden"

        animate="visible"

        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
        "

      >


        {/* =================================================
            INTERVIEWS
        ================================================== */}

        <motion.div

          variants={fadeInUp}

          whileHover={{
            y: -5,
          }}

          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-gray-700/80
            bg-[#253246]
            p-6
            shadow-lg
            hover:shadow-xl
            transition-all
          "

        >

          <div
            className="
              absolute
              top-0
              left-0
              right-0
              h-1
              bg-gradient-to-r
              from-blue-500
              to-cyan-500
            "
          />


          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-blue-500/10
                flex
                items-center
                justify-center
              "
            >

              <Award
                size={23}
                className="text-blue-400"
              />

            </div>


            <TrendingUp
              size={18}
              className="
                text-gray-500
                group-hover:text-blue-400
                transition-colors
              "
            />

          </div>


          <div className="mt-5">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Interview Journey
            </p>

            <h4
              className="
                text-4xl
                font-black
                text-white
                mt-1
              "
            >
              {totalInterviews}
            </h4>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              Interviews Completed
            </p>

          </div>


          <div className="mt-5">

            <div
              className="
                flex
                justify-between
                text-xs
                mb-2
              "
            >

              <span className="text-gray-400">
                Progress
              </span>

              <span className="font-semibold text-blue-400">
                {interviewProgress.toFixed(0)}%
              </span>

            </div>


            <div
              className="
                h-2
                bg-slate-700/70
                rounded-full
                overflow-hidden
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width:
                    `${interviewProgress}%`,
                }}

                transition={{
                  duration: 0.8,
                }}

                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-blue-500
                  to-cyan-500
                "

              />

            </div>

          </div>

        </motion.div>


        {/* =================================================
            CODING
        ================================================== */}

        <motion.div

          variants={fadeInUp}

          whileHover={{
            y: -5,
          }}

          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-gray-700/80
            bg-[#253246]
            p-6
            shadow-lg
            hover:shadow-xl
            transition-all
          "

        >

          <div
            className="
              absolute
              top-0
              left-0
              right-0
              h-1
              bg-gradient-to-r
              from-emerald-500
              to-teal-500
            "
          />


          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-emerald-500/10
                flex
                items-center
                justify-center
              "
            >

              <Code
                size={23}
                className="text-emerald-400"
              />

            </div>


            <Zap
              size={18}
              className="
                text-gray-500
                group-hover:text-emerald-400
                transition-colors
              "
            />

          </div>


          <div className="mt-5">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Coding Practice
            </p>

            <h4
              className="
                text-4xl
                font-black
                text-white
                mt-1
              "
            >
              {totalCodingProblems}
            </h4>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              Coding Problems Solved
            </p>

          </div>


          <div className="mt-5">

            <div
              className="
                flex
                justify-between
                text-xs
                mb-2
              "
            >

              <span className="text-gray-400">
                Problems solved
              </span>

              <span className="font-semibold text-emerald-400">
                {totalCodingProblems}
              </span>

            </div>


            <div
              className="
                h-2
                bg-slate-700/70
                rounded-full
                overflow-hidden
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width:
                    `${codingProgress}%`,
                }}

                transition={{
                  duration: 0.8,
                }}

                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-emerald-500
                  to-teal-500
                "

              />

            </div>

          </div>

        </motion.div>


        {/* =================================================
            IMPROVEMENT
        ================================================== */}

        <motion.div

          variants={fadeInUp}

          whileHover={{
            y: -5,
          }}

          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-gray-700/80
            bg-[#253246]
            p-6
            shadow-lg
            hover:shadow-xl
            transition-all
          "

        >

          <div
            className="
              absolute
              top-0
              left-0
              right-0
              h-1
              bg-gradient-to-r
              from-amber-500
              to-orange-500
            "
          />


          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-amber-500/10
                flex
                items-center
                justify-center
              "
            >

              <Target
                size={23}
                className="text-amber-400"
              />

            </div>


            <span
              className="
                text-xs
                font-semibold
                px-2.5
                py-1
                rounded-full
                bg-amber-500/10
                text-amber-400
              "
            >
              Focus
            </span>

          </div>


          <div className="mt-5">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Improvement Areas
            </p>

            <h4
              className="
                text-4xl
                font-black
                text-white
                mt-1
              "
            >
              {weakAreasCount}
            </h4>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              Areas identified for improvement
            </p>

          </div>


          <div className="mt-5">

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  flex-1
                  h-2
                  rounded-full
                  bg-slate-700/70
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
                    w-1/3
                    rounded-full
                    bg-gradient-to-r
                    from-amber-500
                    to-orange-500
                  "
                />

              </div>

              <span className="text-xs text-gray-400">
                Focus
              </span>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </div>

  );
}