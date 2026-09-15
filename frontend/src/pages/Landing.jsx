import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

import {
  ArrowRight,
  ArrowUpRight,
  Zap,
  BarChart3,
  Brain,
  Code,
  Users,
  Clock,
  Award,
  Sparkles,
  Moon,
  Sun,
  CheckCircle2,
  ShieldCheck,
  Target,
  TrendingUp,
  Star,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ChevronRight,
  Play,
  Check,
} from 'lucide-react';


// =========================================================
// ANIMATION VARIANTS
// =========================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


const fadeIn = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.7,
    },
  },
};


const stagger = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
    },
  },
};


// =========================================================
// COMPONENT
// =========================================================

export default function Landing() {

  const navigate = useNavigate();

  const {
    isDark,
    toggleTheme,
  } = useTheme();


  // =========================================================
  // FEATURES
  // IMPORTANT:
  // Keep these routes connected to your existing working pages.
  // =========================================================

  const features = [

    {
      title: 'ATS Resume Checker',

      desc:
        'Analyze your resume against ATS requirements and discover exactly what needs improvement.',

      icon: Zap,

      gradient:
        'from-blue-500 via-cyan-500 to-sky-500',

      glow:
        'group-hover:shadow-blue-500/20',

      path:
        '/ats-checker',
    },


    {
      title: 'AI Mock Interviews',

      desc:
        'Practice realistic interviews with AI-powered questions, evaluation and instant feedback.',

      icon: Brain,

      gradient:
        'from-violet-500 via-purple-500 to-fuchsia-500',

      glow:
        'group-hover:shadow-purple-500/20',

      path:
        '/interview-selection',
    },


    {
      title: 'Coding Challenges',

      desc:
        'Strengthen your problem-solving skills with coding challenges and performance analysis.',

      icon: Code,

      gradient:
        'from-emerald-500 via-teal-500 to-cyan-500',

      glow:
        'group-hover:shadow-emerald-500/20',

      path:
        '/coding-round',
    },


    {
      title: 'Performance Tracking',

      desc:
        'Understand your preparation progress with detailed analytics and personalized insights.',

      icon: BarChart3,

      gradient:
        'from-orange-500 via-amber-500 to-yellow-500',

      glow:
        'group-hover:shadow-orange-500/20',

      path:
        '/performance',
    },

  ];


  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = [

    {
      title: 'Technical',

      subtitle:
        'Build strong technical fundamentals.',

      types: [
        'Java',
        'SQL',
        'OOP',
        'DBMS',
        'Operating Systems',
        'Computer Networks',
      ],

      icon:
        Code,

      gradient:
        'from-blue-500 to-cyan-500',

      path:
        '/interview-selection',
    },


    {
      title: 'HR & Soft Skills',

      subtitle:
        'Develop confidence and communication.',

      types: [
        'Communication',
        'Leadership',
        'Teamwork',
        'Problem Solving',
      ],

      icon:
        Users,

      gradient:
        'from-purple-500 to-fuchsia-500',

      path:
        '/interview-selection',
    },


    {
      title: 'Coding',

      subtitle:
        'Think faster. Solve better.',

      types: [
        'Data Structures',
        'Algorithms',
        'Problem Solving',
        'System Design',
      ],

      icon:
        Target,

      gradient:
        'from-emerald-500 to-teal-500',

      path:
        '/coding-round',
    },

  ];


  // =========================================================
  // STATS
  // =========================================================

  const stats = [

    {
      value: '10K+',
      label: 'Students',
      icon: Users,
    },

    {
      value: '95%',
      label: 'Success Rate',
      icon: TrendingUp,
    },

    {
      value: '50+',
      label: 'Categories',
      icon: Award,
    },

    {
      value: '24/7',
      label: 'AI Support',
      icon: Clock,
    },

  ];


  // =========================================================
  // PRICING
  // =========================================================

  const plans = [

    {
      name: 'Free',

      price: '₹0',

      period:
        'forever',

      description:
        'Start your interview preparation journey.',

      features: [
        'Basic interview practice',
        'Selected coding challenges',
        'Basic performance tracking',
        'Access to selected categories',
      ],

      popular:
        false,
    },


    {
      name: 'Pro',

      price: '₹299',

      period:
        '/month',

      description:
        'Everything you need for serious preparation.',

      features: [
        'Unlimited mock interviews',
        'Advanced ATS resume analysis',
        'Unlimited coding challenges',
        'Detailed performance analytics',
        'Personalized recommendations',
        'All interview categories',
      ],

      popular:
        true,
    },


    {
      name: 'Premium',

      price: '₹599',

      period:
        '/month',

      description:
        'The complete InterviewTwin experience.',

      features: [
        'Everything in Pro',
        'Advanced interview feedback',
        'Priority AI support',
        'Advanced preparation reports',
        'Personalized preparation insights',
        'Priority feature access',
      ],

      popular:
        false,
    },

  ];


  // =========================================================
  // CONTACT
  // =========================================================

  const contact = {

    email:
      'support.interviewtwin.ai@gmail.com',

    phone:
      '+91 9182778677',

    address:
      'Banglore, India',

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div
      className="
        min-h-screen
        overflow-hidden
        bg-white
        text-gray-900
        dark:bg-[#05070d]
        dark:text-white
        transition-colors
        duration-500
      "
    >


      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div
          className="
            absolute
            -top-40
            -right-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-blue-500/10
            dark:bg-blue-500/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            top-[40%]
            -left-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-purple-500/10
            dark:bg-purple-500/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-[20%]
            w-[400px]
            h-[400px]
            rounded-full
            bg-cyan-500/5
            blur-[120px]
          "
        />

      </div>



      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <motion.nav
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

        className="
          sticky
          top-0
          z-50
          border-b
          border-gray-200/60
          dark:border-white/[0.06]
          bg-white/80
          dark:bg-[#05070d]/80
          backdrop-blur-2xl
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
            py-4
            flex
            items-center
            justify-between
          "
        >


          {/* LOGO */}

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }

            className="
              flex
              items-center
              gap-3
              group
            "
          >

            <div
              className="
                relative
                w-10
                h-10
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                via-violet-500
                to-fuchsia-500
                flex
                items-center
                justify-center
                shadow-lg
                shadow-purple-500/20
                group-hover:scale-105
                transition-transform
              "
            >

              <Sparkles
                size={20}
                className="text-white"
              />

            </div>


            <div className="text-left">

              <div
                className="
                  text-xl
                  font-black
                  tracking-tight
                  text-gray-900
                  dark:text-white
                "
              >
                InterviewTwin
              </div>

              <div
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.22em]
                  text-gray-400
                  dark:text-gray-500
                  -mt-0.5
                "
              >
                AI Interview Platform
              </div>

            </div>

          </button>



          {/* DESKTOP NAVIGATION */}

          <div
            className="
              hidden
              lg:flex
              items-center
              gap-8
            "
          >

            <a
              href="#features"
              className="
                text-sm
                font-medium
                text-gray-600
                dark:text-gray-400
                hover:text-gray-900
                dark:hover:text-white
                transition
              "
            >
              Features
            </a>


            <a
              href="#categories"
              className="
                text-sm
                font-medium
                text-gray-600
                dark:text-gray-400
                hover:text-gray-900
                dark:hover:text-white
                transition
              "
            >
              Categories
            </a>


            <a
              href="#pricing"
              className="
                text-sm
                font-medium
                text-gray-600
                dark:text-gray-400
                hover:text-gray-900
                dark:hover:text-white
                transition
              "
            >
              Pricing
            </a>


            <a
              href="#contact"
              className="
                text-sm
                font-medium
                text-gray-600
                dark:text-gray-400
                hover:text-gray-900
                dark:hover:text-white
                transition
              "
            >
              Contact
            </a>

          </div>



          {/* ACTIONS */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <button
              onClick={toggleTheme}

              className="
                w-10
                h-10
                rounded-xl
                border
                border-gray-200
                dark:border-white/[0.08]
                bg-gray-50
                dark:bg-white/[0.04]
                flex
                items-center
                justify-center
                text-gray-600
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-white/[0.08]
                transition
              "
            >

              {isDark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}

            </button>


            <button
              onClick={() => navigate('/login')}

              className="
                hidden
                sm:block
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-white/[0.05]
                transition
              "
            >
              Login
            </button>


            <button
              onClick={() => navigate('/register')}

              className="
                hidden
                sm:flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-bold
                text-white
                bg-gradient-to-r
                from-blue-600
                via-violet-600
                to-purple-600
                shadow-lg
                shadow-purple-500/20
                hover:shadow-purple-500/40
                hover:-translate-y-0.5
                transition-all
              "
            >
              Get Started
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </motion.nav>



      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          relative
          pt-20
          md:pt-28
          pb-20
          md:pb-28
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
          "
        >

          <div
            className="
              grid
              lg:grid-cols-[1.1fr_0.9fr]
              gap-14
              items-center
            "
          >


            {/* LEFT */}

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
            >

              {/* Badge */}

              <motion.div variants={fadeUp}>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3.5
                    py-2
                    rounded-full
                    border
                    border-blue-200
                    dark:border-blue-400/20
                    bg-blue-50
                    dark:bg-blue-500/[0.08]
                    text-blue-600
                    dark:text-blue-300
                    text-xs
                    font-semibold
                    mb-7
                  "
                >

                  <span
                    className="
                      relative
                      flex
                      w-2
                      h-2
                    "
                  >

                    <span
                      className="
                        absolute
                        inline-flex
                        h-full
                        w-full
                        rounded-full
                        bg-blue-400
                        opacity-75
                        animate-ping
                      "
                    />

                    <span
                      className="
                        relative
                        inline-flex
                        rounded-full
                        h-2
                        w-2
                        bg-blue-500
                      "
                    />

                  </span>

                  AI-Powered Placement Preparation

                </div>

              </motion.div>



              {/* Heading */}

              <motion.h1
                variants={fadeUp}

                className="
                  text-5xl
                  md:text-6xl
                  lg:text-[72px]
                  leading-[0.98]
                  font-black
                  tracking-[-0.045em]
                  text-gray-950
                  dark:text-white
                "
              >

                Prepare Smarter.

                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-blue-500
                    via-violet-500
                    to-fuchsia-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  Interview Better.
                </span>

              </motion.h1>



              {/* Description */}

              <motion.p
                variants={fadeUp}

                className="
                  mt-7
                  text-lg
                  md:text-xl
                  leading-relaxed
                  text-gray-600
                  dark:text-gray-400
                  max-w-2xl
                "
              >

                Master interviews with AI-powered mock interviews,
                ATS resume analysis, coding challenges and
                intelligent performance insights.

              </motion.p>



              {/* Buttons */}

              <motion.div
                variants={fadeUp}

                className="
                  flex
                  flex-wrap
                  gap-4
                  mt-9
                "
              >

                <button
                  onClick={() => navigate('/register')}

                  className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    px-7
                    py-4
                    rounded-2xl
                    text-white
                    font-bold
                    bg-gradient-to-r
                    from-blue-600
                    via-violet-600
                    to-purple-600
                    shadow-xl
                    shadow-purple-500/20
                    hover:shadow-purple-500/40
                    hover:-translate-y-1
                    transition-all
                  "
                >

                  Start Preparing

                  <ArrowRight
                    size={19}
                    className="
                      group-hover:translate-x-1
                      transition-transform
                    "
                  />

                </button>


                <button
                  onClick={() => {
                    document
                      .getElementById('features')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      });
                  }}

                  className="
                    inline-flex
                    items-center
                    gap-3
                    px-7
                    py-4
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-white/[0.1]
                    bg-white
                    dark:bg-white/[0.04]
                    text-gray-800
                    dark:text-gray-200
                    font-semibold
                    hover:bg-gray-50
                    dark:hover:bg-white/[0.08]
                    transition
                  "
                >

                  <Play size={17} />

                  Explore Platform

                </button>

              </motion.div>



              {/* Trust */}

              <motion.div
                variants={fadeUp}

                className="
                  flex
                  items-center
                  gap-4
                  mt-9
                  text-sm
                  text-gray-500
                  dark:text-gray-500
                "
              >

                <div className="flex">

                  {[1, 2, 3, 4, 5].map((item) => (

                    <Star
                      key={item}
                      size={15}
                      className="
                        fill-amber-400
                        text-amber-400
                        -ml-0.5
                      "
                    />

                  ))}

                </div>

                <span>
                  Built for serious placement preparation
                </span>

              </motion.div>

            </motion.div>



            {/* RIGHT — PREMIUM DASHBOARD VISUAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              transition={{
                duration: 0.8,
                delay: 0.2,
              }}

              className="
                relative
                hidden
                md:block
              "
            >

              {/* Glow */}

              <div
                className="
                  absolute
                  inset-10
                  rounded-[40px]
                  bg-gradient-to-r
                  from-blue-500/20
                  via-purple-500/20
                  to-fuchsia-500/20
                  blur-[70px]
                "
              />


              {/* Main Card */}

              <div
                className="
                  relative
                  rounded-[30px]
                  border
                  border-gray-200
                  dark:border-white/[0.1]
                  bg-white/90
                  dark:bg-[#0b0f1a]/95
                  backdrop-blur-2xl
                  shadow-2xl
                  dark:shadow-black/50
                  p-5
                  overflow-hidden
                "
              >

                {/* Header */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    pb-5
                    border-b
                    border-gray-100
                    dark:border-white/[0.06]
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-gradient-to-br
                        from-blue-500
                        to-purple-600
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Brain
                        size={19}
                        className="text-white"
                      />
                    </div>

                    <div>

                      <div
                        className="
                          text-sm
                          font-bold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        InterviewTwin AI
                      </div>

                      <div
                        className="
                          text-xs
                          text-gray-400
                        "
                      >
                        Preparation Dashboard
                      </div>

                    </div>

                  </div>


                  <div
                    className="
                      px-2.5
                      py-1
                      rounded-full
                      bg-emerald-500/10
                      text-emerald-500
                      text-[10px]
                      font-bold
                    "
                  >
                    LIVE
                  </div>

                </div>



                {/* Score */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                    mt-5
                  "
                >

                  <div
                    className="
                      rounded-2xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                      border
                      border-gray-100
                      dark:border-white/[0.05]
                      p-5
                    "
                  >

                    <div
                      className="
                        text-xs
                        text-gray-400
                        mb-2
                      "
                    >
                      Interview Readiness
                    </div>

                    <div
                      className="
                        flex
                        items-end
                        gap-2
                      "
                    >

                      <span
                        className="
                          text-4xl
                          font-black
                          text-gray-900
                          dark:text-white
                        "
                      >
                        87
                      </span>

                      <span
                        className="
                          text-sm
                          text-emerald-500
                          font-semibold
                          mb-1
                        "
                      >
                        +12%
                      </span>

                    </div>

                    <div
                      className="
                        h-2
                        bg-gray-200
                        dark:bg-white/[0.08]
                        rounded-full
                        mt-4
                        overflow-hidden
                      "
                    >

                      <motion.div
                        initial={{
                          width: 0,
                        }}

                        animate={{
                          width: '87%',
                        }}

                        transition={{
                          duration: 1.3,
                          delay: 0.7,
                        }}

                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-blue-500
                          to-violet-500
                        "
                      />

                    </div>

                  </div>



                  <div
                    className="
                      rounded-2xl
                      bg-gray-50
                      dark:bg-white/[0.035]
                      border
                      border-gray-100
                      dark:border-white/[0.05]
                      p-5
                    "
                  >

                    <div
                      className="
                        text-xs
                        text-gray-400
                        mb-2
                      "
                    >
                      Problems Solved
                    </div>

                    <div
                      className="
                        text-4xl
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      126
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        text-xs
                        text-emerald-500
                        mt-2
                      "
                    >

                      <TrendingUp size={13} />

                      Improving

                    </div>

                  </div>

                </div>



                {/* AI Feedback */}

                <div
                  className="
                    mt-4
                    rounded-2xl
                    border
                    border-purple-200/60
                    dark:border-purple-500/10
                    bg-gradient-to-br
                    from-purple-50
                    to-blue-50
                    dark:from-purple-500/[0.06]
                    dark:to-blue-500/[0.04]
                    p-5
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

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <Sparkles
                        size={17}
                        className="text-purple-500"
                      />

                      <span
                        className="
                          text-sm
                          font-bold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        AI Feedback
                      </span>

                    </div>

                    <ChevronRight
                      size={17}
                      className="text-gray-400"
                    />

                  </div>


                  <p
                    className="
                      text-sm
                      leading-relaxed
                      text-gray-600
                      dark:text-gray-400
                    "
                  >
                    Your technical knowledge is strong.
                    Focus on explaining your approach more
                    clearly during interviews.
                  </p>

                </div>



                {/* Skills */}

                <div className="mt-4">

                  <div
                    className="
                      text-xs
                      font-semibold
                      text-gray-400
                      mb-3
                    "
                  >
                    SKILL DEVELOPMENT
                  </div>


                  <div className="space-y-3">

                    {[
                      ['Java', '92%'],
                      ['DSA', '81%'],
                      ['Communication', '74%'],
                    ].map(([name, value]) => (

                      <div key={name}>

                        <div
                          className="
                            flex
                            justify-between
                            text-xs
                            mb-1.5
                          "
                        >

                          <span
                            className="
                              text-gray-600
                              dark:text-gray-400
                            "
                          >
                            {name}
                          </span>

                          <span
                            className="
                              font-semibold
                              text-gray-800
                              dark:text-gray-200
                            "
                          >
                            {value}
                          </span>

                        </div>

                        <div
                          className="
                            h-1.5
                            rounded-full
                            bg-gray-200
                            dark:bg-white/[0.08]
                            overflow-hidden
                          "
                        >

                          <div
                            style={{
                              width: value,
                            }}

                            className="
                              h-full
                              rounded-full
                              bg-gradient-to-r
                              from-blue-500
                              to-purple-500
                            "
                          />

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>



      {/* =====================================================
          STATS
      ====================================================== */}

      <section
        className="
          relative
          border-y
          border-gray-100
          dark:border-white/[0.05]
          bg-gray-50/70
          dark:bg-white/[0.015]
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
            py-8
          "
        >

          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-4
              divide-x
              divide-gray-200
              dark:divide-white/[0.06]
            "
          >

            {stats.map((stat, index) => {

              const Icon = stat.icon;

              return (

                <motion.div
                  key={index}

                  initial={{
                    opacity: 0,
                    y: 15,
                  }}

                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}

                  viewport={{
                    once: true,
                  }}

                  transition={{
                    delay: index * 0.08,
                  }}

                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    px-4
                    py-3
                  "
                >

                  <Icon
                    size={20}
                    className="
                      text-blue-500
                    "
                  />

                  <div>

                    <div
                      className="
                        text-xl
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {stat.value}
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {stat.label}
                    </div>

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

      </section>



      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section
        id="features"
        className="
          relative
          py-24
          md:py-28
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
          "
        >

          <div className="max-w-2xl mb-14">

            <div
              className="
                text-xs
                uppercase
                tracking-[0.2em]
                font-bold
                text-blue-500
                mb-4
              "
            >
              Everything you need
            </div>

            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                tracking-tight
                text-gray-950
                dark:text-white
              "
            >
              One platform.
              <br />
              <span
                className="
                  text-gray-400
                  dark:text-gray-600
                "
              >
                Complete preparation.
              </span>
            </h2>

            <p
              className="
                mt-5
                text-gray-600
                dark:text-gray-400
                text-lg
                leading-relaxed
              "
            >
              From resume screening to final interview
              preparation, InterviewTwin brings your
              entire placement journey together.
            </p>

          </div>



          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}

            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
            "
          >

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (

                <motion.div
                  key={index}
                  variants={fadeUp}

                  onClick={() =>
                    navigate(feature.path)
                  }

                  className={`
                    group
                    relative
                    cursor-pointer
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-gray-200
                    dark:border-white/[0.08]
                    bg-white
                    dark:bg-[#0b0f18]
                    p-6
                    shadow-sm
                    dark:shadow-black/10
                    hover:-translate-y-2
                    hover:shadow-2xl
                    ${feature.glow}
                    transition-all
                    duration-500
                  `}
                >

                  {/* Glow */}

                  <div
                    className={`
                      absolute
                      -right-16
                      -top-16
                      w-40
                      h-40
                      rounded-full
                      bg-gradient-to-br
                      ${feature.gradient}
                      opacity-0
                      blur-3xl
                      group-hover:opacity-20
                      transition-opacity
                      duration-500
                    `}
                  />


                  {/* Icon */}

                  <div
                    className={`
                      relative
                      w-14
                      h-14
                      rounded-2xl
                      bg-gradient-to-br
                      ${feature.gradient}
                      flex
                      items-center
                      justify-center
                      shadow-lg
                      group-hover:scale-110
                      transition-transform
                      duration-500
                    `}
                  >

                    <Icon
                      size={25}
                      className="text-white"
                    />

                  </div>


                  <h3
                    className="
                      relative
                      mt-6
                      text-xl
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {feature.title}
                  </h3>


                  <p
                    className="
                      relative
                      mt-3
                      text-sm
                      leading-6
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {feature.desc}
                  </p>


                  <div
                    className="
                      relative
                      mt-6
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-bold
                      text-blue-500
                    "
                  >

                    Open Feature

                    <ArrowUpRight
                      size={16}
                      className="
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                        transition-transform
                      "
                    />

                  </div>

                </motion.div>

              );

            })}

          </motion.div>

        </div>

      </section>



      {/* =====================================================
          WHY INTERVIEWTWIN
      ====================================================== */}

      <section
        className="
          py-24
          bg-gray-50
          dark:bg-[#080b13]
          border-y
          border-gray-100
          dark:border-white/[0.04]
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
          "
        >

          <div
            className="
              grid
              lg:grid-cols-2
              gap-16
              items-center
            "
          >

            <div>

              <div
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  font-bold
                  text-purple-500
                  mb-4
                "
              >
                Why InterviewTwin
              </div>

              <h2
                className="
                  text-4xl
                  md:text-5xl
                  font-black
                  tracking-tight
                  text-gray-950
                  dark:text-white
                "
              >
                Preparation that
                <br />
                <span
                  className="
                    bg-gradient-to-r
                    from-purple-500
                    to-blue-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  adapts to you.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  text-lg
                  text-gray-600
                  dark:text-gray-400
                  leading-relaxed
                  max-w-xl
                "
              >
                Instead of practicing randomly, understand
                your strengths, identify your weaknesses and
                focus your preparation where it matters most.
              </p>

            </div>



            <div className="space-y-4">

              {[
                {
                  icon: Brain,
                  title: 'AI-Powered Feedback',
                  desc: 'Receive intelligent feedback after every practice session.',
                },

                {
                  icon: ShieldCheck,
                  title: 'Structured Preparation',
                  desc: 'Follow a clear preparation path across multiple interview areas.',
                },

                {
                  icon: TrendingUp,
                  title: 'Track Your Growth',
                  desc: 'See measurable progress as your preparation improves.',
                },

              ].map((item, index) => {

                const Icon = item.icon;

                return (

                  <motion.div
                    key={index}

                    whileHover={{
                      x: 6,
                    }}

                    className="
                      flex
                      gap-5
                      p-5
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-white/[0.07]
                      bg-white
                      dark:bg-white/[0.025]
                      transition
                    "
                  >

                    <div
                      className="
                        flex-shrink-0
                        w-12
                        h-12
                        rounded-xl
                        bg-gradient-to-br
                        from-blue-500/10
                        to-purple-500/10
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Icon
                        size={21}
                        className="text-blue-500"
                      />

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        {item.title}
                      </h3>

                      <p
                        className="
                          mt-1.5
                          text-sm
                          leading-6
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        {item.desc}
                      </p>

                    </div>

                  </motion.div>

                );

              })}

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section
        id="categories"
        className="py-24"
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
          "
        >

          <div className="text-center max-w-2xl mx-auto mb-14">

            <div
              className="
                text-xs
                uppercase
                tracking-[0.2em]
                font-bold
                text-emerald-500
                mb-4
              "
            >
              Practice your way
            </div>

            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                tracking-tight
                text-gray-950
                dark:text-white
              "
            >
              Interview Categories
            </h2>

            <p
              className="
                mt-5
                text-lg
                text-gray-600
                dark:text-gray-400
              "
            >
              Prepare across technical, behavioral and
              problem-solving interviews.
            </p>

          </div>



          <div
            className="
              grid
              md:grid-cols-3
              gap-6
            "
          >

            {categories.map((category, index) => {

              const Icon = category.icon;

              return (

                <motion.div
                  key={index}

                  whileHover={{
                    y: -8,
                  }}

                  onClick={() =>
                    navigate(category.path)
                  }

                  className="
                    group
                    relative
                    cursor-pointer
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-gray-200
                    dark:border-white/[0.08]
                    bg-white
                    dark:bg-[#0b0f18]
                    p-7
                    shadow-sm
                    hover:shadow-2xl
                    transition-all
                    duration-500
                  "
                >

                  <div
                    className={`
                      absolute
                      inset-x-0
                      top-0
                      h-1
                      bg-gradient-to-r
                      ${category.gradient}
                    `}
                  />


                  <div
                    className={`
                      w-12
                      h-12
                      rounded-xl
                      bg-gradient-to-br
                      ${category.gradient}
                      flex
                      items-center
                      justify-center
                    `}
                  >

                    <Icon
                      size={21}
                      className="text-white"
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
                    {category.title}
                  </h3>


                  <p
                    className="
                      mt-2
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {category.subtitle}
                  </p>


                  <div
                    className="
                      mt-6
                      space-y-3
                    "
                  >

                    {category.types.map((type, i) => (

                      <div
                        key={i}
                        className="
                          flex
                          items-center
                          gap-3
                          text-sm
                          text-gray-600
                          dark:text-gray-300
                        "
                      >

                        <CheckCircle2
                          size={16}
                          className="text-emerald-500"
                        />

                        {type}

                      </div>

                    ))}

                  </div>


                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      justify-between
                      text-sm
                      font-bold
                      text-blue-500
                    "
                  >

                    Explore Category

                    <ArrowRight
                      size={17}
                      className="
                        group-hover:translate-x-1
                        transition-transform
                      "
                    />

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

      </section>



      {/* =====================================================
          PRICING
      ====================================================== */}

      <section
        id="pricing"
        className="
          py-24
          bg-gray-50
          dark:bg-[#080b13]
          border-y
          border-gray-100
          dark:border-white/[0.04]
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
          "
        >

          <div className="text-center max-w-2xl mx-auto mb-14">

            <div
              className="
                text-xs
                uppercase
                tracking-[0.2em]
                font-bold
                text-blue-500
                mb-4
              "
            >
              Pricing
            </div>

            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                tracking-tight
                text-gray-950
                dark:text-white
              "
            >
              Choose your preparation level
            </h2>

            <p
              className="
                mt-5
                text-lg
                text-gray-600
                dark:text-gray-400
              "
            >
              Start free and upgrade when you're ready
              for deeper preparation.
            </p>

          </div>



          <div
            className="
              grid
              md:grid-cols-3
              gap-6
              max-w-6xl
              mx-auto
            "
          >

            {plans.map((plan, index) => (

              <motion.div
                key={index}

                whileHover={{
                  y: -8,
                }}

                className={`
                  relative
                  rounded-[28px]
                  p-7
                  border
                  ${
                    plan.popular
                      ? `
                        border-blue-500
                        bg-gradient-to-b
                        from-blue-500/[0.08]
                        to-purple-500/[0.03]
                        shadow-2xl
                        shadow-blue-500/10
                      `
                      : `
                        border-gray-200
                        dark:border-white/[0.08]
                        bg-white
                        dark:bg-[#0b0f18]
                      `
                  }
                `}
              >

                {plan.popular && (

                  <div
                    className="
                      absolute
                      -top-3
                      left-1/2
                      -translate-x-1/2
                      px-4
                      py-1.5
                      rounded-full
                      bg-gradient-to-r
                      from-blue-500
                      to-purple-500
                      text-white
                      text-xs
                      font-bold
                      shadow-lg
                    "
                  >
                    MOST POPULAR
                  </div>

                )}


                <h3
                  className="
                    text-xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {plan.name}
                </h3>


                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                    dark:text-gray-400
                    min-h-[48px]
                  "
                >
                  {plan.description}
                </p>


                <div className="mt-7">

                  <span
                    className="
                      text-4xl
                      font-black
                      text-gray-950
                      dark:text-white
                    "
                  >
                    {plan.price}
                  </span>

                  <span
                    className="
                      ml-1
                      text-sm
                      text-gray-500
                    "
                  >
                    {plan.period}
                  </span>

                </div>


                <div
                  className="
                    mt-7
                    space-y-3
                  "
                >

                  {plan.features.map((feature, i) => (

                    <div
                      key={i}
                      className="
                        flex
                        items-start
                        gap-3
                        text-sm
                        text-gray-600
                        dark:text-gray-300
                      "
                    >

                      <Check
                        size={17}
                        className="
                          mt-0.5
                          flex-shrink-0
                          text-emerald-500
                        "
                      />

                      {feature}

                    </div>

                  ))}

                </div>


                <button
                  onClick={() => navigate('/register')}

                  className={`
                    w-full
                    mt-8
                    py-3.5
                    rounded-xl
                    font-bold
                    transition-all
                    ${
                      plan.popular
                        ? `
                          text-white
                          bg-gradient-to-r
                          from-blue-600
                          to-purple-600
                          hover:shadow-lg
                          hover:shadow-purple-500/20
                        `
                        : `
                          border
                          border-gray-200
                          dark:border-white/[0.1]
                          text-gray-800
                          dark:text-white
                          hover:border-blue-500
                          hover:text-blue-500
                        `
                    }
                  `}
                >
                  Get Started
                </button>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* =====================================================
          CONTACT
      ====================================================== */}

      <section
        id="contact"
        className="py-24"
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
          "
        >

          <div
            className="
              rounded-[32px]
              overflow-hidden
              border
              border-gray-200
              dark:border-white/[0.08]
              bg-white
              dark:bg-[#0b0f18]
              shadow-xl
            "
          >

            <div
              className="
                grid
                lg:grid-cols-2
              "
            >

              {/* LEFT */}

              <div
                className="
                  p-8
                  md:p-12
                  lg:p-14
                  bg-gradient-to-br
                  from-blue-600
                  via-violet-600
                  to-purple-700
                  text-white
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-white/10
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    mb-7
                  "
                >

                  <Sparkles size={22} />

                </div>


                <h2
                  className="
                    text-4xl
                    md:text-5xl
                    font-black
                    tracking-tight
                  "
                >
                  Let's build a
                  <br />
                  better interview.
                </h2>


                <p
                  className="
                    mt-5
                    text-white/75
                    leading-relaxed
                    max-w-md
                  "
                >
                  Have questions, feedback or suggestions
                  about InterviewTwin? Our support team is
                  here to help.
                </p>


                <div
                  className="
                    mt-10
                    space-y-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-4
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
                      <Mail size={18} />
                    </div>

                    <div>

                      <div
                        className="
                          text-xs
                          text-white/50
                        "
                      >
                        Email
                      </div>

                      <div
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        {contact.email}
                      </div>

                    </div>

                  </div>


                  <div
                    className="
                      flex
                      items-center
                      gap-4
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
                      <Phone size={18} />
                    </div>

                    <div>

                      <div
                        className="
                          text-xs
                          text-white/50
                        "
                      >
                        Phone
                      </div>

                      <div
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        {contact.phone}
                      </div>

                    </div>

                  </div>


                  <div
                    className="
                      flex
                      items-center
                      gap-4
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
                      <MapPin size={18} />
                    </div>

                    <div>

                      <div
                        className="
                          text-xs
                          text-white/50
                        "
                      >
                        Address
                      </div>

                      <div
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        {contact.address}
                      </div>

                    </div>

                  </div>

                </div>

              </div>



              {/* RIGHT */}

              <div
                className="
                  p-8
                  md:p-12
                  lg:p-14
                "
              >

                <div
                  className="
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    font-bold
                    text-blue-500
                    mb-4
                  "
                >
                  Connect
                </div>


                <h3
                  className="
                    text-3xl
                    font-black
                    text-gray-950
                    dark:text-white
                  "
                >
                  We're here to help.
                </h3>


                <p
                  className="
                    mt-4
                    text-gray-500
                    dark:text-gray-400
                    leading-relaxed
                  "
                >
                  Reach InterviewTwin through the
                  channels below.
                </p>


                <div
                  className="
                    mt-8
                    space-y-3
                  "
                >

                  <a
                   href="https://mail.google.com/mail/?view=cm&fs=1&to=support.interviewtwin.ai@gmail.com"
                   target="_blank"
                   rel="noopener noreferrer"
                   onClick={(e) => {
                   e.stopPropagation();
                   }}
                       style={{
                       position: 'relative',
                       zIndex: 10,
                       pointerEvents: 'auto',
                      }}

                    className="
                      flex
                      items-center
                      justify-between
                      p-4
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-white/[0.08]
                      hover:border-blue-500
                      hover:bg-blue-500/[0.03]
                      transition
                      group
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <Mail
                        size={20}
                        className="text-blue-500"
                      />

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Email Support
                      </span>

                    </div>

                    <ArrowUpRight
                      size={17}
                      className="
                        text-gray-400
                        group-hover:text-blue-500
                      "
                    />

                  </a>


                  <a
                    href="tel:+919182778677"

                    className="
                      flex
                      items-center
                      justify-between
                      p-4
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-white/[0.08]
                      hover:border-blue-500
                      hover:bg-blue-500/[0.03]
                      transition
                      group
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <Phone
                        size={20}
                        className="text-blue-500"
                      />

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Call Support
                      </span>

                    </div>

                    <ArrowUpRight
                      size={17}
                      className="
                        text-gray-400
                        group-hover:text-blue-500
                      "
                    />

                  </a>


                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      p-4
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-white/[0.08]
                    "
                  >

                    <MapPin
                      size={20}
                      className="text-blue-500"
                    />

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                        dark:text-gray-200
                      "
                    >
                      {contact.address}
                    </span>

                  </div>

                </div>


                {/* Social */}

                <div className="mt-8">

                  <div
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-400
                      mb-4
                    "
                  >
                    Follow
                  </div>

                  <div className="flex gap-3">

                    <a
                      href="https://github.com/Nouman-md"
                      target="_blank"
                      rel="noopener noreferrer"

                      className="
                        w-11
                        h-11
                        rounded-xl
                        border
                        border-gray-200
                        dark:border-white/[0.08]
                        flex
                        items-center
                        justify-center
                        text-gray-500
                        hover:text-gray-900
                        dark:hover:text-white
                        hover:border-blue-500
                        transition
                      "
                    >
                      <Github size={19} />
                    </a>


                    <a
                      href="https://www.linkedin.com/in/mohammednouman2k5"
                      target="_blank"
                      rel="noopener noreferrer"

                      className="
                        w-11
                        h-11
                        rounded-xl
                        border
                        border-gray-200
                        dark:border-white/[0.08]
                        flex
                        items-center
                        justify-center
                        text-gray-500
                        hover:text-blue-500
                        hover:border-blue-500
                        transition
                      "
                    >
                      <Linkedin size={19} />
                    </a>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-5 md:px-8 pb-24">

        <div
          className="
            max-w-7xl
            mx-auto
            relative
            overflow-hidden
            rounded-[32px]
            bg-gradient-to-r
            from-blue-600
            via-violet-600
            to-purple-700
            p-10
            md:p-16
            text-center
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
              -bottom-24
              -left-24
              w-72
              h-72
              rounded-full
              bg-black/10
              blur-3xl
            "
          />


          <div className="relative">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/10
                border
                border-white/10
                text-white/80
                text-xs
                font-semibold
                mb-6
              "
            >

              <Sparkles size={14} />

              Your next opportunity starts here.

            </div>


            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                text-white
                tracking-tight
              "
            >
              Ready to ace your interviews?
            </h2>


            <p
              className="
                mt-5
                text-white/70
                text-lg
                max-w-xl
                mx-auto
              "
            >
              Turn preparation into confidence and
              confidence into results.
            </p>


            <button
              onClick={() => navigate('/register')}

              className="
                mt-8
                inline-flex
                items-center
                gap-3
                px-7
                py-4
                rounded-2xl
                bg-white
                text-blue-700
                font-bold
                shadow-2xl
                hover:scale-105
                transition
              "
            >

              Start Your Journey

              <ArrowRight size={18} />

            </button>

          </div>

        </div>

      </section>



      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        className="
          border-t
          border-gray-100
          dark:border-white/[0.05]
          bg-gray-950
          text-gray-400
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            md:px-8
            py-14
          "
        >

          <div
            className="
              grid
              md:grid-cols-4
              gap-10
              pb-10
            "
          >

            {/* BRAND */}

            <div>

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
                    w-9
                    h-9
                    rounded-xl
                    bg-gradient-to-br
                    from-blue-500
                    to-purple-600
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Sparkles
                    size={17}
                    className="text-white"
                  />

                </div>


                <span
                  className="
                    text-xl
                    font-black
                    text-white
                  "
                >
                  InterviewTwin
                </span>

              </div>


              <p
                className="
                  text-sm
                  leading-6
                  max-w-xs
                "
              >
                AI-powered interview and placement
                preparation built for the next generation
                of professionals.
              </p>

            </div>



            {/* PRODUCT */}

            <div>

              <h4
                className="
                  text-sm
                  font-bold
                  text-white
                  mb-5
                "
              >
                Product
              </h4>

              <div className="space-y-3 text-sm">

                <a
                  href="#features"
                  className="block hover:text-white transition"
                >
                  Features
                </a>

                <a
                  href="#categories"
                  className="block hover:text-white transition"
                >
                  Categories
                </a>

                <a
                  href="#pricing"
                  className="block hover:text-white transition"
                >
                  Pricing
                </a>

                <button
                  onClick={() =>
                    navigate('/coding-round')
                  }

                  className="
                    block
                    hover:text-white
                    transition
                  "
                >
                  Coding Practice
                </button>

              </div>

            </div>



            {/* COMPANY */}

            <div>

              <h4
                className="
                  text-sm
                  font-bold
                  text-white
                  mb-5
                "
              >
                Company
              </h4>

              <div className="space-y-3 text-sm">

                <a
                  href="#contact"
                  className="block hover:text-white transition"
                >
                  Contact
                </a>

                <a
                  href="#contact"
                  className="block hover:text-white transition"
                >
                  Support
                </a>

                <a
                  href="#contact"
                  className="block hover:text-white transition"
                >
                  Location
                </a>

              </div>

            </div>



            {/* LEGAL */}

            <div>

              <h4
                className="
                  text-sm
                  font-bold
                  text-white
                  mb-5
                "
              >
                Legal
              </h4>

              <div className="space-y-3 text-sm">

                <button
                  onClick={() =>
                    navigate('/terms-conditions')
                  }

                  className="
                    block
                    hover:text-white
                    transition
                  "
                >
                  Terms & Conditions
                </button>

                <button
                  onClick={() =>
                navigate('/privacy-policy')
                  }

                  className="
                    block
                    hover:text-white
                    transition
                  "
                >
                  Privacy Policy
                </button>

                <button
                  onClick={() =>
                    navigate('/cookies')
                  }

                  className="
                    block
                    hover:text-white
                    transition
                  "
                >
                  Cookie Policy
                </button>

              </div>

            </div>

          </div>



          {/* FOOTER BOTTOM */}

          <div
            className="
              pt-7
              border-t
              border-white/[0.07]
              flex
              flex-col
              md:flex-row
              justify-between
              items-center
              gap-5
            "
          >

            <div
              className="
                text-xs
                text-gray-500
              "
            >
              © 2026 InterviewTwin AI. All rights reserved.
            </div>


            <div
              className="
                flex
                items-center
                gap-3
              "
            >

             <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=support.interviewtwin.ai@gmail.com"
              target="_blank"
              rel="noopener noreferrer"

                className="
                  w-9
                  h-9
                  rounded-lg
                  border
                  border-white/[0.08]
                  flex
                  items-center
                  justify-center
                  hover:text-white
                  hover:border-white/20
                  transition
                "
              >
                <Mail size={16} />
              </a>


              <a
                href="https://github.com/Nouman-md"
                target="_blank"
                rel="noopener noreferrer"

                className="
                  w-9
                  h-9
                  rounded-lg
                  border
                  border-white/[0.08]
                  flex
                  items-center
                  justify-center
                  hover:text-white
                  hover:border-white/20
                  transition
                "
              >
                <Github size={16} />
              </a>


              <a
                href="https://www.linkedin.com/in/mohammednouman2k5"
                target="_blank"
                rel="noopener noreferrer"

                className="
                  w-9
                  h-9
                  rounded-lg
                  border
                  border-white/[0.08]
                  flex
                  items-center
                  justify-center
                  hover:text-white
                  hover:border-white/20
                  transition
                "
              >
                <Linkedin size={16} />
              </a>

            </div>

          </div>

        </div>

      </footer>

    </div>

  );
}