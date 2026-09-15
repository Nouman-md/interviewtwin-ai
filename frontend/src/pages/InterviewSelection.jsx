import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewAPI } from '../services/api';
import {
  Code,
  Users,
  Cpu,
  Database,
  Brain,
  Server,
  Network,
  FileText,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Trophy,
  Zap,
  ShieldCheck,
  BarChart3,
  AlertCircle,
  Play,
  Layers,
  X,
} from 'lucide-react';

const interviewTypes = [
  {
    id: 'TECHNICAL_INTERVIEW',
    title: 'Technical Interview',
    shortTitle: 'Technical',
    description:
      'Test your core technical knowledge with questions on system design, data structures, algorithms, and computer science fundamentals.',
    icon: Code,
    gradient: 'from-blue-500 via-indigo-500 to-violet-600',
    glow: 'bg-blue-500/20',
    category: 'Technical',
    difficulty: 'Intermediate',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'HR_INTERVIEW',
    title: 'HR Interview',
    shortTitle: 'HR',
    description:
      'Practice behavioral and communication questions commonly asked by HR professionals during placement interviews.',
    icon: Users,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
    glow: 'bg-violet-500/20',
    category: 'Behavioral',
    difficulty: 'Beginner',
    questions: 15,
    time: '15–25 min',
  },
  {
    id: 'JAVA_INTERVIEW',
    title: 'Java Interview',
    shortTitle: 'Java',
    description:
      'Strengthen your Java knowledge with questions covering syntax, OOP, collections, exceptions, and core concepts.',
    icon: Cpu,
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    glow: 'bg-orange-500/20',
    category: 'Programming',
    difficulty: 'Intermediate',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'SQL_INTERVIEW',
    title: 'SQL Interview',
    shortTitle: 'SQL',
    description:
      'Practice SQL queries, joins, aggregations, database concepts, optimization, and query-solving questions.',
    icon: Database,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    glow: 'bg-emerald-500/20',
    category: 'Database',
    difficulty: 'Intermediate',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'OOP_INTERVIEW',
    title: 'OOP Interview',
    shortTitle: 'OOP',
    description:
      'Master object-oriented programming concepts including inheritance, polymorphism, abstraction, and encapsulation.',
    icon: Brain,
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    glow: 'bg-rose-500/20',
    category: 'Programming',
    difficulty: 'Intermediate',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'DBMS_INTERVIEW',
    title: 'DBMS Interview',
    shortTitle: 'DBMS',
    description:
      'Test your understanding of database management systems, normalization, transactions, indexing, and optimization.',
    icon: Server,
    gradient: 'from-indigo-500 via-blue-500 to-cyan-600',
    glow: 'bg-indigo-500/20',
    category: 'Database',
    difficulty: 'Intermediate',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'OS_INTERVIEW',
    title: 'Operating Systems',
    shortTitle: 'Operating Systems',
    description:
      'Practice operating system concepts including processes, threads, scheduling, memory management, and deadlocks.',
    icon: Server,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    glow: 'bg-amber-500/20',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'COMPUTER_NETWORKS_INTERVIEW',
    title: 'Computer Networks',
    shortTitle: 'Networks',
    description:
      'Test your knowledge of networking protocols, OSI and TCP/IP models, routing, security, and communication.',
    icon: Network,
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    glow: 'bg-cyan-500/20',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'RESUME_BASED_INTERVIEW',
    title: 'Resume Based',
    shortTitle: 'Resume Based',
    description:
      'Practice interview questions generated around your resume, projects, technical skills, and experience.',
    icon: FileText,
    gradient: 'from-violet-500 via-purple-500 to-indigo-600',
    glow: 'bg-violet-500/20',
    category: 'Personalized',
    difficulty: 'Advanced',
    questions: 15,
    time: '20–30 min',
  },
  {
    id: 'CASE_INTERVIEW',
    title: 'Case Interview',
    shortTitle: 'Case',
    description:
      'Solve realistic case scenarios designed to evaluate structured thinking, problem-solving, and decision-making.',
    icon: Target,
    gradient: 'from-indigo-500 via-purple-500 to-fuchsia-600',
    glow: 'bg-indigo-500/20',
    category: 'Problem Solving',
    difficulty: 'Advanced',
    questions: 15,
    time: '25–35 min',
  },
];

