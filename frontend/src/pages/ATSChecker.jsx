import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { atsAPI, resumeAPI } from '../services/api';
import {
  Zap,
  AlertCircle,
  CheckCircle2,
  FileText,
  TrendingUp,
  Lightbulb,
  FileWarning,
  Sparkles,
  Target,
  Search,
  BarChart3,
  Award,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Brain,
  XCircle,
  X,
} from 'lucide-react';

const parseJsonArray = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data;
  }

  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseObject = (data) => {
  if (!data) return {};

  if (typeof data === 'object') {
    return data;
  }

  try {
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object'
      ? parsed
      : {};
  } catch {
    return {};
  }
};

const getScoreColor = (score) => {
  const value = Number(score || 0);

  if (value >= 80) {
    return {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500',
      light: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-400 to-teal-500',
    };
  }

  if (value >= 60) {
    return {
      text: 'text-amber-500',
      bg: 'bg-amber-500',
      light: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      gradient: 'from-amber-400 to-orange-500',
    };
  }

  return {
    text: 'text-red-500',
    bg: 'bg-red-500',
    light: 'bg-red-500/10',
    border: 'border-red-500/20',
    gradient: 'from-red-400 to-rose-500',
  };
};

const getScoreLabel = (score) => {
  const value = Number(score || 0);

  if (value >= 90) return 'Outstanding';
  if (value >= 80) return 'Excellent';
  if (value >= 70) return 'Strong';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'Needs Improvement';

  return 'Needs Attention';
};

