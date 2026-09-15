import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { atsAPI, interviewAPI } from '../services/api';
import {
  Brain,
  Clock,
  CheckCircle2,
  Zap,
  BarChart3,
  FileText,
  Trophy,
  TrendingUp,
  Award,
  CalendarDays,
  Target,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Activity,
  X,
} from 'lucide-react';

const getScoreStyle = (score) => {
  const value = Number(score || 0);

  if (value >= 80) {
    return {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-400 to-teal-500',
      label: 'Excellent',
    };
  }

  if (value >= 60) {
    return {
      text: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      gradient: 'from-amber-400 to-orange-500',
      label: 'Good',
    };
  }

  return {
    text: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    gradient: 'from-red-400 to-rose-500',
    label: 'Needs Work',
  };
};

const formatInterviewType = (type) => {
  if (!type) return 'Interview';

  return type
    .replace(/_INTERVIEW$/i, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return 'N/A';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return 'N/A';
  }

  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (date) => {
  if (!date) return '';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getScoreMessage = (score) => {
  const value = Number(score || 0);

  if (value >= 90) {
    return 'Outstanding performance';
  }

  if (value >= 80) {
    return 'Strong interview performance';
  }

  if (value >= 70) {
    return 'Good foundation';
  }

  if (value >= 60) {
    return 'Room for improvement';
  }

  return 'Needs more practice';
};

/*
 * ============================================================
 * LOCAL FEEDBACK
 * ============================================================
 *
 * Used only when the backend session.feedback field is empty.
 *
 * This does NOT call Gemini or any additional API.
 * It uses the score and existing interview session information.
 * ============================================================
 */
const getLocalFeedback = (session, score) => {
  const value = Number(score);
  const interviewType = formatInterviewType(session?.interviewType);

  if (!Number.isFinite(value)) {
    return {
      title: 'Interview completed',
      summary: `Your ${interviewType} interview was completed successfully.`,
      points: [
        'Review your answers and continue practicing regularly.',
        'Focus on giving clear, structured explanations.',
        'Use each interview to improve your confidence and consistency.',
      ],
    };
  }

  if (value >= 90) {
    return {
      title: 'Outstanding performance',
      summary: `You performed exceptionally well in this ${interviewType} interview. Your score shows strong preparation and confident performance.`,
      points: [
        'Continue practicing advanced questions to maintain this level.',
        'Keep explaining your reasoning clearly and confidently.',
        'Challenge yourself with more difficult interview scenarios.',
      ],
    };
  }

  if (value >= 80) {
    return {
      title: 'Excellent performance',
      summary: `You demonstrated strong performance in this ${interviewType} interview. Your score indicates a solid understanding of the topics covered.`,
      points: [
        'Continue strengthening your technical or communication depth.',
        'Practice explaining answers with clear structure and examples.',
        'Work on advanced questions to move toward an outstanding score.',
      ],
    };
  }

  if (value >= 70) {
    return {
      title: 'Good performance',
      summary: `You have a good foundation in this ${interviewType} interview. Focused practice can help improve your answer quality and consistency.`,
      points: [
        'Strengthen the areas where your answers were less confident.',
        'Give more structured and detailed explanations.',
        'Practice regularly to improve consistency under interview pressure.',
      ],
    };
  }

  if (value >= 60) {
    return {
      title: 'Room for improvement',
      summary: `You have a developing foundation in this ${interviewType} interview. Focused preparation can help improve your overall performance.`,
      points: [
        'Review the fundamentals related to the interview topics.',
        'Practice answers with a clear structure and supporting examples.',
        'Work on confidence and accuracy when explaining your answers.',
      ],
    };
  }

  return {
    title: 'Needs more practice',
    summary: `This ${interviewType} interview highlights areas where additional preparation can help.`,
    points: [
      'Review the fundamental concepts before attempting advanced questions.',
      'Practice explaining answers clearly instead of giving very short responses.',
      'Complete more mock interviews to build confidence and consistency.',
    ],
  };
};

const getInterviewMeta = (session) => {
  const parts = [];

  const type = formatInterviewType(session?.interviewType);

  const answerCount = Number(session?.answerCount);
  const duration = Number(session?.durationMinutes);

  if (type) {
    parts.push(type);
  }

  if (Number.isFinite(answerCount) && answerCount > 0) {
    parts.push(
      `${answerCount} answer${answerCount === 1 ? '' : 's'}`
    );
  }

  if (Number.isFinite(duration) && duration > 0) {
    parts.push(`${duration} min`);
  }

  return parts.join(' • ');
};

export default function Reports() {
  const [atsReports, setAtsReports] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState('interview');

  const [expandedSession, setExpandedSession] = useState(null);

  const [error, setError] = useState('');

  const loadReports = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const [atsResult, sessionResult] =
        await Promise.allSettled([
          atsAPI.getReports(),
          interviewAPI.getUserSessions(),
        ]);

      if (atsResult.status === 'fulfilled') {
        setAtsReports(
          Array.isArray(atsResult.value.data)
            ? atsResult.value.data
            : []
        );
      } else {
        setAtsReports([]);

        console.error(
          'Failed to load ATS reports:',
          atsResult.reason
        );
      }

      if (sessionResult.status === 'fulfilled') {
        const data = Array.isArray(sessionResult.value.data)
          ? sessionResult.value.data
          : [];

        setSessions(
          data.filter(
            (session) =>
              session.status === 'COMPLETED'
          )
        );
      } else {
        setSessions([]);

        console.error(
          'Failed to load interview sessions:',
          sessionResult.reason
        );
      }

      if (
        atsResult.status === 'rejected' &&
        sessionResult.status === 'rejected'
      ) {
        setError(
          'Unable to load your reports. Please try again.'
        );
      }
    } catch (err) {
      console.error(
        'Failed to load reports:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to load reports. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const interviewStats = useMemo(() => {
    const scores = sessions
      .map((session) =>
        session.overallScore != null
          ? Number(session.overallScore)
          : null
      )
      .filter(
        (score) =>
          score !== null &&
          !Number.isNaN(score)
      );

    const average =
      scores.length > 0
        ? scores.reduce(
            (sum, score) => sum + score,
            0
          ) / scores.length
        : 0;

    const best =
      scores.length > 0
        ? Math.max(...scores)
        : 0;

    const latest =
      sessions.length > 0 &&
      sessions[0].overallScore != null
        ? Number(
            sessions[0].overallScore
          )
        : 0;

    return {
      total: sessions.length,
      average,
      best,
      latest,
    };
  }, [sessions]);

  const toggleSession = (sessionId) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
      return;
    }

    setExpandedSession(sessionId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pb-14">
        <div className="animate-pulse">
          <div className="h-5 w-32 rounded-full bg-gray-200 dark:bg-white/[0.06] mb-4" />

          <div className="h-12 w-80 rounded-xl bg-gray-200 dark:bg-white/[0.06]" />

          <div className="h-5 w-[500px] max-w-full rounded-lg bg-gray-200 dark:bg-white/[0.06] mt-4" />

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-32
                  rounded-2xl
                  bg-gray-200
                  dark:bg-white/[0.05]
                "
              />
            ))}
          </div>

          <div
            className="
              h-20
              rounded-2xl
              bg-gray-200
              dark:bg-white/[0.05]
              mt-6
            "
          />

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                h-48
                rounded-[26px]
                bg-gray-200
                dark:bg-white/[0.05]
                mt-4
              "
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-14">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
        <div
          className="
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            bg-violet-500/10
            border
            border-violet-500/10
            text-violet-600
            dark:text-violet-400
            text-[11px]
            font-black
            tracking-wider
            mb-4
          "
        >
          <Sparkles size={13} />
          PERFORMANCE CENTER
        </div>

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-5
          "
        >
          <div>
            <h1
              className="
                text-4xl
                md:text-5xl
                font-black
                tracking-tight
                text-gray-950
                dark:text-white
              "
            >
              Interview History
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-gray-500
                dark:text-gray-400
                leading-6
              "
            >
              Review your previous interviews,
              track your scores and understand how
              your performance is improving over time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadReports(true)}
            disabled={refreshing}
            className="
              self-start
              lg:self-auto
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-white
              dark:bg-[#0b0f18]
              border
              border-gray-200
              dark:border-white/[0.08]
              text-sm
              font-bold
              text-gray-700
              dark:text-gray-300
              hover:border-violet-400/40
              transition
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />

            Refresh
          </button>
        </div>
      </motion.div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      <AnimatePresence>
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
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="
              mb-6
              p-4
              rounded-2xl
              border
              border-red-200
              dark:border-red-500/20
              bg-red-50
              dark:bg-red-500/[0.06]
              flex
              items-start
              gap-3
            "
          >
            <AlertCircle
              size={20}
              className="text-red-500 flex-shrink-0"
            />

            <p
              className="
                flex-1
                text-sm
                text-red-700
                dark:text-red-300
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-400"
            >
              <X size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
          mb-7
        "
      >
        <StatCard
          icon={<Activity size={20} />}
          label="Total Interviews"
          value={interviewStats.total}
          description="Completed sessions"
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Average Score"
          value={
            interviewStats.total > 0
              ? interviewStats.average.toFixed(1)
              : '—'
          }
          description="Across all interviews"
          gradient="from-violet-500 to-fuchsia-500"
          delay={0.05}
        />

        <StatCard
          icon={<Trophy size={20} />}
          label="Best Score"
          value={
            interviewStats.best > 0
              ? interviewStats.best.toFixed(1)
              : '—'
          }
          description="Your highest result"
          gradient="from-amber-500 to-orange-500"
          delay={0.1}
        />

        <StatCard
          icon={<Award size={20} />}
          label="Latest Score"
          value={
            interviewStats.latest > 0
              ? interviewStats.latest.toFixed(1)
              : '—'
          }
          description="Most recent interview"
          gradient="from-emerald-500 to-teal-500"
          delay={0.15}
        />
      </div>

      {/* =====================================================
          PREMIUM PROGRESS HERO
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          relative
          overflow-hidden
          rounded-[28px]
          mb-7
          border
          border-violet-400/20
          shadow-xl
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#312e81]
            via-[#5b21b6]
            to-[#7c3aed]
          "
        />

        <div
          className="
            absolute
            -top-28
            -right-20
            w-80
            h-80
            rounded-full
            bg-fuchsia-400/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -left-20
            w-80
            h-80
            rounded-full
            bg-blue-400/20
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
            p-6
            md:p-7
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              gap-5
            "
          >
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-white/10
                border
                border-white/15
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <TrendingUp
                size={27}
                className="text-white"
              />
            </div>

            <div className="flex-1">
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  font-black
                  text-white/50
                "
              >
                Your Progress
              </p>

              <h2
                className="
                  mt-1
                  text-xl
                  md:text-2xl
                  font-black
                  text-white
                "
              >
                Keep building your interview confidence
              </h2>

              <p
                className="
                  mt-1.5
                  text-xs
                  text-white/60
                "
              >
                Every completed interview gives you
                another opportunity to improve.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  px-4
                  py-3
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  text-center
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-white/40
                    font-black
                  "
                >
                  Average
                </p>

                <p
                  className="
                    text-2xl
                    font-black
                    text-white
                  "
                >
                  {interviewStats.total > 0
                    ? interviewStats.average.toFixed(0)
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div
        className="
          flex
          gap-2
          p-1.5
          mb-7
          rounded-2xl
          bg-gray-100
          dark:bg-white/[0.04]
          border
          border-gray-200
          dark:border-white/[0.05]
        "
      >
        <button
          type="button"
          onClick={() => setActiveTab('interview')}
          className={`
            flex-1
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-3
            rounded-xl
            text-sm
            font-black
            transition
            ${
              activeTab === 'interview'
                ? `
                  bg-white
                  dark:bg-[#111621]
                  text-violet-600
                  dark:text-violet-400
                  shadow-sm
                `
                : `
                  text-gray-500
                  dark:text-gray-400
                  hover:text-gray-900
                  dark:hover:text-white
                `
            }
          `}
        >
          <Brain size={17} />

          Interview History

          <span
            className="
              px-2
              py-0.5
              rounded-md
              bg-violet-500/10
              text-[10px]
            "
          >
            {sessions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ats')}
          className={`
            flex-1
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-3
            rounded-xl
            text-sm
            font-black
            transition
            ${
              activeTab === 'ats'
                ? `
                  bg-white
                  dark:bg-[#111621]
                  text-blue-600
                  dark:text-blue-400
                  shadow-sm
                `
                : `
                  text-gray-500
                  dark:text-gray-400
                  hover:text-gray-900
                  dark:hover:text-white
                `
            }
          `}
        >
          <Zap size={17} />

          ATS Reports

          <span
            className="
              px-2
              py-0.5
              rounded-md
              bg-blue-500/10
              text-[10px]
            "
          >
            {atsReports.length}
          </span>
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <AnimatePresence mode="wait">

        {/* ===================================================
            INTERVIEW HISTORY
        =================================================== */}

        {activeTab === 'interview' && (
          <motion.div
            key="interview"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="space-y-4"
          >
            {sessions.length > 0 ? (
              sessions.map((session, index) => {
                const score =
                  session.overallScore != null
                    ? Number(session.overallScore)
                    : null;

                const style =
                  getScoreStyle(score);

                const expanded =
                  expandedSession ===
                  session.sessionId;

                const localFeedback =
                  getLocalFeedback(
                    session,
                    score
                  );

                const hasSavedFeedback =
                  typeof session.feedback === 'string' &&
                  session.feedback.trim().length > 0;

                return (
                  <motion.div
                    key={session.sessionId}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="
                      overflow-hidden
                      rounded-[26px]
                      border
                      border-gray-200
                      dark:border-white/[0.08]
                      bg-white
                      dark:bg-[#0b0f18]
                      shadow-sm
                      hover:shadow-xl
                      dark:hover:shadow-black/20
                      transition-shadow
                    "
                  >

                    {/* MAIN CARD */}

                    <div className="p-5 md:p-6">
                      <div
                        className="
                          flex
                          flex-col
                          lg:flex-row
                          lg:items-center
                          gap-5
                        "
                      >

                        {/* ICON + TITLE */}

                        <div
                          className="
                            flex
                            items-center
                            gap-4
                            flex-1
                            min-w-0
                          "
                        >
                          <div
                            className="
                              relative
                              w-14
                              h-14
                              rounded-2xl
                              bg-gradient-to-br
                              from-violet-500
                              to-fuchsia-600
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                              shadow-lg
                              shadow-violet-500/10
                            "
                          >
                            <Brain
                              size={26}
                              className="text-white"
                            />

                            <div
                              className="
                                absolute
                                -right-1
                                -bottom-1
                                w-5
                                h-5
                                rounded-full
                                bg-emerald-500
                                border-2
                                border-white
                                dark:border-[#0b0f18]
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <CheckCircle2
                                size={11}
                                className="text-white"
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                              "
                            >
                              <h3
                                className="
                                  text-lg
                                  font-black
                                  text-gray-900
                                  dark:text-white
                                "
                              >
                                {session.sessionTitle ||
                                  'Interview Session'}
                              </h3>

                              <span
                                className="
                                  px-2.5
                                  py-1
                                  rounded-lg
                                  bg-violet-500/10
                                  text-violet-600
                                  dark:text-violet-400
                                  text-[10px]
                                  font-black
                                "
                              >
                                {formatInterviewType(
                                  session.interviewType
                                )}
                              </span>
                            </div>

                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                                mt-2
                                text-xs
                                text-gray-400
                              "
                            >
                              <span
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                "
                              >
                                <CalendarDays size={13} />

                                {formatDate(
                                  session.endTime ||
                                    session.startTime
                                )}
                              </span>

                              {formatTime(
                                session.endTime ||
                                  session.startTime
                              ) && (
                                <span
                                  className="
                                    flex
                                    items-center
                                    gap-1.5
                                  "
                                >
                                  <Clock size={13} />

                                  {formatTime(
                                    session.endTime ||
                                      session.startTime
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* SCORE */}

                        <div
                          className="
                            flex
                            items-center
                            gap-4
                          "
                        >
                          <div
                            className="
                              text-right
                              min-w-[90px]
                            "
                          >
                            <p
                              className="
                                text-[9px]
                                uppercase
                                tracking-wider
                                font-black
                                text-gray-400
                              "
                            >
                              Score
                            </p>

                            <div
                              className={`
                                mt-1
                                text-3xl
                                font-black
                                ${
                                  score !== null
                                    ? style.text
                                    : 'text-gray-400'
                                }
                              `}
                            >
                              {score !== null
                                ? score.toFixed(1)
                                : '—'}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              toggleSession(
                                session.sessionId
                              )
                            }
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-gray-100
                              dark:bg-white/[0.05]
                              flex
                              items-center
                              justify-center
                              text-gray-500
                              dark:text-gray-400
                              hover:text-violet-500
                              transition
                            "
                          >
                            {expanded ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* METRICS */}

                      <div
                        className="
                          grid
                          grid-cols-2
                          md:grid-cols-4
                          gap-3
                          mt-6
                        "
                      >
                        <MiniMetric
                          icon={<Trophy size={15} />}
                          label="Performance"
                          value={
                            score !== null
                              ? getScoreMessage(score)
                              : 'Not scored'
                          }
                        />

                        <MiniMetric
                          icon={<Clock size={15} />}
                          label="Duration"
                          value={
                            session.durationMinutes !=
                            null
                              ? `${session.durationMinutes} min`
                              : 'N/A'
                          }
                        />

                        <MiniMetric
                          icon={<Target size={15} />}
                          label="Status"
                          value="Completed"
                        />

                        <MiniMetric
                          icon={<Activity size={15} />}
                          label="Session"
                          value={
                            session.interviewType
                              ? formatInterviewType(
                                  session.interviewType
                                )
                              : 'Interview'
                          }
                        />
                      </div>

                      {/* SCORE BAR */}

                      {score !== null && (
                        <div className="mt-5">
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
                                text-[10px]
                                uppercase
                                tracking-wider
                                font-black
                                text-gray-400
                              "
                            >
                              Overall Performance
                            </span>

                            <span
                              className={`
                                text-xs
                                font-black
                                ${style.text}
                              `}
                            >
                              {score.toFixed(1)}%
                            </span>
                          </div>

                          <div
                            className="
                              w-full
                              h-2
                              rounded-full
                              bg-gray-100
                              dark:bg-white/[0.05]
                              overflow-hidden
                            "
                          >
                            <motion.div
                              initial={{
                                width: 0,
                              }}
                              animate={{
                                width: `${Math.min(
                                  Math.max(score, 0),
                                  100
                                )}%`,
                              }}
                              transition={{
                                duration: 0.9,
                                delay: index * 0.05,
                              }}
                              className={`
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                ${style.gradient}
                              `}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EXPANDED DETAILS */}

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: 'auto',
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          className="
                            border-t
                            border-gray-100
                            dark:border-white/[0.06]
                          "
                        >
                          <div
                            className="
                              p-5
                              md:p-6
                              bg-gray-50/70
                              dark:bg-white/[0.015]
                            "
                          >

                            {/* FEEDBACK HEADER */}

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                                mb-4
                              "
                            >
                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-xl
                                  bg-violet-500/10
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <BarChart3
                                  size={19}
                                  className="text-violet-500"
                                />
                              </div>

                              <div>
                                <h4
                                  className="
                                    text-sm
                                    font-black
                                    text-gray-900
                                    dark:text-white
                                  "
                                >
                                  Interview Feedback
                                </h4>

                                <p
                                  className="
                                    text-[11px]
                                    text-gray-400
                                  "
                                >
                                  {hasSavedFeedback
                                    ? 'Your interview performance summary'
                                    : 'Performance summary based on your interview results'}
                                </p>
                              </div>
                            </div>

                            {/* FEEDBACK */}

                            <div
                              className="
                                p-5
                                rounded-2xl
                                bg-violet-50
                                dark:bg-violet-500/[0.05]
                                border
                                border-violet-100
                                dark:border-violet-500/10
                              "
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-violet-500/10
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                  "
                                >
                                  <Sparkles
                                    size={17}
                                    className="text-violet-500"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h5
                                    className="
                                      text-sm
                                      font-black
                                      text-gray-900
                                      dark:text-white
                                    "
                                  >
                                    {hasSavedFeedback
                                      ? 'Interview Feedback'
                                      : localFeedback.title}
                                  </h5>

                                  <p
                                    className="
                                      mt-2
                                      text-sm
                                      leading-6
                                      text-gray-700
                                      dark:text-gray-300
                                    "
                                  >
                                    {hasSavedFeedback
                                      ? session.feedback.trim()
                                      : localFeedback.summary}
                                  </p>

                                  {!hasSavedFeedback && (
                                    <div className="mt-4 space-y-2">
                                      {localFeedback.points.map(
                                        (point, pointIndex) => (
                                          <div
                                            key={pointIndex}
                                            className="
                                              flex
                                              items-start
                                              gap-2.5
                                            "
                                          >
                                            <CheckCircle2
                                              size={15}
                                              className="
                                                mt-0.5
                                                flex-shrink-0
                                                text-violet-500
                                              "
                                            />

                                            <p
                                              className="
                                                text-xs
                                                leading-5
                                                text-gray-600
                                                dark:text-gray-400
                                              "
                                            >
                                              {point}
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}

                                  {!hasSavedFeedback &&
                                    getInterviewMeta(session) && (
                                      <p
                                        className="
                                          mt-4
                                          text-[10px]
                                          font-bold
                                          uppercase
                                          tracking-wider
                                          text-gray-400
                                        "
                                      >
                                        {getInterviewMeta(session)}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <EmptyState
                icon={<Brain size={34} />}
                title="No interview history yet"
                description="Complete your first AI interview and your performance will appear here."
                buttonText="Start Your First Interview"
                onClick={() =>
                  (window.location.href =
                    '/interview-selection')
                }
              />
            )}
          </motion.div>
        )}

        {/* ===================================================
            ATS REPORTS
        =================================================== */}

        {activeTab === 'ats' && (
          <motion.div
            key="ats"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="space-y-4"
          >
            {atsReports.length > 0 ? (
              atsReports.map((report, index) => {
                const score =
                  report.atsScore != null
                    ? Number(report.atsScore)
                    : null;

                const style =
                  getScoreStyle(score);

                return (
                  <motion.div
                    key={report.reportId}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="
                      p-5
                      md:p-6
                      rounded-[26px]
                      border
                      border-gray-200
                      dark:border-white/[0.08]
                      bg-white
                      dark:bg-[#0b0f18]
                      hover:shadow-xl
                      transition
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        gap-5
                      "
                    >
                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-gradient-to-br
                          from-blue-500
                          to-cyan-500
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                        "
                      >
                        <FileText
                          size={26}
                          className="text-white"
                        />
                      </div>

                      <div
                        className="
                          flex-1
                          min-w-0
                        "
                      >
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <h3
                            className="
                              text-lg
                              font-black
                              text-gray-900
                              dark:text-white
                            "
                          >
                            ATS Analysis Report
                          </h3>

                          <span
                            className={`
                              px-2.5
                              py-1
                              rounded-lg
                              ${style.bg}
                              ${style.text}
                              text-[10px]
                              font-black
                            `}
                          >
                            {style.label}
                          </span>
                        </div>

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                            mt-2
                            text-xs
                            text-gray-400
                          "
                        >
                          <span
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >
                            <CalendarDays size={13} />

                            {formatDate(
                              report.createdAt
                            )}
                          </span>

                          <span>
                            Report ID: #{report.reportId}
                          </span>
                        </div>
                      </div>

                      <div
                        className="
                          text-left
                          sm:text-right
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-wider
                            font-black
                            text-gray-400
                          "
                        >
                          ATS Score
                        </p>

                        <p
                          className={`
                            mt-1
                            text-3xl
                            font-black
                            ${style.text}
                          `}
                        >
                          {score !== null
                            ? score.toFixed(1)
                            : '—'}
                        </p>
                      </div>
                    </div>

                    {score !== null && (
                      <div className="mt-5">
                        <div
                          className="
                            w-full
                            h-2
                            rounded-full
                            bg-gray-100
                            dark:bg-white/[0.05]
                            overflow-hidden
                          "
                        >
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${Math.min(
                                Math.max(score, 0),
                                100
                              )}%`,
                            }}
                            transition={{
                              duration: 0.9,
                            }}
                            className={`
                              h-full
                              rounded-full
                              bg-gradient-to-r
                              ${style.gradient}
                            `}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <EmptyState
                icon={<Zap size={34} />}
                title="No ATS reports yet"
                description="Analyze your resume with the ATS Checker to generate your first report."
                buttonText="Open ATS Checker"
                onClick={() =>
                  (window.location.href =
                    '/ats-checker')
                }
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  label,
  value,
  description,
  gradient,
  delay,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
      }}
      className="
        relative
        overflow-hidden
        p-5
        rounded-2xl
        border
        border-gray-200
        dark:border-white/[0.08]
        bg-white
        dark:bg-[#0b0f18]
      "
    >
      <div
        className={`
          absolute
          -right-8
          -top-8
          w-24
          h-24
          rounded-full
          bg-gradient-to-br
          ${gradient}
          opacity-10
          blur-2xl
        `}
      />

      <div
        className="
          relative
          flex
          items-start
          justify-between
        "
      >
        <div>
          <p
            className="
              text-[10px]
              uppercase
              tracking-wider
              font-black
              text-gray-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-black
              text-gray-950
              dark:text-white
            "
          >
            {value}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-gray-400
            "
          >
            {description}
          </p>
        </div>

        <div
          className={`
            w-10
            h-10
            rounded-xl
            bg-gradient-to-br
            ${gradient}
            text-white
            flex
            items-center
            justify-center
            shadow-lg
          `}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   MINI METRIC
============================================================ */

function MiniMetric({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        p-3
        rounded-xl
        bg-gray-50
        dark:bg-white/[0.025]
        border
        border-gray-100
        dark:border-white/[0.05]
      "
    >
      <div
        className="
          flex
          items-center
          gap-1.5
          text-gray-400
          mb-1
        "
      >
        {icon}

        <span
          className="
            text-[9px]
            uppercase
            tracking-wider
            font-black
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          text-xs
          font-black
          text-gray-800
          dark:text-gray-200
          truncate
        "
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        p-10
        md:p-14
        rounded-[28px]
        border
        border-gray-200
        dark:border-white/[0.08]
        bg-white
        dark:bg-[#0b0f18]
        text-center
      "
    >
      <div
        className="
          mx-auto
          w-20
          h-20
          rounded-3xl
          bg-gradient-to-br
          from-violet-500/10
          to-blue-500/10
          flex
          items-center
          justify-center
          text-violet-500
        "
      >
        {icon}
      </div>

      <h3
        className="
          mt-6
          text-2xl
          font-black
          text-gray-900
          dark:text-white
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          max-w-lg
          mx-auto
          text-sm
          leading-6
          text-gray-500
          dark:text-gray-400
        "
      >
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          px-5
          py-3
          rounded-xl
          bg-gradient-to-r
          from-violet-600
          to-blue-600
          text-white
          text-sm
          font-black
          shadow-lg
          hover:-translate-y-0.5
          transition
        "
      >
        {buttonText}
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}