export default function InterviewSelection() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(
    interviewTypes[0]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartInterview = async () => {
    if (!selectedType || loading) return;

    try {
      setLoading(true);
      setError('');

      const response =
        await interviewAPI.startInterview(
          selectedType.id
        );

      const sessionId =
        response.data.sessionId;

      /*
       * Keep your existing route behavior.
       * Technical interview uses technical-interview.
       * HR uses hr-interview.
       * Case uses case-interview.
       * Other categories continue through technical-interview
       * unless your existing routing has dedicated pages.
       */

      const route =
        selectedType.id.includes('HR')
          ? 'hr-interview'
          : selectedType.id.includes('CASE')
          ? 'case-interview'
          : 'technical-interview';

      navigate(
        `/${route}/${sessionId}`
      );
    } catch (err) {
      console.error(
        'Failed to start interview:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to start interview. Please try again.'
      );

      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-14">

      {/* =====================================================
          PREMIUM PAGE HEADER
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
          AI INTERVIEW STUDIO
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
              Practice Interviews
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
              Choose an interview category and practice
              with AI-powered questions designed to prepare
              you for real placement interviews.
            </p>

          </div>

          {/* TOP STATS */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                px-3
                py-2.5
                rounded-xl
                bg-white
                dark:bg-[#0b0f18]
                border
                border-gray-200
                dark:border-white/[0.08]
              "
            >

              <Layers
                size={16}
                className="text-blue-500"
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                10 Categories
              </span>

            </div>

            <div
              className="
                flex
                items-center
                gap-2
                px-3
                py-2.5
                rounded-xl
                bg-white
                dark:bg-[#0b0f18]
                border
                border-gray-200
                dark:border-white/[0.08]
              "
            >

              <Zap
                size={16}
                className="text-violet-500"
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                AI Powered
              </span>

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
          SELECTED INTERVIEW HERO
      ===================================================== */}

      <motion.div
        layout
        className="
          relative
          overflow-hidden
          rounded-[30px]
          mb-8
          border
          border-white/10
          shadow-2xl
        "
      >

        {/* GRADIENT */}

        <motion.div
          layout
          className={`
            absolute
            inset-0
            bg-gradient-to-br
            ${selectedType.gradient}
          `}
        />

        {/* GLOW */}

        <div
          className="
            absolute
            -top-32
            -right-20
            w-96
            h-96
            rounded-full
            bg-white/10
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
            bg-black/10
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
                  flex
                  items-center
                  gap-4
                  mb-5
                "
              >

                <motion.div
                  key={selectedType.id}
                  initial={{
                    scale: 0.7,
                    rotate: -10,
                  }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                  }}
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-white/15
                    border
                    border-white/20
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    shadow-xl
                  "
                >
                  <selectedType.icon
                    size={30}
                    className="text-white"
                  />
                </motion.div>

                <div>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      font-black
                      text-white/60
                    "
                  >
                    Selected Interview
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      md:text-3xl
                      font-black
                      text-white
                    "
                  >
                    {selectedType.title}
                  </h2>

                </div>

              </div>


              <p
                className="
                  max-w-2xl
                  text-sm
                  leading-6
                  text-white/75
                "
              >
                {selectedType.description}
              </p>


              {/* META */}

              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                  mt-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    bg-white/10
                    border
                    border-white/10
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  <Target size={14} />
                  {selectedType.category}
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    bg-white/10
                    border
                    border-white/10
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  <BarChart3 size={14} />
                  {selectedType.difficulty}
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    bg-white/10
                    border
                    border-white/10
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  <FileText size={14} />
                  {selectedType.questions} Questions
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    bg-white/10
                    border
                    border-white/10
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  <Clock size={14} />
                  {selectedType.time}
                </div>

              </div>

            </div>


            {/* RIGHT CTA */}

            <div
              className="
                w-full
                lg:w-[320px]
                p-5
                rounded-2xl
                bg-black/15
                border
                border-white/10
                backdrop-blur-md
              "
            >

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
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ShieldCheck
                    size={20}
                    className="text-white"
                  />
                </div>

                <div>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      font-black
                      text-white/50
                    "
                  >
                    Interview Mode
                  </p>

                  <p
                    className="
                      text-sm
                      font-black
                      text-white
                    "
                  >
                    AI Evaluation
                  </p>

                </div>

              </div>


              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  mb-4
                "
              >

                <div
                  className="
                    p-3
                    rounded-xl
                    bg-white/[0.07]
                    border
                    border-white/10
                  "
                >

                  <p
                    className="
                      text-[10px]
                      text-white/40
                      uppercase
                      font-black
                    "
                  >
                    Questions
                  </p>

                  <p
                    className="
                      mt-1
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    {selectedType.questions}
                  </p>

                </div>

                <div
                  className="
                    p-3
                    rounded-xl
                    bg-white/[0.07]
                    border
                    border-white/10
                  "
                >

                  <p
                    className="
                      text-[10px]
                      text-white/40
                      uppercase
                      font-black
                    "
                  >
                    Duration
                  </p>

                  <p
                    className="
                      mt-1
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    {selectedType.time
                      .split('–')[0]}
                  </p>

                </div>

              </div>


              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={handleStartInterview}
                disabled={loading}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3.5
                  rounded-xl
                  bg-white
                  text-gray-950
                  text-sm
                  font-black
                  shadow-xl
                  disabled:opacity-60
                "
              >

                {loading ? (
                  <>
                    <div
                      className="
                        w-4
                        h-4
                        rounded-full
                        border-2
                        border-gray-300
                        border-t-gray-900
                        animate-spin
                      "
                    />

                    Starting Interview...
                  </>
                ) : (
                  <>
                    <Play
                      size={17}
                      fill="currentColor"
                    />

                    Start Interview

                    <ArrowRight
                      size={17}
                    />
                  </>
                )}

              </motion.button>

            </div>

          </div>

        </div>

      </motion.div>


      {/* =====================================================
          CATEGORY SECTION
      ===================================================== */}

      <div>

        <div
          className="
            flex
            items-end
            justify-between
            gap-4
            mb-5
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
              Choose your interview
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Select a category to customize your
              practice session.
            </p>

          </div>

          <div
            className="
              hidden
              sm:flex
              items-center
              gap-2
              text-xs
              font-bold
              text-gray-400
            "
          >
            <Sparkles size={14} />
            AI-powered practice
          </div>

        </div>


        <motion.div
          layout
          className="
            grid
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
          "
        >

          {interviewTypes.map(
            (type, index) => {
              const Icon = type.icon;

              const isSelected =
                selectedType.id ===
                type.id;

              return (
                <motion.button
                  key={type.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() => {
                    setSelectedType(type);
                    setError('');
                  }}
                  className={`
                    relative
                    text-left
                    overflow-hidden
                    rounded-[24px]
                    p-5
                    border
                    transition-all
                    duration-300
                    ${
                      isSelected
                        ? `
                          border-blue-500/50
                          dark:border-blue-400/40
                          bg-blue-50/50
                          dark:bg-blue-500/[0.06]
                          shadow-xl
                          shadow-blue-500/10
                        `
                        : `
                          border-gray-200
                          dark:border-white/[0.07]
                          bg-white
                          dark:bg-[#0b0f18]
                          hover:border-gray-300
                          dark:hover:border-white/[0.14]
                          hover:shadow-xl
                          dark:hover:shadow-black/20
                        `
                    }
                  `}
                >

                  {/* SELECTED */}

                  {isSelected && (
                    <div
                      className="
                        absolute
                        top-4
                        right-4
                        w-7
                        h-7
                        rounded-full
                        bg-blue-500
                        text-white
                        flex
                        items-center
                        justify-center
                        shadow-lg
                      "
                    >
                      <CheckCircle2
                        size={17}
                      />
                    </div>
                  )}


                  {/* ICON */}

                  <div
                    className={`
                      w-12
                      h-12
                      rounded-2xl
                      bg-gradient-to-br
                      ${type.gradient}
                      flex
                      items-center
                      justify-center
                      shadow-lg
                      mb-5
                      transition-transform
                      duration-300
                      ${
                        isSelected
                          ? 'scale-105'
                          : ''
                      }
                    `}
                  >
                    <Icon
                      size={23}
                      className="text-white"
                    />
                  </div>


                  {/* TITLE */}

                  <h3
                    className="
                      text-lg
                      font-black
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {type.title}
                  </h3>


                  {/* DESCRIPTION */}

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-gray-500
                      dark:text-gray-400
                      min-h-[60px]
                    "
                  >
                    {type.description}
                  </p>


                  {/* META */}

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
                        px-2.5
                        py-1.5
                        rounded-lg
                        bg-gray-100
                        dark:bg-white/[0.05]
                        text-[10px]
                        font-black
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {type.difficulty}
                    </span>

                    <span
                      className="
                        px-2.5
                        py-1.5
                        rounded-lg
                        bg-gray-100
                        dark:bg-white/[0.05]
                        text-[10px]
                        font-black
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {type.questions} Questions
                    </span>

                  </div>


                  {/* SELECT ACTION */}

                  <div
                    className={`
                      mt-5
                      pt-4
                      border-t
                      flex
                      items-center
                      justify-between
                      ${
                        isSelected
                          ? `
                            border-blue-500/10
                          `
                          : `
                            border-gray-100
                            dark:border-white/[0.05]
                          `
                      }
                    `}
                  >

                    <span
                      className={`
                        text-xs
                        font-black
                        ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }
                      `}
                    >
                      {isSelected
                        ? 'Selected'
                        : 'Select Interview'}
                    </span>

                    <ArrowRight
                      size={16}
                      className={`
                        transition-transform
                        ${
                          isSelected
                            ? 'text-blue-500 translate-x-1'
                            : 'text-gray-400'
                        }
                      `}
                    />

                  </div>

                </motion.button>
              );
            }
          )}

        </motion.div>

      </div>


      {/* =====================================================
          HOW IT WORKS
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
          delay: 0.3,
        }}
        className="
          mt-8
          rounded-[26px]
          border
          border-gray-200
          dark:border-white/[0.08]
          bg-white
          dark:bg-[#0b0f18]
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
              w-12
              h-12
              rounded-2xl
              bg-blue-500/10
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <Trophy
              size={22}
              className="text-blue-500"
            />
          </div>

          <div className="flex-1">

            <h3
              className="
                text-lg
                font-black
                text-gray-900
                dark:text-white
              "
            >
              How your AI interview works
            </h3>

            <div
              className="
                grid
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
                mt-4
              "
            >

              {[
                {
                  icon: Play,
                  title: 'Start',
                  text: 'Choose an interview category.',
                },
                {
                  icon: FileText,
                  title: 'Answer',
                  text: 'Respond to AI-generated questions.',
                },
                {
                  icon: Brain,
                  title: 'Evaluate',
                  text: 'Your answers are evaluated by AI.',
                },
                {
                  icon: BarChart3,
                  title: 'Improve',
                  text: 'Review feedback and performance.',
                },
              ].map(
                (step, index) => {
                  const StepIcon =
                    step.icon;

                  return (
                    <div
                      key={index}
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-gray-100
                          dark:bg-white/[0.05]
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                        "
                      >
                        <StepIcon
                          size={14}
                          className="text-blue-500"
                        />
                      </div>

                      <div>

                        <p
                          className="
                            text-xs
                            font-black
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {step.title}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[11px]
                            leading-4
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {step.text}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
}