export default function ATSChecker() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await resumeAPI.getResumes();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setResumes(data);

      if (data.length > 0) {
        const primaryResume =
          data.find(
            (resume) =>
              resume.isPrimary ||
              resume.primary ||
              resume.primaryResume
          ) || data[0];

        setSelectedResume(primaryResume.resumeId);
      }
    } catch (err) {
      console.error(
        'Failed to load resumes:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to load resumes. Please try again.'
      );

      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume) {
      setError('Please select a resume.');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');
      setReport(null);

      const response =
        await atsAPI.analyzeResume(
          selectedResume
        );

      setReport(response.data);
    } catch (err) {
      console.error(
        'ATS analysis error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Analysis failed. Please try again.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const foundKeywords = report
    ? parseJsonArray(report.foundKeywords)
    : [];

  const missingKeywords = report
    ? parseJsonArray(report.missingKeywords)
    : [];

  const suggestions = report
    ? parseJsonArray(
        report.improvementSuggestions
      )
    : [];

  const grammarIssues = report
    ? parseJsonArray(report.grammarIssues)
    : [];

  const sectionAnalysis = report
    ? parseObject(report.sectionAnalysis)
    : {};

  const atsScore = Number(
    report?.atsScore || 0
  );

  const keywordScore = Number(
    report?.keywordScore || 0
  );

  const formattingScore = Number(
    report?.formattingScore || 0
  );

  const contentScore = Number(
    report?.contentScore || 0
  );

  const scoreColors =
    getScoreColor(atsScore);

  const filteredResumes =
    resumes.filter((resume) => {
      const name = (
        resume.fileName ||
        resume.filename ||
        resume.originalFileName ||
        'Resume'
      ).toLowerCase();

      return name.includes(
        searchTerm.toLowerCase()
      );
    });

  const selectedResumeObject =
    resumes.find(
      (resume) =>
        resume.resumeId === selectedResume
    );

  const ScoreBar = ({
    score,
    label,
    icon,
    delay = 0,
  }) => {
    const value = Number(score || 0);
    const colors = getScoreColor(value);

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
          duration: 0.45,
        }}
        className="
          p-5
          rounded-2xl
          border
          border-gray-200
          dark:border-white/[0.07]
          bg-white
          dark:bg-white/[0.025]
        "
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`
              w-10
              h-10
              rounded-xl
              ${colors.light}
              flex
              items-center
              justify-center
            `}
          >
            {icon}
          </div>

          <div className="flex-1">
            <p
              className="
                text-sm
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              {label}
            </p>

            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              AI evaluation
            </p>
          </div>

          <span
            className={`
              text-lg
              font-black
              ${colors.text}
            `}
          >
            {value.toFixed(0)}
          </span>
        </div>

        <div
          className="
            h-2.5
            w-full
            rounded-full
            bg-gray-100
            dark:bg-white/[0.06]
            overflow-hidden
          "
        >
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${Math.min(
                Math.max(value, 0),
                100
              )}%`,
            }}
            transition={{
              duration: 1.1,
              delay: delay + 0.2,
              ease: 'easeOut',
            }}
            className={`
              h-full
              rounded-full
              bg-gradient-to-r
              ${colors.gradient}
            `}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-14">

      {/* =====================================================
          PREMIUM HEADER
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
        transition={{
          duration: 0.5,
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
            bg-blue-500/10
            border
            border-blue-500/10
            text-blue-600
            dark:text-blue-400
            text-[11px]
            font-black
            tracking-wider
            mb-4
          "
        >
          <Sparkles size={13} />
          AI-POWERED RESUME ANALYSIS
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
              ATS Resume Checker
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
              Discover how well your resume performs
              against Applicant Tracking Systems and
              get actionable AI-powered recommendations.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              bg-white
              dark:bg-[#0b0f18]
              border
              border-gray-200
              dark:border-white/[0.08]
              shadow-sm
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-emerald-500/10
                flex
                items-center
                justify-center
              "
            >
              <ShieldCheck
                size={20}
                className="text-emerald-500"
              />
            </div>

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
                ATS Analysis
              </p>

              <p
                className="
                  text-sm
                  font-black
                  text-gray-900
                  dark:text-white
                "
              >
                AI Powered
              </p>
            </div>
          </div>
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
              className="
                text-red-500
                flex-shrink-0
              "
            />

            <p
              className="
                text-sm
                text-red-700
                dark:text-red-300
                flex-1
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError('')}
              className="
                text-red-400
                hover:text-red-600
              "
            >
              <X size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* =====================================================
          PREMIUM ANALYZER PANEL
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
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          overflow-hidden
          rounded-[30px]
          mb-8
          border
          border-blue-400/20
          shadow-2xl
          dark:shadow-black/30
        "
      >

        {/* Background */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#075cff]
            via-[#4039d8]
            to-[#8a25d5]
          "
        />

        <div
          className="
            absolute
            -top-32
            -right-20
            w-96
            h-96
            rounded-full
            bg-cyan-300/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-20
            w-96
            h-96
            rounded-full
            bg-fuchsia-300/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-x-0
            top-24
            h-24
            bg-white/[0.05]
            blur-2xl
            rotate-[-4deg]
          "
        />

        <div
          className="
            relative
            z-10
            p-6
            md:p-9
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              gap-8
            "
          >

            {/* LEFT */}

            <div className="flex-1">

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/15
                  backdrop-blur-md
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <Zap
                  size={27}
                  className="text-white"
                  fill="currentColor"
                />
              </div>

              <h2
                className="
                  text-2xl
                  md:text-3xl
                  font-black
                  text-white
                "
              >
                Analyze your resume
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-white/70
                "
              >
                Select a resume and let our AI
                evaluate its ATS compatibility,
                keywords, formatting and content quality.
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                  mt-5
                "
              >
                <span
                  className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/10
                    border
                    border-white/10
                    text-white/80
                    text-[11px]
                    font-bold
                  "
                >
                  Keyword Analysis
                </span>

                <span
                  className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/10
                    border
                    border-white/10
                    text-white/80
                    text-[11px]
                    font-bold
                  "
                >
                  AI Insights
                </span>

                <span
                  className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/10
                    border
                    border-white/10
                    text-white/80
                    text-[11px]
                    font-bold
                  "
                >
                  ATS Score
                </span>
              </div>

            </div>


            {/* RIGHT SELECTOR */}

            <div
              className="
                w-full
                lg:w-[430px]
                p-5
                rounded-2xl
                bg-black/15
                border
                border-white/10
                backdrop-blur-md
              "
            >

              <label
                className="
                  block
                  text-xs
                  font-black
                  uppercase
                  tracking-wider
                  text-white/60
                  mb-3
                "
              >
                Select Resume
              </label>

              {loading ? (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    p-4
                    rounded-xl
                    bg-white/10
                    text-white/70
                    text-sm
                  "
                >
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                  Loading resumes...
                </div>
              ) : resumes.length > 0 ? (
                <>
                  <div className="relative">

                    <FileText
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-white/50
                      "
                    />

                    <select
                      value={
                        selectedResume || ''
                      }
                      onChange={(e) =>
                        setSelectedResume(
                          Number(e.target.value)
                        )
                      }
                      className="
                        w-full
                        appearance-none
                        pl-11
                        pr-10
                        py-3.5
                        rounded-xl
                        bg-white/10
                        border
                        border-white/15
                        text-white
                        text-sm
                        font-semibold
                        outline-none
                        focus:border-white/40
                        transition
                      "
                    >
                      {filteredResumes.map(
                        (resume) => (
                          <option
                            key={resume.resumeId}
                            value={resume.resumeId}
                            className="
                              bg-gray-900
                              text-white
                            "
                          >
                            {resume.fileName}
                            {resume.isPrimary
                              ? ' (Primary)'
                              : ''}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronRight
                      size={17}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        rotate-90
                        text-white/50
                        pointer-events-none
                      "
                    />

                  </div>


                  {selectedResumeObject && (
                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        bg-white/[0.06]
                        border
                        border-white/[0.08]
                      "
                    >
                      <div
                        className="
                          w-9
                          h-9
                          rounded-lg
                          bg-white/10
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <FileText
                          size={17}
                          className="text-white"
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            text-xs
                            font-bold
                            text-white
                            truncate
                          "
                        >
                          {
                            selectedResumeObject.fileName
                          }
                        </p>

                        <p
                          className="
                            text-[10px]
                            text-white/50
                            mt-0.5
                          "
                        >
                          Ready for analysis
                        </p>
                      </div>
                    </div>
                  )}


                  <motion.button
                    whileHover={{
                      scale: 1.015,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={handleAnalyze}
                    disabled={
                      !selectedResume ||
                      analyzing
                    }
                    className="
                      w-full
                      mt-4
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-5
                      py-3.5
                      rounded-xl
                      bg-white
                      text-gray-950
                      font-black
                      text-sm
                      shadow-xl
                      disabled:opacity-60
                      transition
                    "
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Zap
                          size={18}
                          fill="currentColor"
                        />
                        Analyze Resume
                        <ArrowRight size={17} />
                      </>
                    )}
                  </motion.button>

                </>
              ) : (
                <div
                  className="
                    text-center
                    p-5
                    rounded-xl
                    bg-white/[0.06]
                    border
                    border-white/10
                  "
                >

                  <FileText
                    size={30}
                    className="
                      mx-auto
                      text-white/50
                    "
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    No resumes found
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/50
                    "
                  >
                    Upload a resume to begin analysis.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/resume-upload')
                    }
                    className="
                      mt-4
                      px-5
                      py-2.5
                      rounded-xl
                      bg-white
                      text-gray-900
                      text-xs
                      font-black
                    "
                  >
                    Upload Resume
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      </motion.div>


      {/* =====================================================
          ANALYZING STATE
      ===================================================== */}

      <AnimatePresence>
        {analyzing && (
          <motion.div
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
            className="
              mb-8
              p-8
              rounded-[28px]
              border
              border-blue-200
              dark:border-blue-500/20
              bg-white
              dark:bg-[#0b0f18]
              text-center
            "
          >

            <div
              className="
                relative
                mx-auto
                w-20
                h-20
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border-4
                  border-blue-500/10
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border-4
                  border-transparent
                  border-t-blue-500
                  border-r-violet-500
                  animate-spin
                "
              />

              <Brain
                size={27}
                className="
                  absolute
                  left-1/2
                  top-1/2
                  -translate-x-1/2
                  -translate-y-1/2
                  text-blue-500
                "
              />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-black
                text-gray-900
                dark:text-white
              "
            >
              AI is analyzing your resume
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Checking keywords, content,
              formatting and ATS compatibility...
            </p>

            <div
              className="
                mt-5
                max-w-md
                mx-auto
                h-1.5
                rounded-full
                bg-gray-100
                dark:bg-white/[0.06]
                overflow-hidden
              "
            >
              <motion.div
                className="
                  h-full
                  w-1/3
                  rounded-full
                  bg-gradient-to-r
                  from-blue-500
                  via-violet-500
                  to-fuchsia-500
                "
                animate={{
                  x: [
                    '-100%',
                    '300%',
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>


      {/* =====================================================
          REPORT
      ===================================================== */}

      {report && !analyzing && (
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="space-y-6"
        >

          {/* =================================================
              SCORE HERO
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-gray-200
              dark:border-white/[0.08]
              bg-white
              dark:bg-[#0b0f18]
              p-6
              md:p-8
            "
          >

            <div
              className="
                absolute
                -top-32
                -right-32
                w-80
                h-80
                rounded-full
                bg-blue-500/5
                blur-3xl
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                lg:flex-row
                items-center
                gap-8
              "
            >

              {/* SCORE CIRCLE */}

              <div
                className="
                  relative
                  w-56
                  h-56
                  flex-shrink-0
                "
              >

                <svg
                  viewBox="0 0 220 220"
                  className="
                    w-full
                    h-full
                    -rotate-90
                  "
                >

                  <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="14"
                    className="
                      text-gray-100
                      dark:text-white/[0.06]
                    "
                  />

                  <motion.circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={
                      2 *
                      Math.PI *
                      88
                    }
                    initial={{
                      strokeDashoffset:
                        2 *
                        Math.PI *
                        88,
                    }}
                    animate={{
                      strokeDashoffset:
                        2 *
                        Math.PI *
                        88 *
                        (1 -
                          atsScore /
                            100),
                    }}
                    transition={{
                      duration: 1.5,
                      ease: 'easeOut',
                    }}
                  />

                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                      />

                      <stop
                        offset="50%"
                        stopColor="#7c3aed"
                      />

                      <stop
                        offset="100%"
                        stopColor="#d946ef"
                      />
                    </linearGradient>
                  </defs>

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

                  <span
                    className="
                      text-5xl
                      font-black
                      text-gray-950
                      dark:text-white
                    "
                  >
                    {atsScore.toFixed(0)}
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-gray-400
                    "
                  >
                    OUT OF 100
                  </span>

                </div>

              </div>


              {/* SCORE INFO */}

              <div className="flex-1 text-center lg:text-left">

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                    text-[11px]
                    font-black
                    mb-4
                  "
                >
                  <Award size={13} />
                  ATS ANALYSIS COMPLETE
                </div>

                <h2
                  className="
                    text-3xl
                    md:text-4xl
                    font-black
                    text-gray-950
                    dark:text-white
                  "
                >
                  {getScoreLabel(atsScore)}
                </h2>

                <p
                  className="
                    mt-3
                    max-w-xl
                    text-sm
                    leading-6
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {atsScore >= 80
                    ? 'Your resume is strongly optimized for ATS systems. Keep refining it to maintain a competitive edge.'
                    : atsScore >= 60
                    ? 'Your resume has a solid foundation, but improving the highlighted areas can significantly increase its ATS performance.'
                    : 'Your resume needs focused improvements before it can perform strongly with ATS systems.'}
                </p>

                <div
                  className="
                    grid
                    grid-cols-3
                    gap-3
                    mt-6
                  "
                >

                  <div
                    className="
                      p-3
                      rounded-xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        uppercase
                        font-black
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Keywords
                    </p>

                    <p
                      className="
                        mt-1
                        text-xl
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {keywordScore.toFixed(0)}%
                    </p>
                  </div>

                  <div
                    className="
                      p-3
                      rounded-xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        uppercase
                        font-black
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Format
                    </p>

                    <p
                      className="
                        mt-1
                        text-xl
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {formattingScore.toFixed(0)}%
                    </p>
                  </div>

                  <div
                    className="
                      p-3
                      rounded-xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        uppercase
                        font-black
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Content
                    </p>

                    <p
                      className="
                        mt-1
                        text-xl
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {contentScore.toFixed(0)}%
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              SCORE BREAKDOWN
          ================================================= */}

          <div>

            <div
              className="
                flex
                items-end
                justify-between
                gap-4
                mb-4
              "
            >

              <div>
                <h2
                  className="
                    text-2xl
                    font-black
                    text-gray-900
                    dark:text-white
                  "
                >
                  Score Breakdown
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Understand exactly where your
                  resume is performing.
                </p>
              </div>

              <BarChart3
                size={24}
                className="text-blue-500"
              />

            </div>

            <div
              className="
                grid
                md:grid-cols-3
                gap-4
              "
            >

              <ScoreBar
                score={keywordScore}
                label="Keyword Optimization"
                icon={
                  <Search
                    size={18}
                    className="text-blue-500"
                  />
                }
                delay={0.1}
              />

              <ScoreBar
                score={formattingScore}
                label="Formatting Quality"
                icon={
                  <FileCheckIcon />
                }
                delay={0.2}
              />

              <ScoreBar
                score={contentScore}
                label="Content Quality"
                icon={
                  <Brain
                    size={18}
                    className="text-violet-500"
                  />
                }
                delay={0.3}
              />

            </div>

          </div>


          {/* =================================================
              KEYWORDS
          ================================================= */}

          <div
            className="
              grid
              lg:grid-cols-2
              gap-5
            "
          >

            {foundKeywords.length > 0 && (
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
                  rounded-[26px]
                  border
                  border-emerald-200
                  dark:border-emerald-500/20
                  bg-white
                  dark:bg-[#0b0f18]
                  p-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-5
                  "
                >

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-emerald-500/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <CheckCircle2
                      size={21}
                      className="text-emerald-500"
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      Strong Keywords
                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {foundKeywords.length}
                      {' '}
                      relevant keywords found
                    </p>
                  </div>

                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {foundKeywords.map(
                    (keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay:
                            index * 0.04,
                        }}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-2
                          rounded-xl
                          bg-emerald-500/10
                          border
                          border-emerald-500/10
                          text-emerald-700
                          dark:text-emerald-300
                          text-xs
                          font-bold
                        "
                      >
                        <CheckCircle2
                          size={12}
                        />
                        {keyword}
                      </motion.span>
                    )
                  )}
                </div>

              </motion.div>
            )}


            {missingKeywords.length > 0 && (
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
                  rounded-[26px]
                  border
                  border-amber-200
                  dark:border-amber-500/20
                  bg-white
                  dark:bg-[#0b0f18]
                  p-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-5
                  "
                >

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-amber-500/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Target
                      size={21}
                      className="text-amber-500"
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      Missing Keywords
                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Consider adding relevant terms
                    </p>
                  </div>

                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {missingKeywords.map(
                    (keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay:
                            index * 0.04,
                        }}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-2
                          rounded-xl
                          bg-amber-500/10
                          border
                          border-amber-500/10
                          text-amber-700
                          dark:text-amber-300
                          text-xs
                          font-bold
                        "
                      >
                        <AlertCircle
                          size={12}
                        />
                        {keyword}
                      </motion.span>
                    )
                  )}
                </div>

              </motion.div>
            )}

          </div>


          {/* =================================================
              IMPROVEMENT SUGGESTIONS
          ================================================= */}

          {suggestions.length > 0 && (
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
                rounded-[26px]
                border
                border-blue-200
                dark:border-blue-500/20
                bg-white
                dark:bg-[#0b0f18]
                overflow-hidden
              "
            >

              <div
                className="
                  px-6
                  py-5
                  border-b
                  border-gray-100
                  dark:border-white/[0.06]
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-500/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Lightbulb
                    size={21}
                    className="text-blue-500"
                  />
                </div>

                <div>
                  <h3
                    className="
                      font-black
                      text-gray-900
                      dark:text-white
                    "
                  >
                    AI Improvement Suggestions
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Actionable recommendations to improve
                    your ATS performance
                  </p>
                </div>

              </div>

              <div className="p-6 space-y-3">

                {suggestions.map(
                  (suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.08,
                      }}
                      className="
                        flex
                        items-start
                        gap-4
                        p-4
                        rounded-2xl
                        bg-blue-50/70
                        dark:bg-blue-500/[0.05]
                        border
                        border-blue-100
                        dark:border-blue-500/10
                      "
                    >

                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-blue-500
                          text-white
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                          text-xs
                          font-black
                        "
                      >
                        {index + 1}
                      </div>

                      <p
                        className="
                          flex-1
                          text-sm
                          leading-6
                          text-gray-700
                          dark:text-gray-300
                        "
                      >
                        {suggestion}
                      </p>

                      <ChevronRight
                        size={16}
                        className="
                          mt-1
                          text-blue-400
                          flex-shrink-0
                        "
                      />

                    </motion.div>
                  )
                )}

              </div>

            </motion.div>
          )}


          {/* =================================================
              GRAMMAR ISSUES
          ================================================= */}

          {grammarIssues.length > 0 && (
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
                rounded-[26px]
                border
                border-orange-200
                dark:border-orange-500/20
                bg-white
                dark:bg-[#0b0f18]
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-5
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-orange-500/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileWarning
                    size={21}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h3
                    className="
                      font-black
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Grammar & Formatting Issues
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Issues that may affect readability
                    or ATS parsing
                  </p>
                </div>

              </div>

              <div className="space-y-3">

                {grammarIssues.map(
                  (issue, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.08,
                      }}
                      className="
                        flex
                        items-start
                        gap-3
                        p-4
                        rounded-xl
                        bg-orange-50
                        dark:bg-orange-500/[0.05]
                        border
                        border-orange-100
                        dark:border-orange-500/10
                      "
                    >

                      <XCircle
                        size={18}
                        className="
                          mt-0.5
                          text-orange-500
                          flex-shrink-0
                        "
                      />

                      <p
                        className="
                          text-sm
                          leading-6
                          text-gray-700
                          dark:text-gray-300
                        "
                      >
                        {issue}
                      </p>

                    </motion.div>
                  )
                )}

              </div>

            </motion.div>
          )}


          {/* =================================================
              SECTION ANALYSIS
          ================================================= */}

          {Object.keys(sectionAnalysis).length >
            0 && (
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
                rounded-[26px]
                border
                border-gray-200
                dark:border-white/[0.08]
                bg-white
                dark:bg-[#0b0f18]
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-6
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-violet-500/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <TrendingUp
                    size={21}
                    className="text-violet-500"
                  />
                </div>

                <div>
                  <h3
                    className="
                      font-black
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Resume Section Analysis
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    AI analysis of individual resume
                    sections
                  </p>
                </div>

              </div>

              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-4
                "
              >

                {Object.entries(
                  sectionAnalysis
                ).map(
                  (
                    [section, analysis],
                    index
                  ) => (
                    <motion.div
                      key={section}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.08,
                      }}
                      className="
                        p-5
                        rounded-2xl
                        bg-gray-50
                        dark:bg-white/[0.025]
                        border
                        border-gray-200
                        dark:border-white/[0.07]
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          mb-3
                        "
                      >

                        <div
                          className="
                            w-2
                            h-2
                            rounded-full
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                          "
                        />

                        <h4
                          className="
                            font-black
                            text-gray-900
                            dark:text-white
                            capitalize
                          "
                        >
                          {section}
                        </h4>

                      </div>

                      <p
                        className="
                          text-sm
                          leading-6
                          text-gray-600
                          dark:text-gray-400
                        "
                      >
                        {typeof analysis ===
                        'string'
                          ? analysis
                          : JSON.stringify(
                              analysis
                            )}
                      </p>

                    </motion.div>
                  )
                )}

              </div>

            </motion.div>
          )}


          {/* =================================================
              ANALYZE AGAIN
          ================================================= */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-4
              p-5
              rounded-2xl
              border
              border-gray-200
              dark:border-white/[0.08]
              bg-gray-50
              dark:bg-white/[0.02]
            "
          >

            <div>
              <p
                className="
                  text-sm
                  font-black
                  text-gray-900
                  dark:text-white
                "
              >
                Want to check another version?
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Select another resume and run the
                analysis again.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                !selectedResume ||
                analyzing
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-violet-600
                text-white
                text-sm
                font-black
                shadow-lg
                shadow-blue-500/10
                hover:-translate-y-0.5
                transition
                disabled:opacity-50
              "
            >
              <RefreshCw size={16} />
              Analyze Again
            </button>

          </div>

        </motion.div>
      )}


      {/* =====================================================
          READY STATE
      ===================================================== */}

      {!report &&
        !analyzing &&
        !loading &&
        resumes.length > 0 && (
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
              rounded-[28px]
              border
              border-gray-200
              dark:border-white/[0.08]
              bg-white
              dark:bg-[#0b0f18]
              p-10
              md:p-14
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
                from-blue-500/10
                to-violet-500/10
                flex
                items-center
                justify-center
              "
            >
              <BarChart3
                size={35}
                className="text-blue-500"
              />
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
              Your resume is ready
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
              Select your resume above and start
              the AI analysis to discover its ATS
              score and improvement opportunities.
            </p>

            <button
              type="button"
              onClick={handleAnalyze}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                px-6
                py-3
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-violet-600
                text-white
                text-sm
                font-black
                shadow-xl
                hover:-translate-y-0.5
                transition
              "
            >
              <Zap
                size={17}
                fill="currentColor"
              />
              Start ATS Analysis
            </button>

          </motion.div>
        )}

    </div>
  );
}


/* ============================================================
   SMALL ICON COMPONENT
   ============================================================ */

function FileCheckIcon() {
  return (
    <div className="relative">
      <FileText
        size={18}
        className="text-emerald-500"
      />

      <CheckCircle2
        size={9}
        className="
          absolute
          -right-1
          -bottom-1
          text-emerald-500
          bg-white
          dark:bg-[#0b0f18]
          rounded-full
        "
      />
    </div>
  );
}