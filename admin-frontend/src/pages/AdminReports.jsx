import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Flag,
  Activity,
  Search,
  Eye,
  ChevronRight,
  RefreshCw,
  X,
  UserRound,
  Mail,
  Video,
  CalendarDays,
  Timer,
  Award,
  AlertCircle,
  XCircle,
  CircleCheck,
} from 'lucide-react';

import AdminLayout from '../layouts/AdminLayout';
import { adminInterviewsAPI } from '../services/api';

const AdminReports = () => {
  /* =========================================================
     STATE
     ========================================================= */

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [selectedInterview, setSelectedInterview] = useState(null);

  const [showStatusEditor, setShowStatusEditor] = useState(false);
  const [newInterviewStatus, setNewInterviewStatus] = useState('');

  const [statusUpdateLoading, setStatusUpdateLoading] =
    useState(false);

  const [statusUpdateError, setStatusUpdateError] =
    useState('');

  const [statusUpdateSuccess, setStatusUpdateSuccess] =
    useState('');

  const [flagLoading, setFlagLoading] = useState(false);

  const [flagError, setFlagError] = useState('');
  const [flagSuccess, setFlagSuccess] = useState('');

  const [showPerformance, setShowPerformance] =
    useState(false);

  /* =========================================================
     LOAD REPORTS
     ========================================================= */

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      if (interviews.length > 0) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response =
        await adminInterviewsAPI.getAllInterviews();

      setInterviews(response.data || []);
    } catch (err) {
      console.error(
        'Failed to load interview reports:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Failed to load interview reports.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     FILTER DATA
     ========================================================= */

  const statuses = useMemo(() => {
    return [
      ...new Set(
        interviews
          .map((item) => item.status)
          .filter(Boolean)
      ),
    ];
  }, [interviews]);

  const interviewTypes = useMemo(() => {
    return [
      ...new Set(
        interviews
          .map((item) => item.interviewType)
          .filter(Boolean)
      ),
    ];
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return interviews.filter((interview) => {
      const matchesSearch =
        !searchText ||
        interview.userName
          ?.toLowerCase()
          .includes(searchText) ||
        interview.userEmail
          ?.toLowerCase()
          .includes(searchText) ||
        interview.sessionTitle
          ?.toLowerCase()
          .includes(searchText) ||
        String(interview.sessionId || '')
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === 'ALL' ||
        interview.status === statusFilter;

      const matchesType =
        typeFilter === 'ALL' ||
        interview.interviewType === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    interviews,
    search,
    statusFilter,
    typeFilter,
  ]);

  /* =========================================================
     STATISTICS
     ========================================================= */

  const stats = useMemo(() => {
    const total = interviews.length;

    const completed = interviews.filter(
      (item) =>
        item.status === 'COMPLETED'
    ).length;

    const inProgress = interviews.filter(
      (item) =>
        item.status === 'IN_PROGRESS'
    ).length;

    const failed = interviews.filter(
      (item) =>
        item.status === 'FAILED'
    ).length;

    const cancelled = interviews.filter(
      (item) =>
        item.status === 'CANCELLED'
    ).length;

    const flagged = interviews.filter(
      (item) =>
        item.flaggedForReview === true
    ).length;

    const scored = interviews.filter(
      (item) =>
        item.overallScore !== null &&
        item.overallScore !== undefined &&
        !Number.isNaN(
          Number(item.overallScore)
        )
    );

    const averageScore =
      scored.length > 0
        ? scored.reduce(
            (sum, item) =>
              sum +
              Number(item.overallScore),
            0
          ) / scored.length
        : 0;

    const durations = interviews.filter(
      (item) =>
        item.durationMinutes !== null &&
        item.durationMinutes !== undefined &&
        !Number.isNaN(
          Number(item.durationMinutes)
        )
    );

    const averageDuration =
      durations.length > 0
        ? durations.reduce(
            (sum, item) =>
              sum +
              Number(item.durationMinutes),
            0
          ) / durations.length
        : 0;

    const totalAnswers =
      interviews.reduce(
        (sum, item) =>
          sum +
          Number(item.answerCount || 0),
        0
      );

    return {
      total,
      completed,
      inProgress,
      failed,
      cancelled,
      flagged,
      averageScore,
      averageDuration,
      totalAnswers,
    };
  }, [interviews]);

  /* =========================================================
     HELPERS
     ========================================================= */

  const formatStatus = (status) => {
    if (!status) {
      return '—';
    }

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatInterviewType = (type) => {
    if (!type) {
      return '—';
    }

    return type
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatDate = (date) => {
    if (!date) {
      return '—';
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return '—';
    }

    return parsed.toLocaleDateString(
      undefined,
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) {
      return '—';
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return '—';
    }

    return parsed.toLocaleString(
      undefined,
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  const formatScore = (score) => {
    if (
      score === null ||
      score === undefined ||
      Number.isNaN(Number(score))
    ) {
      return '—';
    }

    return Number(score).toFixed(1);
  };

  const getScoreClass = (score) => {
    if (
      score === null ||
      score === undefined ||
      Number.isNaN(Number(score))
    ) {
      return '';
    }

    const value = Number(score);

    if (value >= 80) {
      return 'report-score-high';
    }

    if (value >= 60) {
      return 'report-score-medium';
    }

    return 'report-score-low';
  };

  const isInterviewFlagged = (interview) => {
    return (
      interview?.flaggedForReview === true
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'report-status report-status-completed';

      case 'IN_PROGRESS':
        return 'report-status report-status-progress';

      case 'FAILED':
        return 'report-status report-status-failed';

      case 'CANCELLED':
        return 'report-status report-status-cancelled';

      default:
        return 'report-status report-status-other';
    }
  };

  /* =========================================================
     OPEN VIEW MODAL
     ========================================================= */

  const openInterview = (interview) => {
    setSelectedInterview(interview);

    setShowStatusEditor(false);
    setShowPerformance(false);

    setNewInterviewStatus(
      interview?.status || ''
    );

    setStatusUpdateError('');
    setStatusUpdateSuccess('');

    setFlagError('');
    setFlagSuccess('');
  };

  /* =========================================================
     CLOSE VIEW MODAL
     ========================================================= */

  const closeInterview = () => {
    if (
      statusUpdateLoading ||
      flagLoading
    ) {
      return;
    }

    setSelectedInterview(null);
    setShowStatusEditor(false);
    setShowPerformance(false);

    setStatusUpdateError('');
    setStatusUpdateSuccess('');

    setFlagError('');
    setFlagSuccess('');
  };

  /* =========================================================
     UPDATE STATUS
     ========================================================= */

  const handleUpdateStatus = async () => {
    if (!selectedInterview) {
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
          {
            status: newInterviewStatus,
          }
        );

      const updatedInterview =
        response?.data || {
          ...selectedInterview,
          status: newInterviewStatus,
        };

      setSelectedInterview(
        updatedInterview
      );

      setInterviews((current) =>
        current.map((item) =>
          item.sessionId ===
          selectedInterview.sessionId
            ? {
                ...item,
                ...updatedInterview,
              }
            : item
        )
      );

      setStatusUpdateSuccess(
        'Interview status updated successfully.'
      );

      setShowStatusEditor(false);
    } catch (err) {
      console.error(
        'Failed to update interview status:',
        err
      );

      setStatusUpdateError(
        err?.response?.data?.message ||
          'Failed to update interview status.'
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  /* =========================================================
     TOGGLE REVIEW FLAG
     ========================================================= */

  const handleToggleReviewFlag = async () => {
    if (!selectedInterview) {
      return;
    }

    try {
      setFlagLoading(true);

      setFlagError('');
      setFlagSuccess('');

      const currentlyFlagged =
        isInterviewFlagged(
          selectedInterview
        );

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

      const updatedInterview =
        response?.data || {
          ...selectedInterview,
          flaggedForReview:
            !currentlyFlagged,
        };

      setSelectedInterview(
        updatedInterview
      );

      setInterviews((current) =>
        current.map((item) =>
          item.sessionId ===
          selectedInterview.sessionId
            ? {
                ...item,
                ...updatedInterview,
              }
            : item
        )
      );

      setFlagSuccess(
        currentlyFlagged
          ? 'Review flag removed successfully.'
          : 'Interview flagged for administrator review.'
      );
    } catch (err) {
      console.error(
        'Failed to update review flag:',
        err
      );

      setFlagError(
        err?.response?.data?.message ||
          'Failed to update review flag.'
      );
    } finally {
      setFlagLoading(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <AdminLayout currentPage="Reports">
        <style>{REPORTS_STYLES}</style>

        <div className="reports-page">
          <div className="reports-loading">
            <RefreshCw
              size={20}
              className="reports-spin"
            />

            <span>
              Loading reports...
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <AdminLayout currentPage="Reports">
      <style>{REPORTS_STYLES}</style>

      <div className="reports-page">

        {/* =====================================================
            PAGE HEADER
            ===================================================== */}

        <div className="reports-page-header">

          <div>
            <div className="reports-eyebrow">
              REPORTING &amp; ANALYTICS
            </div>

            <h1>
              Reports
            </h1>

            <p>
              Monitor interview performance
              and activity across InterviewTwin.
            </p>
          </div>

          <button
            type="button"
            className="reports-refresh-button"
            onClick={loadReports}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? 'reports-spin'
                  : ''
              }
            />

            <span>
              {refreshing
                ? 'Refreshing...'
                : 'Refresh'}
            </span>
          </button>

        </div>

        {/* =====================================================
            ERROR
            ===================================================== */}

        {error && (
          <div className="reports-error">
            <AlertCircle size={17} />

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={loadReports}
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================================
            SUMMARY STATISTICS
            ===================================================== */}

        <div className="reports-stat-grid">

          {/* TOTAL */}

          <div className="reports-stat-card">

            <div className="reports-stat-icon reports-icon-blue">
              <BarChart3 size={21} />
            </div>

            <div className="reports-stat-content">

              <span className="reports-stat-label">
                TOTAL INTERVIEWS
              </span>

              <strong className="reports-stat-value">
                {stats.total}
              </strong>

            </div>

          </div>

          {/* COMPLETED */}

          <div className="reports-stat-card">

            <div className="reports-stat-icon reports-icon-green">
              <CheckCircle2 size={21} />
            </div>

            <div className="reports-stat-content">

              <span className="reports-stat-label">
                COMPLETED
              </span>

              <strong className="reports-stat-value">
                {stats.completed}
              </strong>

            </div>

          </div>

          {/* IN PROGRESS */}

          <div className="reports-stat-card">

            <div className="reports-stat-icon reports-icon-blue">
              <Clock3 size={21} />
            </div>

            <div className="reports-stat-content">

              <span className="reports-stat-label">
                IN PROGRESS
              </span>

              <strong className="reports-stat-value">
                {stats.inProgress}
              </strong>

            </div>

          </div>

          {/* AVERAGE SCORE */}

          <div className="reports-stat-card">

            <div className="reports-stat-icon reports-icon-purple">
              <Activity size={21} />
            </div>

            <div className="reports-stat-content">

              <span className="reports-stat-label">
                AVERAGE SCORE
              </span>

              <strong className="reports-stat-value">
                {stats.averageScore.toFixed(1)}
              </strong>

            </div>

          </div>

          {/* AVERAGE DURATION */}

          <div className="reports-stat-card">

            <div className="reports-stat-icon reports-icon-blue">
              <Clock3 size={21} />
            </div>

            <div className="reports-stat-content">

              <span className="reports-stat-label">
                AVERAGE DURATION
              </span>

              <strong className="reports-stat-value">
                {stats.averageDuration.toFixed(0)}
                <span className="reports-stat-unit">
                  {' '}min
                </span>
              </strong>

            </div>

          </div>

          {/* ANSWERS */}

          <div className="reports-stat-card">

            <div className="reports-stat-icon reports-icon-green">
              <CircleCheck size={21} />
            </div>

            <div className="reports-stat-content">

              <span className="reports-stat-label">
                ANSWERS SUBMITTED
              </span>

              <strong className="reports-stat-value">
                {stats.totalAnswers}
              </strong>

            </div>

          </div>

          {/* FLAGGED */}

          <div className="reports-stat-card">

            <div className="reports-stat-icon reports-icon-purple">
              <Flag size={21} />
            </div>

            <div className="reports-stat-content">

              <span className="reports-stat-label">
                FLAGGED FOR REVIEW
              </span>

              <strong className="reports-stat-value">
                {stats.flagged}
              </strong>

            </div>

          </div>

        </div>

        {/* =====================================================
            STATUS OVERVIEW
            ===================================================== */}

        <section className="reports-section-card">

          <div className="reports-section-header">

            <div>
              <span className="reports-section-eyebrow">
                INTERVIEW STATUS
              </span>

              <h2>
                Status Overview
              </h2>
            </div>

          </div>

          <div className="reports-status-grid">

            {/* COMPLETED */}

            <div className="reports-status-card">

              <div className="reports-status-icon reports-status-green">
                <CheckCircle2 size={19} />
              </div>

              <span>
                COMPLETED
              </span>

              <strong>
                {stats.completed}
              </strong>

            </div>

            {/* IN PROGRESS */}

            <div className="reports-status-card">

              <div className="reports-status-icon reports-status-blue">
                <Clock3 size={19} />
              </div>

              <span>
                IN PROGRESS
              </span>

              <strong>
                {stats.inProgress}
              </strong>

            </div>

            {/* FAILED */}

            <div className="reports-status-card">

              <div className="reports-status-icon reports-status-red">
                <XCircle size={19} />
              </div>

              <span>
                FAILED
              </span>

              <strong>
                {stats.failed}
              </strong>

            </div>

            {/* CANCELLED */}

            <div className="reports-status-card">

              <div className="reports-status-icon reports-status-gray">
                <XCircle size={19} />
              </div>

              <span>
                CANCELLED
              </span>

              <strong>
                {stats.cancelled}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================================
            INTERVIEW REPORTS
            ===================================================== */}

        <section className="reports-section-card reports-table-card">

          {/* TABLE HEADER */}

          <div className="reports-table-header">

            <div>

              <span className="reports-section-eyebrow">
                REPORT DATABASE
              </span>

              <h2>
                All Interview Reports

                <span className="reports-count-badge">
                  {filteredInterviews.length}
                </span>
              </h2>

            </div>

            <div className="reports-filter-row">

              {/* SEARCH */}

              <div className="reports-search">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search user, email or interview..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* STATUS */}

              <select
                className="reports-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="ALL">
                  All Statuses
                </option>

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                ))}

              </select>

              {/* TYPE */}

              <select
                className="reports-select reports-type-select"
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value
                  )
                }
              >

                <option value="ALL">
                  All Interview Types
                </option>

                {interviewTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {formatInterviewType(type)}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* TABLE */}

          <div className="reports-table-wrapper">

            <table className="reports-table">

              <colgroup>
                <col className="reports-col-user" />
                <col className="reports-col-interview" />
                <col className="reports-col-type" />
                <col className="reports-col-status" />
                <col className="reports-col-score" />
                <col className="reports-col-duration" />
                <col className="reports-col-answers" />
                <col className="reports-col-date" />
                <col className="reports-col-review" />
                <col className="reports-col-action" />
              </colgroup>

              <thead>

                <tr>

                  <th>
                    USER
                  </th>

                  <th>
                    INTERVIEW
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
                    ANSWERS
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    REVIEW
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredInterviews.length === 0 ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="reports-empty"
                    >

                      <div className="reports-empty-icon">
                        <Search size={22} />
                      </div>

                      <strong>
                        No reports found
                      </strong>

                      <span>
                        Try changing your search
                        or filters.
                      </span>

                    </td>

                  </tr>

                ) : (

                  filteredInterviews.map(
                    (interview) => {

                      const flagged =
                        isInterviewFlagged(
                          interview
                        );

                      return (
                        <tr
                          key={
                            interview.sessionId
                          }
                        >

                          {/* USER */}

                          <td>

                            <div className="reports-user-cell">

                              <strong
                                title={
                                  interview.userName ||
                                  'Unknown User'
                                }
                              >
                                {interview.userName ||
                                  'Unknown User'}
                              </strong>

                              <span
                                title={
                                  interview.userEmail ||
                                  '—'
                                }
                              >
                                {interview.userEmail ||
                                  '—'}
                              </span>

                            </div>

                          </td>

                          {/* INTERVIEW */}

                          <td>

                            <div className="reports-interview-cell">

                              <strong
                                title={
                                  interview.sessionTitle ||
                                  'Untitled Interview'
                                }
                              >
                                {interview.sessionTitle ||
                                  'Untitled Interview'}
                              </strong>

                              <span>
                                Session #
                                {interview.sessionId ??
                                  '—'}
                              </span>

                            </div>

                          </td>

                          {/* TYPE */}

                          <td>

                            <span className="reports-type-badge">
                              {formatInterviewType(
                                interview.interviewType
                              )}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={getStatusClass(
                                interview.status
                              )}
                            >

                              {interview.status ===
                                'COMPLETED' && (
                                <CheckCircle2
                                  size={14}
                                />
                              )}

                              {interview.status ===
                                'IN_PROGRESS' && (
                                <Clock3
                                  size={14}
                                />
                              )}

                              {interview.status ===
                                'FAILED' && (
                                <XCircle
                                  size={14}
                                />
                              )}

                              {interview.status !==
                                'COMPLETED' &&
                                interview.status !==
                                  'IN_PROGRESS' &&
                                interview.status !==
                                  'FAILED' && (
                                  <Activity
                                    size={14}
                                  />
                                )}

                              {formatStatus(
                                interview.status
                              )}

                            </span>

                          </td>

                          {/* SCORE */}

                          <td>

                            <span
                              className={
                                getScoreClass(
                                  interview.overallScore
                                )
                              }
                            >
                              {formatScore(
                                interview.overallScore
                              )}
                            </span>

                          </td>

                          {/* DURATION */}

                          <td>

                            {interview.durationMinutes !==
                              null &&
                            interview.durationMinutes !==
                              undefined ? (
                              <span className="reports-value-text">
                                {
                                  interview.durationMinutes
                                }{' '}
                                min
                              </span>
                            ) : (
                              <span className="reports-dash">
                                —
                              </span>
                            )}

                          </td>

                          {/* ANSWERS */}

                          <td>

                            <span className="reports-answer-badge">
                              {interview.answerCount ??
                                0}
                            </span>

                          </td>

                          {/* DATE */}

                          <td>

                            <span
                              className="reports-date"
                              title={formatDateTime(
                                interview.startTime
                              )}
                            >
                              {formatDate(
                                interview.startTime
                              )}
                            </span>

                          </td>

                          {/* REVIEW */}

                          <td>

                            {flagged ? (

                              <span className="reports-review-badge reports-review-flagged">
                                <Flag
                                  size={14}
                                />

                                <span>
                                  Flagged
                                </span>
                              </span>

                            ) : (

                              <span className="reports-review-badge reports-review-normal">
                                <CircleCheck
                                  size={14}
                                />

                                <span>
                                  Normal
                                </span>
                              </span>

                            )}

                          </td>

                          {/* ACTION */}

                          <td>

                            <button
                              type="button"
                              className="reports-view-button"
                              onClick={() =>
                                openInterview(
                                  interview
                                )
                              }
                            >

                              <Eye size={15} />

                              <span>
                                View
                              </span>

                              <ChevronRight
                                size={15}
                              />

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

      {/* =======================================================
          VIEW INTERVIEW MODAL
          ======================================================= */}

      {selectedInterview && (

        <div
          className="reports-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeInterview();
            }

          }}
        >

          <div className="reports-modal">

            {/* MODAL HEADER */}

            <div className="reports-modal-header">

              <div className="reports-modal-user">

                <div className="reports-modal-avatar">
                  {(
                    selectedInterview.userName ||
                    'U'
                  )
                    .split(' ')
                    .map(
                      (part) =>
                        part.charAt(0)
                    )
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>

                  <h2>
                    {selectedInterview.userName ||
                      'Unknown User'}
                  </h2>

                  <p>
                    <Mail size={14} />

                    {selectedInterview.userEmail ||
                      '—'}
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="reports-modal-close"
                onClick={closeInterview}
              >
                <X size={19} />
              </button>

            </div>

            {/* STATUS ROW */}

            <div className="reports-modal-status-grid">

              <div className="reports-modal-status-card">

                <span>
                  STATUS
                </span>

                <strong>
                  {formatStatus(
                    selectedInterview.status
                  )}
                </strong>

              </div>

              <div className="reports-modal-status-card">

                <span>
                  SCORE
                </span>

                <strong
                  className={getScoreClass(
                    selectedInterview.overallScore
                  )}
                >
                  {formatScore(
                    selectedInterview.overallScore
                  )}
                </strong>

              </div>

              <div className="reports-modal-status-card">

                <span>
                  TYPE
                </span>

                <strong>
                  {formatInterviewType(
                    selectedInterview.interviewType
                  )}
                </strong>

              </div>

            </div>

            {/* REVIEW STATUS */}

            <div
              className={
                isInterviewFlagged(
                  selectedInterview
                )
                  ? 'reports-review-panel reports-review-panel-flagged'
                  : 'reports-review-panel reports-review-panel-normal'
              }
            >

              {isInterviewFlagged(
                selectedInterview
              ) ? (
                <Flag size={18} />
              ) : (
                <CircleCheck size={18} />
              )}

              <div>

                <strong>
                  {isInterviewFlagged(
                    selectedInterview
                  )
                    ? 'Flagged for Review'
                    : 'Normal'}
                </strong>

                <span>
                  {isInterviewFlagged(
                    selectedInterview
                  )
                    ? 'This interview is marked for administrator review.'
                    : 'This interview is not currently flagged for review.'}
                </span>

              </div>

            </div>

            {/* DETAILS */}

            <div className="reports-details-grid">

              <div className="reports-detail-item">

                <div className="reports-detail-icon">
                  <UserRound size={16} />
                </div>

                <div>

                  <span>
                    USER ID
                  </span>

                  <strong>
                    {selectedInterview.userId ??
                      '—'}
                  </strong>

                </div>

              </div>

              <div className="reports-detail-item">

                <div className="reports-detail-icon">
                  <Video size={16} />
                </div>

                <div>

                  <span>
                    SESSION ID
                  </span>

                  <strong>
                    {selectedInterview.sessionId ??
                      '—'}
                  </strong>

                </div>

              </div>

              <div className="reports-detail-item">

                <div className="reports-detail-icon">
                  <CalendarDays size={16} />
                </div>

                <div>

                  <span>
                    STARTED
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedInterview.startTime
                    )}
                  </strong>

                </div>

              </div>

              <div className="reports-detail-item">

                <div className="reports-detail-icon">
                  <Clock3 size={16} />
                </div>

                <div>

                  <span>
                    ENDED
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedInterview.endTime
                    )}
                  </strong>

                </div>

              </div>

              <div className="reports-detail-item">

                <div className="reports-detail-icon">
                  <Timer size={16} />
                </div>

                <div>

                  <span>
                    DURATION
                  </span>

                  <strong>
                    {selectedInterview.durationMinutes !=
                    null
                      ? `${selectedInterview.durationMinutes} minutes`
                      : '—'}
                  </strong>

                </div>

              </div>

              <div className="reports-detail-item">

                <div className="reports-detail-icon">
                  <Award size={16} />
                </div>

                <div>

                  <span>
                    ANSWERS SUBMITTED
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

              <div className="reports-info-block">

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

              <div className="reports-info-block">

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

            <div className="reports-admin-section">

              <div className="reports-admin-header">

                <div>

                  <span>
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

              {/* MESSAGES */}

              {statusUpdateError && (

                <div className="reports-action-message reports-action-error">

                  <AlertCircle size={15} />

                  <span>
                    {statusUpdateError}
                  </span>

                </div>

              )}

              {statusUpdateSuccess && (

                <div className="reports-action-message reports-action-success">

                  <CheckCircle2 size={15} />

                  <span>
                    {statusUpdateSuccess}
                  </span>

                </div>

              )}

              {flagError && (

                <div className="reports-action-message reports-action-error">

                  <AlertCircle size={15} />

                  <span>
                    {flagError}
                  </span>

                </div>

              )}

              {flagSuccess && (

                <div className="reports-action-message reports-action-success">

                  <CheckCircle2 size={15} />

                  <span>
                    {flagSuccess}
                  </span>

                </div>

              )}

              <div className="reports-action-grid">

                {/* =================================================
                    UPDATE STATUS
                    ================================================= */}

                <div className="reports-action-card">

                  <div className="reports-action-icon reports-action-status-icon">
                    <CheckCircle2 size={19} />
                  </div>

                  <div className="reports-action-content">

                    <h4>
                      Update Status
                    </h4>

                    <p>
                      Change the current interview
                      session status.
                    </p>

                  </div>

                  {!showStatusEditor ? (

                    <button
                      type="button"
                      className="reports-action-button"
                      onClick={() => {

                        setStatusUpdateError('');
                        setStatusUpdateSuccess('');

                        setNewInterviewStatus(
                          selectedInterview.status ||
                            ''
                        );

                        setShowStatusEditor(
                          true
                        );

                      }}
                      disabled={
                        statusUpdateLoading
                      }
                    >

                      <span>
                        Update
                      </span>

                      <ChevronRight
                        size={15}
                      />

                    </button>

                  ) : (

                    <div className="reports-status-editor">

                      <select
                        value={
                          newInterviewStatus
                        }
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

                        <option value="FAILED">
                          Failed
                        </option>

                        <option value="CANCELLED">
                          Cancelled
                        </option>

                      </select>

                      <div className="reports-status-editor-actions">

                        <button
                          type="button"
                          onClick={() => {

                            setShowStatusEditor(
                              false
                            );

                            setStatusUpdateError(
                              ''
                            );

                          }}
                          disabled={
                            statusUpdateLoading
                          }
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleUpdateStatus
                          }
                          disabled={
                            statusUpdateLoading
                          }
                        >

                          {statusUpdateLoading
                            ? 'Saving...'
                            : 'Save'}

                        </button>

                      </div>

                    </div>

                  )}

                </div>

                {/* =================================================
                    VIEW PERFORMANCE
                    ================================================= */}

                <div className="reports-action-card">

                  <div className="reports-action-icon reports-action-performance-icon">
                    <BarChart3 size={19} />
                  </div>

                  <div className="reports-action-content">

                    <h4>
                      View Performance
                    </h4>

                    <p>
                      Review score and candidate
                      performance.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="reports-action-button"
                    onClick={() =>
                      setShowPerformance(
                        (current) =>
                          !current
                      )
                    }
                  >

                    <span>
                      {showPerformance
                        ? 'Hide'
                        : 'View'}
                    </span>

                    <ChevronRight
                      size={15}
                    />

                  </button>

                </div>

                {/* =================================================
                    FLAG / UNFLAG
                    ================================================= */}

                <div className="reports-action-card">

                  <div
                    className={
                      isInterviewFlagged(
                        selectedInterview
                      )
                        ? 'reports-action-icon reports-action-review-icon reports-action-review-active'
                        : 'reports-action-icon reports-action-review-icon'
                    }
                  >
                    <Flag size={19} />
                  </div>

                  <div className="reports-action-content">

                    <h4>
                      {isInterviewFlagged(
                        selectedInterview
                      )
                        ? 'Review Flag'
                        : 'Flag for Review'}
                    </h4>

                    <p>
                      {isInterviewFlagged(
                        selectedInterview
                      )
                        ? 'This session is currently marked for administrator review.'
                        : 'Mark this session for administrator review.'}
                    </p>

                  </div>

                  <button
                    type="button"
                    className={
                      isInterviewFlagged(
                        selectedInterview
                      )
                        ? 'reports-action-button'
                        : 'reports-action-button reports-action-warning'
                    }
                    onClick={
                      handleToggleReviewFlag
                    }
                    disabled={flagLoading}
                  >

                    <span>
                      {flagLoading
                        ? 'Saving...'
                        : isInterviewFlagged(
                            selectedInterview
                          )
                        ? 'Remove Flag'
                        : 'Flag for Review'}
                    </span>

                    {!flagLoading && (
                      <ChevronRight
                        size={15}
                      />
                    )}

                  </button>

                </div>

              </div>

            </div>

            {/* =================================================
                PERFORMANCE PANEL
                ================================================= */}

            {showPerformance && (

              <div className="reports-performance-panel">

                <div className="reports-performance-header">

                  <div>

                    <span>
                      PERFORMANCE
                    </span>

                    <h3>
                      Interview Performance
                    </h3>

                  </div>

                </div>

                <div className="reports-performance-grid">

                  <div className="reports-performance-card">

                    <span>
                      OVERALL SCORE
                    </span>

                    <strong
                      className={getScoreClass(
                        selectedInterview.overallScore
                      )}
                    >
                      {formatScore(
                        selectedInterview.overallScore
                      )}
                    </strong>

                  </div>

                  <div className="reports-performance-card">

                    <span>
                      ANSWERS
                    </span>

                    <strong>
                      {selectedInterview.answerCount ??
                        0}
                    </strong>

                  </div>

                  <div className="reports-performance-card">

                    <span>
                      DURATION
                    </span>

                    <strong>
                      {selectedInterview.durationMinutes !=
                      null
                        ? `${selectedInterview.durationMinutes} min`
                        : '—'}
                    </strong>

                  </div>

                  <div className="reports-performance-card">

                    <span>
                      STATUS
                    </span>

                    <strong>
                      {formatStatus(
                        selectedInterview.status
                      )}
                    </strong>

                  </div>

                </div>

                {selectedInterview.feedback && (

                  <div className="reports-performance-feedback">

                    <span>
                      FEEDBACK
                    </span>

                    <p>
                      {selectedInterview.feedback}
                    </p>

                  </div>

                )}

              </div>

            )}

            {/* MODAL FOOTER */}

            <div className="reports-modal-footer">

              <button
                type="button"
                onClick={closeInterview}
                className="reports-modal-close-button"
                disabled={
                  statusUpdateLoading ||
                  flagLoading
                }
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

/* =============================================================
   REPORTS PAGE STYLES

   These styles are intentionally inside this component so
   you do NOT need another CSS file for the Reports redesign.
   ============================================================= */

const REPORTS_STYLES = `
  .reports-page {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0;
  }

  .reports-page *,
  .reports-page *::before,
  .reports-page *::after {
    box-sizing: border-box;
  }

  /* =========================================================
     HEADER
     ========================================================= */

  .reports-page-header {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 34px;
  }

  .reports-eyebrow {
    color: #7887ff;
    font-size: 11px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.16em;
    margin-bottom: 14px;
  }

  .reports-page-header h1 {
    margin: 0;
    color: #f7f8ff;
    font-size: 42px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.035em;
  }

  .reports-page-header p {
    margin: 10px 0 0;
    color: #6f83a7;
    font-size: 16px;
    line-height: 1.5;
  }

  .reports-refresh-button {
    flex-shrink: 0;
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 0 18px;
    border: 1px solid #263657;
    border-radius: 11px;
    background: #101a31;
    color: #a9c2ed;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      transform 0.2s ease;
  }

  .reports-refresh-button:hover:not(:disabled) {
    background: #14203b;
    border-color: #39527e;
    transform: translateY(-1px);
  }

  .reports-refresh-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* =========================================================
     ERROR
     ========================================================= */

  .reports-error {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 46px;
    padding: 0 14px;
    margin-bottom: 22px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 10px;
    background: rgba(239, 68, 68, 0.07);
    color: #ef9aa5;
    font-size: 13px;
  }

  .reports-error button {
    margin-left: auto;
    border: 0;
    background: transparent;
    color: #b8c7ff;
    font-weight: 700;
    cursor: pointer;
  }

  /* =========================================================
     STATISTICS
     ========================================================= */

  .reports-stat-grid {
    display: grid;
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-bottom: 28px;
  }

  .reports-stat-card {
    min-height: 132px;
    display: flex;
    align-items: center;
    gap: 17px;
    padding: 22px;
    border: 1px solid #1d2a46;
    border-radius: 18px;
    background:
      radial-gradient(
        circle at 100% 100%,
        rgba(68, 82, 205, 0.08),
        transparent 42%
      ),
      #0e172b;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.015);
  }

  .reports-stat-icon {
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
  }

  .reports-icon-blue {
    color: #9aa8ff;
    border: 1px solid rgba(98, 115, 255, 0.3);
    background: rgba(70, 85, 215, 0.13);
  }

  .reports-icon-green {
    color: #5fe0ad;
    border: 1px solid rgba(41, 202, 145, 0.28);
    background: rgba(27, 173, 119, 0.12);
  }

  .reports-icon-purple {
    color: #c48bff;
    border: 1px solid rgba(183, 79, 255, 0.28);
    background: rgba(150, 62, 204, 0.12);
  }

  .reports-stat-content {
    min-width: 0;
  }

  .reports-stat-label {
    display: block;
    margin-bottom: 8px;
    color: #5e76a0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.15em;
    white-space: nowrap;
  }

  .reports-stat-value {
    display: block;
    color: #f4f7ff;
    font-size: 36px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .reports-stat-unit {
    color: #aab9d4;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0;
  }

  /* =========================================================
     SECTION CARD
     ========================================================= */

  .reports-section-card {
    width: 100%;
    overflow: hidden;
    margin-bottom: 28px;
    border: 1px solid #1d2a46;
    border-radius: 20px;
    background: #0c1528;
  }

  .reports-section-header {
    min-height: 102px;
    display: flex;
    align-items: center;
    padding: 25px 28px;
    border-bottom: 1px solid #1b2942;
  }

  .reports-section-eyebrow {
    display: block;
    margin-bottom: 8px;
    color: #7184ff;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.15em;
  }

  .reports-section-header h2,
  .reports-table-header h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #f4f6fc;
    font-size: 23px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  /* =========================================================
     STATUS OVERVIEW
     ========================================================= */

  .reports-status-grid {
    display: grid;
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
    gap: 16px;
    padding: 24px;
  }

  .reports-status-card {
    min-height: 142px;
    padding: 22px;
    border: 1px solid #1c2942;
    border-radius: 16px;
    background: #0d172b;
  }

  .reports-status-icon {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 17px;
    border-radius: 10px;
  }

  .reports-status-green {
    color: #66e0b2;
    border: 1px solid rgba(61, 210, 153, 0.25);
    background: rgba(40, 176, 124, 0.11);
  }

  .reports-status-blue {
    color: #91a5ff;
    border: 1px solid rgba(85, 112, 255, 0.27);
    background: rgba(64, 82, 198, 0.11);
  }

  .reports-status-red {
    color: #e992a0;
    border: 1px solid rgba(218, 87, 108, 0.23);
    background: rgba(194, 67, 91, 0.09);
  }

  .reports-status-gray {
    color: #9ba7bd;
    border: 1px solid rgba(120, 135, 161, 0.22);
    background: rgba(100, 113, 140, 0.08);
  }

  .reports-status-card span {
    display: block;
    margin-bottom: 8px;
    color: #586e93;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  .reports-status-card strong {
    display: block;
    color: #f4f7ff;
    font-size: 30px;
    line-height: 1;
    font-weight: 800;
  }

  /* =========================================================
     TABLE HEADER
     ========================================================= */

  .reports-table-header {
    min-height: 118px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 23px 28px;
    border-bottom: 1px solid #1b2942;
  }

  .reports-count-badge {
    min-width: 32px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 9px;
    border-radius: 9px;
    background: rgba(71, 88, 220, 0.15);
    color: #8ea0ff;
    font-size: 11px;
    font-weight: 800;
  }

  .reports-filter-row {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  .reports-search {
    width: 330px;
    height: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 15px;
    border: 1px solid #263653;
    border-radius: 11px;
    background: #0a1426;
    color: #6d82a8;
  }

  .reports-search:focus-within {
    border-color: #465ba0;
  }

  .reports-search input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #dce5f7;
    font-size: 13px;
  }

  .reports-search input::placeholder {
    color: #58709a;
  }

  .reports-select {
    width: 160px;
    height: 50px;
    padding: 0 13px;
    border: 1px solid #263653;
    border-radius: 11px;
    outline: 0;
    background: #0a1426;
    color: #c5d1e6;
    font-size: 13px;
    cursor: pointer;
  }

  .reports-type-select {
    width: 220px;
  }

  /* =========================================================
     TABLE
     ========================================================= */

  .reports-table-wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .reports-table {
    width: 100%;
    min-width: 1180px;
    table-layout: fixed;
    border-collapse: collapse;
  }

  .reports-col-user {
    width: 17%;
  }

  .reports-col-interview {
    width: 20%;
  }

  .reports-col-type {
    width: 12%;
  }

  .reports-col-status {
    width: 11%;
  }

  .reports-col-score {
    width: 7%;
  }

  .reports-col-duration {
    width: 8%;
  }

  .reports-col-answers {
    width: 7%;
  }

  .reports-col-date {
    width: 9%;
  }

  .reports-col-review {
    width: 11%;
  }

  .reports-col-action {
    width: 8%;
  }

  .reports-table thead {
    background: #0a1425;
  }

  .reports-table th {
    height: 52px;
    padding: 0 16px;
    border-bottom: 1px solid #1d2a43;
    color: #60779f;
    text-align: left;
    font-size: 10px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.14em;
    white-space: nowrap;
  }

  .reports-table td {
    height: 84px;
    padding: 13px 16px;
    border-bottom: 1px solid #17243a;
    color: #dce5f7;
    vertical-align: middle;
    overflow: hidden;
  }

  .reports-table tbody tr {
    transition: background 0.18s ease;
  }

  .reports-table tbody tr:hover {
    background:
      linear-gradient(
        90deg,
        rgba(83, 97, 225, 0.065),
        rgba(83, 97, 225, 0.018)
      );
  }

  .reports-table tbody tr:last-child td {
    border-bottom: 0;
  }

  /* =========================================================
     USER CELL
     ========================================================= */

  .reports-user-cell {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .reports-user-cell strong {
    overflow: hidden;
    color: #f0f4fc;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reports-user-cell span {
    overflow: hidden;
    color: #6681ad;
    font-size: 11px;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* =========================================================
     INTERVIEW CELL
     ========================================================= */

  .reports-interview-cell {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .reports-interview-cell strong {
    overflow: hidden;
    color: #eaf0fc;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reports-interview-cell span {
    color: #6680a9;
    font-size: 11px;
    line-height: 1.2;
  }

  /* =========================================================
     TYPE BADGE
     ========================================================= */

  .reports-type-badge {
    max-width: 100%;
    min-height: 34px;
    display: inline-flex;
    align-items: center;
    padding: 0 11px;
    border: 1px solid #29416c;
    border-radius: 9px;
    background:
      linear-gradient(
        145deg,
        rgba(29, 49, 87, 0.75),
        rgba(13, 27, 50, 0.9)
      );
    color: #87aff5;
    font-size: 10px;
    font-weight: 800;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* =========================================================
     STATUS
     ========================================================= */

  .report-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
    font-size: 11px;
    font-weight: 800;
    white-space: nowrap;
  }

  .report-status-completed {
    color: #6be1ae;
  }

  .report-status-progress {
    color: #91a4ff;
  }

  .report-status-failed {
    color: #e78e9d;
  }

  .report-status-cancelled,
  .report-status-other {
    color: #93a1b9;
  }

  /* =========================================================
     SCORE
     ========================================================= */

  .report-score-high,
  .report-score-medium,
  .report-score-low {
    display: inline-flex;
    min-height: 30px;
    align-items: center;
    padding: 0 9px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 800;
    white-space: nowrap;
  }

  .report-score-high {
    color: #70dfa9;
    background: rgba(44, 190, 130, 0.1);
    border: 1px solid rgba(44, 190, 130, 0.2);
  }

  .report-score-medium {
    color: #d9c36f;
    background: rgba(211, 180, 65, 0.08);
    border: 1px solid rgba(211, 180, 65, 0.19);
  }

  .report-score-low {
    color: #e18c9e;
    background: rgba(206, 79, 105, 0.08);
    border: 1px solid rgba(206, 79, 105, 0.18);
  }

  .reports-dash {
    color: #667795;
    font-size: 13px;
  }

  .reports-value-text {
    color: #b7c5dc;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  /* =========================================================
     ANSWERS
     ========================================================= */

  .reports-answer-badge {
    min-width: 35px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border: 1px solid #263e69;
    border-radius: 8px;
    background: rgba(34, 55, 96, 0.48);
    color: #a8c5f5;
    font-size: 11px;
    font-weight: 800;
  }

  /* =========================================================
     DATE
     ========================================================= */

  .reports-date {
    color: #9eafcb;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  /* =========================================================
     REVIEW
     ========================================================= */

  .reports-review-badge {
    min-height: 31px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 9px;
    border-radius: 9px;
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;
  }

  .reports-review-normal {
    border: 1px solid #263a5e;
    background: rgba(31, 48, 79, 0.42);
    color: #7e9bc9;
  }

  .reports-review-flagged {
    border: 1px solid rgba(184, 94, 255, 0.3);
    background: rgba(145, 55, 202, 0.1);
    color: #c783ff;
  }

  /* =========================================================
     VIEW BUTTON
     ========================================================= */

  .reports-view-button {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 10px;
    border: 1px solid #294064;
    border-radius: 10px;
    background: #101c32;
    color: #a9c3ee;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;
  }

  .reports-view-button:hover {
    background: #172542;
    border-color: #3b5785;
    transform: translateY(-1px);
  }

  /* =========================================================
     EMPTY
     ========================================================= */

  .reports-empty {
    height: 280px !important;
    text-align: center !important;
  }

  .reports-empty-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    border: 1px solid #263653;
    border-radius: 12px;
    background: #101b30;
    color: #7185ad;
  }

  .reports-empty strong {
    display: block;
    margin-bottom: 6px;
    color: #dce5f5;
    font-size: 14px;
  }

  .reports-empty span {
    color: #667b9f;
    font-size: 12px;
  }

  /* =========================================================
     MODAL
     ========================================================= */

  .reports-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(2, 7, 18, 0.78);
    backdrop-filter: blur(7px);
  }

  .reports-modal {
    width: min(980px, 100%);
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    border: 1px solid #263755;
    border-radius: 22px;
    background:
      radial-gradient(
        circle at 100% 0%,
        rgba(73, 83, 198, 0.09),
        transparent 30%
      ),
      #0c1629;
    box-shadow:
      0 30px 90px rgba(0,0,0,0.55);
  }

  .reports-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 28px;
    border-bottom: 1px solid #1d2a43;
  }

  .reports-modal-user {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .reports-modal-avatar {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #3d4e9a;
    border-radius: 13px;
    background: #1d2558;
    color: #c5ceff;
    font-size: 14px;
    font-weight: 800;
  }

  .reports-modal-user h2 {
    margin: 0 0 5px;
    color: #f3f6fd;
    font-size: 20px;
    font-weight: 800;
  }

  .reports-modal-user p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #7086ab;
    font-size: 12px;
  }

  .reports-modal-close {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid #263653;
    border-radius: 10px;
    background: #101a2e;
    color: #91a3c0;
    cursor: pointer;
  }

  .reports-modal-close:hover {
    color: #e5ebf8;
    background: #16233b;
  }

  /* =========================================================
     MODAL STATUS
     ========================================================= */

  .reports-modal-status-grid {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 12px;
    padding: 20px 28px 0;
  }

  .reports-modal-status-card {
    min-height: 84px;
    padding: 16px;
    border: 1px solid #1e2d49;
    border-radius: 12px;
    background: #0d182c;
  }

  .reports-modal-status-card span {
    display: block;
    margin-bottom: 8px;
    color: #5e7499;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  .reports-modal-status-card strong {
    color: #e9eef9;
    font-size: 16px;
    font-weight: 800;
  }

  /* =========================================================
     REVIEW PANEL
     ========================================================= */

  .reports-review-panel {
    display: flex;
    align-items: center;
    gap: 11px;
    margin: 18px 28px 0;
    padding: 12px 14px;
    border-radius: 11px;
  }

  .reports-review-panel > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .reports-review-panel strong {
    font-size: 12px;
    font-weight: 800;
  }

  .reports-review-panel span {
    color: #8092af;
    font-size: 11px;
  }

  .reports-review-panel-normal {
    border: 1px solid rgba(74, 113, 171, 0.23);
    background: rgba(35, 58, 94, 0.17);
    color: #89a8d7;
  }

  .reports-review-panel-flagged {
    border: 1px solid rgba(184, 94, 255, 0.25);
    background: rgba(146, 57, 204, 0.09);
    color: #c783ff;
  }

  /* =========================================================
     DETAILS
     ========================================================= */

  .reports-details-grid {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 12px;
    padding: 20px 28px 0;
  }

  .reports-detail-item {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 13px;
    border: 1px solid #1c2a44;
    border-radius: 11px;
    background: #0b1528;
  }

  .reports-detail-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #263b61;
    border-radius: 8px;
    background: #111f38;
    color: #8da8d7;
  }

  .reports-detail-item > div:last-child {
    min-width: 0;
  }

  .reports-detail-item span {
    display: block;
    margin-bottom: 5px;
    color: #5c7398;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.11em;
  }

  .reports-detail-item strong {
    display: block;
    overflow: hidden;
    color: #d8e1f1;
    font-size: 11px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* =========================================================
     INFO BLOCKS
     ========================================================= */

  .reports-info-block {
    margin: 14px 28px 0;
    padding: 14px;
    border: 1px solid #1c2a44;
    border-radius: 11px;
    background: #0b1528;
  }

  .reports-info-block span {
    display: block;
    margin-bottom: 7px;
    color: #5d7397;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.13em;
  }

  .reports-info-block p {
    margin: 0;
    color: #bdc9dd;
    font-size: 12px;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  /* =========================================================
     ADMINISTRATION
     ========================================================= */

  .reports-admin-section {
    margin: 20px 28px 0;
    overflow: hidden;
    border: 1px solid #1e2e4a;
    border-radius: 17px;
    background: #0b1528;
  }

  .reports-admin-header {
    padding: 21px 22px;
    border-bottom: 1px solid #1c2b45;
  }

  .reports-admin-header span {
    display: block;
    margin-bottom: 6px;
    color: #7286ff;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.15em;
  }

  .reports-admin-header h3 {
    margin: 0;
    color: #edf2fb;
    font-size: 18px;
    font-weight: 800;
  }

  .reports-admin-header p {
    margin: 5px 0 0;
    color: #6c81a4;
    font-size: 12px;
  }

  .reports-action-message {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 14px 16px 0;
    padding: 10px 12px;
    border-radius: 9px;
    font-size: 11px;
    font-weight: 700;
  }

  .reports-action-success {
    border: 1px solid rgba(53, 202, 145, 0.22);
    background: rgba(38, 180, 126, 0.07);
    color: #68dcae;
  }

  .reports-action-error {
    border: 1px solid rgba(222, 83, 106, 0.22);
    background: rgba(203, 64, 88, 0.07);
    color: #e48e9c;
  }

  .reports-action-grid {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 16px;
    padding: 20px;
  }

  .reports-action-card {
    min-width: 0;
    min-height: 225px;
    display: flex;
    flex-direction: column;
    padding: 22px;
    border: 1px solid #22324f;
    border-radius: 15px;
    background: #0e192d;
  }

  .reports-action-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 19px;
    border-radius: 13px;
  }

  .reports-action-status-icon {
    color: #63ddb0;
    border: 1px solid rgba(55, 203, 148, 0.25);
    background: rgba(32, 175, 119, 0.09);
  }

  .reports-action-performance-icon {
    color: #95a3ff;
    border: 1px solid rgba(91, 112, 255, 0.25);
    background: rgba(68, 83, 206, 0.09);
  }

  .reports-action-review-icon {
    color: #e6a34e;
    border: 1px solid rgba(218, 151, 57, 0.25);
    background: rgba(188, 124, 35, 0.08);
  }

  .reports-action-review-active {
    color: #c783ff;
    border-color: rgba(184, 94, 255, 0.28);
    background: rgba(146, 57, 204, 0.1);
  }

  .reports-action-content {
    min-width: 0;
    flex: 1;
  }

  .reports-action-content h4 {
    margin: 0 0 8px;
    color: #f0f4fc;
    font-size: 15px;
    font-weight: 800;
  }

  .reports-action-content p {
    margin: 0;
    color: #6f83a6;
    font-size: 12px;
    line-height: 1.6;
  }

  .reports-action-button {
    width: 100%;
    min-height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 20px;
    border: 1px solid #30466e;
    border-radius: 10px;
    background: #121f38;
    color: #a7c2ef;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }

  .reports-action-button:hover:not(:disabled) {
    background: #182844;
    border-color: #46618f;
  }

  .reports-action-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .reports-action-warning {
    color: #e6ad63;
    border-color: rgba(218, 151, 57, 0.34);
    background: rgba(159, 103, 30, 0.07);
  }

  .reports-status-editor {
    margin-top: 16px;
  }

  .reports-status-editor select {
    width: 100%;
    height: 41px;
    padding: 0 10px;
    border: 1px solid #2a3e60;
    border-radius: 9px;
    outline: 0;
    background: #0b1528;
    color: #d3dced;
    font-size: 11px;
  }

  .reports-status-editor-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
    margin-top: 8px;
  }

  .reports-status-editor-actions button {
    height: 38px;
    border-radius: 8px;
    border: 1px solid #283b5b;
    background: #111d33;
    color: #9bb2d9;
    font-size: 10px;
    font-weight: 800;
    cursor: pointer;
  }

  .reports-status-editor-actions button:last-child {
    border-color: #405594;
    background: #182650;
    color: #b8c5ff;
  }

  /* =========================================================
     PERFORMANCE
     ========================================================= */

  .reports-performance-panel {
    margin: 16px 28px 0;
    padding: 20px;
    border: 1px solid #263653;
    border-radius: 15px;
    background: #0b162a;
  }

  .reports-performance-header span {
    display: block;
    margin-bottom: 6px;
    color: #7185ff;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  .reports-performance-header h3 {
    margin: 0;
    color: #edf2fa;
    font-size: 17px;
    font-weight: 800;
  }

  .reports-performance-grid {
    display: grid;
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
  }

  .reports-performance-card {
    padding: 14px;
    border: 1px solid #1d2d48;
    border-radius: 10px;
    background: #0e192d;
  }

  .reports-performance-card span {
    display: block;
    margin-bottom: 7px;
    color: #5e7398;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
  }

  .reports-performance-card strong {
    color: #e5ebf7;
    font-size: 16px;
    font-weight: 800;
  }

  .reports-performance-feedback {
    margin-top: 12px;
    padding: 14px;
    border: 1px solid #1d2d48;
    border-radius: 10px;
    background: #0e192d;
  }

  .reports-performance-feedback span {
    display: block;
    margin-bottom: 7px;
    color: #5e7398;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
  }

  .reports-performance-feedback p {
    margin: 0;
    color: #bdc9dd;
    font-size: 12px;
    line-height: 1.6;
  }

  /* =========================================================
     MODAL FOOTER
     ========================================================= */

  .reports-modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px 28px;
    margin-top: 20px;
    border-top: 1px solid #1b2942;
  }

  .reports-modal-close-button {
    min-height: 40px;
    padding: 0 17px;
    border: 1px solid #2b3d5b;
    border-radius: 9px;
    background: #101b30;
    color: #a8b9d4;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }

  .reports-modal-close-button:hover:not(:disabled) {
    background: #17243b;
    color: #dbe4f5;
  }

  /* =========================================================
     LOADING
     ========================================================= */

  .reports-loading {
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #7790b8;
    font-size: 13px;
    font-weight: 700;
  }

  .reports-spin {
    animation: reports-spin-animation 0.9s linear infinite;
  }

  @keyframes reports-spin-animation {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  /* =========================================================
     RESPONSIVE
     ========================================================= */

  @media (max-width: 1200px) {

    .reports-stat-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .reports-table-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .reports-filter-row {
      width: 100%;
      justify-content: flex-start;
    }

    .reports-search {
      flex: 1;
      width: auto;
    }

  }

  @media (max-width: 900px) {

    .reports-status-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .reports-details-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .reports-action-grid {
      grid-template-columns:
        1fr;
    }

    .reports-performance-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

  }

  @media (max-width: 700px) {

    .reports-page-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .reports-page-header h1 {
      font-size: 34px;
    }

    .reports-stat-grid {
      grid-template-columns: 1fr;
    }

    .reports-status-grid {
      grid-template-columns: 1fr;
    }

    .reports-filter-row {
      flex-direction: column;
      align-items: stretch;
    }

    .reports-search,
    .reports-select,
    .reports-type-select {
      width: 100%;
    }

    .reports-details-grid {
      grid-template-columns: 1fr;
    }

    .reports-modal-overlay {
      padding: 10px;
    }

    .reports-modal-header,
    .reports-section-header,
    .reports-table-header {
      padding-left: 18px;
      padding-right: 18px;
    }

    .reports-modal-status-grid {
      grid-template-columns: 1fr;
      padding-left: 18px;
      padding-right: 18px;
    }

    .reports-details-grid {
      padding-left: 18px;
      padding-right: 18px;
    }

    .reports-review-panel,
    .reports-info-block,
    .reports-admin-section,
    .reports-performance-panel {
      margin-left: 18px;
      margin-right: 18px;
    }

    .reports-modal-footer {
      padding-left: 18px;
      padding-right: 18px;
    }

    .reports-performance-grid {
      grid-template-columns: 1fr;
    }

  }
`;

export default AdminReports;