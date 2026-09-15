import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Search,
  RefreshCw,
  Plus,
  Code2,
  Eye,
  Edit3,
  Trash2,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import AdminLayout from '../layouts/AdminLayout';

import {
  adminCodingQuestionsAPI,
} from '../services/api';


/*
 * =========================================================
 * INITIAL FORM DATA
 * =========================================================
 */

const initialFormData = {
  title: '',
  questionText: '',
  problemStatement: '',
  questionType: 'DSA',
  category: '',
  difficultyLevel: 'EASY',
  bloomsLevel: 'APPLY',
  language: 'JAVA',
  description: '',
  constraints: '',
  inputFormat: '',
  outputFormat: '',
  examples: '',
  hints: '',
  tags: '',
  isFavorite: false,
};


/*
 * =========================================================
 * JSON HELPERS
 * =========================================================
 */

const parseJsonValue = (value, fallback = []) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return fallback;
  } catch {
    return fallback;
  }
};


const convertQuestionToForm = (question) => {

  const examplesArray =
    parseJsonValue(question.examples);

  const hintsArray =
    parseJsonValue(question.hints);

  const tagsArray =
    parseJsonValue(question.tags);

  return {

    title:
      question.title || '',

    questionText:
      question.questionText || '',

    problemStatement:
      question.problemStatement || '',

    questionType:
      question.questionType || 'DSA',

    category:
      question.category || '',

    difficultyLevel:
      question.difficultyLevel || 'EASY',

    bloomsLevel:
      question.bloomsLevel || 'APPLY',

    language:
      question.language || 'JAVA',

    description:
      question.description || '',

    constraints:
      question.constraints || '',

    inputFormat:
      question.inputFormat || '',

    outputFormat:
      question.outputFormat || '',

    examples:
      examplesArray.join('\n\n'),

    hints:
      hintsArray.join('\n'),

    tags:
      tagsArray.join(', '),

    isFavorite:
      Boolean(question.isFavorite),
  };
};


/*
 * =========================================================
 * ADMIN CODING QUESTIONS
 * =========================================================
 */

