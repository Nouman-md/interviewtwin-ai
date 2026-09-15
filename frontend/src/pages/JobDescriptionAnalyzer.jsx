import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI, atsAPI } from '../services/api';
import {
  Briefcase,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  FileText,
  Zap,
  Sparkles,
  Search,
  Brain,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Award,
  ClipboardCheck,
} from 'lucide-react';

const getMatchStyle = (score) => {
  const value = Number(score || 0);

  if (value >= 80) {
    return {
      label: 'Excellent Match',
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-400 to-teal-500',
    };
  }

  if (value >= 60) {
    return {
      label: 'Good Match',
      text: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      gradient: 'from-amber-400 to-orange-500',
    };
  }

  return {
    label: 'Needs Improvement',
    text: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    gradient: 'from-red-400 to-rose-500',
  };
};

export default function JobDescriptionAnalyzer() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

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
          data.find((resume) => resume.isPrimary) ||
          data[0];

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
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    if (!selectedResume) {
      setError('Please select a resume.');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');
      setAnalysis(null);

      const response =
        await atsAPI.analyzeJobMatchText(
          selectedResume,
          {
            jobDescription: jobDescription,
          }
        );

      const result = response.data;

      setAnalysis({
        matchPercentage: Math.round(
          Number(result.matchPercentage || 0)
        ),
        matchingSkills:
          result.matchingSkills || [],
        missingSkills:
          result.missingSkills || [],
        suggestions:
          result.suggestions || [],
      });
    } catch (err) {
      console.error(
        'Job match analysis error:',
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

  const selectedResumeObject =
    resumes.find(
      (resume) =>
        resume.resumeId === selectedResume
    );

  const matchPercentage =
    Number(
      analysis?.matchPercentage || 0
    );

  const matchStyle =
    getMatchStyle(matchPercentage);

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
          AI-POWERED JOB MATCH
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
              Job Match
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
              Compare your resume with a job description
              and discover how closely your skills match
              the role.
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
                bg-violet-500/10
                flex
                items-center
                justify-center
              "
            >
              <ShieldCheck
                size={20}
                className="text-violet-500"
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
                Match Engine
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

          </motion.div>
        )}
      </AnimatePresence>


      {/* =====================================================
          PREMIUM MATCH BUILDER
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
          border-violet-400/20
          shadow-2xl
          dark:shadow-black/30
        "
      >

        {/* BACKGROUND */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#312e81]
            via-[#5b21b6]
            to-[#9333ea]
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
            bg-fuchsia-400/20
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
            bg-blue-400/20
            blur-3xl
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
              grid
              lg:grid-cols-[0.8fr_1.2fr]
              gap-8
            "
          >

            {/* LEFT INFORMATION */}

            <div className="flex flex-col justify-center">

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
                <Briefcase
                  size={27}
                  className="text-white"
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
                Find your job fit
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
                Match your resume against the
                requirements of your target role using
                AI-powered skill analysis.
              </p>

              <div
                className="
                  mt-7
                  space-y-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-white/80
                    text-xs
                    font-semibold
                  "
                >
                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-white/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Search size={15} />
                  </div>

                  Compare job requirements
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-white/80
                    text-xs
                    font-semibold
                  "
                >
                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-white/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Target size={15} />
                  </div>

                  Identify matching skills
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-white/80
                    text-xs
                    font-semibold
                  "
                >
                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-white/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Lightbulb size={15} />
                  </div>

                  Get personalized suggestions
                </div>

              </div>

            </div>


            {/* RIGHT INPUT */}

            <div
              className="
                p-5
                md:p-6
                rounded-2xl
                bg-black/15
                border
                border-white/10
                backdrop-blur-md
              "
            >

              {/* RESUME */}

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
                Resume to Compare
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

                <div className="relative">

                  <FileText
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/50
                      pointer-events-none
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
                    "
                  >

                    {resumes.map(
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
                    size={28}
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


              {/* JOB DESCRIPTION */}

              {resumes.length > 0 && (
                <>
                  <div className="mt-5">

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-3
                      "
                    >

                      <label
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-wider
                          text-white/60
                        "
                      >
                        Job Description
                      </label>

                      <span
                        className="
                          text-[10px]
                          text-white/40
                        "
                      >
                        {jobDescription.length}
                        {' '}
                        characters
                      </span>

                    </div>

                    <textarea
                      value={jobDescription}
                      onChange={(e) =>
                        setJobDescription(
                          e.target.value
                        )
                      }
                      placeholder="Paste the job description here..."
                      className="
                        w-full
                        h-52
                        resize-none
                        p-4
                        rounded-xl
                        bg-white/10
                        border
                        border-white/15
                        text-white
                        placeholder:text-white/35
                        text-sm
                        leading-6
                        outline-none
                        focus:border-white/40
                      "
                    />

                  </div>


                  <motion.button
                    whileHover={{
                      scale: 1.015,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={handleAnalyze}
                    disabled={
                      !jobDescription.trim() ||
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
                      disabled:opacity-50
                    "
                  >

                    {analyzing ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />

                        Comparing with AI...
                      </>
                    ) : (
                      <>
                        <Zap
                          size={18}
                          fill="currentColor"
                        />

                        Analyze Job Match

                        <ArrowRight
                          size={17}
                        />
                      </>
                    )}

                  </motion.button>

                </>
              )}

            </div>

          </div>

        </div>

      </motion.div>


      {/* =====================================================
          ANALYZING
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
            }}
            className="
              mb-8
              p-8
              rounded-[28px]
              border
              border-violet-200
              dark:border-violet-500/20
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
                  border-violet-500/10
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border-4
                  border-transparent
                  border-t-violet-500
                  border-r-fuchsia-500
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
                  text-violet-500
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
              AI is comparing your profile
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Matching your resume against the
              job requirements and identifying gaps...
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
          RESULTS
      ===================================================== */}

      {analysis && !analyzing && (
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
          className="space-y-6"
        >

          {/* =================================================
              MATCH SCORE
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
                -top-40
                -right-40
                w-96
                h-96
                rounded-full
                bg-violet-500/5
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

              {/* SCORE */}

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
                    stroke="url(#matchGradient)"
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
                          matchPercentage /
                            100),
                    }}
                    transition={{
                      duration: 1.5,
                      ease: 'easeOut',
                    }}
                  />

                  <defs>
                    <linearGradient
                      id="matchGradient"
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
                    {matchPercentage}
                    %
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-gray-400
                    "
                  >
                    JOB MATCH
                  </span>

                </div>

              </div>


              {/* INFO */}

              <div
                className="
                  flex-1
                  text-center
                  lg:text-left
                "
              >

                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    ${matchStyle.bg}
                    ${matchStyle.text}
                    text-[11px]
                    font-black
                    mb-4
                  `}
                >

                  <Award size={13} />

                  {matchStyle.label}

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
                  {matchPercentage >= 80
                    ? 'You are highly aligned with this role.'
                    : matchPercentage >= 60
                    ? 'You have a solid foundation for this role.'
                    : 'There are important gaps to work on.'}
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
                  {matchPercentage >= 80
                    ? 'Your resume covers most of the important requirements identified in the job description.'
                    : matchPercentage >= 60
                    ? 'Your profile matches several requirements, but strengthening the missing areas could improve your chances.'
                    : 'Review the missing skills and recommendations below before applying.'}
                </p>


                {/* QUICK STATS */}

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
                      p-4
                      rounded-xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-black
                        text-gray-400
                      "
                    >
                      Match
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
                      {matchPercentage}%
                    </p>

                  </div>

                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-black
                        text-gray-400
                      "
                    >
                      Matching
                    </p>

                    <p
                      className="
                        mt-1
                        text-xl
                        font-black
                        text-emerald-500
                      "
                    >
                      {
                        analysis.matchingSkills
                          .length
                      }
                    </p>

                  </div>

                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-black
                        text-gray-400
                      "
                    >
                      Missing
                    </p>

                    <p
                      className="
                        mt-1
                        text-xl
                        font-black
                        text-orange-500
                      "
                    >
                      {
                        analysis.missingSkills
                          .length
                      }
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              SKILL COMPARISON
          ================================================= */}

          <div
            className="
              grid
              lg:grid-cols-2
              gap-5
            "
          >

            {/* MATCHING */}

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
                    Matching Skills
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Skills already present in your resume
                  </p>
                </div>

                <span
                  className="
                    ml-auto
                    px-2.5
                    py-1
                    rounded-lg
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-400
                    text-xs
                    font-black
                  "
                >
                  {
                    analysis.matchingSkills
                      .length
                  }
                </span>

              </div>


              {analysis.matchingSkills.length >
              0 ? (

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {analysis.matchingSkills.map(
                    (skill, index) => (
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

                        {skill}

                      </motion.span>
                    )
                  )}

                </div>

              ) : (

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  No matching skills were detected.
                </p>

              )}

            </motion.div>


            {/* MISSING */}

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
                delay: 0.1,
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
                  <XCircle
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
                    Missing Skills
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Areas worth improving
                  </p>
                </div>

                <span
                  className="
                    ml-auto
                    px-2.5
                    py-1
                    rounded-lg
                    bg-orange-500/10
                    text-orange-600
                    dark:text-orange-400
                    text-xs
                    font-black
                  "
                >
                  {
                    analysis.missingSkills
                      .length
                  }
                </span>

              </div>


              {analysis.missingSkills.length >
              0 ? (

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {analysis.missingSkills.map(
                    (skill, index) => (
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
                          bg-orange-500/10
                          border
                          border-orange-500/10
                          text-orange-700
                          dark:text-orange-300
                          text-xs
                          font-bold
                        "
                      >

                        <XCircle size={12} />

                        {skill}

                      </motion.span>
                    )
                  )}

                </div>

              ) : (

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-emerald-600
                    dark:text-emerald-400
                    font-semibold
                  "
                >

                  <CheckCircle2 size={17} />

                  No major skill gaps detected.

                </div>

              )}

            </motion.div>

          </div>


          {/* =================================================
              SUGGESTIONS
          ================================================= */}

          {analysis.suggestions.length >
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
                border-violet-200
                dark:border-violet-500/20
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
                    bg-violet-500/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Lightbulb
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
                    AI Recommendations
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Ways to improve your match for this role
                  </p>
                </div>

              </div>


              <div className="p-6 space-y-3">

                {analysis.suggestions.map(
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
                        bg-violet-50
                        dark:bg-violet-500/[0.05]
                        border
                        border-violet-100
                        dark:border-violet-500/10
                      "
                    >

                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-violet-500
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
                          text-violet-400
                        "
                      />

                    </motion.div>
                  )
                )}

              </div>

            </motion.div>
          )}


          {/* =================================================
              FOOTER ACTION
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

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

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
                <ClipboardCheck
                  size={18}
                  className="text-blue-500"
                />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-black
                    text-gray-900
                    dark:text-white
                  "
                >
                  Ready to improve your match?
                </p>

                <p
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mt-0.5
                  "
                >
                  Update your resume and analyze again.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                !selectedResume ||
                !jobDescription.trim() ||
                analyzing
              }
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                text-white
                text-sm
                font-black
                shadow-lg
                shadow-violet-500/10
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
          EMPTY / READY STATE
      ===================================================== */}

      {!analysis &&
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
                from-violet-500/10
                to-fuchsia-500/10
                flex
                items-center
                justify-center
              "
            >

              <TrendingUp
                size={35}
                className="text-violet-500"
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
              Ready to find your match?
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
              Select your resume, paste the target
              job description above and let AI identify
              your strengths and skill gaps.
            </p>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                !selectedResume ||
                !jobDescription.trim()
              }
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                px-6
                py-3
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                text-white
                text-sm
                font-black
                shadow-xl
                disabled:opacity-40
              "
            >

              <Zap
                size={17}
                fill="currentColor"
              />

              Start Job Match

            </button>

          </motion.div>
        )}

    </div>
  );
}