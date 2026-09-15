import React, { useState } from 'react';
import {
  ShieldCheck,
  LockKeyhole,
  KeyRound,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MonitorSmartphone,
  LogOut,
  RefreshCw,
} from 'lucide-react';

import AdminLayout from '../layouts/AdminLayout';

const AdminSecureConsole = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(false);

  const [sessionProtection, setSessionProtection] =
    useState(true);

  const [loginMonitoring, setLoginMonitoring] =
    useState(true);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <AdminLayout currentPage="Secure Console">

      <div className="admin-page admin-secure-console-page">

        {/* ===================================================
            HEADER
            =================================================== */}

        <div className="admin-users-header">

          <div>

            <span className="admin-dashboard-eyebrow">
              SECURITY CENTER
            </span>

            <h1>
              Secure Console
            </h1>

            <p>
              Monitor administrator security, authentication,
              sessions, and access protection.
            </p>

          </div>


          <button
            type="button"
            className="admin-secure-refresh"
            onClick={handleRefresh}
            disabled={loading}
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? 'admin-secure-spin'
                  : ''
              }
            />

            {loading
              ? 'Refreshing'
              : 'Refresh'}

          </button>

        </div>


        {/* ===================================================
            SECURITY STATUS
            =================================================== */}

        <div className="admin-secure-status-card">

          <div className="admin-secure-status-icon">

            <ShieldCheck size={25} />

          </div>


          <div className="admin-secure-status-content">

            <span>
              SECURITY STATUS
            </span>

            <h2>
              Administrator Console Protected
            </h2>

            <p>
              Your administrator area is protected by the
              configured authentication and access controls.
            </p>

          </div>


          <div className="admin-secure-status-badge">

            <span className="admin-secure-status-dot"></span>

            System Secure

          </div>

        </div>


        {/* ===================================================
            SECURITY OVERVIEW
            =================================================== */}

        <div className="admin-secure-stats-grid">

          <div className="admin-secure-stat-card">

            <div className="admin-secure-stat-icon">
              <LockKeyhole size={19} />
            </div>

            <span>
              Authentication
            </span>

            <strong>
              Protected
            </strong>

            <small>
              Admin authentication required
            </small>

          </div>


          <div className="admin-secure-stat-card">

            <div className="admin-secure-stat-icon">
              <Activity size={19} />
            </div>

            <span>
              Login Monitoring
            </span>

            <strong>
              Active
            </strong>

            <small>
              Administrator access monitoring
            </small>

          </div>


          <div className="admin-secure-stat-card">

            <div className="admin-secure-stat-icon">
              <MonitorSmartphone size={19} />
            </div>

            <span>
              Active Session
            </span>

            <strong>
              1
            </strong>

            <small>
              Current administrator session
            </small>

          </div>


          <div className="admin-secure-stat-card">

            <div className="admin-secure-stat-icon">
              <AlertTriangle size={19} />
            </div>

            <span>
              Security Alerts
            </span>

            <strong>
              0
            </strong>

            <small>
              No unresolved alerts
            </small>

          </div>

        </div>


        {/* ===================================================
            ACCESS PROTECTION
            =================================================== */}

        <div className="admin-card admin-secure-card">

          <div className="admin-card-header">

            <div className="admin-secure-heading">

              <div className="admin-secure-heading-icon">
                <ShieldCheck size={19} />
              </div>

              <div>

                <span className="admin-dashboard-eyebrow">
                  ACCESS CONTROL
                </span>

                <h2>
                  Access Protection
                </h2>

                <p>
                  Configure protection mechanisms for the
                  administrator console.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-secure-options">

            {/* TWO FACTOR */}

            <div className="admin-secure-option">

              <div className="admin-secure-option-left">

                <div className="admin-secure-option-icon">
                  <KeyRound size={17} />
                </div>

                <div>

                  <strong>
                    Two-factor authentication
                  </strong>

                  <span>
                    Add an additional authentication layer
                    to administrator access.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  twoFactorEnabled
                    ? 'admin-secure-toggle active'
                    : 'admin-secure-toggle'
                }
                onClick={() =>
                  setTwoFactorEnabled(
                    !twoFactorEnabled
                  )
                }
                aria-label="Toggle two-factor authentication"
              >

                <span />

              </button>

            </div>


            {/* SESSION PROTECTION */}

            <div className="admin-secure-option">

              <div className="admin-secure-option-left">

                <div className="admin-secure-option-icon">
                  <LockKeyhole size={17} />
                </div>

                <div>

                  <strong>
                    Session protection
                  </strong>

                  <span>
                    Protect administrator sessions from
                    unauthorized access.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  sessionProtection
                    ? 'admin-secure-toggle active'
                    : 'admin-secure-toggle'
                }
                onClick={() =>
                  setSessionProtection(
                    !sessionProtection
                  )
                }
                aria-label="Toggle session protection"
              >

                <span />

              </button>

            </div>


            {/* LOGIN MONITORING */}

            <div className="admin-secure-option">

              <div className="admin-secure-option-left">

                <div className="admin-secure-option-icon">
                  <Activity size={17} />
                </div>

                <div>

                  <strong>
                    Login monitoring
                  </strong>

                  <span>
                    Monitor administrator authentication
                    activity and login events.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  loginMonitoring
                    ? 'admin-secure-toggle active'
                    : 'admin-secure-toggle'
                }
                onClick={() =>
                  setLoginMonitoring(
                    !loginMonitoring
                  )
                }
                aria-label="Toggle login monitoring"
              >

                <span />

              </button>

            </div>

          </div>

        </div>


        {/* ===================================================
            CURRENT SESSION
            =================================================== */}

        <div className="admin-card admin-secure-card">

          <div className="admin-card-header">

            <div className="admin-secure-heading">

              <div className="admin-secure-heading-icon">
                <MonitorSmartphone size={19} />
              </div>

              <div>

                <span className="admin-dashboard-eyebrow">
                  SESSION
                </span>

                <h2>
                  Current Administrator Session
                </h2>

                <p>
                  Information about the current admin
                  authentication session.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-secure-session">

            <div className="admin-secure-session-row">

              <div>

                <span>
                  SESSION STATUS
                </span>

                <strong>
                  Active
                </strong>

              </div>

              <CheckCircle2 size={19} />

            </div>


            <div className="admin-secure-session-grid">

              <div>

                <span>
                  ACCESS LEVEL
                </span>

                <strong>
                  Administrator
                </strong>

              </div>


              <div>

                <span>
                  SESSION PROTECTION
                </span>

                <strong>
                  {sessionProtection
                    ? 'Enabled'
                    : 'Disabled'}
                </strong>

              </div>


              <div>

                <span>
                  LOGIN MONITORING
                </span>

                <strong>
                  {loginMonitoring
                    ? 'Enabled'
                    : 'Disabled'}
                </strong>

              </div>


              <div>

                <span>
                  SESSION TIMEOUT
                </span>

                <strong>
                  30 minutes
                </strong>

              </div>

            </div>


            <button
              type="button"
              className="admin-secure-logout"
            >

              <LogOut size={16} />

              Sign Out Current Session

            </button>

          </div>

        </div>


        {/* ===================================================
            SECURITY EVENTS
            =================================================== */}

        <div className="admin-card admin-secure-card">

          <div className="admin-card-header">

            <div className="admin-secure-heading">

              <div className="admin-secure-heading-icon">
                <Activity size={19} />
              </div>

              <div>

                <span className="admin-dashboard-eyebrow">
                  SECURITY ACTIVITY
                </span>

                <h2>
                  Recent Security Events
                </h2>

                <p>
                  Recent administrator security activity
                  detected by the console.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-secure-events">

            <div className="admin-secure-event">

              <div className="admin-secure-event-icon success">
                <CheckCircle2 size={16} />
              </div>

              <div className="admin-secure-event-content">

                <strong>
                  Administrator authentication successful
                </strong>

                <span>
                  Current administrator session authenticated
                  successfully.
                </span>

              </div>

              <div className="admin-secure-event-time">

                <Clock3 size={13} />

                Just now

              </div>

            </div>


            <div className="admin-secure-event">

              <div className="admin-secure-event-icon">
                <ShieldCheck size={16} />
              </div>

              <div className="admin-secure-event-content">

                <strong>
                  Security monitoring active
                </strong>

                <span>
                  Administrator access monitoring is enabled.
                </span>

              </div>

              <div className="admin-secure-event-time">

                <Clock3 size={13} />

                Active

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            SECURITY NOTICE
            =================================================== */}

        <div className="admin-secure-notice">

          <ShieldCheck size={20} />

          <div>

            <strong>
              Security Hardening
            </strong>

            <p>
              This console currently provides the
              administrator security interface. Backend
              enforcement, audit logging, session controls,
              and two-factor authentication will be connected
              during the final security-hardening phase.
            </p>

          </div>

        </div>


        {/* ===================================================
            CSS
            =================================================== */}

        <style>{`

          /* ================================================
             PAGE
             ================================================ */

          .admin-secure-console-page {
            width: 100%;
          }


          /* ================================================
             REFRESH
             ================================================ */

          .admin-secure-refresh {

            height: 40px;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            gap: 8px;

            padding: 0 15px;

            border:
              1px solid #273754;

            border-radius: 9px;

            background:
              #0d1729;

            color:
              #c4d0e5;

            font-size: 11px;
            font-weight: 700;

            cursor: pointer;

          }


          .admin-secure-refresh:hover {

            background:
              #111d31;

            border-color:
              #4a5fc9;

          }


          .admin-secure-refresh:disabled {

            opacity: 0.6;

            cursor: not-allowed;

          }


          .admin-secure-spin {

            animation:
              adminSecureSpin 0.8s linear infinite;

          }


          @keyframes adminSecureSpin {

            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }

          }


          /* ================================================
             SECURITY STATUS
             ================================================ */

          .admin-secure-status-card {

            display: flex;

            align-items: center;

            gap: 17px;

            margin-bottom: 20px;

            padding: 20px 22px;

            background:
              linear-gradient(
                145deg,
                #101d31,
                #0b1526
              );

            border:
              1px solid #263b62;

            border-radius: 16px;

          }


          .admin-secure-status-icon {

            width: 48px;
            height: 48px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border:
              1px solid #354d91;

            border-radius: 12px;

            background:
              rgba(79, 70, 229, 0.12);

            color:
              #8da2ff;

          }


          .admin-secure-status-content {

            flex: 1;

          }


          .admin-secure-status-content > span {

            display: block;

            color:
              #6380d0;

            font-size: 9px;

            font-weight: 800;

            letter-spacing: 1.2px;

          }


          .admin-secure-status-content h2 {

            margin:
              5px 0 0;

            color:
              #f3f6ff;

            font-size: 18px;

            font-weight: 750;

          }


          .admin-secure-status-content p {

            margin:
              5px 0 0;

            color:
              #61799f;

            font-size: 11px;

          }


          .admin-secure-status-badge {

            display: flex;

            align-items: center;

            gap: 7px;

            padding:
              8px 11px;

            border:
              1px solid rgba(
                34,
                197,
                94,
                0.18
              );

            border-radius: 8px;

            background:
              rgba(
                34,
                197,
                94,
                0.06
              );

            color:
              #86d9a2;

            font-size: 10px;

            font-weight: 700;

            white-space: nowrap;

          }


          .admin-secure-status-dot {

            width: 7px;
            height: 7px;

            border-radius: 50%;

            background:
              #4ade80;

            box-shadow:
              0 0 8px
              rgba(74, 222, 128, 0.55);

          }


          /* ================================================
             STATS
             ================================================ */

          .admin-secure-stats-grid {

            display: grid;

            grid-template-columns:
              repeat(4, minmax(0, 1fr));

            gap: 15px;

            margin-bottom: 20px;

          }


          .admin-secure-stat-card {

            min-height: 135px;

            padding: 18px;

            background:
              linear-gradient(
                145deg,
                #0d1729,
                #0a1220
              );

            border:
              1px solid #1d2b45;

            border-radius: 14px;

          }


          .admin-secure-stat-icon {

            width: 37px;
            height: 37px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-bottom: 13px;

            border:
              1px solid #293c67;

            border-radius: 10px;

            background:
              rgba(79, 70, 229, 0.08);

            color:
              #8ba1ff;

          }


          .admin-secure-stat-card > span {

            display: block;

            color:
              #607ba5;

            font-size: 9px;

            font-weight: 800;

            letter-spacing: 1px;

            text-transform: uppercase;

          }


          .admin-secure-stat-card > strong {

            display: block;

            margin-top: 7px;

            color:
              #f4f7ff;

            font-size: 20px;

            font-weight: 800;

          }


          .admin-secure-stat-card > small {

            display: block;

            margin-top: 5px;

            color:
              #596e90;

            font-size: 9px;

          }


          /* ================================================
             CARDS
             ================================================ */

          .admin-secure-card {

            margin-bottom: 20px;

            overflow: hidden;

            background:
              linear-gradient(
                145deg,
                #0d1729,
                #0a1220
              ) !important;

            border:
              1px solid #1d2b45 !important;

            border-radius: 16px !important;

          }


          .admin-secure-heading {

            display: flex;

            align-items: flex-start;

            gap: 13px;

          }


          .admin-secure-heading-icon {

            width: 38px;
            height: 38px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border:
              1px solid #293e70;

            border-radius: 10px;

            background:
              rgba(79, 70, 229, 0.08);

            color:
              #8ca2ff;

          }


          /* ================================================
             OPTIONS
             ================================================ */

          .admin-secure-options {

            width: 100%;

          }


          .admin-secure-option {

            min-height: 78px;

            display: flex;

            align-items: center;
            justify-content: space-between;

            gap: 20px;

            padding:
              16px 24px;

            border-top:
              1px solid #18263d;

          }


          .admin-secure-option-left {

            display: flex;

            align-items: center;

            gap: 13px;

          }


          .admin-secure-option-icon {

            width: 34px;
            height: 34px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border:
              1px solid #263754;

            border-radius: 9px;

            background:
              #0d192d;

            color:
              #8198c0;

          }


          .admin-secure-option-left strong {

            display: block;

            color:
              #e5ebf8;

            font-size: 12px;

          }


          .admin-secure-option-left span {

            display: block;

            margin-top: 4px;

            color:
              #617494;

            font-size: 10px;

          }


          /* ================================================
             TOGGLE
             ================================================ */

          .admin-secure-toggle {

            position: relative;

            width: 42px;
            height: 23px;

            flex-shrink: 0;

            padding: 0;

            border: none;

            border-radius: 999px;

            background:
              #25334c;

            cursor: pointer;

          }


          .admin-secure-toggle span {

            position: absolute;

            top: 3px;
            left: 3px;

            width: 17px;
            height: 17px;

            border-radius: 50%;

            background:
              #9aa8bd;

            transition:
              transform 0.2s ease,
              background 0.2s ease;

          }


          .admin-secure-toggle.active {

            background:
              #4f46e5;

          }


          .admin-secure-toggle.active span {

            background:
              #ffffff;

            transform:
              translateX(19px);

          }


          /* ================================================
             SESSION
             ================================================ */

          .admin-secure-session {

            padding: 22px 24px;

          }


          .admin-secure-session-row {

            display: flex;

            align-items: center;
            justify-content: space-between;

            padding-bottom: 18px;

            border-bottom:
              1px solid #18263d;

          }


          .admin-secure-session-row span {

            display: block;

            color:
              #607ba5;

            font-size: 9px;

            font-weight: 800;

            letter-spacing: 1px;

          }


          .admin-secure-session-row strong {

            display: block;

            margin-top: 5px;

            color:
              #86efac;

            font-size: 13px;

          }


          .admin-secure-session-row svg {

            color:
              #4ade80;

          }


          .admin-secure-session-grid {

            display: grid;

            grid-template-columns:
              repeat(4, minmax(0, 1fr));

            gap: 20px;

            padding:
              20px 0;

          }


          .admin-secure-session-grid span {

            display: block;

            color:
              #607ba5;

            font-size: 9px;

            font-weight: 800;

            letter-spacing: 0.9px;

          }


          .admin-secure-session-grid strong {

            display: block;

            margin-top: 7px;

            color:
              #dbe5f7;

            font-size: 11px;

          }


          .admin-secure-logout {

            display: inline-flex;

            align-items: center;

            gap: 8px;

            height: 36px;

            padding:
              0 13px;

            border:
              1px solid #382d3c;

            border-radius: 8px;

            background:
              #15101a;

            color:
              #c7aabd;

            font-size: 10px;

            font-weight: 700;

            cursor: pointer;

          }


          .admin-secure-logout:hover {

            border-color:
              #684b62;

            background:
              #1b131e;

          }


          /* ================================================
             EVENTS
             ================================================ */

          .admin-secure-events {

            width: 100%;

          }


          .admin-secure-event {

            min-height: 72px;

            display: flex;

            align-items: center;

            gap: 13px;

            padding:
              14px 24px;

            border-top:
              1px solid #18263d;

          }


          .admin-secure-event-icon {

            width: 34px;
            height: 34px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border:
              1px solid #263754;

            border-radius: 9px;

            background:
              #0d192d;

            color:
              #8198c0;

          }


          .admin-secure-event-icon.success {

            border-color:
              rgba(34, 197, 94, 0.2);

            background:
              rgba(34, 197, 94, 0.06);

            color:
              #69dc8e;

          }


          .admin-secure-event-content {

            flex: 1;

          }


          .admin-secure-event-content strong {

            display: block;

            color:
              #dfe7f7;

            font-size: 11px;

          }


          .admin-secure-event-content span {

            display: block;

            margin-top: 4px;

            color:
              #607494;

            font-size: 9px;

          }


          .admin-secure-event-time {

            display: flex;

            align-items: center;

            gap: 5px;

            color:
              #596e8d;

            font-size: 9px;

            white-space: nowrap;

          }


          /* ================================================
             NOTICE
             ================================================ */

          .admin-secure-notice {

            display: flex;

            align-items: flex-start;

            gap: 12px;

            margin-bottom: 20px;

            padding:
              17px 20px;

            border:
              1px solid #263650;

            border-radius: 12px;

            background:
              rgba(15, 23, 42, 0.55);

          }


          .admin-secure-notice svg {

            flex-shrink: 0;

            color:
              #8297ff;

          }


          .admin-secure-notice strong {

            display: block;

            color:
              #dce5f6;

            font-size: 11px;

          }


          .admin-secure-notice p {

            margin:
              5px 0 0;

            color:
              #617494;

            font-size: 10px;

            line-height: 1.5;

          }


          /* ================================================
             RESPONSIVE
             ================================================ */

          @media (max-width: 1100px) {

            .admin-secure-stats-grid {

              grid-template-columns:
                repeat(2, minmax(0, 1fr));

            }


            .admin-secure-session-grid {

              grid-template-columns:
                repeat(2, minmax(0, 1fr));

            }

          }


          @media (max-width: 700px) {

            .admin-secure-status-card {

              align-items: flex-start;

              flex-wrap: wrap;

            }


            .admin-secure-status-badge {

              margin-left: 65px;

            }


            .admin-secure-stats-grid {

              grid-template-columns: 1fr;

            }


            .admin-secure-session-grid {

              grid-template-columns: 1fr;

            }


            .admin-secure-option {

              align-items: flex-start;

            }


            .admin-secure-event {

              align-items: flex-start;

            }


            .admin-secure-event-time {

              display: none;

            }

          }

        `}</style>

      </div>

    </AdminLayout>
  );
};

export default AdminSecureConsole;