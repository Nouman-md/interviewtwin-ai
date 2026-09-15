import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Flag,
  RefreshCw,
  Activity,
  Target,
  XCircle,
} from 'lucide-react';

import { adminInterviewsAPI } from '../services/api';
import AdminLayout from '../layouts/AdminLayout';

const AdminAnalytics = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // =========================================================
  // LOAD ANALYTICS DATA
  // =========================================================

  const loadAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response =
        await adminInterviewsAPI.getAllInterviews();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setInterviews(data);
    } catch (err) {
      console.error(
        'Failed to load analytics:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Failed to load analytics data.'
      );
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================

  const normalizeStatus = (status) => {
    if (!status) {
      return '';
    }

    return String(status)
      .trim()
      .toUpperCase();
  };

  const normalizeType = (type) => {
    if (!type) {
      return 'Unknown';
    }

    return String(type).trim() || 'Unknown';
  };

  const getScore = (interview) => {
    const value = Number(
      interview?.overallScore
    );

    return Number.isFinite(value)
      ? value
      : null;
  };

  const getDuration = (interview) => {
    const value = Number(
      interview?.durationMinutes
    );

    return Number.isFinite(value)
      ? value
      : null;
  };

  const getAnswers = (interview) => {
    const value = Number(
      interview?.answerCount
    );

    return Number.isFinite(value)
      ? value
      : 0;
  };

  // =========================================================
  // ANALYTICS CALCULATIONS
  // =========================================================

  const analytics = useMemo(() => {
    const total = interviews.length;

    const completed = interviews.filter(
      (interview) =>
        normalizeStatus(interview.status) ===
        'COMPLETED'
    ).length;

    const inProgress = interviews.filter(
      (interview) =>
        normalizeStatus(interview.status) ===
        'IN_PROGRESS'
    ).length;

    const failed = interviews.filter(
      (interview) =>
        normalizeStatus(interview.status) ===
        'FAILED'
    ).length;

    const cancelled = interviews.filter(
      (interview) =>
        normalizeStatus(interview.status) ===
        'CANCELLED'
    ).length;

    const flagged = interviews.filter(
      (interview) =>
        interview.flaggedForReview === true
    ).length;

    // -------------------------------------------------------
    // SCORES
    // -------------------------------------------------------

    const scoredInterviews =
      interviews.filter(
        (interview) =>
          getScore(interview) !== null
      );

    const averageScore =
      scoredInterviews.length > 0
        ? scoredInterviews.reduce(
            (sum, interview) =>
              sum + getScore(interview),
            0
          ) / scoredInterviews.length
        : 0;

    // -------------------------------------------------------
    // DURATION
    // -------------------------------------------------------

    const interviewsWithDuration =
      interviews.filter(
        (interview) =>
          getDuration(interview) !== null
      );

    const averageDuration =
      interviewsWithDuration.length > 0
        ? interviewsWithDuration.reduce(
            (sum, interview) =>
              sum + getDuration(interview),
            0
          ) /
          interviewsWithDuration.length
        : 0;

    // -------------------------------------------------------
    // ANSWERS
    // -------------------------------------------------------

    const totalAnswers =
      interviews.reduce(
        (sum, interview) =>
          sum + getAnswers(interview),
        0
      );

    // -------------------------------------------------------
    // COMPLETION RATE
    // -------------------------------------------------------

    const completionRate =
      total > 0
        ? (completed / total) * 100
        : 0;

    // -------------------------------------------------------
    // SCORE BANDS
    // -------------------------------------------------------

    const excellent =
      scoredInterviews.filter(
        (interview) =>
          getScore(interview) >= 80
      ).length;

    const good =
      scoredInterviews.filter(
        (interview) =>
          getScore(interview) >= 60 &&
          getScore(interview) < 80
      ).length;

    const needsImprovement =
      scoredInterviews.filter(
        (interview) =>
          getScore(interview) < 60
      ).length;

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
      completionRate,
      excellent,
      good,
      needsImprovement,
    };
  }, [interviews]);

  // =========================================================
  // INTERVIEW TYPE ANALYTICS
  // =========================================================

  const typeAnalytics = useMemo(() => {
    const grouped = {};

    interviews.forEach((interview) => {
      const type = normalizeType(
        interview.interviewType
      );

      if (!grouped[type]) {
        grouped[type] = {
          type,
          total: 0,
          completed: 0,
          scores: [],
          durations: [],
          answers: 0,
        };
      }

      grouped[type].total += 1;

      if (
        normalizeStatus(interview.status) ===
        'COMPLETED'
      ) {
        grouped[type].completed += 1;
      }

      const score = getScore(interview);

      if (score !== null) {
        grouped[type].scores.push(score);
      }

      const duration =
        getDuration(interview);

      if (duration !== null) {
        grouped[type].durations.push(
          duration
        );
      }

      grouped[type].answers +=
        getAnswers(interview);
    });

    return Object.values(grouped)
      .map((item) => {
        const averageScore =
          item.scores.length > 0
            ? item.scores.reduce(
                (sum, score) =>
                  sum + score,
                0
              ) / item.scores.length
            : 0;

        const averageDuration =
          item.durations.length > 0
            ? item.durations.reduce(
                (sum, duration) =>
                  sum + duration,
                0
              ) /
              item.durations.length
            : 0;

        const completionRate =
          item.total > 0
            ? (item.completed /
                item.total) *
              100
            : 0;

        return {
          ...item,
          averageScore,
          averageDuration,
          completionRate,
        };
      })
      .sort(
        (a, b) =>
          b.total - a.total
      );
  }, [interviews]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <AdminLayout currentPage="Analytics">
        <div className="admin-page admin-analytics-page">
          <div className="admin-loading">
            Loading analytics...
          </div>
        </div>
      </AdminLayout>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <AdminLayout currentPage="Analytics">

      <div className="admin-page admin-analytics-page">

        {/* ===================================================
            HEADER
            =================================================== */}

        <div className="admin-users-header">

          <div>

            <span className="admin-dashboard-eyebrow">
              REPORTING &amp; ANALYTICS
            </span>

            <h1>
              Analytics
            </h1>

            <p>
              Track interview activity, performance,
              completion trends, and overall platform
              insights.
            </p>

          </div>

          <button
            type="button"
            className="admin-users-refresh"
            onClick={() =>
              loadAnalytics(true)
            }
            disabled={refreshing}
          >

            <RefreshCw
              size={15}
              className={
                refreshing
                  ? 'admin-spin'
                  : ''
              }
            />

            {refreshing
              ? 'Refreshing'
              : 'Refresh'}

          </button>

        </div>


        {/* ===================================================
            ERROR
            =================================================== */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {/* ===================================================
            STATISTICS
            =================================================== */}

        <div className="admin-stat-grid">

          {/* TOTAL INTERVIEWS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <BarChart3 size={20} />
            </div>

            <div className="admin-stat-label">
              Total Interviews
            </div>

            <div className="admin-stat-value">
              {analytics.total}
            </div>

            <div className="admin-stat-description">
              Interview sessions
            </div>

          </div>


          {/* COMPLETED */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <div className="admin-stat-label">
              Completed
            </div>

            <div className="admin-stat-value">
              {analytics.completed}
            </div>

            <div className="admin-stat-description">
              Finished sessions
            </div>

          </div>


          {/* IN PROGRESS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <Clock3 size={20} />
            </div>

            <div className="admin-stat-label">
              In Progress
            </div>

            <div className="admin-stat-value">
              {analytics.inProgress}
            </div>

            <div className="admin-stat-description">
              Active sessions
            </div>

          </div>


          {/* AVERAGE SCORE */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <Activity size={20} />
            </div>

            <div className="admin-stat-label">
              Average Score
            </div>

            <div className="admin-stat-value">
              {analytics.averageScore.toFixed(1)}
            </div>

            <div className="admin-stat-description">
              Overall performance
            </div>

          </div>


          {/* AVERAGE DURATION */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <Clock3 size={20} />
            </div>

            <div className="admin-stat-label">
              Average Duration
            </div>

            <div className="admin-stat-value">

              {analytics.averageDuration.toFixed(0)}

              <span
                style={{
                  fontSize: '18px',
                  marginLeft: '4px',
                }}
              >
                min
              </span>

            </div>

            <div className="admin-stat-description">
              Average session time
            </div>

          </div>


          {/* ANSWERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <Target size={20} />
            </div>

            <div className="admin-stat-label">
              Answers Submitted
            </div>

            <div className="admin-stat-value">
              {analytics.totalAnswers}
            </div>

            <div className="admin-stat-description">
              Candidate responses
            </div>

          </div>


          {/* FLAGGED */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <Flag size={20} />
            </div>

            <div className="admin-stat-label">
              Flagged for Review
            </div>

            <div className="admin-stat-value">
              {analytics.flagged}
            </div>

            <div className="admin-stat-description">
              Sessions requiring review
            </div>

          </div>

        </div>


        {/* ===================================================
            STATUS OVERVIEW
            =================================================== */}

        <div className="admin-card analytics-content-card">

          <div className="admin-card-header">

            <div>

              <span className="admin-dashboard-eyebrow">
                INTERVIEW STATUS
              </span>

              <h2>
                Status Overview
              </h2>

              <p>
                Distribution of interview sessions
                by current status.
              </p>

            </div>

          </div>


          <div className="admin-reports-status-grid">

            <div className="admin-reports-status-item">

              <span>
                Completed
              </span>

              <strong>
                {analytics.completed}
              </strong>

            </div>


            <div className="admin-reports-status-item">

              <span>
                In Progress
              </span>

              <strong>
                {analytics.inProgress}
              </strong>

            </div>


            <div className="admin-reports-status-item">

              <span>
                Failed
              </span>

              <strong>
                {analytics.failed}
              </strong>

            </div>


            <div className="admin-reports-status-item">

              <span>
                Cancelled
              </span>

              <strong>
                {analytics.cancelled}
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================================
            PERFORMANCE SUMMARY
            =================================================== */}

        <div className="admin-card analytics-content-card">

          <div className="admin-card-header">

            <div>

              <span className="admin-dashboard-eyebrow">
                PERFORMANCE
              </span>

              <h2>
                Performance Summary
              </h2>

              <p>
                Key performance indicators calculated
                from interview sessions.
              </p>

            </div>

          </div>


          <div className="admin-reports-status-grid">

            <div className="admin-reports-status-item">

              <span>
                Completion Rate
              </span>

              <strong>
                {analytics.completionRate.toFixed(1)}%
              </strong>

            </div>


            <div className="admin-reports-status-item">

              <span>
                Score 80+
              </span>

              <strong>
                {analytics.excellent}
              </strong>

            </div>


            <div className="admin-reports-status-item">

              <span>
                Score 60–79
              </span>

              <strong>
                {analytics.good}
              </strong>

            </div>


            <div className="admin-reports-status-item">

              <span>
                Score Below 60
              </span>

              <strong>
                {analytics.needsImprovement}
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================================
            PERFORMANCE BY INTERVIEW TYPE
            =================================================== */}

        <div className="admin-card analytics-table-card">

          <div className="admin-card-header">

            <div>

              <span className="admin-dashboard-eyebrow">
                INTERVIEW TYPES
              </span>

              <h2>
                Performance by Interview Type
              </h2>

              <p>
                Compare activity and performance
                across interview types.
              </p>

            </div>

          </div>


          {typeAnalytics.length === 0 ? (

            <div className="admin-empty">
              No interview analytics available.
            </div>

          ) : (

            <div className="admin-table-wrapper analytics-table-wrapper">

              <table className="admin-table analytics-performance-table">

                <thead>

                  <tr>

                    <th>
                      Interview Type
                    </th>

                    <th>
                      Interviews
                    </th>

                    <th>
                      Completed
                    </th>

                    <th>
                      Completion Rate
                    </th>

                    <th>
                      Avg. Score
                    </th>

                    <th>
                      Avg. Duration
                    </th>

                    <th>
                      Answers
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {typeAnalytics.map(
                    (item) => (

                      <tr
                        key={item.type}
                      >

                        <td>
                          <strong>
                            {item.type}
                          </strong>
                        </td>

                        <td>
                          {item.total}
                        </td>

                        <td>
                          {item.completed}
                        </td>

                        <td>
                          {item.completionRate.toFixed(1)}%
                        </td>

                        <td>
                          {item.scores.length > 0
                            ? item.averageScore.toFixed(1)
                            : '—'}
                        </td>

                        <td>
                          {item.durations.length > 0
                            ? `${item.averageDuration.toFixed(0)} min`
                            : '—'}
                        </td>

                        <td>
                          {item.answers}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* ===================================================
            ANALYTICS SUMMARY
            =================================================== */}

        <div className="admin-card analytics-summary-card">

          <div className="admin-card-header">

            <div>

              <span className="admin-dashboard-eyebrow">
                PLATFORM INSIGHTS
              </span>

              <h2>
                Analytics Summary
              </h2>

              <p>
                High-level insights from the current
                interview dataset.
              </p>

            </div>

          </div>


          <div className="analytics-summary-grid">


            {/* TOTAL SESSIONS */}

            <div className="analytics-summary-item">

              <span>
                Total Sessions
              </span>

              <strong>
                {analytics.total}
              </strong>

              <p>
                Interview sessions included
                in the analytics.
              </p>

            </div>


            {/* AVERAGE SCORE */}

            <div className="analytics-summary-item">

              <span>
                Average Score
              </span>

              <strong>
                {analytics.averageScore.toFixed(1)}
              </strong>

              <p>
                Average score across scored
                interview sessions.
              </p>

            </div>


            {/* AVERAGE DURATION */}

            <div className="analytics-summary-item">

              <span>
                Average Duration
              </span>

              <strong>
                {analytics.averageDuration.toFixed(0)}
                {' '}min
              </strong>

              <p>
                Average duration of recorded
                interview sessions.
              </p>

            </div>


            {/* FLAGGED */}

            <div className="analytics-summary-item">

              <span>
                Flagged Sessions
              </span>

              <strong>
                {analytics.flagged}
              </strong>

              <p>
                Interview sessions currently
                requiring review.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ANALYTICS-SPECIFIC CSS
          ===================================================== */}

      <style>{`

        /* =====================================================
           MAIN PAGE
           ===================================================== */

        .admin-analytics-page {
          width: 100%;
        }


        /* =====================================================
           TABLE CARD
           ===================================================== */

        .admin-analytics-page
        .analytics-table-card {

          width: 100%;

          margin-bottom: 22px;

          background:
            linear-gradient(
              145deg,
              #0d1729,
              #0a1220
            );

          border:
            1px solid #1d2b45;

          border-radius: 16px;

          overflow: hidden;

          box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.12);

        }


        /* =====================================================
           SUMMARY CARD
           ===================================================== */

        .admin-analytics-page
        .analytics-summary-card {

          width: 100%;

          margin-bottom: 22px;

          background:
            linear-gradient(
              145deg,
              #0d1729,
              #0a1220
            );

          border:
            1px solid #1d2b45;

          border-radius: 16px;

          overflow: hidden;

          box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.12);

        }


        /* =====================================================
           CONTENT CARDS
           ===================================================== */

        .admin-analytics-page
        .analytics-content-card {

          width: 100%;

          margin-bottom: 22px;

          background:
            linear-gradient(
              145deg,
              #0d1729,
              #0a1220
            );

          border:
            1px solid #1d2b45;

          border-radius: 16px;

          overflow: hidden;

        }


        /* =====================================================
           CARD HEADER
           ===================================================== */

        .admin-analytics-page
        .analytics-table-card
        .admin-card-header,

        .admin-analytics-page
        .analytics-summary-card
        .admin-card-header,

        .admin-analytics-page
        .analytics-content-card
        .admin-card-header {

          padding:
            21px 24px;

          background:
            #0d1729;

          border-bottom:
            1px solid #1d2b45;

        }


        .admin-analytics-page
        .admin-card-header
        h2 {

          margin: 0;

          color: #f5f7ff;

          font-size: 21px;

          font-weight: 750;

          line-height: 1.3;

        }


        .admin-analytics-page
        .admin-card-header
        p {

          margin:
            8px 0 0;

          color: #61799f;

          font-size: 13px;

          line-height: 1.5;

        }


        /* =====================================================
           EYEBROW
           ===================================================== */

        .admin-analytics-page
        .admin-dashboard-eyebrow {

          display: block;

          margin-bottom: 7px;

          color: #6681ff;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1.5px;

          text-transform: uppercase;

        }


        /* =====================================================
           TABLE WRAPPER
           ===================================================== */

        .admin-analytics-page
        .analytics-table-wrapper {

          width: 100%;

          overflow-x: auto;

          background: #0b1425;

        }


        /* =====================================================
           TABLE
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table {

          width: 100%;

          min-width: 1000px;

          border-collapse: collapse;

          table-layout: fixed;

        }


        /* =====================================================
           TABLE HEADER
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        thead {

          background:
            #0c1527;

        }


        .admin-analytics-page
        .analytics-performance-table
        th {

          height: 47px;

          padding:
            0 24px;

          color: #607ba5;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1.1px;

          text-align: left;

          text-transform: uppercase;

          white-space: nowrap;

          border-bottom:
            1px solid #1d2b45;

        }


        /* =====================================================
           TABLE ROW
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        tbody tr {

          background:
            #0b1425;

          transition:
            background 0.18s ease;

        }


        .admin-analytics-page
        .analytics-performance-table
        tbody tr:hover {

          background:
            #101c31;

        }


        /* =====================================================
           TABLE CELLS
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        td {

          height: 68px;

          padding:
            12px 24px;

          color: #cbd7eb;

          font-size: 13px;

          vertical-align: middle;

          white-space: nowrap;

          border-bottom:
            1px solid #18263d;

        }


        .admin-analytics-page
        .analytics-performance-table
        tbody tr:last-child td {

          border-bottom: none;

        }


        /* =====================================================
           FIRST COLUMN
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        td:first-child {

          color: #f1f5ff;

          font-weight: 700;

        }


        .admin-analytics-page
        .analytics-performance-table
        td strong {

          color: #edf2ff;

          font-weight: 700;

        }


        /* =====================================================
           COMPLETION RATE
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(4) {

          color: #9fb5ff;

          font-weight: 650;

        }


        /* =====================================================
           SCORE
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(5) {

          color: #dfe7ff;

          font-weight: 700;

        }


        /* =====================================================
           DURATION
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(6) {

          color: #a9b9d4;

        }


        /* =====================================================
           ANSWERS
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(7) {

          color: #dce5f8;

          font-weight: 650;

        }


        /* =====================================================
           COLUMN WIDTHS
           ===================================================== */

        .admin-analytics-page
        .analytics-performance-table
        th:nth-child(1),
        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(1) {

          width: 29%;

        }


        .admin-analytics-page
        .analytics-performance-table
        th:nth-child(2),
        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(2) {

          width: 11%;

        }


        .admin-analytics-page
        .analytics-performance-table
        th:nth-child(3),
        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(3) {

          width: 11%;

        }


        .admin-analytics-page
        .analytics-performance-table
        th:nth-child(4),
        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(4) {

          width: 15%;

        }


        .admin-analytics-page
        .analytics-performance-table
        th:nth-child(5),
        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(5) {

          width: 11%;

        }


        .admin-analytics-page
        .analytics-performance-table
        th:nth-child(6),
        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(6) {

          width: 13%;

        }


        .admin-analytics-page
        .analytics-performance-table
        th:nth-child(7),
        .admin-analytics-page
        .analytics-performance-table
        td:nth-child(7) {

          width: 10%;

        }


        /* =====================================================
           SUMMARY GRID
           ===================================================== */

        .admin-analytics-page
        .analytics-summary-grid {

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 15px;

          padding: 20px;

          background:
            #0b1425;

        }


        /* =====================================================
           SUMMARY ITEM
           ===================================================== */

        .admin-analytics-page
        .analytics-summary-item {

          min-height: 115px;

          display: flex;

          flex-direction: column;

          justify-content: center;

          padding: 18px;

          background:
            #0d1729;

          border:
            1px solid #1d2b45;

          border-radius: 12px;

          box-sizing: border-box;

        }


        .admin-analytics-page
        .analytics-summary-item span {

          color: #607ba5;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1.2px;

          text-transform: uppercase;

        }


        .admin-analytics-page
        .analytics-summary-item strong {

          margin-top: 11px;

          color: #f5f7ff;

          font-size: 25px;

          font-weight: 800;

          line-height: 1.1;

        }


        .admin-analytics-page
        .analytics-summary-item p {

          margin:
            8px 0 0;

          color: #60718f;

          font-size: 10px;

          line-height: 1.5;

        }


        /* =====================================================
           STATUS GRID
           ===================================================== */

        .admin-analytics-page
        .admin-reports-status-grid {

          width: 100%;

        }


        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 1100px) {

          .admin-analytics-page
          .analytics-summary-grid {

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

          }

        }


        @media (max-width: 700px) {

          .admin-analytics-page
          .analytics-summary-grid {

            grid-template-columns: 1fr;

            padding: 15px;

          }


          .admin-analytics-page
          .analytics-table-wrapper {

            overflow-x: auto;

          }


          .admin-analytics-page
          .analytics-performance-table {

            min-width: 1000px;

          }

        }

      `}</style>

    </AdminLayout>
  );
};

export default AdminAnalytics;