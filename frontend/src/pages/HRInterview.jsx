import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewAPI } from '../services/api';
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Users,
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

export default function HRInterview() {
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
  //
  // This stores every question already loaded.
  //
  // Example:
  //
  // questionHistory[0] = Question 1
  // questionHistory[1] = Question 2
  // questionHistory[2] = Question 3
  //
  // This allows Previous to work without asking
  // the backend for a previous question.
  // =========================================================

  const [questionHistory, setQuestionHistory] = useState([]);

  // =========================================================
  // ANSWER
  // =========================================================

  const [answer, setAnswer] = useState('');

  // =========================================================
  // SUBMITTED ANSWERS
  // =========================================================

  const [allAnswers, setAllAnswers] = useState({});

  // =========================================================
  // AI FEEDBACK
  // =========================================================

  const [feedback, setFeedback] = useState(null);

  // =========================================================
  // UI STATES
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // =========================================================
  // LOAD SESSION
  // =========================================================

  useEffect(() => {
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
        setQuestion(questionRes.data);
        setQuestionHistory([
          questionRes.data
        ]);
        setQuestionIndex(0);
      } else {
        setQuestion(null);
      }

    } catch (err) {
      console.error(
        'Failed to load HR interview:',
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
  // LOAD ANSWER FOR CURRENT QUESTION
  // =========================================================

  const loadAnswerForQuestion = (
    selectedQuestion
  ) => {

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
  // HANDLE NEXT QUESTION
  // =========================================================

  const handleNextQuestion = async () => {

    setError('');
    setFeedback(null);

    // -------------------------------------------------------
    // IF THERE IS A QUESTION ALREADY IN HISTORY
    // -------------------------------------------------------

    const nextIndex =
      questionIndex + 1;

    if (
      nextIndex <
      questionHistory.length
    ) {

      const nextQuestion =
        questionHistory[nextIndex];

      setQuestionIndex(nextIndex);
      setQuestion(nextQuestion);

      loadAnswerForQuestion(
        nextQuestion
      );

      return;
    }

    // -------------------------------------------------------
    // MAXIMUM 15 QUESTIONS
    // -------------------------------------------------------

    if (
      nextIndex >= MAX_QUESTIONS
    ) {

      setError(
        'You have reached the maximum of 15 questions.'
      );

      return;
    }

    // -------------------------------------------------------
    // LOAD NEXT QUESTION FROM BACKEND
    // -------------------------------------------------------

    try {

      const nextQuestionRes =
        await interviewAPI.getNextQuestion(
          sessionId
        );

      if (
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

        setQuestion(null);

      }

    } catch (err) {

      console.error(
        'Failed to load next HR question:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Failed to load next question'
      );
    }
  };

  // =========================================================
  // HANDLE PREVIOUS QUESTION
  // =========================================================

  const handlePreviousQuestion = () => {

    setError('');
    setFeedback(null);

    if (questionIndex <= 0) {
      return;
    }

    const previousIndex =
      questionIndex - 1;

    const previousQuestion =
      questionHistory[
        previousIndex
      ];

    setQuestionIndex(
      previousIndex
    );

    setQuestion(
      previousQuestion
    );

    loadAnswerForQuestion(
      previousQuestion
    );
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

      // -----------------------------------------------------
      // SAVE ANSWER BY QUESTION ID
      // -----------------------------------------------------

      setAllAnswers(
        (previous) => ({
          ...previous,
          [question.questionId]:
            answerData
        })
      );

      // -----------------------------------------------------
      // SHOW FEEDBACK
      // -----------------------------------------------------

      setFeedback(
        answerData
      );

    } catch (err) {

      console.error(
        'Failed to submit HR answer:',
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
        'Failed to end HR interview:',
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
  // CURRENT FEEDBACK DATA
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

          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">

            <Users
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

        {/* =================================================
            PROGRESS BAR
        ================================================= */}

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
            className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full"
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

                {/* ===========================================
                    QUESTION
                =========================================== */}

                <div className="mb-6">

                  <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 mb-3">

                    Question {questionIndex + 1}

                  </span>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">

                    {question.questionText}

                  </h2>

                </div>

                {/* ===========================================
                    MODEL ANSWER
                =========================================== */}

                {question.modelAnswer && (

                  <details className="mb-6 group">

                    <summary className="cursor-pointer text-purple-600 dark:text-purple-400 font-medium hover:underline text-sm">

                      View Model Answer (for reference)

                    </summary>

                    <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-gray-700 dark:text-gray-300 text-sm">

                      {question.modelAnswer}

                    </div>

                  </details>

                )}

                {/* ===========================================
                    ANSWER
                =========================================== */}

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

                {/* ===========================================
                    BUTTONS
                =========================================== */}

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
                      questionIndex === 0
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

                        <Send size={18} />

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
                      questionIndex >=
                      MAX_QUESTIONS - 1
                    }
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >

                    <span className="flex items-center gap-2">

                      Next

                      <ArrowRight
                        size={18}
                      />

                    </span>

                  </motion.button>

                  {/* END */}

                  <button
                    onClick={
                      handleEndInterview
                    }
                    className="btn-secondary"
                  >

                    <span className="flex items-center gap-2">

                      <Flag size={18} />

                      End

                    </span>

                  </button>

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
             FEEDBACK
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

              <p className="text-gray-700 dark:text-gray-300 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm">

                {question?.questionText}

              </p>

              {/* ===========================================
                  USER ANSWER
              =========================================== */}

              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">

                Your Answer

              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm whitespace-pre-wrap">

                {feedback?.userAnswer ||
                  answer}

              </p>

              {/* ===========================================
                  SCORE
              =========================================== */}

              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0
                }}
                animate={{
                  scale: 1,
                  opacity: 1
                }}
                className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl"
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
                        className="text-purple-600 dark:text-purple-400"
                      />

                      <span className="font-medium text-gray-900 dark:text-white">

                        {score >= 80
                          ? 'Excellent response!'
                          : score >= 60
                          ? 'Good response with room for improvement'
                          : 'Needs improvement'}

                      </span>

                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">

                      {feedback?.feedback}

                    </p>

                  </div>

                </div>

              </motion.div>

              {/* ===========================================
                  STRENGTHS
              =========================================== */}

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
                      (strength, idx) => (

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

              {/* ===========================================
                  IMPROVEMENTS
              =========================================== */}

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

              {/* ===========================================
                  NAVIGATION AFTER FEEDBACK
              =========================================== */}

              <div className="flex flex-wrap gap-3">

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
                    questionIndex === 0
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
                    questionIndex >=
                    MAX_QUESTIONS - 1
                  }
                  className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >

                  <span className="flex items-center justify-center gap-2">

                    Next Question

                    <ArrowRight
                      size={18}
                    />

                  </span>

                </motion.button>

                <button
                  onClick={
                    handleEndInterview
                  }
                  className="btn-secondary"
                >

                  <span className="flex items-center gap-2">

                    <Flag size={18} />

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