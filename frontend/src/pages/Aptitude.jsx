import React, { useEffect, useMemo, useState } from 'react';
import { aptitudeAPI } from '../services/api';

import {
  Calculator,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  Loader2,
  AlertCircle,
  Filter,
} from 'lucide-react';

export default function Aptitude() {

  // =========================================================
  // STATE
  // =========================================================

  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);

  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // =========================================================
  // LOAD INITIAL QUESTIONS
  // =========================================================

  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, []);

  // =========================================================
  // LOAD QUESTIONS
  // =========================================================

  const loadQuestions = async () => {

    try {

      setLoading(true);
      setError('');

      const response =
        await aptitudeAPI.getAllQuestions();

      setQuestions(response.data || []);
      setCurrentIndex(0);

      resetQuestionState();

    } catch (err) {

      console.error(
        'Error loading aptitude questions:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Unable to load aptitude questions.'
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  const loadCategories = async () => {

    try {

      const response =
        await aptitudeAPI.getCategories();

      setCategories(response.data || []);

    } catch (err) {

      console.error(
        'Error loading aptitude categories:',
        err
      );

    }

  };

  // =========================================================
  // FILTER QUESTIONS
  // =========================================================

  const applyFilters = async () => {

    try {

      setLoading(true);
      setError('');

      let response;

      if (category || difficulty) {

        response =
          await aptitudeAPI.getQuestionsByFilters(
            category,
            difficulty
          );

      } else {

        response =
          await aptitudeAPI.getAllQuestions();

      }

      setQuestions(response.data || []);
      setCurrentIndex(0);

      setScore(0);
      setAnsweredCount(0);

      resetQuestionState();

    } catch (err) {

      console.error(
        'Error filtering aptitude questions:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Unable to filter questions.'
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestion =
    questions[currentIndex];

  // =========================================================
  // PROGRESS
  // =========================================================

  const progress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

  // =========================================================
  // ANSWER OPTIONS
  // =========================================================

  const options = useMemo(() => {

    if (!currentQuestion?.options) {
      return [];
    }

    return currentQuestion.options;

  }, [currentQuestion]);

  // =========================================================
  // RESET CURRENT QUESTION STATE
  // =========================================================

  const resetQuestionState = () => {

    setSelectedAnswer(null);
    setAnswerResult(null);

  };

  // =========================================================
  // SELECT ANSWER
  // =========================================================

  const handleSelectAnswer = (answer) => {

    if (answerResult || submitting) {
      return;
    }

    setSelectedAnswer(answer);

  };

  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const handleSubmitAnswer = async () => {

    if (
      !currentQuestion ||
      !selectedAnswer ||
      submitting ||
      answerResult
    ) {
      return;
    }

    try {

      setSubmitting(true);
      setError('');

      const response =
        await aptitudeAPI.submitAnswer(
          currentQuestion.aptitudeId,
          selectedAnswer
        );

      const result = response.data;

      setAnswerResult(result);

      setAnsweredCount(
        (prev) => prev + 1
      );

      if (result.correct) {

        setScore(
          (prev) => prev + 1
        );

      }

    } catch (err) {

      console.error(
        'Error submitting aptitude answer:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Unable to submit your answer.'
      );

    } finally {

      setSubmitting(false);

    }

  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNext = () => {

    if (
      currentIndex >= questions.length - 1
    ) {
      return;
    }

    setCurrentIndex(
      (prev) => prev + 1
    );

    resetQuestionState();

  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const handlePrevious = () => {

    if (currentIndex <= 0) {
      return;
    }

    setCurrentIndex(
      (prev) => prev - 1
    );

    resetQuestionState();

  };

  // =========================================================
  // RESET TEST
  // =========================================================

  const handleResetTest = () => {

    setCurrentIndex(0);
    setScore(0);
    setAnsweredCount(0);

    resetQuestionState();

  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="aptitude-page min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <Loader2
            size={42}
            className="mx-auto animate-spin text-primary-500"
          />

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading aptitude questions...
          </p>

        </div>

      </div>

    );

  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && questions.length === 0) {

    return (

      <div className="aptitude-page max-w-4xl mx-auto">

        <div className="bg-white dark:bg-dark-800 rounded-2xl border border-red-200 dark:border-red-900/40 p-8 text-center">

          <AlertCircle
            size={48}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Unable to Load Aptitude
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {error}
          </p>

          <button
            onClick={loadQuestions}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition"
          >

            <RotateCcw size={18} />

            Try Again

          </button>

        </div>

      </div>

    );

  }

  // =========================================================
  // EMPTY
  // =========================================================

  if (questions.length === 0) {

    return (

      <div className="aptitude-page max-w-4xl mx-auto">

        <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center">

          <Calculator
            size={50}
            className="mx-auto text-primary-500"
          />

          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            No Questions Found
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Try changing your category or difficulty filters.
          </p>

          <button
            onClick={() => {

              setCategory('');
              setDifficulty('');
              setCurrentIndex(0);
              setScore(0);
              setAnsweredCount(0);

              resetQuestionState();

              loadQuestions();

            }}
            className="mt-6 px-5 py-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition"
          >
            Reset
          </button>

        </div>

      </div>

    );

  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div className="aptitude-page max-w-6xl mx-auto">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">

              <Calculator
                size={24}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Aptitude
              </h1>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Practice quantitative, logical and verbal aptitude.
              </p>

            </div>

          </div>

          {/* SCORE */}

          <div className="flex items-center gap-3">

            <div className="px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700">

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Score
              </p>

              <p className="font-bold text-gray-900 dark:text-white">
                {score} / {answeredCount}
              </p>

            </div>

            <button
              onClick={handleResetTest}
              className="p-3 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition"
              title="Restart test"
            >

              <RotateCcw
                size={18}
                className="text-gray-600 dark:text-gray-300"
              />

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="mb-6 bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">

        <div className="flex flex-col md:flex-row gap-3">

          {/* CATEGORY */}

          <div className="flex-1">

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >

              <option value="">
                All Categories
              </option>

              {categories.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

          {/* DIFFICULTY */}

          <div className="flex-1">

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >

              <option value="">
                All Difficulties
              </option>

              <option value="EASY">
                Easy
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HARD">
                Hard
              </option>

            </select>

          </div>

          {/* APPLY */}

          <div className="flex items-end">

            <button
              onClick={applyFilters}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 transition"
            >

              <Filter size={18} />

              Apply Filters

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          PROGRESS
          ===================================================== */}

      <div className="mb-5">

        <div className="flex justify-between text-sm mb-2">

          <span className="text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>

          <span className="font-medium text-primary-600 dark:text-primary-400">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* =====================================================
          QUESTION CARD
          ===================================================== */}

      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

        {/* QUESTION HEADER */}

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">

          <div className="flex flex-wrap items-center gap-2 mb-4">

            {currentQuestion.category && (

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">

                {currentQuestion.category}

              </span>

            )}

            {currentQuestion.difficultyLevel && (

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentQuestion.difficultyLevel ===
                  'EASY'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : currentQuestion.difficultyLevel ===
                      'MEDIUM'
                    ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}
              >

                {currentQuestion.difficultyLevel}

              </span>

            )}

          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed">

            {currentQuestion.questionText}

          </h2>

          {currentQuestion.problemStatement && (

            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">

              {currentQuestion.problemStatement}

            </p>

          )}

        </div>

        {/* OPTIONS */}

        <div className="p-6">

          <div className="space-y-3">

            {options.map((option, index) => {

              const isSelected =
                selectedAnswer === option;

              const isCorrectAnswer =
                answerResult?.correctAnswer ===
                option;

              const isWrongSelected =
                answerResult &&
                isSelected &&
                !answerResult.correct;

              let optionClass =
                'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500';

              if (
                !answerResult &&
                isSelected
              ) {

                optionClass =
                  'border-primary-500 bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-200 dark:ring-primary-900/50';

              }

              if (
                answerResult &&
                isCorrectAnswer
              ) {

                optionClass =
                  'border-green-500 bg-green-50 dark:bg-green-900/20';

              }

              if (isWrongSelected) {

                optionClass =
                  'border-red-500 bg-red-50 dark:bg-red-900/20';

              }

              return (

                <button
                  key={`${option}-${index}`}
                  onClick={() =>
                    handleSelectAnswer(option)
                  }
                  disabled={
                    !!answerResult ||
                    submitting
                  }
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${optionClass}`}
                >

                  <div className="flex items-center gap-4">

                    {/* OPTION LETTER */}

                    <div
                      className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center font-semibold ${
                        isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >

                      {String.fromCharCode(
                        65 + index
                      )}

                    </div>

                    {/* OPTION TEXT */}

                    <span className="flex-1 text-gray-800 dark:text-gray-200">

                      {option}

                    </span>

                    {/* RESULT ICON */}

                    {answerResult &&
                      isCorrectAnswer && (

                        <CheckCircle2
                          size={22}
                          className="text-green-500"
                        />

                      )}

                    {isWrongSelected && (

                      <XCircle
                        size={22}
                        className="text-red-500"
                      />

                    )}

                  </div>

                </button>

              );

            })}

          </div>

          {/* =================================================
              SUBMIT
              ================================================== */}

          {!answerResult && (

            <button
              onClick={handleSubmitAnswer}
              disabled={
                !selectedAnswer ||
                submitting
              }
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition"
            >

              {submitting ? (

                <>

                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Checking Answer...

                </>

              ) : (

                <>

                  <CheckCircle2 size={20} />

                  Submit Answer

                </>

              )}

            </button>

          )}

          {/* =================================================
              RESULT
              ================================================== */}

          {answerResult && (

            <div
              className={`mt-6 p-5 rounded-xl border ${
                answerResult.correct
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >

              <div className="flex items-start gap-3">

                {answerResult.correct ? (

                  <CheckCircle2
                    size={25}
                    className="text-green-500 flex-shrink-0"
                  />

                ) : (

                  <XCircle
                    size={25}
                    className="text-red-500 flex-shrink-0"
                  />

                )}

                <div>

                  <h3
                    className={`font-semibold ${
                      answerResult.correct
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}
                  >

                    {answerResult.correct
                      ? 'Correct Answer!'
                      : 'Incorrect Answer'}

                  </h3>

                  {!answerResult.correct &&
                    answerResult.correctAnswer && (

                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">

                        Correct answer:{' '}

                        <strong>
                          {answerResult.correctAnswer}
                        </strong>

                      </p>

                    )}

                  {answerResult.explanation && (

                    <div className="mt-3">

                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">

                        Explanation

                      </p>

                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">

                        {answerResult.explanation}

                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}

          {/* =================================================
              NAVIGATION
              ================================================== */}

          <div className="mt-6 flex items-center justify-between gap-3">

            <button
              onClick={handlePrevious}
              disabled={
                currentIndex === 0
              }
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >

              <ChevronLeft size={18} />

              Previous

            </button>

            {currentIndex <
            questions.length - 1 ? (

              <button
                onClick={handleNext}
                disabled={
                  currentIndex >=
                  questions.length - 1
                }
                className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-2 transition"
              >

                Next Question

                <ChevronRight
                  size={18}
                />

              </button>

            ) : (

              <button
                onClick={handleResetTest}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center gap-2 transition"
              >

                <RotateCcw size={18} />

                Restart Test

              </button>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR MESSAGE
          ===================================================== */}

      {error && (

        <div className="mt-4 flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">

          <AlertCircle size={18} />

          <span className="text-sm">
            {error}
          </span>

        </div>

      )}

      {/* =====================================================
          SCORE SUMMARY
          ===================================================== */}

      {answeredCount > 0 && (

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Answered
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {answeredCount}
            </p>

          </div>

          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Correct
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {score}
            </p>

          </div>

          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Accuracy
            </p>

            <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">

              {answeredCount > 0
                ? Math.round(
                    (score /
                      answeredCount) *
                      100
                  )
                : 0}

              %

            </p>

          </div>

        </div>

      )}

      {/* =====================================================
          COMPLETION
          ===================================================== */}

      {currentIndex ===
        questions.length - 1 &&
        answerResult && (

          <div className="mt-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">

                <Trophy size={25} />

              </div>

              <div>

                <h3 className="text-xl font-bold">
                  You've reached the end!
                </h3>

                <p className="text-white/80">

                  Final score: {score} /{' '}
                  {answeredCount}

                  {answeredCount > 0 &&
                    ` (${Math.round(
                      (score /
                        answeredCount) *
                        100
                    )}%)`}

                </p>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}