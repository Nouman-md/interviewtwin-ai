import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Bell,
  LockKeyhole,
  Settings2,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

import AdminLayout from '../layouts/AdminLayout';

const AdminSettings = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [settings, setSettings] = useState({
    adminName: 'Administrator',
    adminEmail: '',
    emailNotifications: true,
    securityAlerts: true,
    loginAlerts: true,
    sessionTimeout: '30',
    requireAdminAuth: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = () => {
    /*
     * UI-only for now.
     *
     * Backend persistence will be connected during
     * the security/backend phase.
     */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    setSettings({
      adminName: 'Administrator',
      adminEmail: '',
      emailNotifications: true,
      securityAlerts: true,
      loginAlerts: true,
      sessionTimeout: '30',
      requireAdminAuth: true,
      maintenanceMode: false,
    });

    setSaved(false);
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <AdminLayout currentPage="Settings">

      <div className="admin-page admin-settings-page">

        {/* ===================================================
            HEADER
            =================================================== */}

        <div className="admin-users-header">

          <div>

            <span className="admin-dashboard-eyebrow">
              SYSTEM SETTINGS
            </span>

            <h1>
              Settings
            </h1>

            <p>
              Manage administrator preferences, security,
              notifications, and system configuration.
            </p>

          </div>

          <div className="admin-settings-header-actions">

            <button
              type="button"
              className="admin-settings-reset-button"
              onClick={handleReset}
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="button"
              className="admin-settings-save-button"
              onClick={handleSave}
            >
              <Save size={15} />
              Save Changes
            </button>

          </div>

        </div>


        {/* ===================================================
            SUCCESS MESSAGE
            =================================================== */}

        {saved && (

          <div className="admin-settings-success">

            <CheckCircle2 size={17} />

            <span>
              Settings saved successfully.
            </span>

          </div>

        )}


        {/* ===================================================
            ADMINISTRATOR PROFILE
            =================================================== */}

        <div className="admin-card admin-settings-card">

          <div className="admin-card-header">

            <div className="admin-settings-section-heading">

              <div className="admin-settings-section-icon">
                <User size={19} />
              </div>

              <div>

                <span className="admin-dashboard-eyebrow">
                  ADMINISTRATOR
                </span>

                <h2>
                  Administrator Profile
                </h2>

                <p>
                  Manage the administrator information
                  associated with this console.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-settings-form">

            <div className="admin-settings-field">

              <label>
                Administrator Name
              </label>

              <input
                type="text"
                value={settings.adminName}
                onChange={(event) =>
                  handleChange(
                    'adminName',
                    event.target.value
                  )
                }
                placeholder="Administrator name"
              />

            </div>


            <div className="admin-settings-field">

              <label>
                Administrator Email
              </label>

              <input
                type="email"
                value={settings.adminEmail}
                onChange={(event) =>
                  handleChange(
                    'adminEmail',
                    event.target.value
                  )
                }
                placeholder="admin@example.com"
              />

            </div>

          </div>

        </div>


        {/* ===================================================
            SECURITY
            =================================================== */}

        <div className="admin-card admin-settings-card">

          <div className="admin-card-header">

            <div className="admin-settings-section-heading">

              <div className="admin-settings-section-icon">
                <ShieldCheck size={19} />
              </div>

              <div>

                <span className="admin-dashboard-eyebrow">
                  SECURITY
                </span>

                <h2>
                  Security &amp; Authentication
                </h2>

                <p>
                  Control administrator authentication
                  and security-related behavior.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-settings-options">

            {/* ADMIN AUTH */}

            <div className="admin-settings-option">

              <div className="admin-settings-option-content">

                <div className="admin-settings-option-icon">
                  <LockKeyhole size={17} />
                </div>

                <div>

                  <strong>
                    Require administrator authentication
                  </strong>

                  <span>
                    Require authentication before accessing
                    protected admin pages.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.requireAdminAuth
                    ? 'admin-settings-toggle active'
                    : 'admin-settings-toggle'
                }
                onClick={() =>
                  handleChange(
                    'requireAdminAuth',
                    !settings.requireAdminAuth
                  )
                }
                aria-label="Toggle administrator authentication"
              >

                <span />

              </button>

            </div>


            {/* LOGIN ALERTS */}

            <div className="admin-settings-option">

              <div className="admin-settings-option-content">

                <div className="admin-settings-option-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <strong>
                    Administrator login alerts
                  </strong>

                  <span>
                    Receive an alert when an administrator
                    signs into the console.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.loginAlerts
                    ? 'admin-settings-toggle active'
                    : 'admin-settings-toggle'
                }
                onClick={() =>
                  handleChange(
                    'loginAlerts',
                    !settings.loginAlerts
                  )
                }
                aria-label="Toggle login alerts"
              >

                <span />

              </button>

            </div>


            {/* SESSION TIMEOUT */}

            <div className="admin-settings-option">

              <div className="admin-settings-option-content">

                <div className="admin-settings-option-icon">
                  <LockKeyhole size={17} />
                </div>

                <div>

                  <strong>
                    Session timeout
                  </strong>

                  <span>
                    Automatically expire inactive administrator
                    sessions after the selected period.
                  </span>

                </div>

              </div>


              <select
                value={settings.sessionTimeout}
                onChange={(event) =>
                  handleChange(
                    'sessionTimeout',
                    event.target.value
                  )
                }
                className="admin-settings-select-small"
              >
                <option value="15">
                  15 minutes
                </option>

                <option value="30">
                  30 minutes
                </option>

                <option value="60">
                  1 hour
                </option>

                <option value="120">
                  2 hours
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* ===================================================
            NOTIFICATIONS
            =================================================== */}

        <div className="admin-card admin-settings-card">

          <div className="admin-card-header">

            <div className="admin-settings-section-heading">

              <div className="admin-settings-section-icon">
                <Bell size={19} />
              </div>

              <div>

                <span className="admin-dashboard-eyebrow">
                  NOTIFICATIONS
                </span>

                <h2>
                  Notification Preferences
                </h2>

                <p>
                  Choose which administrator notifications
                  should be enabled.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-settings-options">

            {/* EMAIL NOTIFICATIONS */}

            <div className="admin-settings-option">

              <div className="admin-settings-option-content">

                <div className="admin-settings-option-icon">
                  <Bell size={17} />
                </div>

                <div>

                  <strong>
                    Email notifications
                  </strong>

                  <span>
                    Receive important administrator
                    notifications by email.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.emailNotifications
                    ? 'admin-settings-toggle active'
                    : 'admin-settings-toggle'
                }
                onClick={() =>
                  handleChange(
                    'emailNotifications',
                    !settings.emailNotifications
                  )
                }
                aria-label="Toggle email notifications"
              >

                <span />

              </button>

            </div>


            {/* SECURITY ALERTS */}

            <div className="admin-settings-option">

              <div className="admin-settings-option-content">

                <div className="admin-settings-option-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <strong>
                    Security alerts
                  </strong>

                  <span>
                    Receive notifications about important
                    security events.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.securityAlerts
                    ? 'admin-settings-toggle active'
                    : 'admin-settings-toggle'
                }
                onClick={() =>
                  handleChange(
                    'securityAlerts',
                    !settings.securityAlerts
                  )
                }
                aria-label="Toggle security alerts"
              >

                <span />

              </button>

            </div>

          </div>

        </div>


        {/* ===================================================
            SYSTEM PREFERENCES
            =================================================== */}

        <div className="admin-card admin-settings-card">

          <div className="admin-card-header">

            <div className="admin-settings-section-heading">

              <div className="admin-settings-section-icon">
                <Settings2 size={19} />
              </div>

              <div>

                <span className="admin-dashboard-eyebrow">
                  SYSTEM
                </span>

                <h2>
                  System Preferences
                </h2>

                <p>
                  Configure general administrator console
                  behavior.
                </p>

              </div>

            </div>

          </div>


          <div className="admin-settings-options">

            {/* MAINTENANCE MODE */}

            <div className="admin-settings-option">

              <div className="admin-settings-option-content">

                <div className="admin-settings-option-icon">
                  <Settings2 size={17} />
                </div>

                <div>

                  <strong>
                    Maintenance mode
                  </strong>

                  <span>
                    Place the platform into maintenance mode.
                    This setting will be connected to the
                    backend later.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.maintenanceMode
                    ? 'admin-settings-toggle active'
                    : 'admin-settings-toggle'
                }
                onClick={() =>
                  handleChange(
                    'maintenanceMode',
                    !settings.maintenanceMode
                  )
                }
                aria-label="Toggle maintenance mode"
              >

                <span />

              </button>

            </div>

          </div>

        </div>


        {/* ===================================================
            SECURITY NOTICE
            =================================================== */}

        <div className="admin-settings-security-notice">

          <ShieldCheck size={20} />

          <div>

            <strong>
              Administrator Security
            </strong>

            <p>
              Security-sensitive settings will be connected
              to the protected backend during the final
              security-hardening phase.
            </p>

          </div>

        </div>


        {/* ===================================================
            SETTINGS CSS
            =================================================== */}

        <style>{`

          /* =================================================
             PAGE
             ================================================= */

          .admin-settings-page {
            width: 100%;
          }


          /* =================================================
             HEADER ACTIONS
             ================================================= */

          .admin-settings-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }


          .admin-settings-reset-button,
          .admin-settings-save-button {

            height: 40px;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            gap: 8px;

            padding: 0 15px;

            border-radius: 9px;

            font-size: 11px;
            font-weight: 700;

            cursor: pointer;

            transition:
              background 0.2s ease,
              border-color 0.2s ease,
              transform 0.2s ease;

          }


          .admin-settings-reset-button {

            border:
              1px solid #27324d;

            background:
              #0d1628;

            color:
              #a9b7d0;

          }


          .admin-settings-reset-button:hover {

            border-color:
              #3a4968;

            background:
              #111d31;

          }


          .admin-settings-save-button {

            border:
              1px solid #3445b8;

            background:
              linear-gradient(
                135deg,
                #4f46e5,
                #6366f1
              );

            color:
              #ffffff;

          }


          .admin-settings-save-button:hover {

            transform:
              translateY(-1px);

            box-shadow:
              0 8px 22px
              rgba(79, 70, 229, 0.2);

          }


          /* =================================================
             SUCCESS
             ================================================= */

          .admin-settings-success {

            display: flex;
            align-items: center;

            gap: 9px;

            margin-bottom: 18px;

            padding:
              12px 15px;

            border:
              1px solid rgba(34, 197, 94, 0.22);

            border-radius: 10px;

            background:
              rgba(34, 197, 94, 0.07);

            color:
              #86efac;

            font-size: 11px;
            font-weight: 650;

          }


          /* =================================================
             CARDS
             ================================================= */

          .admin-settings-page
          .admin-settings-card {

            margin-bottom: 20px;

            overflow: hidden;

            background:
              linear-gradient(
                145deg,
                #0d1729,
                #0a1220
              );

            border:
              1px solid #1d2b45;

            border-radius: 16px;

          }


          /* =================================================
             SECTION HEADING
             ================================================= */

          .admin-settings-section-heading {

            display: flex;
            align-items: flex-start;

            gap: 13px;

          }


          .admin-settings-section-icon {

            width: 38px;
            height: 38px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border:
              1px solid #273b72;

            border-radius: 10px;

            background:
              rgba(79, 70, 229, 0.09);

            color:
              #8fa4ff;

          }


          /* =================================================
             FORM
             ================================================= */

          .admin-settings-form {

            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 18px;

            padding: 22px 24px;

          }


          .admin-settings-field {

            display: flex;

            flex-direction: column;

            gap: 8px;

          }


          .admin-settings-field label {

            color:
              #7186aa;

            font-size: 10px;

            font-weight: 800;

            letter-spacing: 1px;

            text-transform: uppercase;

          }


          .admin-settings-field input {

            width: 100%;

            height: 42px;

            box-sizing: border-box;

            padding:
              0 13px;

            border:
              1px solid #263650;

            border-radius: 9px;

            outline: none;

            background:
              #0a1324;

            color:
              #e5ecfa;

            font-size: 12px;

            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease;

          }


          .admin-settings-field input::placeholder {

            color:
              #435572;

          }


          .admin-settings-field input:focus {

            border-color:
              #5668e8;

            box-shadow:
              0 0 0 3px
              rgba(86, 104, 232, 0.09);

          }


          /* =================================================
             OPTIONS
             ================================================= */

          .admin-settings-options {

            width: 100%;

          }


          .admin-settings-option {

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


          .admin-settings-option-content {

            display: flex;

            align-items: center;

            gap: 13px;

            min-width: 0;

          }


          .admin-settings-option-icon {

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


          .admin-settings-option-content strong {

            display: block;

            color:
              #e5ebf8;

            font-size: 12px;

            font-weight: 700;

          }


          .admin-settings-option-content span {

            display: block;

            margin-top: 4px;

            color:
              #617494;

            font-size: 10px;

            line-height: 1.5;

          }


          /* =================================================
             TOGGLE
             ================================================= */

          .admin-settings-toggle {

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

            transition:
              background 0.2s ease;

          }


          .admin-settings-toggle span {

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


          .admin-settings-toggle.active {

            background:
              #4f46e5;

          }


          .admin-settings-toggle.active span {

            background:
              #ffffff;

            transform:
              translateX(19px);

          }


          /* =================================================
             SELECT
             ================================================= */

          .admin-settings-select-small {

            min-width: 145px;

            height: 38px;

            padding:
              0 11px;

            border:
              1px solid #263650;

            border-radius: 8px;

            outline: none;

            background:
              #0a1324;

            color:
              #cdd8eb;

            font-size: 11px;

            cursor: pointer;

          }


          .admin-settings-select-small:focus {

            border-color:
              #5668e8;

          }


          /* =================================================
             SECURITY NOTICE
             ================================================= */

          .admin-settings-security-notice {

            display: flex;

            align-items: flex-start;

            gap: 12px;

            margin-top: 4px;
            margin-bottom: 20px;

            padding:
              17px 20px;

            border:
              1px solid #263650;

            border-radius: 12px;

            background:
              rgba(15, 23, 42, 0.55);

            color:
              #8197bd;

          }


          .admin-settings-security-notice svg {

            flex-shrink: 0;

            color:
              #7f94ff;

          }


          .admin-settings-security-notice strong {

            display: block;

            color:
              #dce5f6;

            font-size: 11px;

          }


          .admin-settings-security-notice p {

            margin:
              5px 0 0;

            color:
              #617494;

            font-size: 10px;

            line-height: 1.5;

          }


          /* =================================================
             RESPONSIVE
             ================================================= */

          @media (max-width: 800px) {

            .admin-settings-header-actions {

              margin-top: 15px;

            }


            .admin-settings-form {

              grid-template-columns: 1fr;

            }


            .admin-settings-option {

              align-items: flex-start;

            }

          }


          @media (max-width: 600px) {

            .admin-settings-header-actions {

              width: 100%;

            }


            .admin-settings-reset-button,
            .admin-settings-save-button {

              flex: 1;

            }


            .admin-settings-form {

              padding:
                18px;

            }


            .admin-settings-option {

              padding:
                15px 18px;

            }


            .admin-settings-select-small {

              min-width: 125px;

            }

          }

        `}</style>

      </div>

    </AdminLayout>
  );
};

export default AdminSettings;