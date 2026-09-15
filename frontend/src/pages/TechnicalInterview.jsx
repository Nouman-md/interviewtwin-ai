import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewAPI } from '../services/api';
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Brain,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Flag
} from 'lucide-react';

const MAX_QUESTIONS = 15;

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

export default function TechnicalInterview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // SESSION
  // =========================================================

  const [session, setSession] = useState(null);

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  // =========================================================
  // QUESTION HISTORY
  // =========================================================

  const [questionHistory, setQuestionHistory] = useState([]);

  // =========================================================
  // ANSWERS
  // =========================================================

  const [allAnswers, setAllAnswers] = useState({});

  // =========================================================
  // CURRENT ANSWER
  // =========================================================

  const [answer, setAnswer] = useState('');

  // =========================================================
  // FEEDBACK
  // =========================================================

  const [feedback, setFeedback] = useState(null);

  // =========================================================
  // UI STATES
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState('');

  // =========================================================
  // REQUEST PROTECTION
  // =========================================================

  // Prevent React StrictMode / duplicate initial loading.
  const initialLoadRef = useRef(false);

  // Prevent two Next requests from being sent at the same time.
  const nextRequestRef = useRef(false);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    if (initialLoadRef.current) {
      return;
    }

    initialLoadRef.current = true;

    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      setError('');

      const sessionRes =
        await interviewAPI.getSession(sessionId);

      setSession(sessionRes.data);

      const questionRes =
        await interviewAPI.getNextQuestion(sessionId);

      if (questionRes.data) {
        const firstQuestion =
          questionRes.data;

        setQuestion(firstQuestion);

        setQuestionHistory([
          firstQuestion
        ]);

        setQuestionIndex(0);

        const savedAnswer =
          allAnswers[
            firstQuestion.questionId
          ];

        if (savedAnswer) {
          setAnswer(
            savedAnswer.userAnswer || ''
          );
        } else {
          setAnswer('');
        }
      } else {
        setQuestion(null);
      }

    } catch (err) {
      console.error(
        'Failed to load interview:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Failed to load interview'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD SAVED ANSWER
  // =========================================================

  const loadSavedAnswer = (selectedQuestion) => {
    if (!selectedQuestion) {
      setAnswer('');
      return;
    }

    const savedAnswer =
      allAnswers[
        selectedQuestion.questionId
      ];

    if (savedAnswer) {
      setAnswer(
        savedAnswer.userAnswer || ''
      );
    } else {
      setAnswer('');
    }
  };

  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError(
        'Please provide an answer'
      );
      return;
    }

    if (!question) {
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response =
        await interviewAPI.submitAnswer(
          sessionId,
          {
            questionId:
              question.questionId,

            userAnswer:
              answer
          }
        );

      const answerData =
        response.data;

      setAllAnswers(
        (previous) => ({
          ...previous,
          [question.questionId]:
            answerData
        })
      );

      setFeedback(answerData);

    } catch (err) {
      console.error(
        'Failed to submit answer:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Failed to submit answer'
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNextQuestion = async () => {

    // -------------------------------------------------------
    // IMPORTANT:
    // Prevent duplicate API requests.
    // -------------------------------------------------------

    if (nextRequestRef.current) {
      return;
    }

    if (loadingNext) {
      return;
    }

    const nextIndex =
      questionIndex + 1;

    // -------------------------------------------------------
    // MAXIMUM 15 QUESTIONS
    // -------------------------------------------------------

    if (nextIndex >= MAX_QUESTIONS) {
      setError(
        'You have reached the maximum of 15 questions.'
      );
      return;
    }

    setFeedback(null);
    setError('');

    // -------------------------------------------------------
    // QUESTION ALREADY EXISTS IN HISTORY
    // -------------------------------------------------------

    if (
      nextIndex <
      questionHistory.length
    ) {
      const nextQuestion =
        questionHistory[nextIndex];

      setQuestionIndex(
        nextIndex
      );

      setQuestion(
        nextQuestion
      );

      loadSavedAnswer(
        nextQuestion
      );

      return;
    }

    // -------------------------------------------------------
    // LOCK NEXT REQUEST
    // -------------------------------------------------------

    nextRequestRef.current = true;
    setLoadingNext(true);

    try {
      const nextQuestionRes =
        await interviewAPI.getNextQuestion(
          sessionId
        );

      if (
        nextQuestionRes &&
        nextQuestionRes.data
      ) {
        const nextQuestion =
          nextQuestionRes.data;

        setQuestionHistory(
          (previous) => [
            ...previous,
            nextQuestion
          ]
        );

        setQuestionIndex(
          nextIndex
        );

        setQuestion(
          nextQuestion
        );

        setAnswer('');

      } else {
        setError(
          'No more questions are available for this interview.'
        );
      }

    } catch (err) {
      console.error(
        'Failed to load next question:',
        err
      );

      /*
       * If the backend returns 404 after Question 15,
       * do not let a duplicate request destroy the UI.
       */
      if (
        err.response?.status === 404 &&
        nextIndex >= MAX_QUESTIONS
      ) {
        setError(
          'You have reached the maximum of 15 questions.'
        );
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to load next question'
        );
      }

    } finally {
      nextRequestRef.current = false;
      setLoadingNext(false);
    }
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const handlePreviousQuestion = () => {
    setFeedback(null);
    setError('');

    if (questionIndex <= 0) {
      return;
    }

    const previousIndex =
      questionIndex - 1;

    const previousQuestion =
      questionHistory[
        previousIndex
      ];

    if (!previousQuestion) {
      return;
    }

    setQuestionIndex(
      previousIndex
    );

    setQuestion(
      previousQuestion
    );

    loadSavedAnswer(
      previousQuestion
    );
  };

  // =========================================================
  // END INTERVIEW
  // =========================================================

  const handleEndInterview = async () => {
    try {
      setError('');

      await interviewAPI.endInterview(
        sessionId
      );

      navigate('/performance');

    } catch (err) {
      console.error(
        'Failed to end interview:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Failed to end interview'
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto"></div>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading interview...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // FEEDBACK DATA
  // =========================================================

  const score =
    feedback?.answerScore
      ? Number(feedback.answerScore)
      : 0;

  const strengths =
    parseJsonArray(
      feedback?.strengths
    );

  const improvements =
    parseJsonArray(
      feedback?.improvements
    );

  // =========================================================
  // PROGRESS
  // =========================================================

  const progress =
    Math.min(
      ((questionIndex + 1) /
        MAX_QUESTIONS) *
        100,
      100
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="max-w-4xl mx-auto">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-8"
      >

        <div className="flex items-center gap-3 mb-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">

            <Brain
              className="text-white"
              size={20}
            />

          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {session?.sessionTitle}
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Question {questionIndex + 1} of {MAX_QUESTIONS}
            </p>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">

          <motion.div
            initial={{
              width: 0
            }}
            animate={{
              width: `${progress}%`
            }}
            transition={{
              duration: 0.5
            }}
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          />

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
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0
            }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex gap-3"
          >

            <AlertCircle
              className="text-red-600 dark:text-red-400 flex-shrink-0"
              size={20}
            />

            <p className="text-red-700 dark:text-red-300 text-sm">
              {error}
            </p>

          </motion.div>

        )}

      </AnimatePresence>

      {/* =====================================================
          QUESTION / FEEDBACK
      ===================================================== */}

      <AnimatePresence mode="wait">

        {!feedback ? (

          <motion.div
            key="question"
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
          >

            {question ? (

              <div className="card">

                {/* QUESTION */}

                <div className="mb-6">

                  <span className="badge-primary mb-3">
                    Question {questionIndex + 1}
                  </span>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {question.questionText}
                  </h2>

                </div>

                {/* MODEL ANSWER */}

                {question.modelAnswer && (

                  <details className="mb-6 group">

                    <summary className="cursor-pointer text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm">
                      View Model Answer (for reference)
                    </summary>

                    <div className="mt-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-gray-700 dark:text-gray-300 text-sm">
                      {question.modelAnswer}
                    </div>

                  </details>

                )}

                {/* ANSWER INPUT */}

                <div>

                  <label className="form-label">
                    Your Answer
                  </label>

                  <textarea
                    value={answer}
                    onChange={(e) =>
                      setAnswer(
                        e.target.value
                      )
                    }
                    placeholder="Type your answer here..."
                    className="input-field h-40 resize-none"
                  />

                </div>

                {/* BUTTONS */}

                <div className="flex flex-wrap gap-3 mt-6">

                  {/* PREVIOUS */}

                  <motion.button
                    whileHover={{
                      scale: 1.02
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    onClick={
                      handlePreviousQuestion
                    }
                    disabled={
                      questionIndex === 0 ||
                      loadingNext
                    }
                    className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                  >

                    <span className="flex items-center gap-2">

                      <ArrowLeft
                        size={18}
                      />

                      Previous

                    </span>

                  </motion.button>

                  {/* SUBMIT */}

                  <motion.button
                    whileHover={{
                      scale: 1.02
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    onClick={
                      handleSubmitAnswer
                    }
                    disabled={
                      submitting ||
                      loadingNext ||
                      !answer.trim()
                    }
                    className="btn-primary flex-1 min-w-[180px] disabled:opacity-50"
                  >

                    {submitting ? (

                      <span className="flex items-center justify-center gap-2">

                        <div className="spinner h-4 w-4 border-white/30 border-t-white"></div>

                        Evaluating...

                      </span>

                    ) : (

                      <span className="flex items-center justify-center gap-2">

                        <Send
                          size={18}
                        />

                        Submit Answer

                      </span>

                    )}

                  </motion.button>

                  {/* NEXT */}

                  <motion.button
                    whileHover={{
                      scale: 1.02
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    onClick={
                      handleNextQuestion
                    }
                    disabled={
                      loadingNext ||
                      questionIndex >=
                        MAX_QUESTIONS - 1
                    }
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >

                    <span className="flex items-center gap-2">

                      {loadingNext ? (
                        <>
                          <div className="spinner h-4 w-4 border-white/30 border-t-white"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight
                            size={18}
                          />
                        </>
                      )}

                    </span>

                  </motion.button>

                  {/* END */}

                  <button
                    onClick={
                      handleEndInterview
                    }
                    disabled={loadingNext}
                    className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                  >

                    <span className="flex items-center gap-2">

                      <Flag
                        size={18}
                      />

                      End

                    </span>

                  </button>

                </div>

                {/* NAVIGATION INFO */}

                <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">

                  <span className="text-xs text-gray-400">
                    {questionIndex + 1} / {MAX_QUESTIONS}
                  </span>

                  <span className="text-xs text-gray-400">
                    You can move between questions without submitting.
                  </span>

                </div>

              </div>

            ) : (

              <div className="card text-center py-16">

                <div className="empty-state-icon mx-auto mb-4">

                  <CheckCircle2
                    size={32}
                  />

                </div>

                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No more questions available
                </p>

                <button
                  onClick={
                    handleEndInterview
                  }
                  className="btn-primary"
                >
                  Finish Interview
                </button>

              </div>

            )}

          </motion.div>

        ) : (

          /* =================================================
             FEEDBACK SCREEN
          ================================================= */

          <motion.div
            key="feedback"
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
          >

            <div className="card">

              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Question {questionIndex + 1}
              </h2>

              {/* QUESTION */}

              <p className="text-gray-700 dark:text-gray-300 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm">
                {question?.questionText}
              </p>

              {/* USER ANSWER */}

              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                Your Answer
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm whitespace-pre-wrap">
                {feedback?.userAnswer ||
                  answer}
              </p>

              {/* SCORE */}

              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0
                }}
                animate={{
                  scale: 1,
                  opacity: 1
                }}
                className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl"
              >

                <div className="flex items-center gap-4">

                  <div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      AI Score
                    </p>

                    <h4 className="text-4xl font-bold text-gradient">
                      {score.toFixed(1)}
                    </h4>

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2 mb-1">

                      <TrendingUp
                        size={20}
                        className="text-primary-600 dark:text-primary-400"
                      />

                      <span className="font-medium text-gray-900 dark:text-white">

                        {score >= 80
                          ? 'Excellent answer!'
                          : score >= 60
                          ? 'Good answer with room for improvement'
                          : 'Needs improvement'}

                      </span>

                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feedback?.feedback}
                    </p>

                  </div>

                </div>

              </motion.div>

              {/* STRENGTHS */}

              {strengths.length > 0 && (

                <div className="mb-6">

                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">

                    <CheckCircle2
                      size={18}
                    />

                    Strengths

                  </h4>

                  <div className="space-y-2">

                    {strengths.map(
                      (
                        strength,
                        idx
                      ) => (

                        <motion.div
                          key={idx}
                          initial={{
                            opacity: 0,
                            x: -20
                          }}
                          animate={{
                            opacity: 1,
                            x: 0
                          }}
                          transition={{
                            delay:
                              idx * 0.1
                          }}
                          className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded-r-xl"
                        >

                          <p className="text-emerald-800 dark:text-emerald-300 text-sm">
                            {strength}
                          </p>

                        </motion.div>

                      )
                    )}

                  </div>

                </div>

              )}

              {/* IMPROVEMENTS */}

              {improvements.length > 0 && (

                <div className="mb-6">

                  <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">

                    <Lightbulb
                      size={18}
                    />

                    Improvements

                  </h4>

                  <div className="space-y-2">

                    {improvements.map(
                      (
                        improvement,
                        idx
                      ) => (

                        <motion.div
                          key={idx}
                          initial={{
                            opacity: 0,
                            x: -20
                          }}
                          animate={{
                            opacity: 1,
                            x: 0
                          }}
                          transition={{
                            delay:
                              idx * 0.1
                          }}
                          className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-xl"
                        >

                          <p className="text-amber-800 dark:text-amber-300 text-sm">
                            {improvement}
                          </p>

                        </motion.div>

                      )
                    )}

                  </div>

                </div>

              )}

              {/* FEEDBACK NAVIGATION */}

              <div className="flex flex-wrap gap-3">

                {/* PREVIOUS */}

                <motion.button
                  whileHover={{
                    scale: 1.02
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  onClick={
                    handlePreviousQuestion
                  }
                  disabled={
                    questionIndex === 0 ||
                    loadingNext
                  }
                  className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                >

                  <span className="flex items-center gap-2">

                    <ArrowLeft
                      size={18}
                    />

                    Previous

                  </span>

                </motion.button>

                {/* NEXT */}

                <motion.button
                  whileHover={{
                    scale: 1.02
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  onClick={
                    handleNextQuestion
                  }
                  disabled={
                    loadingNext ||
                    questionIndex >=
                      MAX_QUESTIONS - 1
                  }
                  className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >

                  <span className="flex items-center justify-center gap-2">

                    {loadingNext ? (
                      <>
                        <div className="spinner h-4 w-4 border-white/30 border-t-white"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        Next Question
                        <ArrowRight
                          size={18}
                        />
                      </>
                    )}

                  </span>

                </motion.button>

                {/* END */}

                <button
                  onClick={
                    handleEndInterview
                  }
                  disabled={loadingNext}
                  className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                >

                  <span className="flex items-center gap-2">

                    <Flag
                      size={18}
                    />

                    Finish

                  </span>

                </button>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}