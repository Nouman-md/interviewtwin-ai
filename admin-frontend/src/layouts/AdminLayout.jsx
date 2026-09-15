import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Video,
  Code2,
  Brain,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

import { useAdminAuth } from '../context/AdminAuthContext';

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    path: '/users',
    icon: Users,
  },
  {
    name: 'Interviews',
    path: '/interviews',
    icon: Video,
  },
  {
    name: 'Coding Questions',
    path: '/coding-questions',
    icon: Code2,
  },
  {
    name: 'Aptitude',
    path: '/aptitude',
    icon: Brain,
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: FileText,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
  },
];

const AdminLayout = ({
  children,
  currentPage = 'Dashboard',
}) => {

  const { admin, logout } = useAdminAuth();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="admin-layout">

      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? 'admin-sidebar-open'
            : ''
        }`}
      >

        {/* Sidebar Header */}

        <div className="admin-sidebar-header">

          <div className="admin-sidebar-brand">

            <div className="admin-sidebar-logo">
              <ShieldCheck size={21} />
            </div>

            <div className="admin-sidebar-brand-text">

              <span className="admin-sidebar-brand-name">
                InterviewTwinAI
              </span>

              <span className="admin-sidebar-brand-label">
                ADMIN CONSOLE
              </span>

            </div>

          </div>


          {/* Mobile Close */}

          <button
            className="admin-mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close sidebar"
            type="button"
          >
            <X size={20} />
          </button>

        </div>


        {/* ===================================================
            NAVIGATION
            =================================================== */}

        <nav className="admin-navigation">

          <div className="admin-navigation-section">

            <span className="admin-navigation-title">
              MAIN
            </span>


            {navigation.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-nav-item ${
                      isActive
                        ? 'admin-nav-item-active'
                        : ''
                    }`
                  }
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                >

                  <Icon size={19} />

                  <span>
                    {item.name}
                  </span>


                  {/* Active Arrow */}

                  <span className="admin-nav-arrow-wrapper">

                    <ChevronRight
                      size={15}
                      className="admin-nav-active-arrow"
                    />

                  </span>

                </NavLink>
              );

            })}

          </div>


          {/* =================================================
              SYSTEM
              ================================================= */}

          <div className="admin-navigation-section admin-navigation-system">

            <span className="admin-navigation-title">
              SYSTEM
            </span>


            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `admin-nav-item ${
                  isActive
                    ? 'admin-nav-item-active'
                    : ''
                }`
              }
              onClick={() =>
                setSidebarOpen(false)
              }
            >

              <Settings size={19} />

              <span>
                Settings
              </span>


              <span className="admin-nav-arrow-wrapper">

                <ChevronRight
                  size={15}
                  className="admin-nav-active-arrow"
                />

              </span>

            </NavLink>

          </div>

        </nav>


        {/* =====================================================
            SIDEBAR BOTTOM
            ===================================================== */}

        <div className="admin-sidebar-bottom">

      <NavLink
  to="/secure-console"
  className={({ isActive }) =>
    `admin-sidebar-security ${
      isActive
        ? 'admin-sidebar-security-active'
        : ''
    }`
  }
  onClick={() =>
    setSidebarOpen(false)
}
>
  <ShieldCheck size={16} />

  <div>

    <strong>
      Secure Console
    </strong>

    <span>
      Administrator access
    </span>

  </div>

</NavLink>

          {/* Logout */}

          <button
            className="admin-logout-button"
            onClick={handleLogout}
            type="button"
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
          ===================================================== */}

      <div className="admin-main">


        {/* ===================================================
            TOPBAR
            =================================================== */}

        <header className="admin-topbar">


          {/* Mobile Menu */}

          <button
            className="admin-mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open sidebar"
            type="button"
          >

            <Menu size={22} />

          </button>


          {/* Breadcrumb */}

          <div className="admin-topbar-left">

            <span className="admin-topbar-label">
              Administration
            </span>

            <span className="admin-topbar-separator">
              /
            </span>

            <span className="admin-topbar-page">
              {currentPage}
            </span>

          </div>


          {/* Topbar Right */}

          <div className="admin-topbar-right">


            {/* System Status */}

            <div className="admin-topbar-status">

              <span className="admin-status-dot"></span>

              System Online

            </div>


            {/* Admin Profile */}

            <div className="admin-profile">

              <div className="admin-profile-avatar">

                {admin?.firstName
                  ?.charAt(0)
                  ?.toUpperCase() || 'A'}

              </div>


              <div className="admin-profile-info">

                <strong>
                  {admin?.firstName ||
                    'Administrator'}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
            =================================================== */}

        <main className="admin-content">

          {children}

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;