const AdminCodingQuestions = () => {

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [difficultyFilter, setDifficultyFilter] =
    useState('ALL');

  const [categoryFilter, setCategoryFilter] =
    useState('ALL');

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  const [showAddQuestion, setShowAddQuestion] =
    useState(false);

  const [showEditQuestion, setShowEditQuestion] =
    useState(false);

  const [formData, setFormData] =
    useState(initialFormData);

  const [submitting, setSubmitting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [formError, setFormError] =
    useState('');


  /*
   * =======================================================
   * FETCH QUESTIONS
   * =======================================================
   */

  const fetchQuestions = async () => {

    try {

      setLoading(true);
      setError('');

      const response =
        await adminCodingQuestionsAPI
          .getAllQuestions();

      const data =
        response.data;

      setQuestions(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        'Failed to load coding questions:',
        err
      );

      if (
        err.response?.status === 401
      ) {

        setError(
          'Your administrator session has expired. Please login again.'
        );

      } else if (
        err.response?.status === 403
      ) {

        setError(
          'Administrator access is required.'
        );

      } else {

        setError(
          err.response?.data?.message ||
          'Unable to load coding questions from the server.'
        );
      }

    } finally {

      setLoading(false);
    }
  };


  /*
   * =======================================================
   * INITIAL LOAD
   * =======================================================
   */

  useEffect(() => {

    fetchQuestions();

  }, []);


  /*
   * =======================================================
   * FILTER QUESTIONS
   * =======================================================
   */

  const filteredQuestions =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return questions.filter(
        (question) => {

          const title =
            String(
              question.title || ''
            ).toLowerCase();

          const category =
            String(
              question.category || ''
            ).toLowerCase();

          const language =
            String(
              question.language || ''
            ).toLowerCase();

          const questionType =
            String(
              question.questionType || ''
            ).toLowerCase();

          const matchesSearch =
            !search ||
            title.includes(search) ||
            category.includes(search) ||
            language.includes(search) ||
            questionType.includes(search);

          const matchesDifficulty =
            difficultyFilter === 'ALL' ||
            question.difficultyLevel ===
              difficultyFilter;

          const matchesCategory =
            categoryFilter === 'ALL' ||
            question.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesDifficulty &&
            matchesCategory
          );
        }
      );

    }, [
      questions,
      searchTerm,
      difficultyFilter,
      categoryFilter,
    ]);


  /*
   * =======================================================
   * CATEGORIES
   * =======================================================
   */

  const categories =
    useMemo(() => {

      return [
        ...new Set(
          questions
            .map(
              (question) =>
                question.category
            )
            .filter(Boolean)
        ),
      ].sort();

    }, [questions]);


  /*
   * =======================================================
   * STATISTICS
   * =======================================================
   */

  const totalQuestions =
    questions.length;

  const easyQuestions =
    questions.filter(
      (question) =>
        question.difficultyLevel ===
        'EASY'
    ).length;

  const mediumQuestions =
    questions.filter(
      (question) =>
        question.difficultyLevel ===
        'MEDIUM'
    ).length;

  const hardQuestions =
    questions.filter(
      (question) =>
        question.difficultyLevel ===
        'HARD'
    ).length;


  /*
   * =======================================================
   * FORMAT HELPERS
   * =======================================================
   */

  const formatDifficulty = (
    difficulty
  ) => {

    if (!difficulty) {
      return 'Unknown';
    }

    return String(difficulty)
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };


  const formatQuestionType = (
    type
  ) => {

    if (!type) {
      return '—';
    }

    return String(type)
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };


  const formatBloomsLevel = (
    level
  ) => {

    if (!level) {
      return '—';
    }

    return String(level)
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };


  const getDifficultyClass = (
    difficulty
  ) => {

    if (difficulty === 'EASY') {
      return 'admin-coding-difficulty-easy';
    }

    if (difficulty === 'MEDIUM') {
      return 'admin-coding-difficulty-medium';
    }

    if (difficulty === 'HARD') {
      return 'admin-coding-difficulty-hard';
    }

    return '';
  };


  const formatDate = (
    dateValue
  ) => {

    if (!dateValue) {
      return '—';
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '—';
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };


  /*
   * =======================================================
   * VIEW QUESTION
   * =======================================================
   */

  const openQuestion = async (
    question
  ) => {

    setSelectedQuestion(
      question
    );

    try {

      const response =
        await adminCodingQuestionsAPI
          .getQuestionById(
            question.codingId
          );

      if (response.data) {

        setSelectedQuestion(
          response.data
        );
      }

    } catch (err) {

      console.error(
        'Failed to load coding question details:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Unable to load question details.'
      );
    }
  };


  const closeQuestion = () => {

    if (submitting || deleting) {
      return;
    }

    setSelectedQuestion(null);
  };


  /*
   * =======================================================
   * ADD QUESTION
   * =======================================================
   */

  const openAddQuestion = () => {

    setFormData(
      {
        ...initialFormData,
      }
    );

    setFormError('');
    setSuccessMessage('');

    setShowEditQuestion(false);

    setShowAddQuestion(true);
  };


  const closeAddQuestion = () => {

    if (submitting) {
      return;
    }

    setShowAddQuestion(false);

    setFormData(
      {
        ...initialFormData,
      }
    );

    setFormError('');
  };


  /*
   * =======================================================
   * EDIT QUESTION
   * =======================================================
   */

  const openEditQuestion = async (
    question
  ) => {

    try {

      setFormError('');

      const response =
        await adminCodingQuestionsAPI
          .getQuestionById(
            question.codingId
          );

      const fullQuestion =
        response.data || question;

      setSelectedQuestion(
        fullQuestion
      );

      setFormData(
        convertQuestionToForm(
          fullQuestion
        )
      );

      setShowAddQuestion(false);

      setShowEditQuestion(true);

    } catch (err) {

      console.error(
        'Failed to load question for editing:',
        err
      );

      setFormError(
        err.response?.data?.message ||
        'Unable to load question for editing.'
      );
    }
  };


  const closeEditQuestion = () => {

    if (submitting) {
      return;
    }

    setShowEditQuestion(false);

    setFormData(
      {
        ...initialFormData,
      }
    );

    setFormError('');
  };


  /*
   * =======================================================
   * FORM CHANGE
   * =======================================================
   */

  const handleFormChange = (
    event
  ) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          type === 'checkbox'
            ? checked
            : value,
      })
    );

    if (formError) {
      setFormError('');
    }
  };


  /*
   * =======================================================
   * VALIDATE FORM
   * =======================================================
   */

  const validateForm = () => {

    if (!formData.title.trim()) {

      setFormError(
        'Question title is required.'
      );

      return false;
    }

    if (!formData.questionText.trim()) {

      setFormError(
        'Question text is required.'
      );

      return false;
    }

    if (!formData.problemStatement.trim()) {

      setFormError(
        'Problem statement is required.'
      );

      return false;
    }

    if (!formData.difficultyLevel) {

      setFormError(
        'Difficulty level is required.'
      );

      return false;
    }

    return true;
  };


  /*
   * =======================================================
   * PREPARE REQUEST DATA
   * =======================================================
   */

  const prepareQuestionData = () => {

    const examplesArray =
      formData.examples
        .split(/\n\s*\n/)
        .map(
          (example) =>
            example.trim()
        )
        .filter(Boolean);

    const hintsArray =
      formData.hints
        .split(/\n/)
        .map(
          (hint) =>
            hint.trim()
        )
        .filter(Boolean);

    const tagsArray =
      formData.tags
        .split(',')
        .map(
          (tag) =>
            tag.trim()
        )
        .filter(Boolean);

    return {

      ...formData,

      title:
        formData.title.trim(),

      questionText:
        formData.questionText.trim(),

      problemStatement:
        formData.problemStatement.trim(),

      category:
        formData.category.trim(),

      language:
        formData.language
          .trim()
          .toUpperCase(),

      description:
        formData.description.trim(),

      constraints:
        formData.constraints.trim(),

      inputFormat:
        formData.inputFormat.trim(),

      outputFormat:
        formData.outputFormat.trim(),

      examples:
        JSON.stringify(
          examplesArray
        ),

      hints:
        JSON.stringify(
          hintsArray
        ),

      tags:
        JSON.stringify(
          tagsArray
        ),
    };
  };


  /*
   * =======================================================
   * CREATE QUESTION
   * =======================================================
   */

  const handleCreateQuestion =
    async (event) => {

      event.preventDefault();

      setFormError('');
      setSuccessMessage('');

      if (!validateForm()) {
        return;
      }

      try {

        setSubmitting(true);

        const response =
          await adminCodingQuestionsAPI
            .createQuestion(
              prepareQuestionData()
            );

        if (response.data) {

          setQuestions(
            (previous) => [
              response.data,
              ...previous,
            ]
          );
        }

        setShowAddQuestion(false);

        setFormData(
          {
            ...initialFormData,
          }
        );

        setSuccessMessage(
          'Coding question created successfully.'
        );

      } catch (err) {

        console.error(
          'Failed to create coding question:',
          err
        );

        setFormError(
          err.response?.data?.message ||
          (
            typeof err.response?.data ===
            'string'
              ? err.response.data
              : null
          ) ||
          'Unable to create coding question. Please try again.'
        );

      } finally {

        setSubmitting(false);
      }
    };


  /*
   * =======================================================
   * UPDATE QUESTION
   * =======================================================
   */

  const handleUpdateQuestion =
    async (event) => {

      event.preventDefault();

      setFormError('');
      setSuccessMessage('');

      if (!selectedQuestion) {

        setFormError(
          'No question selected for editing.'
        );

        return;
      }

      if (!validateForm()) {
        return;
      }

      try {

        setSubmitting(true);

        const codingId =
          selectedQuestion.codingId;

        const response =
          await adminCodingQuestionsAPI
            .updateQuestion(
              codingId,
              prepareQuestionData()
            );

        if (response.data) {

          setQuestions(
            (previous) =>
              previous.map(
                (question) =>
                  question.codingId ===
                  codingId
                    ? response.data
                    : question
              )
          );

          setSelectedQuestion(
            response.data
          );
        }

        setShowEditQuestion(false);

        setSuccessMessage(
          'Coding question updated successfully.'
        );

        setFormData(
          {
            ...initialFormData,
          }
        );

      } catch (err) {

        console.error(
          'Failed to update coding question:',
          err
        );

        setFormError(
          err.response?.data?.message ||
          (
            typeof err.response?.data ===
            'string'
              ? err.response.data
              : null
          ) ||
          'Unable to update coding question. Please try again.'
        );

      } finally {

        setSubmitting(false);
      }
    };


  /*
   * =======================================================
   * DELETE QUESTION
   * =======================================================
   */

  const handleDeleteQuestion =
    async () => {

      if (!selectedQuestion) {
        return;
      }

      const codingId =
        selectedQuestion.codingId;

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${selectedQuestion.title}"?\n\nThis action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {

        setDeleting(true);
        setError('');

        await adminCodingQuestionsAPI
          .deleteQuestion(
            codingId
          );

        setQuestions(
          (previous) =>
            previous.filter(
              (question) =>
                question.codingId !==
                codingId
            )
        );

        setSelectedQuestion(null);

        setSuccessMessage(
          'Coding question deleted successfully.'
        );

      } catch (err) {

        console.error(
          'Failed to delete coding question:',
          err
        );

        setError(
          err.response?.data?.message ||
          (
            typeof err.response?.data ===
            'string'
              ? err.response.data
              : null
          ) ||
          'Unable to delete coding question. Please try again.'
        );

      } finally {

        setDeleting(false);
      }
    };


  /*
   * =======================================================
   * FORM COMPONENT
   * =======================================================
   */

  const renderQuestionForm = (
    isEdit = false
  ) => {

    const submitHandler =
      isEdit
        ? handleUpdateQuestion
        : handleCreateQuestion;

    const closeHandler =
      isEdit
        ? closeEditQuestion
        : closeAddQuestion;

    return (

      <div
        className="admin-user-modal-backdrop"
        onMouseDown={(event) => {

          if (
            event.target ===
            event.currentTarget
          ) {

            closeHandler();
          }
        }}
      >

        <div
          className="admin-user-modal"
          role="dialog"
          aria-modal="true"
          style={{
            maxWidth: '900px',
          }}
        >

          <div className="admin-user-modal-header">

            <div>

              <span className="admin-panel-eyebrow">
                QUESTION MANAGEMENT
              </span>

              <h2>
                {isEdit
                  ? 'Edit Coding Question'
                  : 'Add Coding Question'}
              </h2>

            </div>

            <button
              className="admin-user-modal-close"
              type="button"
              onClick={closeHandler}
              disabled={submitting}
              aria-label="Close"
            >
              <X size={18} />
            </button>

          </div>


          {formError && (

            <div
              className="admin-users-error"
              style={{
                marginBottom: '20px',
              }}
            >

              <div>

                <AlertCircle
                  size={17}
                />

                <span>
                  {formError}
                </span>

              </div>

            </div>
          )}


          <form
            onSubmit={submitHandler}
          >

            {/* TITLE */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >

              <label>
                TITLE *
              </label>

              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter question title"
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border:
                    '1px solid rgba(120,140,180,0.25)',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                }}
              />

            </div>


            {/* BASIC INFORMATION */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '16px',
                marginBottom: '18px',
              }}
            >

              <div>

                <label>
                  QUESTION TYPE *
                </label>

                <select
                  name="questionType"
                  value={
                    formData.questionType
                  }
                  onChange={
                    handleFormChange
                  }
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background:
                      'rgba(10,18,32,0.6)',
                    color: 'inherit',
                  }}
                >

                  <option value="DSA">
                    DSA
                  </option>

                  <option value="PROGRAMMING">
                    Programming
                  </option>

                </select>

              </div>


              <div>

                <label>
                  DIFFICULTY *
                </label>

                <select
                  name="difficultyLevel"
                  value={
                    formData.difficultyLevel
                  }
                  onChange={
                    handleFormChange
                  }
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background:
                      'rgba(10,18,32,0.6)',
                    color: 'inherit',
                  }}
                >

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


              <div>

                <label>
                  CATEGORY
                </label>

                <input
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="e.g. Arrays"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background:
                      'rgba(10,18,32,0.6)',
                    color: 'inherit',
                  }}
                />

              </div>


              <div>

                <label>
                  LANGUAGE
                </label>

                <input
                  name="language"
                  value={
                    formData.language
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="JAVA"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background:
                      'rgba(10,18,32,0.6)',
                    color: 'inherit',
                  }}
                />

              </div>


              <div>

                <label>
                  BLOOM'S LEVEL
                </label>

                <select
                  name="bloomsLevel"
                  value={
                    formData.bloomsLevel
                  }
                  onChange={
                    handleFormChange
                  }
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background:
                      'rgba(10,18,32,0.6)',
                    color: 'inherit',
                  }}
                >

                  <option value="REMEMBER">
                    Remember
                  </option>

                  <option value="UNDERSTAND">
                    Understand
                  </option>

                  <option value="APPLY">
                    Apply
                  </option>

                  <option value="ANALYZE">
                    Analyze
                  </option>

                  <option value="EVALUATE">
                    Evaluate
                  </option>

                  <option value="CREATE">
                    Create
                  </option>

                </select>

              </div>

            </div>


            {/* QUESTION TEXT */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >

              <label>
                QUESTION TEXT *
              </label>

              <textarea
                name="questionText"
                value={
                  formData.questionText
                }
                onChange={
                  handleFormChange
                }
                rows={4}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                  resize: 'vertical',
                }}
              />

            </div>


            {/* PROBLEM STATEMENT */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >

              <label>
                PROBLEM STATEMENT *
              </label>

              <textarea
                name="problemStatement"
                value={
                  formData.problemStatement
                }
                onChange={
                  handleFormChange
                }
                rows={5}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                  resize: 'vertical',
                }}
              />

            </div>


            {/* DESCRIPTION */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >

              <label>
                DESCRIPTION
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleFormChange
                }
                rows={3}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                  resize: 'vertical',
                }}
              />

            </div>


            {/* CONSTRAINTS */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >

              <label>
                CONSTRAINTS
              </label>

              <textarea
                name="constraints"
                value={
                  formData.constraints
                }
                onChange={
                  handleFormChange
                }
                rows={3}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                  resize: 'vertical',
                }}
              />

            </div>


            {/* INPUT / OUTPUT */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
              }}
            >

              <div>

                <label>
                  INPUT FORMAT
                </label>

                <textarea
                  name="inputFormat"
                  value={
                    formData.inputFormat
                  }
                  onChange={
                    handleFormChange
                  }
                  rows={4}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background:
                      'rgba(10,18,32,0.6)',
                    color: 'inherit',
                  }}
                />

              </div>


              <div>

                <label>
                  OUTPUT FORMAT
                </label>

                <textarea
                  name="outputFormat"
                  value={
                    formData.outputFormat
                  }
                  onChange={
                    handleFormChange
                  }
                  rows={4}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background:
                      'rgba(10,18,32,0.6)',
                    color: 'inherit',
                  }}
                />

              </div>

            </div>


            {/* EXAMPLES */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >

              <label>
                EXAMPLES
              </label>

              <textarea
                name="examples"
                value={
                  formData.examples
                }
                onChange={
                  handleFormChange
                }
                placeholder={`Example 1:
Input: [1, 2, 3]
Output: 6`}
                rows={6}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                  resize: 'vertical',
                  fontFamily: 'monospace',
                }}
              />

            </div>


            {/* HINTS */}

            <div
              style={{
                marginBottom: '16px',
              }}
            >

              <label>
                HINTS
              </label>

              <textarea
                name="hints"
                value={
                  formData.hints
                }
                onChange={
                  handleFormChange
                }
                placeholder="One hint per line"
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                  resize: 'vertical',
                }}
              />

            </div>


            {/* TAGS */}

            <div
              style={{
                marginBottom: '18px',
              }}
            >

              <label>
                TAGS
              </label>

              <input
                name="tags"
                value={
                  formData.tags
                }
                onChange={
                  handleFormChange
                }
                placeholder="arrays, loops, hashing"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    'rgba(10,18,32,0.6)',
                  color: 'inherit',
                }}
              />

            </div>


            {/* FAVORITE */}

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                marginBottom: '22px',
                cursor: 'pointer',
              }}
            >

              <input
                type="checkbox"
                name="isFavorite"
                checked={
                  formData.isFavorite
                }
                onChange={
                  handleFormChange
                }
              />

              <span>
                Mark this question as favorite
              </span>

            </label>


            {/* FOOTER */}

            <div
              className="admin-user-modal-footer"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >

              <button
                className="admin-user-modal-close-button"
                type="button"
                onClick={closeHandler}
                disabled={submitting}
              >
                Cancel
              </button>


              <button
                className="admin-users-refresh"
                type="submit"
                disabled={submitting}
              >

                {submitting ? (

                  <>
                    <RefreshCw
                      size={15}
                      className="admin-spin"
                    />

                    {isEdit
                      ? 'Saving...'
                      : 'Creating...'}
                  </>

                ) : (

                  <>
                    {isEdit
                      ? <Edit3 size={15} />
                      : <Plus size={15} />}

                    {isEdit
                      ? 'Save Changes'
                      : 'Create Question'}
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>
    );
  };


  /*
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (

    <AdminLayout
      currentPage="Coding Questions"
    >

      {/* HEADER */}

      <div className="admin-users-header">

        <div>

          <span className="admin-dashboard-eyebrow">
            QUESTION MANAGEMENT
          </span>

          <h1>
            Coding Questions
          </h1>

          <p>
            Manage coding problems used throughout InterviewTwin.
          </p>

        </div>


        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >

          <button
            className="admin-users-refresh"
            type="button"
            onClick={fetchQuestions}
            disabled={loading}
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? 'admin-spin'
                  : ''
              }
            />

            {loading
              ? 'Loading'
              : 'Refresh'}

          </button>


          <button
            className="admin-users-refresh"
            type="button"
            onClick={
              openAddQuestion
            }
          >

            <Plus size={15} />

            Add Question

          </button>

        </div>

      </div>


      {/* SUCCESS */}

      {successMessage && (

        <div
          className="admin-users-error"
          style={{
            borderColor:
              'rgba(34,197,94,0.3)',
          }}
        >

          <div>

            <CheckCircle2
              size={17}
            />

            <span>
              {successMessage}
            </span>

          </div>


          <button
            type="button"
            onClick={() =>
              setSuccessMessage('')
            }
          >
            ×
          </button>

        </div>
      )}


      {/* ERROR */}

      {error && (

        <div className="admin-users-error">

          <div>

            <AlertCircle
              size={17}
            />

            <span>
              {error}
            </span>

          </div>


          <button
            type="button"
            onClick={
              fetchQuestions
            }
          >

            <RefreshCw
              size={13}
            />

            Retry

          </button>

        </div>
      )}


      {/* SUMMARY */}

      <div className="admin-users-summary">

        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon">
            <Code2 size={19} />
          </div>

          <div>

            <span>
              TOTAL QUESTIONS
            </span>

            <strong>
              {loading
                ? '...'
                : totalQuestions}
            </strong>

          </div>

        </div>


        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-active">
            <CheckCircle2 size={19} />
          </div>

          <div>

            <span>
              EASY
            </span>

            <strong>
              {loading
                ? '...'
                : easyQuestions}
            </strong>

          </div>

        </div>


        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-verified">
            <Code2 size={19} />
          </div>

          <div>

            <span>
              MEDIUM
            </span>

            <strong>
              {loading
                ? '...'
                : mediumQuestions}
            </strong>

          </div>

        </div>


        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-admin">
            <Code2 size={19} />
          </div>

          <div>

            <span>
              HARD
            </span>

            <strong>
              {loading
                ? '...'
                : hardQuestions}
            </strong>

          </div>

        </div>

      </div>


      {/* QUESTION BANK */}

      <section className="admin-users-panel">

        <div className="admin-users-toolbar">

          <div className="admin-users-toolbar-title">

            <div>

              <span className="admin-panel-eyebrow">
                QUESTION BANK
              </span>

              <h2>
                All Coding Questions
              </h2>

            </div>

            <span className="admin-users-count">
              {filteredQuestions.length}
            </span>

          </div>


          <div className="admin-users-toolbar-controls">

            {/* SEARCH */}

            <div className="admin-users-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />


              {searchTerm && (

                <button
                  className="admin-users-search-clear"
                  type="button"
                  onClick={() =>
                    setSearchTerm('')
                  }
                >
                  ×
                </button>

              )}

            </div>


            {/* DIFFICULTY */}

            <select
              className="admin-users-filter"
              value={
                difficultyFilter
              }
              onChange={(event) =>
                setDifficultyFilter(
                  event.target.value
                )
              }
            >

              <option value="ALL">
                All Difficulty
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


            {/* CATEGORY */}

            <select
              className="admin-users-filter"
              value={
                categoryFilter
              }
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
            >

              <option value="ALL">
                All Categories
              </option>

              {categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="admin-users-loading">

            <div className="admin-users-loader"></div>

            <p>
              Loading coding questions...
            </p>

          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          filteredQuestions.length === 0 && (

            <div className="admin-users-empty">

              <div className="admin-users-empty-icon">
                <Code2 size={22} />
              </div>

              <h3>
                No questions found
              </h3>

              <p>
                {questions.length === 0
                  ? 'There are no coding questions in the database.'
                  : 'Try changing your search or filters.'}
              </p>

            </div>
          )}


        {/* TABLE */}

        {!loading &&
          filteredQuestions.length > 0 && (

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>

                  <tr>

                    <th>
                      QUESTION
                    </th>

                    <th>
                      CATEGORY
                    </th>

                    <th>
                      DIFFICULTY
                    </th>

                    <th>
                      LANGUAGE
                    </th>

                    <th>
                      TYPE
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredQuestions.map(
                    (question) => (

                      <tr
                        key={
                          question.codingId
                        }
                      >

                        <td>

                          <div
                            className="admin-user-identity"
                            style={{
                              maxWidth:
                                '360px',
                            }}
                          >

                            <strong>
                              {question.title ||
                                'Untitled Question'}
                            </strong>

                            <span>
                              Question ID: #
                              {question.codingId}
                            </span>

                          </div>

                        </td>


                        <td>

                          <span className="admin-role-badge admin-role-user">
                            {question.category ||
                              '—'}
                          </span>

                        </td>


                        <td>

                          <span
                            className={`admin-status-badge ${getDifficultyClass(
                              question.difficultyLevel
                            )}`}
                          >

                            <span className="admin-status-small-dot"></span>

                            {formatDifficulty(
                              question.difficultyLevel
                            )}

                          </span>

                        </td>


                        <td>

                          <span className="admin-role-badge admin-role-user">
                            {question.language ||
                              '—'}
                          </span>

                        </td>


                        <td>

                          <span className="admin-role-badge admin-role-user">
                            {formatQuestionType(
                              question.questionType
                            )}
                          </span>

                        </td>


                        <td>

                          <button
                            className="admin-user-view-button"
                            type="button"
                            onClick={() =>
                              openQuestion(
                                question
                              )
                            }
                          >

                            <Eye
                              size={14}
                            />

                            View

                            <ChevronRight
                              size={14}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </section>


      {/* ===================================================
          QUESTION DETAILS MODAL
          =================================================== */}

      {selectedQuestion &&
        !showEditQuestion && (

          <div
            className="admin-user-modal-backdrop"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {

                closeQuestion();
              }
            }}
          >

            <div
              className="admin-user-modal"
              role="dialog"
              aria-modal="true"
            >

              <div className="admin-user-modal-header">

                <div>

                  <span className="admin-panel-eyebrow">
                    CODING QUESTION
                  </span>

                  <h2>
                    Question Details
                  </h2>

                </div>


                <button
                  className="admin-user-modal-close"
                  type="button"
                  onClick={
                    closeQuestion
                  }
                >
                  <X size={18} />
                </button>

              </div>


              <div
                style={{
                  marginBottom: '22px',
                }}
              >

                <h3
                  style={{
                    margin: 0,
                    fontSize: '22px',
                  }}
                >
                  {selectedQuestion.title ||
                    'Untitled Question'}
                </h3>

                <p
                  style={{
                    marginTop: '7px',
                    color: '#7184a8',
                  }}
                >
                  Question ID: #
                  {selectedQuestion.codingId}
                </p>

              </div>


              {/* BASIC INFORMATION */}

              <div className="admin-user-modal-status-row">

                <div className="admin-user-modal-status-card">

                  <span>
                    CATEGORY
                  </span>

                  <strong>
                    {selectedQuestion.category ||
                      '—'}
                  </strong>

                </div>


                <div className="admin-user-modal-status-card">

                  <span>
                    DIFFICULTY
                  </span>

                  <strong>
                    {formatDifficulty(
                      selectedQuestion.difficultyLevel
                    )}
                  </strong>

                </div>


                <div className="admin-user-modal-status-card">

                  <span>
                    LANGUAGE
                  </span>

                  <strong>
                    {selectedQuestion.language ||
                      '—'}
                  </strong>

                </div>

              </div>


              <div className="admin-user-modal-status-row">

                <div className="admin-user-modal-status-card">

                  <span>
                    QUESTION TYPE
                  </span>

                  <strong>
                    {formatQuestionType(
                      selectedQuestion.questionType
                    )}
                  </strong>

                </div>


                <div className="admin-user-modal-status-card">

                  <span>
                    BLOOM'S LEVEL
                  </span>

                  <strong>
                    {formatBloomsLevel(
                      selectedQuestion.bloomsLevel
                    )}
                  </strong>

                </div>


                <div className="admin-user-modal-status-card">

                  <span>
                    CREATED
                  </span>

                  <strong>
                    {formatDate(
                      selectedQuestion.createdAt
                    )}
                  </strong>

                </div>

              </div>


              {/* CONTENT */}

              {selectedQuestion.questionText && (

                <div className="admin-user-modal-bio">

                  <span>
                    QUESTION
                  </span>

                  <p>
                    {selectedQuestion.questionText}
                  </p>

                </div>
              )}


              {selectedQuestion.problemStatement && (

                <div className="admin-user-modal-bio">

                  <span>
                    PROBLEM STATEMENT
                  </span>

                  <p>
                    {selectedQuestion.problemStatement}
                  </p>

                </div>
              )}


              {selectedQuestion.description && (

                <div className="admin-user-modal-bio">

                  <span>
                    DESCRIPTION
                  </span>

                  <p>
                    {selectedQuestion.description}
                  </p>

                </div>
              )}


              {selectedQuestion.constraints && (

                <div className="admin-user-modal-bio">

                  <span>
                    CONSTRAINTS
                  </span>

                  <p>
                    {selectedQuestion.constraints}
                  </p>

                </div>
              )}


              {selectedQuestion.inputFormat && (

                <div className="admin-user-modal-bio">

                  <span>
                    INPUT FORMAT
                  </span>

                  <p>
                    {selectedQuestion.inputFormat}
                  </p>

                </div>
              )}


              {selectedQuestion.outputFormat && (

                <div className="admin-user-modal-bio">

                  <span>
                    OUTPUT FORMAT
                  </span>

                  <p>
                    {selectedQuestion.outputFormat}
                  </p>

                </div>
              )}


              {selectedQuestion.examples && (

                <div className="admin-user-modal-bio">

                  <span>
                    EXAMPLES
                  </span>

                  <pre
                    style={{
                      whiteSpace:
                        'pre-wrap',
                      wordBreak:
                        'break-word',
                      margin: 0,
                      fontFamily:
                        'inherit',
                    }}
                  >
                    {parseJsonValue(
                      selectedQuestion.examples
                    ).join('\n\n')}
                  </pre>

                </div>
              )}


              {selectedQuestion.hints && (

                <div className="admin-user-modal-bio">

                  <span>
                    HINTS
                  </span>

                  <pre
                    style={{
                      whiteSpace:
                        'pre-wrap',
                      wordBreak:
                        'break-word',
                      margin: 0,
                      fontFamily:
                        'inherit',
                    }}
                  >
                    {parseJsonValue(
                      selectedQuestion.hints
                    ).join('\n')}
                  </pre>

                </div>
              )}


              {selectedQuestion.tags && (

                <div className="admin-user-modal-bio">

                  <span>
                    TAGS
                  </span>

                  <p>
                    {parseJsonValue(
                      selectedQuestion.tags
                    ).join(', ')}
                  </p>

                </div>
              )}


              {/* STATISTICS */}

              <div className="admin-user-modal-status-row">

                <div className="admin-user-modal-status-card">

                  <span>
                    ACCEPTANCE RATE
                  </span>

                  <strong>
                    {selectedQuestion.acceptanceRate !==
                      null &&
                    selectedQuestion.acceptanceRate !==
                      undefined
                      ? `${Number(
                          selectedQuestion.acceptanceRate
                        ).toFixed(2)}%`
                      : '0.00%'}
                  </strong>

                </div>


                <div className="admin-user-modal-status-card">

                  <span>
                    SUBMISSIONS
                  </span>

                  <strong>
                    {selectedQuestion.totalSubmissions ??
                      0}
                  </strong>

                </div>


                <div className="admin-user-modal-status-card">

                  <span>
                    ACCEPTED
                  </span>

                  <strong>
                    {selectedQuestion.totalAccepted ??
                      0}
                  </strong>

                </div>

              </div>


              {/* FAVORITE */}

              <div className="admin-user-modal-bio">

                <span>
                  FAVORITE
                </span>

                <p>
                  {selectedQuestion.isFavorite
                    ? 'Yes'
                    : 'No'}
                </p>

              </div>


              {/* ACTIONS */}

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '20px',
                  flexWrap: 'wrap',
                }}
              >

                <button
                  className="admin-user-view-button"
                  type="button"
                  onClick={() =>
                    openEditQuestion(
                      selectedQuestion
                    )
                  }
                >

                  <Edit3
                    size={14}
                  />

                  Edit

                </button>


                <button
                  className="admin-user-view-button"
                  type="button"
                  onClick={
                    handleDeleteQuestion
                  }
                  disabled={deleting}
                >

                  {deleting ? (

                    <RefreshCw
                      size={14}
                      className="admin-spin"
                    />

                  ) : (

                    <Trash2
                      size={14}
                    />

                  )}

                  {deleting
                    ? 'Deleting...'
                    : 'Delete'}

                </button>

              </div>


              {/* FOOTER */}

              <div className="admin-user-modal-footer">

                <button
                  className="admin-user-modal-close-button"
                  type="button"
                  onClick={
                    closeQuestion
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}


      {/* ADD */}

      {showAddQuestion &&
        renderQuestionForm(false)}


      {/* EDIT */}

      {showEditQuestion &&
        renderQuestionForm(true)}

    </AdminLayout>
  );
};


export default AdminCodingQuestions;