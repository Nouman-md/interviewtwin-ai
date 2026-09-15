import React, { useEffect, useMemo, useState } from 'react';

import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail,
  CalendarDays,
  ChevronRight,
  UserRound,
  Phone,
  BriefcaseBusiness,
  Target,
  Clock3,
  Power,
  BadgeCheck,
  AlertTriangle,
  X,
} from 'lucide-react';

import AdminLayout from '../layouts/AdminLayout';
import { adminUsersAPI } from '../services/api';


const AdminUsers = () => {

  // =========================================================
  // STATE
  // =========================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedUser, setSelectedUser] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [actionError, setActionError] = useState(null);

  const [actionSuccess, setActionSuccess] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null);


  // =========================================================
  // FETCH USERS
  // =========================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);
      setError(null);

      const response =
        await adminUsersAPI.getAllUsers();

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (err) {

      console.error(
        'Failed to load users:',
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
          'Unable to load users from the server.'
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

    fetchUsers();

  }, []);


  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers = useMemo(() => {

    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return users.filter((user) => {

      const matchesSearch =
        !normalizedSearch ||
        [
          user.fullName,
          user.firstName,
          user.lastName,
          user.email,
          user.currentRole,
          user.targetRole,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(normalizedSearch)
          );


      let matchesStatus = true;


      if (statusFilter === 'ACTIVE') {

        matchesStatus =
          user.isActive === true;

      }


      if (statusFilter === 'INACTIVE') {

        matchesStatus =
          user.isActive === false;

      }


      if (statusFilter === 'VERIFIED') {

        matchesStatus =
          user.isVerified === true;

      }


      if (statusFilter === 'UNVERIFIED') {

        matchesStatus =
          user.isVerified === false;

      }


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    users,
    searchTerm,
    statusFilter,
  ]);


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {

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


  // =========================================================
  // FORMAT DATE TIME
  // =========================================================

  const formatDateTime = (dateValue) => {

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


  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (user) => {

    const first =
      user?.firstName?.charAt(0) || '';

    const last =
      user?.lastName?.charAt(0) || '';

    const initials =
      `${first}${last}`.trim();

    return initials
      ? initials.toUpperCase()
      : 'U';

  };


  // =========================================================
  // PRIMARY ROLE
  // =========================================================

  const getPrimaryRole = (user) => {

    if (!Array.isArray(user?.roles)) {
      return 'USER';
    }

    if (
      user.roles.includes('ADMIN')
    ) {
      return 'ADMIN';
    }

    return user.roles[0] || 'USER';

  };


  // =========================================================
  // COUNTS
  // =========================================================

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (user) =>
        user.isActive === true
    ).length;

  const verifiedUsers =
    users.filter(
      (user) =>
        user.isVerified === true
    ).length;

  const adminUsers =
    users.filter(
      (user) =>
        Array.isArray(user.roles) &&
        user.roles.includes('ADMIN')
    ).length;


  // =========================================================
  // OPEN USER DETAILS
  // =========================================================

  const openUserDetails = (user) => {

    setSelectedUser(user);

    setActionError(null);

    setActionSuccess(null);

  };


  // =========================================================
  // CLOSE USER DETAILS
  // =========================================================

  const closeUserDetails = () => {

    if (actionLoading) {
      return;
    }

    setSelectedUser(null);

    setActionError(null);

    setActionSuccess(null);

  };


  // =========================================================
  // REQUEST ACTION
  // =========================================================

  const requestAction = (
    action,
    user
  ) => {

    setActionError(null);

    setActionSuccess(null);

    setConfirmAction({
      action,
      user,
    });

  };


  // =========================================================
  // CANCEL ACTION
  // =========================================================

  const cancelAction = () => {

    if (actionLoading) {
      return;
    }

    setConfirmAction(null);

  };


  // =========================================================
  // EXECUTE ADMIN ACTION
  // =========================================================

  const executeAction = async () => {

    if (!confirmAction) {
      return;
    }

    const {
      action,
      user,
    } = confirmAction;


    try {

      setActionLoading(true);

      setActionError(null);

      setActionSuccess(null);


      let response;


      // -------------------------------------------------------
      // ACTIVATE
      // -------------------------------------------------------

      if (action === 'ACTIVATE') {

        response =
          await adminUsersAPI.activateUser(
            user.userId
          );

      }


      // -------------------------------------------------------
      // DEACTIVATE
      // -------------------------------------------------------

      if (action === 'DEACTIVATE') {

        response =
          await adminUsersAPI.deactivateUser(
            user.userId
          );

      }


      // -------------------------------------------------------
      // VERIFY
      // -------------------------------------------------------

      if (action === 'VERIFY') {

        response =
          await adminUsersAPI.verifyUser(
            user.userId
          );

      }


      // -------------------------------------------------------
      // UNVERIFY
      // -------------------------------------------------------

      if (action === 'UNVERIFY') {

        response =
          await adminUsersAPI.unverifyUser(
            user.userId
          );

      }


      const updatedUser =
        response?.data;


      // -------------------------------------------------------
      // UPDATE USER LIST
      // -------------------------------------------------------

      if (updatedUser) {

        setUsers(
          (currentUsers) =>
            currentUsers.map(
              (currentUser) =>
                currentUser.userId ===
                updatedUser.userId
                  ? updatedUser
                  : currentUser
            )
        );


        // Update modal

        if (
          selectedUser?.userId ===
          updatedUser.userId
        ) {

          setSelectedUser(
            updatedUser
          );

        }

      } else {

        // Fallback refresh if backend
        // does not return the updated user.

        await fetchUsers();

      }


      // -------------------------------------------------------
      // SUCCESS MESSAGE
      // -------------------------------------------------------

      const messages = {

        ACTIVATE:
          'User account activated successfully.',

        DEACTIVATE:
          'User account deactivated successfully.',

        VERIFY:
          'User verified successfully.',

        UNVERIFY:
          'User verification removed successfully.',

      };


      setActionSuccess(
        messages[action] ||
        'Action completed successfully.'
      );


      setConfirmAction(null);


    } catch (err) {

      console.error(
        'Admin user action failed:',
        err
      );


      if (
        err.response?.status === 401
      ) {

        setActionError(
          'Your admin session has expired. Please login again.'
        );

      } else if (
        err.response?.status === 403
      ) {

        setActionError(
          'Administrator access is required.'
        );

      } else if (
        err.response?.data?.message
      ) {

        setActionError(
          err.response.data.message
        );

      } else {

        setActionError(
          'Unable to complete this action. Please try again.'
        );

      }

    } finally {

      setActionLoading(false);

    }

  };


  // =========================================================
  // CONFIRMATION DETAILS
  // =========================================================

  const getActionDetails = () => {

    if (!confirmAction) {
      return null;
    }

    const {
      action,
      user,
    } = confirmAction;


    const name =
      user.fullName ||
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      'this user';


    const details = {

      ACTIVATE: {

        title:
          'Activate User',

        description:
          `Are you sure you want to activate ${name}'s account?`,

        button:
          'Activate User',

        className:
          'admin-confirm-positive',

      },


      DEACTIVATE: {

        title:
          'Deactivate User',

        description:
          `Are you sure you want to deactivate ${name}'s account?`,

        button:
          'Deactivate User',

        className:
          'admin-confirm-danger',

      },


      VERIFY: {

        title:
          'Verify User',

        description:
          `Are you sure you want to verify ${name}'s account?`,

        button:
          'Verify User',

        className:
          'admin-confirm-positive',

      },


      UNVERIFY: {

        title:
          'Remove Verification',

        description:
          `Are you sure you want to remove verification from ${name}'s account?`,

        button:
          'Remove Verification',

        className:
          'admin-confirm-danger',

      },

    };


    return details[action];

  };


  const confirmationDetails =
    getActionDetails();


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <AdminLayout
      currentPage="Users"
    >


      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="admin-users-header">

        <div>

          <span className="admin-dashboard-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            Manage and monitor InterviewTwinAI accounts.
          </p>

        </div>


        <button
          className="admin-users-refresh"
          onClick={fetchUsers}
          disabled={
            loading ||
            actionLoading
          }
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
          SUMMARY CARDS
          ===================================================== */}

      <div className="admin-users-summary">


        {/* TOTAL */}

        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon">

            <Users size={19} />

          </div>

          <div>

            <span>
              TOTAL USERS
            </span>

            <strong>
              {loading
                ? '...'
                : totalUsers}
            </strong>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-active">

            <CheckCircle2 size={19} />

          </div>

          <div>

            <span>
              ACTIVE
            </span>

            <strong>
              {loading
                ? '...'
                : activeUsers}
            </strong>

          </div>

        </div>


        {/* VERIFIED */}

        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-verified">

            <ShieldCheck size={19} />

          </div>

          <div>

            <span>
              VERIFIED
            </span>

            <strong>
              {loading
                ? '...'
                : verifiedUsers}
            </strong>

          </div>

        </div>


        {/* ADMINS */}

        <div className="admin-users-summary-card">

          <div className="admin-users-summary-icon admin-users-summary-admin">

            <UserRound size={19} />

          </div>

          <div>

            <span>
              ADMINS
            </span>

            <strong>
              {loading
                ? '...'
                : adminUsers}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          PAGE ERROR
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
            onClick={fetchUsers}
            type="button"
          >

            <RefreshCw size={13} />

            Retry

          </button>

        </div>

      )}


      {/* =====================================================
          ACTION SUCCESS
          ===================================================== */}

      {actionSuccess && (

        <div className="admin-action-success">

          <CheckCircle2 size={16} />

          <span>
            {actionSuccess}
          </span>

          <button
            type="button"
            onClick={() =>
              setActionSuccess(null)
            }
            aria-label="Close success message"
          >
            ×
          </button>

        </div>

      )}


      {/* =====================================================
          ACTION ERROR
          ===================================================== */}

      {actionError && (

        <div className="admin-action-error">

          <AlertTriangle size={16} />

          <span>
            {actionError}
          </span>

          <button
            type="button"
            onClick={() =>
              setActionError(null)
            }
            aria-label="Close error message"
          >
            ×
          </button>

        </div>

      )}


      {/* =====================================================
          USERS PANEL
          ===================================================== */}

      <section className="admin-users-panel">


        {/* ===================================================
            TOOLBAR
            =================================================== */}

        <div className="admin-users-toolbar">

          <div className="admin-users-toolbar-title">

            <div>

              <span className="admin-panel-eyebrow">
                ACCOUNTS
              </span>

              <h2>
                All Users
              </h2>

            </div>

            <span className="admin-users-count">
              {filteredUsers.length}
            </span>

          </div>


          <div className="admin-users-toolbar-controls">


            {/* SEARCH */}

            <div className="admin-users-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search users..."
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


            {/* FILTER */}

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

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

              <option value="VERIFIED">
                Verified
              </option>

              <option value="UNVERIFIED">
                Unverified
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
              Loading users...
            </p>

          </div>

        )}


        {/* ===================================================
            EMPTY
            =================================================== */}

        {!loading &&
          !error &&
          filteredUsers.length === 0 && (

            <div className="admin-users-empty">

              <div className="admin-users-empty-icon">

                <Users size={22} />

              </div>

              <h3>
                No users found
              </h3>

              <p>
                Try changing your search or filter.
              </p>

            </div>

          )}


        {/* ===================================================
            TABLE
            =================================================== */}

        {!loading &&
          !error &&
          filteredUsers.length > 0 && (

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>

                  <tr>

                    <th>
                      USER
                    </th>

                    <th>
                      ROLE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      VERIFICATION
                    </th>

                    <th>
                      REGISTERED
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredUsers.map(
                    (user) => {

                      const primaryRole =
                        getPrimaryRole(user);


                      return (

                        <tr
                          key={user.userId}
                        >


                          {/* USER */}

                          <td>

                            <div className="admin-user-cell">

                              <div className="admin-user-avatar">

                                {getInitials(user)}

                              </div>


                              <div className="admin-user-identity">

                                <strong>

                                  {user.fullName ||
                                    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                    'Unnamed User'}

                                </strong>

                                <span>

                                  <Mail size={11} />

                                  {user.email}

                                </span>

                              </div>

                            </div>

                          </td>


                          {/* ROLE */}

                          <td>

                            <span
                              className={
                                `admin-role-badge ${
                                  primaryRole === 'ADMIN'
                                    ? 'admin-role-admin'
                                    : 'admin-role-user'
                                }`
                              }
                            >

                              {primaryRole === 'ADMIN' && (

                                <ShieldCheck
                                  size={12}
                                />

                              )}

                              {primaryRole}

                            </span>

                          </td>


                          {/* STATUS */}

                          <td>

                            {user.isActive ? (

                              <span className="admin-status-badge admin-status-active">

                                <span className="admin-status-small-dot"></span>

                                Active

                              </span>

                            ) : (

                              <span className="admin-status-badge admin-status-inactive">

                                <span className="admin-status-small-dot"></span>

                                Inactive

                              </span>

                            )}

                          </td>


                          {/* VERIFICATION */}

                          <td>

                            {user.isVerified ? (

                              <span className="admin-verification-badge admin-verification-verified">

                                <CheckCircle2
                                  size={13}
                                />

                                Verified

                              </span>

                            ) : (

                              <span className="admin-verification-badge admin-verification-unverified">

                                <XCircle
                                  size={13}
                                />

                                Unverified

                              </span>

                            )}

                          </td>


                          {/* REGISTERED */}

                          <td>

                            <div className="admin-date-cell">

                              <CalendarDays
                                size={13}
                              />

                              {formatDate(
                                user.createdAt
                              )}

                            </div>

                          </td>


                          {/* ACTION */}

                          <td>

                            <button
                              className="admin-user-view-button"
                              type="button"
                              onClick={() =>
                                openUserDetails(
                                  user
                                )
                              }
                            >

                              View

                              <ChevronRight
                                size={14}
                              />

                            </button>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

      </section>


      {/* =====================================================
          USER DETAILS MODAL
          ===================================================== */}

      {selectedUser && (

        <div
          className="admin-user-modal-backdrop"
          onMouseDown={(event) => {

            if (
              event.target ===
                event.currentTarget &&
              !actionLoading
            ) {

              closeUserDetails();

            }

          }}
        >

          <div
            className="admin-user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-user-modal-title"
          >


            {/* =================================================
                MODAL HEADER
                ================================================= */}

            <div className="admin-user-modal-header">

              <div>

                <span className="admin-panel-eyebrow">
                  USER PROFILE
                </span>

                <h2 id="admin-user-modal-title">
                  Account Details
                </h2>

              </div>


              <button
                className="admin-user-modal-close"
                onClick={closeUserDetails}
                type="button"
                aria-label="Close user details"
                disabled={actionLoading}
              >

                <X size={18} />

              </button>

            </div>


            {/* =================================================
                PROFILE
                ================================================= */}

            <div className="admin-user-modal-profile">

              <div className="admin-user-modal-avatar">

                {getInitials(
                  selectedUser
                )}

              </div>


              <div>

                <h3>

                  {selectedUser.fullName ||
                    `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() ||
                    'Unnamed User'}

                </h3>

                <p>

                  <Mail size={13} />

                  {selectedUser.email}

                </p>

              </div>

            </div>


            {/* =================================================
                STATUS ROW
                ================================================= */}

            <div className="admin-user-modal-status-row">


              {/* ACCOUNT */}

              <div className="admin-user-modal-status-card">

                <span>
                  ACCOUNT
                </span>

                <strong
                  className={
                    selectedUser.isActive
                      ? 'admin-modal-positive'
                      : 'admin-modal-negative'
                  }
                >

                  {selectedUser.isActive
                    ? 'Active'
                    : 'Inactive'}

                </strong>

              </div>


              {/* VERIFICATION */}

              <div className="admin-user-modal-status-card">

                <span>
                  VERIFICATION
                </span>

                <strong
                  className={
                    selectedUser.isVerified
                      ? 'admin-modal-positive'
                      : 'admin-modal-negative'
                  }
                >

                  {selectedUser.isVerified
                    ? 'Verified'
                    : 'Unverified'}

                </strong>

              </div>


              {/* ROLE */}

              <div className="admin-user-modal-status-card">

                <span>
                  ROLE
                </span>

                <strong>
                  {getPrimaryRole(
                    selectedUser
                  )}
                </strong>

              </div>

            </div>


            {/* =================================================
                USER INFORMATION
                ================================================= */}

            <div className="admin-user-modal-details">


              {/* FIRST NAME */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <UserRound size={16} />

                </div>

                <div>

                  <span>
                    FIRST NAME
                  </span>

                  <strong>
                    {selectedUser.firstName ||
                      '—'}
                  </strong>

                </div>

              </div>


              {/* LAST NAME */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <UserRound size={16} />

                </div>

                <div>

                  <span>
                    LAST NAME
                  </span>

                  <strong>
                    {selectedUser.lastName ||
                      '—'}
                  </strong>

                </div>

              </div>


              {/* PHONE */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <Phone size={16} />

                </div>

                <div>

                  <span>
                    PHONE
                  </span>

                  <strong>
                    {selectedUser.phone ||
                      '—'}
                  </strong>

                </div>

              </div>


              {/* CURRENT ROLE */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <BriefcaseBusiness
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    CURRENT ROLE
                  </span>

                  <strong>
                    {selectedUser.currentRole ||
                      '—'}
                  </strong>

                </div>

              </div>


              {/* TARGET ROLE */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <Target size={16} />

                </div>

                <div>

                  <span>
                    TARGET ROLE
                  </span>

                  <strong>
                    {selectedUser.targetRole ||
                      '—'}
                  </strong>

                </div>

              </div>


              {/* EXPERIENCE */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <Clock3 size={16} />

                </div>

                <div>

                  <span>
                    EXPERIENCE
                  </span>

                  <strong>
                    {selectedUser.yearsOfExperience ??
                      0}{' '}
                    {selectedUser.yearsOfExperience === 1
                      ? 'year'
                      : 'years'}
                  </strong>

                </div>

              </div>


              {/* REGISTERED */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <CalendarDays size={16} />

                </div>

                <div>

                  <span>
                    REGISTERED
                  </span>

                  <strong>
                    {formatDate(
                      selectedUser.createdAt
                    )}
                  </strong>

                </div>

              </div>


              {/* LAST LOGIN */}

              <div className="admin-user-modal-detail">

                <div className="admin-user-modal-detail-icon">

                  <Clock3 size={16} />

                </div>

                <div>

                  <span>
                    LAST LOGIN
                  </span>

                  <strong>
                    {formatDateTime(
                      selectedUser.lastLogin
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* =================================================
                ADMIN ACTIONS
                ================================================= */}

            <div className="admin-account-actions">


              {/* HEADER */}

              <div className="admin-account-actions-header">

                <span className="admin-account-actions-eyebrow">
                  ADMINISTRATION
                </span>

                <h2>
                  Account Actions
                </h2>

                <p>
                  Manage account access and verification status.
                </p>

              </div>


              {/* ACTION GRID */}

              <div className="admin-account-actions-grid">


                {/* =================================================
                    ACTIVATE / DEACTIVATE
                    ================================================= */}

                <div className="admin-account-action-card">

                  <div className="admin-account-action-icon">

                    <Power size={20} />

                  </div>


                  <div className="admin-account-action-content">

                    <h3>

                      {selectedUser.isActive
                        ? 'Deactivate Account'
                        : 'Activate Account'}

                    </h3>

                    <p>

                      {selectedUser.isActive
                        ? 'Prevent this user from accessing their account.'
                        : 'Restore this user\'s account access.'}

                    </p>

                  </div>


                  <button
                    type="button"
                    className={
                      selectedUser.isActive
                        ? 'admin-account-action-button admin-account-action-button-danger'
                        : 'admin-account-action-button admin-account-action-button-success'
                    }
                    onClick={() =>
                      requestAction(
                        selectedUser.isActive
                          ? 'DEACTIVATE'
                          : 'ACTIVATE',
                        selectedUser
                      )
                    }
                    disabled={actionLoading}
                  >

                    <Power size={14} />

                    <span>

                      {selectedUser.isActive
                        ? 'Deactivate'
                        : 'Activate'}

                    </span>

                  </button>

                </div>


                {/* =================================================
                    VERIFY / UNVERIFY
                    ================================================= */}

                <div className="admin-account-action-card">

                  <div className="admin-account-action-icon">

                    <BadgeCheck size={20} />

                  </div>


                  <div className="admin-account-action-content">

                    <h3>

                      {selectedUser.isVerified
                        ? 'Remove Verification'
                        : 'Verify Account'}

                    </h3>

                    <p>

                      {selectedUser.isVerified
                        ? 'Mark this account as unverified.'
                        : 'Mark this account as verified.'}

                    </p>

                  </div>


                  <button
                    type="button"
                    className={
                      selectedUser.isVerified
                        ? 'admin-account-action-button admin-account-action-button-warning'
                        : 'admin-account-action-button admin-account-action-button-primary'
                    }
                    onClick={() =>
                      requestAction(
                        selectedUser.isVerified
                          ? 'UNVERIFY'
                          : 'VERIFY',
                        selectedUser
                      )
                    }
                    disabled={actionLoading}
                  >

                    <BadgeCheck size={14} />

                    <span>

                      {selectedUser.isVerified
                        ? 'Unverify'
                        : 'Verify'}

                    </span>

                  </button>

                </div>

              </div>

            </div>


            {/* =================================================
                MODAL FOOTER
                ================================================= */}

            <div className="admin-user-modal-footer">

              <button
                type="button"
                className="admin-user-modal-footer-close"
                onClick={closeUserDetails}
                disabled={actionLoading}
              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CONFIRMATION MODAL
          ===================================================== */}

      {confirmAction &&
        confirmationDetails && (

          <div
            className="admin-confirm-backdrop"
            onMouseDown={(event) => {

              if (
                event.target ===
                  event.currentTarget &&
                !actionLoading
              ) {

                cancelAction();

              }

            }}
          >

            <div
              className="admin-confirm-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-confirm-title"
            >


              {/* ICON */}

              <div className="admin-confirm-icon">

                {confirmAction.action ===
                  'DEACTIVATE' ||
                confirmAction.action ===
                  'UNVERIFY' ? (

                  <AlertTriangle
                    size={22}
                  />

                ) : (

                  <ShieldCheck
                    size={22}
                  />

                )}

              </div>


              {/* CONTENT */}

              <div className="admin-confirm-content">

                <h2 id="admin-confirm-title">

                  {confirmationDetails.title}

                </h2>

                <p>

                  {confirmationDetails.description}

                </p>

              </div>


              {/* ACTIONS */}

              <div className="admin-confirm-actions">

                <button
                  type="button"
                  className="admin-confirm-cancel"
                  onClick={cancelAction}
                  disabled={actionLoading}
                >

                  Cancel

                </button>


                <button
                  type="button"
                  className={
                    `admin-confirm-submit ${confirmationDetails.className}`
                  }
                  onClick={executeAction}
                  disabled={actionLoading}
                >

                  {actionLoading
                    ? 'Processing...'
                    : confirmationDetails.button}

                </button>

              </div>

            </div>

          </div>

        )}

    </AdminLayout>

  );

};


export default AdminUsers;