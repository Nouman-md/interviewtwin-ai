import React, { useEffect, useState } from 'react';
import {
  Users,
  Video,
  Code2,
  Brain,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

import { adminDashboardAPI } from '../services/api';

import AdminLayout from '../layouts/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';


const AdminDashboard = () => {
  const { admin } = useAdminAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    totalCodingQuestions: 0,
    totalAptitudeQuestions: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);

      const response =
  await adminDashboardAPI.getStats();
      const data = response.data;

      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalInterviews: data.totalInterviews ?? 0,
        totalCodingQuestions: data.totalCodingQuestions ?? 0,
        totalAptitudeQuestions:
          data.totalAptitudeQuestions ?? 0,
      });

    } catch (error) {
      console.error(
        'Failed to load dashboard statistics:',
        error
      );

      if (error.response?.status === 401) {
        setStatsError(
          'Your admin session has expired. Please login again.'
        );
      } else if (error.response?.status === 403) {
        setStatsError(
          'Administrator access is required.'
        );
      } else {
        setStatsError(
          'Unable to load dashboard statistics.'
        );
      }

    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <AdminLayout currentPage="Dashboard">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="admin-dashboard-header">

        <div>
          <span className="admin-dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>
            Good to see you,{' '}
            {admin?.firstName || 'Administrator'}
          </h1>

          <p>
            Here's what's happening across InterviewTwinAI today.
          </p>
        </div>

        <div className="admin-dashboard-date">
          <span>ADMIN CONSOLE</span>

          <strong>
            Live Overview
          </strong>
        </div>

      </div>


      {/* =====================================================
          ERROR MESSAGE
          ===================================================== */}

      {statsError && (
        <div
          style={{
            marginBottom: '18px',
            padding: '13px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '15px',
            borderRadius: '11px',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            background: 'rgba(127, 29, 29, 0.18)',
            color: '#fca5a5',
            fontSize: '12px',
          }}
        >

          <span>
            {statsError}
          </span>

          <button
            onClick={fetchDashboardStats}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 10px',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              borderRadius: '7px',
              color: '#fca5a5',
              background: 'rgba(248, 113, 113, 0.06)',
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            Retry
          </button>

        </div>
      )}


      {/* =====================================================
          STATISTICS CARDS
          ===================================================== */}

      <div className="admin-stat-grid">

        {/* USERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon admin-stat-icon-users">
              <Users size={20} />
            </div>

            <span className="admin-stat-label">
              USERS
            </span>

          </div>

          <div className="admin-stat-value">

            {statsLoading
              ? '...'
              : stats.totalUsers}

          </div>

          <div className="admin-stat-description">
            Registered users
          </div>

        </div>


        {/* INTERVIEWS */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon admin-stat-icon-interviews">
              <Video size={20} />
            </div>

            <span className="admin-stat-label">
              INTERVIEWS
            </span>

          </div>

          <div className="admin-stat-value">

            {statsLoading
              ? '...'
              : stats.totalInterviews}

          </div>

          <div className="admin-stat-description">
            Interview sessions
          </div>

        </div>


        {/* CODING */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon admin-stat-icon-coding">
              <Code2 size={20} />
            </div>

            <span className="admin-stat-label">
              CODING
            </span>

          </div>

          <div className="admin-stat-value">

            {statsLoading
              ? '...'
              : stats.totalCodingQuestions}

          </div>

          <div className="admin-stat-description">
            Coding questions
          </div>

        </div>


        {/* APTITUDE */}

        <div className="admin-stat-card">

          <div className="admin-stat-top">

            <div className="admin-stat-icon admin-stat-icon-aptitude">
              <Brain size={20} />
            </div>

            <span className="admin-stat-label">
              APTITUDE
            </span>

          </div>

          <div className="admin-stat-value">

            {statsLoading
              ? '...'
              : stats.totalAptitudeQuestions}

          </div>

          <div className="admin-stat-description">
            Aptitude questions
          </div>

        </div>

      </div>


      {/* =====================================================
          LOWER DASHBOARD
          ===================================================== */}

      <div className="admin-dashboard-grid">


        {/* PLATFORM OVERVIEW */}

        <section className="admin-panel admin-overview-panel">

          <div className="admin-panel-header">

            <div>

              <span className="admin-panel-eyebrow">
                PLATFORM
              </span>

              <h2>
                Platform Overview
              </h2>

            </div>

            <TrendingUp size={20} />

          </div>


          <div className="admin-overview-empty">

            <div className="admin-overview-empty-icon">
              <TrendingUp size={22} />
            </div>

            <h3>
              Analytics coming next
            </h3>

            <p>
              Real platform analytics will be added
              after we finish the core admin management
              modules.
            </p>

          </div>

        </section>


        {/* RECENT ACTIVITY */}

        <section className="admin-panel admin-activity-panel">

          <div className="admin-panel-header">

            <div>

              <span className="admin-panel-eyebrow">
                ACTIVITY
              </span>

              <h2>
                Recent Activity
              </h2>

            </div>

          </div>


          <div className="admin-activity-empty">

            <div className="admin-activity-line"></div>

            <p>
              Activity tracking coming next.
            </p>

            <span>
              We'll connect this to the admin activity API.
            </span>

          </div>

        </section>

      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;