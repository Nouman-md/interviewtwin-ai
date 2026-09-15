import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { codingAPI } from '../services/api';

import {
  Code2,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Play,
  Send,
  Clock3,
  Cpu,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  BookOpen,
  Terminal,
  Sparkles,
  Zap,
  X,
  History,
  BarChart3,
  Lightbulb,
  Tag,
  CircleDot,
} from 'lucide-react';

export default function CodingRound() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JAVA');

  const [stats, setStats] = useState(null);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');

  const [questionType, setQuestionType] = useState('ALL');

  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    bloomsLevel: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activePanel, setActivePanel] = useState('problem');
  const [showHint, setShowHint] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('test');
  const [submissions, setSubmissions] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      let questionsResponse;

      if (questionType === 'DSA') {
        questionsResponse =
          await codingAPI.getQuestionsByType('DSA');
      } else if (questionType === 'PROGRAMMING') {
        questionsResponse =
          await codingAPI.getQuestionsByType('PROGRAMMING');
      } else {
        questionsResponse =
        await codingAPI.getRandomQuestions(50);
      }

      let questionsData = [];

      if (questionsResponse?.data) {
        questionsData = Array.isArray(questionsResponse.data)
          ? questionsResponse.data
          : Array.isArray(questionsResponse.data.questions)
            ? questionsResponse.data.questions
            : [];
      }

      setQuestions(questionsData);

      try {
        const statsResponse =
          await codingAPI.getCodingStats();

        if (statsResponse?.data) {
          setStats(statsResponse.data);
        }
      } catch {
        setStats(null);
      }

      try {
        const submissionsResponse =
          await codingAPI.getUserSubmissions();

        if (submissionsResponse?.data) {
          setSubmissions(
            Array.isArray(submissionsResponse.data)
              ? submissionsResponse.data
              : submissionsResponse.data.submissions || []
          );
        }
      } catch {
        setSubmissions([]);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load coding challenges.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [questionType]);

  const filteredQuestions = useMemo(() => {
    let data = [...questions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      data = data.filter(
        (q) =>
          q.title?.toLowerCase().includes(query) ||
          q.questionText?.toLowerCase().includes(query) ||
          q.problemStatement?.toLowerCase().includes(query) ||
          q.category?.toLowerCase().includes(query) ||
          q.tags?.toLowerCase?.().includes(query)
      );
    }

    if (filters.difficulty) {
      data = data.filter(
        (q) => q.difficultyLevel === filters.difficulty
      );
    }

    if (filters.category) {
      data = data.filter(
        (q) => q.category === filters.category
      );
    }

    if (filters.bloomsLevel) {
      data = data.filter(
        (q) => q.bloomsLevel === filters.bloomsLevel
      );
    }

    return data;
  }, [questions, searchQuery, filters]);

  const parseTags = (tags) => {
    if (!tags) return [];

    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return {
          badge:
            'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
          dot: 'bg-emerald-500',
        };

      case 'MEDIUM':
        return {
          badge:
            'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
          dot: 'bg-amber-500',
        };

      case 'HARD':
        return {
          badge:
            'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
          dot: 'bg-red-500',
        };

      default:
        return {
          badge:
            'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
          dot: 'bg-slate-400',
        };
    }
  };

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setCode('');
    setResult(null);
    setShowHint(false);
    setActivePanel('problem');
    setActiveBottomTab('test');
  };

  const handleSubmitCode = async () => {
    if (!selectedQuestion || !code.trim()) return;

    setSubmitting(true);
    setResult(null);
    setError('');

    try {
      const response = await codingAPI.submitCode(
        selectedQuestion.codingId,
        {
          code,
          language,
        }
      );

      setResult(response.data);

      try {
        const statsResponse =
          await codingAPI.getCodingStats();

        if (statsResponse?.data) {
          setStats(statsResponse.data);
        }
      } catch {}

      try {
        const submissionsResponse =
          await codingAPI.getUserSubmissions();

        if (submissionsResponse?.data) {
          setSubmissions(
            Array.isArray(submissionsResponse.data)
              ? submissionsResponse.data
              : submissionsResponse.data.submissions || []
          );
        }
      } catch {}
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Submission failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      difficulty: '',
      category: '',
      bloomsLevel: '',
    });
  };

  const getComplexity = () => {
    if (!result?.complexityAnalysis) {
      return {
        time: '—',
        space: '—',
      };
    }

    try {
      const parsed =
        typeof result.complexityAnalysis === 'string'
          ? JSON.parse(result.complexityAnalysis)
          : result.complexityAnalysis;

      return {
        time: parsed?.timeComplexity || '—',
        space: parsed?.spaceComplexity || '—',
      };
    } catch {
      return {
        time: '—',
        space: '—',
      };
    }
  };

  const complexity = getComplexity();

  if (loading) {
    return (
      <div className="coding-page min-h-[80vh] flex items-center justify-center bg-white dark:bg-[#080b14]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Code2 className="text-white" size={28} />
            </div>
          </div>

          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">
            Loading Coding Arena
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Preparing your challenges...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="coding-page min-h-screen bg-white text-slate-900 dark:bg-[#080b14] dark:text-white">

      {/* HEADER */}

      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40 dark:border-white/[0.06] dark:bg-[#0b0f1a]/90">

        <div className="max-w-[1600px] mx-auto px-5 lg:px-8">

          <div className="h-[76px] flex items-center justify-between gap-6">

            <div className="flex items-center gap-4">

              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/30 blur-xl" />

                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Code2 size={22} className="text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">

                  <h1 className="font-bold text-xl text-slate-900 dark:text-white">
                    Coding Arena
                  </h1>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                    PRO
                  </span>

                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  Master DSA. Build problem-solving skills.
                </p>
              </div>

            </div>

            <div className="hidden md:flex items-center gap-3">

              <button
                onClick={loadData}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex items-center gap-2 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <div className="h-10 px-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2 dark:bg-indigo-500/10 dark:border-indigo-500/20">

                <Flame size={16} className="text-orange-500 dark:text-orange-400" />

                <span className="text-sm font-semibold text-slate-700 dark:text-white">
                  Keep practicing
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* CONTENT */}

      <main className="max-w-[1600px] mx-auto px-5 lg:px-8 py-7">

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-7">

          <StatCard
            icon={<Trophy size={18} />}
            label="Solved"
            value={stats?.totalSolved || 0}
            accent="indigo"
          />

          <StatCard
            icon={<Send size={18} />}
            label="Submissions"
            value={stats?.totalSubmissions || 0}
            accent="blue"
          />

          <StatCard
            icon={<Target size={18} />}
            label="Success Rate"
            value={`${stats?.successRate || 0}%`}
            accent="emerald"
          />

          <StatCard
            icon={<Zap size={18} />}
            label="Easy"
            value={stats?.easySolved || 0}
            accent="emerald"
          />

          <StatCard
            icon={<TrendingUp size={18} />}
            label="Medium / Hard"
            value={`${stats?.mediumSolved || 0} / ${stats?.hardSolved || 0}`}
            accent="orange"
          />

        </div>


        {/* TYPE SWITCHER */}

        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit dark:bg-white/[0.03] dark:border-white/[0.07]">

            {[
              ['ALL', 'All Problems'],
              ['DSA', 'DSA'],
              ['PROGRAMMING', 'Programming'],
            ].map(([value, label]) => (

              <button
                key={value}
                onClick={() => setQuestionType(value)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                  questionType === value
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {label}
              </button>

            ))}

          </div>


          <div className="flex-1 flex gap-3">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search problems, topics, keywords..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500/50 transition dark:bg-white/[0.03] dark:border-white/[0.07] dark:text-white dark:placeholder:text-slate-600"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}

            </div>


            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-4 rounded-xl border flex items-center gap-2 text-sm transition ${
                showFilters
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 dark:bg-white/[0.03] dark:border-white/[0.07] dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Filter size={17} />

              <span className="hidden sm:inline">
                Filters
              </span>

              <ChevronDown
                size={15}
                className={`transition ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>

          </div>

        </div>


        {/* FILTERS */}

        <AnimatePresence>

          {showFilters && (

            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="mb-6 overflow-hidden"
            >

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.025] dark:border-white/[0.07]">

                <div className="grid sm:grid-cols-3 gap-4">

                  <FilterSelect
                    label="Difficulty"
                    value={filters.difficulty}
                    onChange={(value) =>
                      setFilters({
                        ...filters,
                        difficulty: value,
                      })
                    }
                    options={[
                      ['', 'All difficulties'],
                      ['EASY', 'Easy'],
                      ['MEDIUM', 'Medium'],
                      ['HARD', 'Hard'],
                    ]}
                  />

                  <FilterSelect
                    label="Topic"
                    value={filters.category}
                    onChange={(value) =>
                      setFilters({
                        ...filters,
                        category: value,
                      })
                    }
                    options={[
                      ['', 'All topics'],
                      ['Arrays', 'Arrays'],
                      ['Strings', 'Strings'],
                      ['Linked Lists', 'Linked Lists'],
                      ['Trees', 'Trees'],
                      ['Graphs', 'Graphs'],
                      ['Dynamic Programming', 'Dynamic Programming'],
                      ['Backtracking', 'Backtracking'],
                      ['Greedy', 'Greedy'],
                      ['Hashing', 'Hashing'],
                      ['Sorting', 'Sorting'],
                      ['Searching', 'Searching'],
                      ['Stacks', 'Stacks'],
                      ['Queues', 'Queues'],
                    ]}
                  />

                  <FilterSelect
                    label="Learning Level"
                    value={filters.bloomsLevel}
                    onChange={(value) =>
                      setFilters({
                        ...filters,
                        bloomsLevel: value,
                      })
                    }
                    options={[
                      ['', 'All levels'],
                      ['REMEMBER', 'Remember'],
                      ['UNDERSTAND', 'Understand'],
                      ['APPLY', 'Apply'],
                      ['ANALYZE', 'Analyze'],
                      ['EVALUATE', 'Evaluate'],
                      ['CREATE', 'Create'],
                    ]}
                  />

                </div>

                <div className="flex justify-end mt-4">

                  <button
                    onClick={clearFilters}
                    className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Clear all filters
                  </button>

                </div>

              </div>

            </motion.div>

          )}

        </AnimatePresence>


        {/* ERROR */}

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
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300"
          >
            <XCircle size={19} />

            <span className="text-sm">
              {error}
            </span>

          </motion.div>

        )}


        {/* WORKSPACE */}

        <div className="grid xl:grid-cols-[350px_minmax(0,1fr)] gap-5">


          {/* PROBLEM SIDEBAR */}

          <aside className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm dark:bg-[#0d121f] dark:border-white/[0.07]">

            <div className="p-5 border-b border-slate-200 dark:border-white/[0.06]">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Problems
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    {filteredQuestions.length} challenges
                  </p>

                </div>

                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center dark:bg-indigo-500/10 dark:text-indigo-400">
                  <BookOpen size={17} />
                </div>

              </div>

            </div>


            <div className="max-h-[680px] overflow-y-auto p-3">

              {filteredQuestions.length > 0 ? (

                <div className="space-y-2">

                  {filteredQuestions.map(
                    (question, index) => {

                      const difficulty =
                        getDifficultyStyle(
                          question.difficultyLevel
                        );

                      const active =
                        selectedQuestion?.codingId ===
                        question.codingId;

                      return (

                        <motion.button
                          key={question.codingId}
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: index * 0.015,
                          }}
                          onClick={() =>
                            handleSelectQuestion(
                              question
                            )
                          }
                          className={`w-full text-left p-4 rounded-xl border transition-all group ${
                            active
                              ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-500/[0.08] dark:border-indigo-500/40'
                              : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-white/[0.035] dark:hover:border-white/[0.06]'
                          }`}
                        >

                          <div className="flex gap-3">

                            <div className="pt-1">

                              {active ? (

                                <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,.8)]" />

                              ) : (

                                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-400 transition dark:bg-slate-700 dark:group-hover:bg-slate-500" />

                              )}

                            </div>


                            <div className="min-w-0 flex-1">

                              <p
                                className={`font-medium text-sm line-clamp-2 ${
                                  active
                                    ? 'text-indigo-700 dark:text-white'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {question.title}
                              </p>


                              <div className="flex items-center gap-2 mt-2 flex-wrap">

                                <span
                                  className={`text-[10px] px-2 py-1 rounded-md border font-semibold ${difficulty.badge}`}
                                >
                                  {question.difficultyLevel}
                                </span>

                                {question.category && (

                                  <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                                    {question.category}
                                  </span>

                                )}

                              </div>

                            </div>


                            <ChevronRight
                              size={15}
                              className={`mt-1 transition ${
                                active
                                  ? 'text-indigo-500 dark:text-indigo-400'
                                  : 'text-slate-300 group-hover:text-slate-500 dark:text-slate-700 dark:group-hover:text-slate-400'
                              }`}
                            />

                          </div>

                        </motion.button>

                      );

                    }
                  )}

                </div>

              ) : (

                <div className="py-20 text-center">

                  <Search
                    size={35}
                    className="mx-auto text-slate-300 mb-4 dark:text-slate-700"
                  />

                  <p className="text-sm text-slate-500">
                    No problems found
                  </p>

                  <p className="text-xs text-slate-400 mt-1 dark:text-slate-600">
                    Try different filters
                  </p>

                </div>

              )}

            </div>

          </aside>


          {/* RIGHT WORKSPACE */}

          <section className="min-w-0">

            {!selectedQuestion ? (

              <div className="min-h-[680px] rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm dark:bg-[#0d121f] dark:border-white/[0.07]">

                <div className="text-center max-w-md px-6">

                  <div className="relative w-20 h-20 mx-auto mb-6">

                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl" />

                    <div className="relative w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center dark:bg-gradient-to-br dark:from-indigo-500/20 dark:to-violet-500/20 dark:border-indigo-500/20">

                      <Terminal
                        size={34}
                        className="text-indigo-500 dark:text-indigo-400"
                      />

                    </div>

                  </div>


                  <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                    Choose a challenge
                  </h2>

                  <p className="text-slate-500 text-sm leading-6">
                    Select a coding problem from the left to open the problem statement and start solving.
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400 dark:text-slate-600">

                    <Sparkles size={14} />

                    Practice consistently to improve your DSA skills.

                  </div>

                </div>

              </div>

            ) : (

              <div className="space-y-5">


                {/* PROBLEM HEADER */}

                <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm dark:bg-[#0d121f] dark:border-white/[0.07]">

                  <div className="p-6 border-b border-slate-200 dark:border-white/[0.06]">

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                      <div>

                        <div className="flex items-center gap-2 mb-3">

                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                            CHALLENGE
                          </span>

                          <span className="text-slate-300 dark:text-slate-700">
                            •
                          </span>

                          <span className="text-xs text-slate-500">
                            #{selectedQuestion.codingId}
                          </span>

                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedQuestion.title}
                        </h2>


                        <div className="flex flex-wrap items-center gap-2 mt-4">

                          <DifficultyBadge
                            difficulty={
                              selectedQuestion.difficultyLevel
                            }
                          />

                          {selectedQuestion.category && (

                            <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-medium flex items-center gap-1.5 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">

                              <Tag size={12} />

                              {selectedQuestion.category}

                            </span>

                          )}

                          {selectedQuestion.bloomsLevel && (

                            <span className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-200 text-xs font-medium dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20">

                              {selectedQuestion.bloomsLevel}

                            </span>

                          )}

                        </div>

                      </div>


                      <div className="flex items-center gap-2">

                        <button
                          onClick={() =>
                            setActivePanel('problem')
                          }
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                            activePanel === 'problem'
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Problem
                        </button>

                        <button
                          onClick={() =>
                            setActivePanel('editor')
                          }
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                            activePanel === 'editor'
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Editor
                        </button>

                      </div>

                    </div>

                  </div>


                  {/* PROBLEM CONTENT */}

                  {activePanel === 'problem' && (

                    <div className="p-6 space-y-5">

                      <div>

                        <div className="flex items-center gap-2 mb-3">

                          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center dark:bg-indigo-500/10">

                            <BookOpen
                              size={15}
                              className="text-indigo-500 dark:text-indigo-400"
                            />

                          </div>

                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            Problem Statement
                          </h3>

                        </div>


                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 dark:bg-white/[0.025] dark:border-white/[0.05]">

                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-wrap">

                            {selectedQuestion.problemStatement ||
                              selectedQuestion.questionText}

                          </p>

                        </div>

                      </div>


                      {selectedQuestion.constraints && (

                        <div>

                          <h3 className="font-semibold text-sm mb-3 text-slate-900 dark:text-white">
                            Constraints
                          </h3>

                          <div className="rounded-xl bg-amber-50 border border-amber-100 p-5 dark:bg-amber-500/[0.04] dark:border-amber-500/10">

                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-wrap font-mono">
                              {selectedQuestion.constraints}
                            </p>

                          </div>

                        </div>

                      )}


                      {selectedQuestion.examples && (

                        <div>

                          <h3 className="font-semibold text-sm mb-3 text-slate-900 dark:text-white">
                            Examples
                          </h3>

                          <pre className="rounded-xl bg-slate-100 border border-slate-200 p-5 overflow-x-auto text-sm text-slate-700 font-mono leading-7 dark:bg-[#080b12] dark:border-white/[0.06] dark:text-slate-300">
                            {selectedQuestion.examples}
                          </pre>

                        </div>

                      )}


                      {selectedQuestion.hints && (

                        <div>

                          <button
                            onClick={() =>
                              setShowHint(!showHint)
                            }
                            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                          >

                            <Lightbulb size={17} />

                            {showHint
                              ? 'Hide Hint'
                              : 'Need a hint?'}

                            <ChevronDown
                              size={14}
                              className={
                                showHint
                                  ? 'rotate-180'
                                  : ''
                              }
                            />

                          </button>


                          <AnimatePresence>

                            {showHint && (

                              <motion.div
                                initial={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                  height: 'auto',
                                }}
                                exit={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                className="mt-3 overflow-hidden"
                              >

                                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-slate-700 leading-6 dark:bg-indigo-500/[0.05] dark:border-indigo-500/10 dark:text-slate-300">

                                  {selectedQuestion.hints}

                                </div>

                              </motion.div>

                            )}

                          </AnimatePresence>

                        </div>

                      )}


                      {parseTags(
                        selectedQuestion.tags
                      ).length > 0 && (

                        <div className="flex flex-wrap gap-2">

                          {parseTags(
                            selectedQuestion.tags
                          ).map(
                            (tag, index) => (

                              <span
                                key={index}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-500 dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-slate-400"
                              >
                                #{tag}
                              </span>

                            )
                          )}

                        </div>

                      )}

                    </div>

                  )}

                </div>


                {/* CODE EDITOR */}

                <div className="rounded-2xl bg-[#0d121f] border border-white/[0.07] overflow-hidden">

                  <div className="h-14 px-5 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0e18]">

                    <div className="flex items-center gap-3">

                      <div className="flex gap-1.5">

                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />

                      </div>

                      <div className="h-5 w-px bg-white/[0.08]" />

                      <span className="text-xs text-slate-400 flex items-center gap-2">

                        <Code2 size={14} />

                        Solution

                      </span>

                    </div>


                    <select
                      value={language}
                      onChange={(e) =>
                        setLanguage(e.target.value)
                      }
                      className="bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs rounded-lg px-3 py-2 outline-none"
                    >

                      <option value="JAVA">
                        Java
                      </option>

                      <option value="PYTHON">
                        Python
                      </option>

                      <option value="CPP">
                        C++
                      </option>

                      <option value="C">
                        C
                      </option>

                      <option value="JAVASCRIPT">
                        JavaScript
                      </option>

                    </select>

                  </div>


                  <div className="relative">

                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#080b12] border-r border-white/[0.04] pointer-events-none" />

                    <textarea
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value)
                      }
                      spellCheck={false}
                      placeholder={
  language === 'JAVA'
    ? `// Write your Java solution here.
//
// IMPORTANT:
// Use class Main as the class name.
//
// Example:
// class Main {
//     public static void main(String[] args) {
//         // your code
//     }
// }`
    : `// Write your ${language.toLowerCase()} solution here...`
}
                      className="w-full min-h-[430px] resize-y bg-[#080b12] text-slate-200 pl-16 pr-6 py-6 outline-none font-mono text-[13px] leading-6 placeholder:text-slate-700"
                    />

                  </div>


                  <div className="px-5 py-4 border-t border-white/[0.06] bg-[#0a0e18] flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                    <div className="flex items-center gap-4 text-xs text-slate-500">

                      <span className="flex items-center gap-1.5">

                        <CircleDot size={12} />

                        {language}

                      </span>

                      <span>
                        {code.length} characters
                      </span>

                    </div>


                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => setCode('')}
                        className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
                      >
                        Clear
                      </button>


                      <motion.button
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={handleSubmitCode}
                        disabled={
                          !code.trim() ||
                          submitting
                        }
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                      >

                        {submitting ? (

                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                            Evaluating...
                          </>

                        ) : (

                          <>
                            <Send size={16} />

                            Submit Solution
                          </>

                        )}

                      </motion.button>

                    </div>

                  </div>

                </div>


                {/* RESULT */}

                <AnimatePresence>

                  {result && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm dark:bg-[#0d121f] dark:border-white/[0.07]"
                    >

                      <div className="p-5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          {result.status ===
                          'ACCEPTED' ? (

                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center dark:bg-emerald-500/10">

                              <CheckCircle2
                                size={21}
                                className="text-emerald-500 dark:text-emerald-400"
                              />

                            </div>

                          ) : (

                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center dark:bg-red-500/10">

                              <XCircle
                                size={21}
                                className="text-red-500 dark:text-red-400"
                              />

                            </div>

                          )}


                          <div>

                            <h3
                              className={`font-bold ${
                                result.status ===
                                'ACCEPTED'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >

                              {result.status ===
                              'ACCEPTED'
                                ? 'Accepted'
                                : result.status}

                            </h3>

                            <p className="text-xs text-slate-500 mt-0.5">
                              Submission evaluated successfully
                            </p>

                          </div>

                        </div>


                        <div className="text-right">

                          <p className="text-xl font-bold text-slate-900 dark:text-white">

                            {result.score
                              ? Number(
                                  result.score
                                ).toFixed(0)
                              : 0}

                            <span className="text-xs text-slate-500">
                              /100
                            </span>

                          </p>

                          <p className="text-[10px] text-slate-500">
                            Score
                          </p>

                        </div>

                      </div>


                      <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">

                        <ResultMetric
                          icon={<Clock3 size={16} />}
                          label="Execution"
                          value={
                            result.executionTime
                              ? `${result.executionTime} ms`
                              : '—'
                          }
                        />

                        <ResultMetric
                          icon={<Cpu size={16} />}
                          label="Memory"
                          value={
                            result.memoryUsed
                              ? `${result.memoryUsed} MB`
                              : '—'
                          }
                        />

                        <ResultMetric
                          icon={<TrendingUp size={16} />}
                          label="Time Complexity"
                          value={complexity.time}
                        />

                        <ResultMetric
                          icon={<BarChart3 size={16} />}
                          label="Space Complexity"
                          value={complexity.space}
                        />

                      </div>


                      {result.compilationOutput && (

                        <div className="mx-5 mb-5 rounded-xl bg-slate-100 border border-slate-200 p-4 dark:bg-[#070a10] dark:border-white/[0.05]">

                          <div className="flex items-center gap-2 mb-2">

                            <Terminal
                              size={14}
                              className="text-slate-500"
                            />

                            <span className="text-xs text-slate-500">
                              Output
                            </span>

                          </div>

                          <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                            {result.compilationOutput}
                          </pre>

                        </div>

                      )}

                    </motion.div>

                  )}

                </AnimatePresence>


                {/* LOWER PANEL */}

                <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm dark:bg-[#0d121f] dark:border-white/[0.07]">

                  <div className="flex border-b border-slate-200 dark:border-white/[0.06]">

                    <BottomTab
                      active={
                        activeBottomTab === 'test'
                      }
                      onClick={() =>
                        setActiveBottomTab('test')
                      }
                      icon={<Play size={14} />}
                      label="Test Results"
                    />

                    <BottomTab
                      active={
                        activeBottomTab ===
                        'submissions'
                      }
                      onClick={() =>
                        setActiveBottomTab(
                          'submissions'
                        )
                      }
                      icon={<History size={14} />}
                      label="Submissions"
                    />

                    <BottomTab
                      active={
                        activeBottomTab ===
                        'stats'
                      }
                      onClick={() =>
                        setActiveBottomTab('stats')
                      }
                      icon={<BarChart3 size={14} />}
                      label="Statistics"
                    />

                  </div>


                  <div className="p-6">

                    {activeBottomTab ===
                      'test' && (

                      <div>

                        {result ? (

                          <div className="flex items-center gap-3">

                            {result.status ===
                            'ACCEPTED' ? (

                              <CheckCircle2
                                size={18}
                                className="text-emerald-500 dark:text-emerald-400"
                              />

                            ) : (

                              <XCircle
                                size={18}
                                className="text-red-500 dark:text-red-400"
                              />

                            )}

                            <div>

                              <p className="text-sm font-medium text-slate-900 dark:text-white">

                                {result.status ===
                                'ACCEPTED'
                                  ? 'All test cases passed'
                                  : 'Some test cases failed'}

                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                Review the result above for detailed performance metrics.
                              </p>

                            </div>

                          </div>

                        ) : (

                          <div className="text-center py-6">

                            <Play
                              size={28}
                              className="mx-auto text-slate-300 dark:text-slate-700 mb-3"
                            />

                            <p className="text-sm text-slate-500">
                              Submit your solution to see test results.
                            </p>

                          </div>

                        )}

                      </div>

                    )}


                    {activeBottomTab ===
                      'submissions' && (

                      <div>

                        {submissions.length > 0 ? (

                          <div className="space-y-2">

                            {submissions
                              .slice(0, 8)
                              .map(
                                (
                                  submission,
                                  index
                                ) => (

                                  <div
                                    key={
                                      submission.submissionId ||
                                      index
                                    }
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-white/[0.025] dark:border-white/[0.05]"
                                  >

                                    <div className="flex items-center gap-3">

                                      {submission.status ===
                                      'ACCEPTED' ? (

                                        <CheckCircle2
                                          size={17}
                                          className="text-emerald-500 dark:text-emerald-400"
                                        />

                                      ) : (

                                        <XCircle
                                          size={17}
                                          className="text-red-500 dark:text-red-400"
                                        />

                                      )}

                                      <div>

                                        <p className="text-sm text-slate-700 dark:text-slate-300">

                                          {submission.questionTitle ||
                                            submission.title ||
                                            'Coding submission'}

                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">

                                          {submission.language ||
                                            language}

                                        </p>

                                      </div>

                                    </div>


                                    <span className="text-xs text-slate-500">
                                      {submission.status ||
                                        'Submitted'}
                                    </span>

                                  </div>

                                )
                              )}

                          </div>

                        ) : (

                          <div className="text-center py-8">

                            <History
                              size={30}
                              className="mx-auto text-slate-300 dark:text-slate-700 mb-3"
                            />

                            <p className="text-sm text-slate-500">
                              No submissions yet.
                            </p>

                          </div>

                        )}

                      </div>

                    )}


                    {activeBottomTab ===
                      'stats' && (

                      <div className="grid sm:grid-cols-3 gap-4">

                        <MiniStat
                          label="Solved"
                          value={
                            stats?.totalSolved ||
                            0
                          }
                        />

                        <MiniStat
                          label="Success Rate"
                          value={`${stats?.successRate || 0}%`}
                        />

                        <MiniStat
                          label="Submissions"
                          value={
                            stats?.totalSubmissions ||
                            0
                          }
                        />

                      </div>

                    )}

                  </div>

                </div>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   HELPER COMPONENTS
   ========================================================= */

function StatCard({
  icon,
  label,
  value,
  accent,
}) {

  const accents = {
    indigo:
      'bg-indigo-50 text-indigo-500 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/10',

    blue:
      'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/10',

    emerald:
      'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/10',

    orange:
      'bg-orange-50 text-orange-500 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/10',
  };

  return (

    <div className="rounded-2xl bg-white border border-slate-200 p-4 hover:border-slate-300 transition shadow-sm dark:bg-[#0d121f] dark:border-white/[0.07] dark:hover:border-white/[0.12]">

      <div className="flex items-center justify-between">

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border ${accents[accent]}`}
        >
          {icon}
        </div>

        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          {label}
        </span>

      </div>

      <p className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">
        {value}
      </p>

    </div>

  );
}


