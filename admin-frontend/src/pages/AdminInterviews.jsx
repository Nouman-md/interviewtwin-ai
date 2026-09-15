import React, { useEffect, useMemo, useState } from 'react';

import {
  Search,
  RefreshCw,
  Video,
  CheckCircle2,
  Clock3,
  BarChart3,
  XCircle,
  ChevronRight,
  CalendarDays,
  UserRound,
  Mail,
  Timer,
  Award,
  Flag,
} from 'lucide-react';

import AdminLayout from '../layouts/AdminLayout';
import { adminInterviewsAPI } from '../services/api';

const AdminInterviews = () => {

  // =========================================================
  // STATE
  // =========================================================

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedInterview, setSelectedInterview] =
    useState(null);

  const [showPerformance, setShowPerformance] =
    useState(false);

  // =========================================================
  // STATUS UPDATE
  // =========================================================

  const [statusUpdateLoading, setStatusUpdateLoading] =
    useState(false);

  const [statusUpdateError, setStatusUpdateError] =
    useState('');

  const [statusUpdateSuccess, setStatusUpdateSuccess] =
    useState('');

  const [showStatusEditor, setShowStatusEditor] =
    useState(false);

  const [newInterviewStatus, setNewInterviewStatus] =
    useState('');

  // =========================================================
  // REVIEW FLAG
  // =========================================================

  const [flagLoading, setFlagLoading] =
    useState(false);

  const [flagError, setFlagError] =
    useState('');

  const [flagSuccess, setFlagSuccess] =
    useState('');


  // =========================================================
  // FETCH ALL INTERVIEWS
  // =========================================================

  const fetchInterviews = async () => {

    try {

      setLoading(true);
      setError(null);

      const response =
        await adminInterviewsAPI.getAllInterviews();

      setInterviews(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (err) {

      console.error(
        'Failed to load interviews:',
        err
      );

      if (err.response?.status === 401) {

        setError(
          'Your admin session has expired. Please login again.'
        );

      } else if (err.response?.status === 403) {

        setError(
          'Administrator access is required.'
        );

      } else {

        setError(
          'Unable to load interviews from the server.'
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchInterviews();

  }, []);


  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return '—';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
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


  const formatDateTime = (dateValue) => {

    if (!dateValue) {
      return '—';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };


  const formatStatus = (status) => {

    if (!status) {
      return 'Unknown';
    }

    return String(status)
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  const normalizeStatus = (status) => {

    return String(status || '')
      .trim()
      .toUpperCase();
  };


  const formatScore = (score) => {

    if (
      score === null ||
      score === undefined ||
      score === ''
    ) {
      return '—';
    }

    const numericScore = Number(score);

    if (Number.isNaN(numericScore)) {
      return '—';
    }

    return numericScore.toFixed(2);
  };


  const getScoreClass = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return '';
    }

    const numericScore = Number(score);

    if (Number.isNaN(numericScore)) {
      return '';
    }

    if (numericScore >= 80) {
      return 'admin-interview-score-high';
    }

    if (numericScore >= 60) {
      return 'admin-interview-score-medium';
    }

    return 'admin-interview-score-low';
  };


  const getStatusClass = (status) => {

    const normalized =
      normalizeStatus(status);

    if (
      normalized === 'COMPLETED' ||
      normalized === 'COMPLETE'
    ) {
      return 'admin-interview-status-completed';
    }

    if (
      normalized === 'IN_PROGRESS' ||
      normalized === 'STARTED'
    ) {
      return 'admin-interview-status-progress';
    }

    if (
      normalized === 'CANCELLED' ||
      normalized === 'CANCELED' ||
      normalized === 'FAILED'
    ) {
      return 'admin-interview-status-failed';
    }

    return 'admin-interview-status-other';
  };


  const isInterviewFlagged = (interview) => {

    return Boolean(
      interview?.flaggedForReview
    );

  };


  // =========================================================
  // FILTERED INTERVIEWS
  // =========================================================

  const filteredInterviews = useMemo(() => {

    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return interviews.filter((interview) => {

      const searchableValues = [
        interview.userName,
        interview.userEmail,
        interview.interviewType,
        interview.sessionTitle,
        interview.status,
      ];

      const matchesSearch =
        !normalizedSearch ||
        searchableValues
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(normalizedSearch)
          );

      const normalizedStatus =
        normalizeStatus(interview.status);

      let matchesStatus = true;

      if (statusFilter === 'COMPLETED') {

        matchesStatus =
          normalizedStatus === 'COMPLETED' ||
          normalizedStatus === 'COMPLETE';
      }

      if (statusFilter === 'IN_PROGRESS') {

        matchesStatus =
          normalizedStatus === 'IN_PROGRESS' ||
          normalizedStatus === 'STARTED';
      }

      if (statusFilter === 'CANCELLED') {

        matchesStatus =
          normalizedStatus === 'CANCELLED' ||
          normalizedStatus === 'CANCELED';
      }

      return matchesSearch && matchesStatus;

    });

  }, [
    interviews,
    searchTerm,
    statusFilter,
  ]);


  // =========================================================
  // SUMMARY
  // =========================================================

  const totalInterviews =
    interviews.length;

  const completedInterviews =
    interviews.filter((interview) => {

      const status =
        normalizeStatus(interview.status);

      return (
        status === 'COMPLETED' ||
        status === 'COMPLETE'
      );

    }).length;

  const inProgressInterviews =
    interviews.filter((interview) => {

      const status =
        normalizeStatus(interview.status);

      return (
        status === 'IN_PROGRESS' ||
        status === 'STARTED'
      );

    }).length;

  const scoredInterviews =
    interviews.filter(
      (interview) =>
        interview.overallScore !== null &&
        interview.overallScore !== undefined &&
        !Number.isNaN(
          Number(interview.overallScore)
        )
    );

  const averageScore =
    scoredInterviews.length > 0
      ? scoredInterviews.reduce(
          (total, interview) =>
            total +
            Number(interview.overallScore),
          0
        ) / scoredInterviews.length
      : null;


  // =========================================================
  // OPEN INTERVIEW DETAILS
  // =========================================================

  const openInterviewDetails = async (
    interview
  ) => {

    setSelectedInterview(interview);

    setShowPerformance(false);

    setStatusUpdateError('');
    setStatusUpdateSuccess('');

    setFlagError('');
    setFlagSuccess('');

    setShowStatusEditor(false);
    setNewInterviewStatus('');

    try {

      const response =
        await adminInterviewsAPI.getInterviewById(
          interview.sessionId
        );

      if (response.data) {

        setSelectedInterview(
          response.data
        );

      }

    } catch (err) {

      console.error(
        'Failed to load interview details:',
        err
      );

      // Keep existing interview data visible.

    }
  };


  // =========================================================
  // CLOSE INTERVIEW
  // =========================================================

  const closeInterviewDetails = () => {

    setSelectedInterview(null);

    setShowPerformance(false);

    setStatusUpdateError('');
    setStatusUpdateSuccess('');

    setFlagError('');
    setFlagSuccess('');

    setShowStatusEditor(false);
    setNewInterviewStatus('');

  };


  // =========================================================
  // UPDATE INTERVIEW STATUS
  // =========================================================

  const handleUpdateInterviewStatus = async () => {

    if (!selectedInterview?.sessionId) {
      return;
    }

    if (!newInterviewStatus) {

      setStatusUpdateError(
        'Please select a status.'
      );

      return;
    }

    try {

      setStatusUpdateLoading(true);

      setStatusUpdateError('');
      setStatusUpdateSuccess('');

      const response =
        await adminInterviewsAPI.updateInterviewStatus(
          selectedInterview.sessionId,
          newInterviewStatus
        );

      if (response.data) {

        setSelectedInterview(
          response.data
        );

        setInterviews(
          (currentInterviews) =>
            currentInterviews.map(
              (interview) =>
                interview.sessionId ===
                response.data.sessionId
                  ? response.data
                  : interview
            )
        );

        setStatusUpdateSuccess(
          'Interview status updated successfully.'
        );

        setNewInterviewStatus('');

        setShowStatusEditor(false);

      }

    } catch (err) {

      console.error(
        'Failed to update interview status:',
        err
      );

      setStatusUpdateError(
        err.response?.data?.message ||
        err.response?.data ||
        'Unable to update interview status.'
      );

    } finally {

      setStatusUpdateLoading(false);

    }
  };


  // =========================================================
  // FLAG / UNFLAG INTERVIEW
  // =========================================================

  const handleToggleReviewFlag = async () => {

    if (!selectedInterview?.sessionId) {
      return;
    }

    try {

      setFlagLoading(true);

      setFlagError('');
      setFlagSuccess('');

      const currentlyFlagged =
        isInterviewFlagged(selectedInterview);

      let response;

      if (currentlyFlagged) {

        response =
          await adminInterviewsAPI.unflagInterviewForReview(
            selectedInterview.sessionId
          );

      } else {

        response =
          await adminInterviewsAPI.flagInterviewForReview(
            selectedInterview.sessionId
          );

      }

      if (response.data) {

        setSelectedInterview(
          response.data
        );

        setInterviews(
          (currentInterviews) =>
            currentInterviews.map(
              (interview) =>
                interview.sessionId ===
                response.data.sessionId
                  ? response.data
                  : interview
            )
        );

        setFlagSuccess(
          currentlyFlagged
            ? 'Review flag removed successfully.'
            : 'Interview flagged for review successfully.'
        );

      }

    } catch (err) {

      console.error(
        'Failed to update interview review flag:',
        err
      );

      setFlagError(
        err.response?.data?.message ||
        err.response?.data ||
        'Unable to update review flag.'
      );

    } finally {

      setFlagLoading(false);

    }
  };


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <AdminLayout currentPage="Interviews">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="admin-users-header">

        <div>

          <span className="admin-dashboard-eyebrow">
            INTERVIEW MANAGEMENT
          </span>

          <h1>
            Interviews
          </h1>

          <p>
            Monitor interview sessions and candidate performance.
          </p>

        </div>


        <button
          className="admin-users-refresh"
          onClick={fetchInterviews}
          disabled={loading}
          type="button"
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
            ? 'Refreshing'
            : 'Refresh'}

        </button>

      </div>


      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="admin-users-summary">

        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon">
            <Video size={19} />
          </div>

          <div>

            <span>
              TOTAL INTERVIEWS
            </span>

            <strong>
              {loading
                ? '...'
                : totalInterviews}
            </strong>

          </div>

        </div>


        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-active">
            <CheckCircle2 size={19} />
          </div>

          <div>

            <span>
              COMPLETED
            </span>

            <strong>
              {loading
                ? '...'
                : completedInterviews}
            </strong>

          </div>

        </div>


        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-verified">
            <Clock3 size={19} />
          </div>

          <div>

            <span>
              IN PROGRESS
            </span>

            <strong>
              {loading
                ? '...'
                : inProgressInterviews}
            </strong>

          </div>

        </div>


        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-admin">
            <BarChart3 size={19} />
          </div>

          <div>

            <span>
              AVERAGE SCORE
            </span>

            <strong>
              {loading
                ? '...'
                : averageScore !== null
                  ? averageScore.toFixed(2)
                  : '—'}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <div className="admin-users-error">

          <div>

            <XCircle size={17} />

            <span>
              {error}
            </span>

          </div>

          <button
            onClick={fetchInterviews}
            type="button"
          >

            <RefreshCw size={13} />

            Retry

          </button>

        </div>

      )}


      {/* =====================================================
          INTERVIEW PANEL
          ===================================================== */}

      <section className="admin-users-panel">

        <div className="admin-users-toolbar">

          <div className="admin-users-toolbar-title">

            <div>

              <span className="admin-panel-eyebrow">
                SESSIONS
              </span>

              <h2>
                All Interviews
              </h2>

            </div>

            <span className="admin-users-count">
              {filteredInterviews.length}
            </span>

          </div>


          <div className="admin-users-toolbar-controls">

            <div className="admin-users-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search interviews..."
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
                  onClick={() =>
                    setSearchTerm('')
                  }
                  aria-label="Clear search"
                  type="button"
                >
                  ×
                </button>

              )}

            </div>


            <select
              className="admin-users-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="ALL">
                All Status
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>

            </select>

          </div>

        </div>


        {/* ===================================================
            LOADING
            =================================================== */}

        {loading && (

          <div className="admin-users-loading">

            <div className="admin-users-loader"></div>

            <p>
              Loading interviews...
            </p>

          </div>

        )}


        {/* ===================================================
            EMPTY
            =================================================== */}

        {!loading &&
          !error &&
          filteredInterviews.length === 0 && (

            <div className="admin-users-empty">

              <div className="admin-users-empty-icon">
                <Video size={22} />
              </div>

              <h3>
                No interviews found
              </h3>

              <p>
                Try changing your search or status filter.
              </p>

            </div>

          )}


        {/* ===================================================
            TABLE
            =================================================== */}

        {!loading &&
          !error &&
          filteredInterviews.length > 0 && (

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>

                  <tr>

                    <th>
                      USER
                    </th>

                    <th>
                      TYPE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      SCORE
                    </th>

                    <th>
                      DURATION
                    </th>

                    <th>
                      STARTED
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredInterviews.map(
                    (interview) => (

                      <tr
                        key={
                          interview.sessionId
                        }
                      >

                        <td>

                          <div className="admin-user-cell">

                            <div className="admin-user-avatar">

                              {interview.userName
                                ?.split(' ')
                                .map(
                                  (part) =>
                                    part.charAt(0)
                                )
                                .slice(0, 2)
                                .join('')
                                .toUpperCase() ||
                                'U'}

                            </div>


                            <div className="admin-user-identity">

                              <strong>
                                {interview.userName ||
                                  'Unknown User'}
                              </strong>

                              <span>

                                <Mail size={11} />

                                {interview.userEmail ||
                                  '—'}

                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="admin-role-badge admin-role-user">

                            {interview.interviewType ||
                              'Unknown'}

                          </span>

                        </td>


                        <td>

                          <span
                            className={`admin-status-badge ${getStatusClass(
                              interview.status
                            )}`}
                          >

                            <span className="admin-status-small-dot"></span>

                            {formatStatus(
                              interview.status
                            )}

                          </span>

                        </td>


                        <td>

                          <span
                            className={`admin-interview-score ${getScoreClass(
                              interview.overallScore
                            )}`}
                          >

                            {formatScore(
                              interview.overallScore
                            )}

                          </span>

                        </td>


                        <td>

                          <div className="admin-date-cell">

                            <Timer size={13} />

                            {interview.durationMinutes != null
                              ? `${interview.durationMinutes} min`
                              : '—'}

                          </div>

                        </td>


                        <td>

                          <div className="admin-date-cell">

                            <CalendarDays size={13} />

                            {formatDate(
                              interview.startTime
                            )}

                          </div>

                        </td>


                        <td>

                          <button
                            className="admin-user-view-button"
                            type="button"
                            onClick={() =>
                              openInterviewDetails(
                                interview
                              )
                            }
                          >

                            View

                            <ChevronRight size={14} />

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


      {/* =====================================================
          INTERVIEW DETAILS MODAL
          ===================================================== */}

      {selectedInterview && (

        <div
          className="admin-user-modal-backdrop"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeInterviewDetails();

            }

          }}
        >

          <div
            className="admin-user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-interview-modal-title"
          >

            {/* HEADER */}

            <div className="admin-user-modal-header">

              <div>

                <span className="admin-panel-eyebrow">
                  INTERVIEW SESSION
                </span>

                <h2 id="admin-interview-modal-title">
                  Session Details
                </h2>

              </div>


              <button
                className="admin-user-modal-close"
                onClick={closeInterviewDetails}
                type="button"
              >
                ×
              </button>

            </div>


            {/* PROFILE */}

            <div className="admin-user-modal-profile">

              <div className="admin-user-modal-avatar">

                {selectedInterview.userName
                  ?.split(' ')
                  .map(
                    (part) =>
                      part.charAt(0)
                  )
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() ||
                  'U'}

              </div>


              <div>

                <h3>
                  {selectedInterview.userName ||
                    'Unknown User'}
                </h3>

                <p>

                  <Mail size={13} />

                  {selectedInterview.userEmail ||
                    '—'}

                </p>

              </div>

            </div>


            {/* STATUS / SCORE / TYPE */}

            <div className="admin-user-modal-status-row">

              <div className="admin-user-modal-status-card">

                <span>
                  STATUS
                </span>

                <strong>
                  {formatStatus(
                    selectedInterview.status
                  )}
                </strong>

              </div>


              <div className="admin-user-modal-status-card">

                <span>
                  SCORE
                </span>

                <strong
                  className={
                    getScoreClass(
                      selectedInterview.overallScore
                    )
                  }
                >
                  {formatScore(
                    selectedInterview.overallScore
                  )}
                </strong>

              </div>


              <div className="admin-user-modal-status-card">

                <span>
                  TYPE
                </span>

                <strong>
                  {selectedInterview.interviewType ||
                    '—'}
                </strong>

              </div>

            </div>


            {/* REVIEW FLAG STATUS */}

            {isInterviewFlagged(selectedInterview) && (

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  marginBottom: '18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >

                <Flag size={15} />

                This interview is flagged for administrator review.

              </div>

            )}


            {/* DETAILS */}

            <div className="admin-user-modal-details">

              <div className="admin-user-detail-item">

                <div className="admin-user-detail-icon">
                  <UserRound size={15} />
                </div>

                <div>

                  <span>
                    User ID
                  </span>

                  <strong>
                    {selectedInterview.userId ??
                      '—'}
                  </strong>

                </div>

              </div>


              <div className="admin-user-detail-item">

                <div className="admin-user-detail-icon">
                  <Video size={15} />
                </div>

                <div>

                  <span>
                    Session ID
                  </span>

                  <strong>
                    {selectedInterview.sessionId ??
                      '—'}
                  </strong>

                </div>

              </div>


              <div className="admin-user-detail-item">

                <div className="admin-user-detail-icon">
                  <CalendarDays size={15} />
                </div>

                <div>

                  <span>
                    Started
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedInterview.startTime
                    )}
                  </strong>

                </div>

              </div>


              <div className="admin-user-detail-item">

                <div className="admin-user-detail-icon">
                  <Clock3 size={15} />
                </div>

                <div>

                  <span>
                    Ended
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedInterview.endTime
                    )}
                  </strong>

                </div>

              </div>


              <div className="admin-user-detail-item">

                <div className="admin-user-detail-icon">
                  <Timer size={15} />
                </div>

                <div>

                  <span>
                    Duration
                  </span>

                  <strong>
                    {selectedInterview.durationMinutes != null
                      ? `${selectedInterview.durationMinutes} minutes`
                      : '—'}
                  </strong>

                </div>

              </div>


              <div className="admin-user-detail-item">

                <div className="admin-user-detail-icon">
                  <Award size={15} />
                </div>

                <div>

                  <span>
                    Answers Submitted
                  </span>

                  <strong>
                    {selectedInterview.answerCount ??
                      0}
                  </strong>

                </div>

              </div>

            </div>


            {/* SESSION TITLE */}

            {selectedInterview.sessionTitle && (

              <div className="admin-user-modal-bio">

                <span>
                  SESSION TITLE
                </span>

                <p>
                  {selectedInterview.sessionTitle}
                </p>

              </div>

            )}


            {/* FEEDBACK */}

            {selectedInterview.feedback && (

              <div className="admin-user-modal-bio">

                <span>
                  FEEDBACK
                </span>

                <p>
                  {selectedInterview.feedback}
                </p>

              </div>

            )}


            {/* =================================================
                ADMINISTRATION
                ================================================= */}

            <div className="admin-interview-actions">

              <div className="admin-interview-actions-header">

                <div>

                  <span className="admin-panel-eyebrow">
                    ADMINISTRATION
                  </span>

                  <h3>
                    Interview Actions
                  </h3>

                  <p>
                    Manage this interview session.
                  </p>

                </div>

              </div>


              {/* STATUS SUCCESS */}

              {statusUpdateSuccess && (

                <div className="admin-interview-action-message admin-interview-action-message-success">

                  <CheckCircle2 size={14} />

                  <span>
                    {statusUpdateSuccess}
                  </span>

                </div>

              )}


              {/* STATUS ERROR */}

              {statusUpdateError && (

                <div className="admin-interview-action-message admin-interview-action-message-error">

                  <XCircle size={14} />

                  <span>
                    {statusUpdateError}
                  </span>

                </div>

              )}


              {/* FLAG SUCCESS */}

              {flagSuccess && (

                <div className="admin-interview-action-message admin-interview-action-message-success">

                  <CheckCircle2 size={14} />

                  <span>
                    {flagSuccess}
                  </span>

                </div>

              )}


              {/* FLAG ERROR */}

              {flagError && (

                <div className="admin-interview-action-message admin-interview-action-message-error">

                  <XCircle size={14} />

                  <span>
                    {flagError}
                  </span>

                </div>

              )}


              <div className="admin-interview-actions-grid">


                {/* =================================================
                    UPDATE STATUS
                    ================================================= */}

                <div className="admin-interview-action-card">

                  <div className="admin-interview-action-icon admin-interview-action-icon-status">

                    <CheckCircle2 size={19} />

                  </div>


                  <div className="admin-interview-action-content">

                    <h4>
                      Update Status
                    </h4>

                    <p>
                      Change the current interview session status.
                    </p>

                  </div>


                  {!showStatusEditor ? (

                    <button
                      type="button"
                      className="admin-interview-action-button"
                      onClick={() => {

                        setStatusUpdateError('');
                        setStatusUpdateSuccess('');

                        setNewInterviewStatus(
                          normalizeStatus(
                            selectedInterview.status
                          )
                        );

                        setShowStatusEditor(true);

                      }}
                      disabled={statusUpdateLoading}
                    >

                      <span>
                        Update
                      </span>

                      <ChevronRight size={15} />

                    </button>

                  ) : (

                    <div className="admin-interview-status-editor">

                      <select
                        className="admin-interview-status-select"
                        value={newInterviewStatus}
                        onChange={(event) =>
                          setNewInterviewStatus(
                            event.target.value
                          )
                        }
                        disabled={
                          statusUpdateLoading
                        }
                      >

                        <option value="">
                          Select status
                        </option>

                        <option value="IN_PROGRESS">
                          In Progress
                        </option>

                        <option value="COMPLETED">
                          Completed
                        </option>

                        <option value="CANCELLED">
                          Cancelled
                        </option>

                        <option value="FAILED">
                          Failed
                        </option>

                      </select>


                      <div className="admin-interview-status-editor-buttons">

                        <button
                          type="button"
                          className="admin-interview-status-confirm"
                          onClick={
                            handleUpdateInterviewStatus
                          }
                          disabled={
                            statusUpdateLoading
                          }
                        >

                          {statusUpdateLoading
                            ? 'Updating...'
                            : 'Confirm'}

                        </button>


                        <button
                          type="button"
                          className="admin-interview-status-cancel"
                          onClick={() => {

                            setShowStatusEditor(
                              false
                            );

                            setStatusUpdateError(
                              ''
                            );

                            setStatusUpdateSuccess(
                              ''
                            );

                          }}
                          disabled={
                            statusUpdateLoading
                          }
                        >

                          Cancel

                        </button>

                      </div>

                    </div>

                  )}

                </div>


                {/* =================================================
                    VIEW PERFORMANCE
                    ================================================= */}

                <div className="admin-interview-action-card">

                  <div className="admin-interview-action-icon admin-interview-action-icon-performance">

                    <BarChart3 size={19} />

                  </div>


                  <div className="admin-interview-action-content">

                    <h4>
                      View Performance
                    </h4>

                    <p>
                      Review score and candidate performance.
                    </p>

                  </div>


                  <button
                    type="button"
                    className="admin-interview-action-button admin-interview-action-performance-button"
                    onClick={() => {

                      setShowPerformance(
                        true
                      );

                    }}
                  >

                    <span>
                      View
                    </span>

                    <ChevronRight size={15} />

                  </button>

                </div>


                {/* =================================================
                    FLAG FOR REVIEW
                    ================================================= */}

                <div className="admin-interview-action-card">

                  <div className="admin-interview-action-icon admin-interview-action-icon-review">

                    <Flag size={19} />

                  </div>


                  <div className="admin-interview-action-content">

                    <h4>
                      {isInterviewFlagged(selectedInterview)
                        ? 'Review Flag'
                        : 'Flag for Review'}
                    </h4>

                    <p>
                      {isInterviewFlagged(selectedInterview)
                        ? 'This session is currently marked for administrator review.'
                        : 'Mark this session for administrator review.'}
                    </p>

                  </div>


                  <button
                    type="button"
                    className={
                      isInterviewFlagged(selectedInterview)
                        ? 'admin-interview-action-button'
                        : 'admin-interview-action-button admin-interview-action-button-warning'
                    }
                    onClick={
                      handleToggleReviewFlag
                    }
                    disabled={flagLoading}
                  >

                    <span>
                      {flagLoading
                        ? 'Saving...'
                        : isInterviewFlagged(selectedInterview)
                          ? 'Remove Flag'
                          : 'Flag for Review'}
                    </span>

                    {!flagLoading && (
                      <ChevronRight size={15} />
                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  PERFORMANCE PANEL
                  ================================================= */}

              {showPerformance && (

                <div className="admin-interview-performance-panel">

                  <div className="admin-interview-performance-header">

                    <div>

                      <h4>
                        Performance Overview
                      </h4>

                      <p>
                        Candidate performance for this interview session.
                      </p>

                    </div>


                    <button
                      type="button"
                      className="admin-interview-performance-close"
                      onClick={() =>
                        setShowPerformance(
                          false
                        )
                      }
                      aria-label="Close performance"
                    >
                      ×
                    </button>

                  </div>


                  <div className="admin-interview-performance-grid">


                    {/* SCORE */}

                    <div className="admin-interview-performance-stat">

                      <span>
                        Overall Score
                      </span>

                      <strong className="admin-interview-performance-score">

                        {selectedInterview.overallScore !== null &&
                        selectedInterview.overallScore !== undefined
                          ? Number(
                              selectedInterview.overallScore
                            ).toFixed(2)
                          : 'Not scored'}

                      </strong>

                    </div>


                    {/* ANSWERS */}

                    <div className="admin-interview-performance-stat">

                      <span>
                        Answers
                      </span>

                      <strong>
                        {selectedInterview.answerCount ??
                          0}
                      </strong>

                    </div>


                    {/* DURATION */}

                    <div className="admin-interview-performance-stat">

                      <span>
                        Duration
                      </span>

                      <strong>

                        {selectedInterview.durationMinutes != null
                          ? `${selectedInterview.durationMinutes} min`
                          : '—'}

                      </strong>

                    </div>


                    {/* STATUS */}

                    <div className="admin-interview-performance-stat">

                      <span>
                        Status
                      </span>

                      <strong>
                        {formatStatus(
                          selectedInterview.status
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* FEEDBACK */}

                  <div className="admin-interview-performance-feedback">

                    <span>
                      FEEDBACK
                    </span>

                    <p>

                      {selectedInterview.feedback
                        ? selectedInterview.feedback
                        : 'Performance feedback is not available yet for this interview.'}

                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                FOOTER
                ================================================= */}

            <div className="admin-user-modal-footer">

              <button
                className="admin-user-modal-close-button"
                onClick={closeInterviewDetails}
                type="button"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </AdminLayout>
  );
};

export default AdminInterviews;