function DifficultyBadge({
  difficulty,
}) {

  const style = {

    EASY:
      'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',

    MEDIUM:
      'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',

    HARD:
      'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',

  };

  return (

    <span
      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
        style[difficulty] ||
        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
      }`}
    >
      {difficulty || 'UNKNOWN'}
    </span>

  );
}


function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {

  return (

    <div>

      <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-semibold mb-2">
        {label}
      </label>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full h-11 appearance-none px-3 pr-9 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-indigo-500/40 dark:bg-white/[0.035] dark:border-white/[0.07] dark:text-slate-300"
        >

          {options.map(
            ([optionValue, optionLabel]) => (

              <option
                key={optionValue}
                value={optionValue}
                className="bg-white text-slate-900 dark:bg-[#0d121f] dark:text-white"
              >
                {optionLabel}
              </option>

            )
          )}

        </select>

        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-600"
        />

      </div>

    </div>

  );
}


function ResultMetric({
  icon,
  label,
  value,
}) {

  return (

    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-white/[0.025] dark:border-white/[0.05]">

      <div className="flex items-center gap-2 text-slate-500 mb-2">

        {icon}

        <span className="text-[11px]">
          {label}
        </span>

      </div>

      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 font-mono">
        {value}
      </p>

    </div>

  );
}


function BottomTab({
  active,
  onClick,
  icon,
  label,
}) {

  return (

    <button
      onClick={onClick}
      className={`px-5 py-3.5 flex items-center gap-2 text-xs font-medium border-b-2 transition ${
        active
          ? 'text-indigo-600 border-indigo-500 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/[0.03]'
          : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-slate-300'
      }`}
    >

      {icon}

      {label}

    </button>

  );
}


function MiniStat({
  label,
  value,
}) {

  return (

    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-white/[0.025] dark:border-white/[0.05]">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
        {value}
      </p>

    </div>

  );
}