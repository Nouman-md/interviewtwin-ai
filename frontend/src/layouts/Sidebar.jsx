import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';

 import {
  Home,
  LayoutDashboard,
  FileText,
Briefcase,
  Brain,
  Code,
  Calculator,
  BarChart3,
  FileCheck,
  ChevronDown,
  ChevronLeft,
  Sparkles,
  Settings,
  User,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  // =========================================================
  // STATE
  // =========================================================

  const [expandedMenu, setExpandedMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profile, setProfile] = useState(null);

  // =========================================================
  // LOAD PROFILE + PROFILE PICTURE
  // =========================================================

  useEffect(() => {
    loadProfile();
    loadProfilePicture();

    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Sidebar profile loading error:', err);
    }
  };

  const loadProfilePicture = async () => {
    try {
      const response = await userAPI.getProfilePicture();

      const blobUrl = URL.createObjectURL(response.data);

      setProfileImageUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }

        return blobUrl;
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Sidebar profile picture error:', err);
      }

      setProfileImageUrl(null);
    }
  };

  // =========================================================
  // MENU ITEMS
  // =========================================================

  const menuItems = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },

  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
    {
      label: 'Resume',
      icon: FileText,
      submenu: [
        {
          label: 'Upload Resume',
          path: '/resume-upload',
        },
        {
          label: 'ATS Checker',
          path: '/ats-checker',
        },
      ],
    },

    {
      label: 'Job Match',
      icon: Briefcase,
      path: '/job-analyzer',
    },

    {
      label: 'Interview',
      icon: Brain,
      submenu: [
        {
          label: 'Start Interview',
          path: '/interview-selection',
        },
        {
          label: 'Interview History',
          path: '/reports',
        },
      ],
    },

    // =======================================================
    // CODING
    // =======================================================

    {
      label: 'Coding',
      icon: Code,
      path: '/coding-round',
    },

    // =======================================================
    // APTITUDE — SEPARATE SECTION
    // =======================================================

    {
      label: 'Aptitude',
      icon: Calculator,
      path: '/aptitude',
    },

    {
      label: 'Performance',
      icon: BarChart3,
      path: '/performance',
    },

    {
      label: 'Reports',
      icon: FileCheck,
      path: '/reports',
    },

    {
      label: 'Profile',
      icon: User,
      path: '/profile',
    },

    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  // =========================================================
  // ACTIVE CHECKS
  // =========================================================

  const isActive = (path) => location.pathname === path;

  const isSubmenuActive = (submenu) =>
    submenu?.some(
      (item) => location.pathname === item.path
    );

  const toggleSubmenu = (label) => {
    if (collapsed) {
      setCollapsed(false);

      setTimeout(() => {
        setExpandedMenu((current) =>
          current === label ? null : label
        );
      }, 150);

      return;
    }

    setExpandedMenu((current) =>
      current === label ? null : label
    );
  };

  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = () => {
    const first = profile?.firstName?.[0] || '';
    const last = profile?.lastName?.[0] || '';

    return `${first}${last}`.toUpperCase() || 'U';
  };

  // =========================================================
  // SIDEBAR CONTENT
  // =========================================================

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div
        className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
          collapsed && !isMobile
            ? 'px-3'
            : ''
        }`}
      >
        <Link
          to="/dashboard"
          className={`flex items-center ${
            collapsed && !isMobile
              ? 'justify-center'
              : 'gap-2'
          }`}
          onClick={() => setMobileOpen(false)}
          title={
            collapsed && !isMobile
              ? 'InterviewTwin'
              : undefined
          }
        >

          {/* Logo icon */}

          <motion.div
            animate={{
              scale:
                collapsed && !isMobile
                  ? 0.95
                  : 1,
            }}
            transition={{
              duration: 0.2,
            }}
            className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow"
          >
            <Sparkles
              className="text-white"
              size={20}
            />
          </motion.div>

          {/* Logo text */}

          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{
                  opacity: 0,
                  width: 0,
                }}
                animate={{
                  opacity: 1,
                  width: 'auto',
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  InterviewTwin
                </h2>

                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Preparation Platform
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="mt-4 px-3 flex-1 overflow-y-auto">

        {menuItems.map((item) => (
          <div key={item.label}>

            {/* =================================================
                SUBMENU ITEM
            ================================================= */}

            {item.submenu ? (
              <div className="mb-1">

                <button
                  onClick={() =>
                    toggleSubmenu(item.label)
                  }
                  title={
                    collapsed && !isMobile
                      ? item.label
                      : undefined
                  }
                  className={`w-full px-4 py-2.5 flex items-center rounded-xl transition-all duration-200 ${
                    collapsed && !isMobile
                      ? 'justify-center'
                      : 'gap-3'
                  } ${
                    isSubmenuActive(item.submenu)
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >

                  <item.icon
                    size={20}
                    className="flex-shrink-0"
                  />

                  <AnimatePresence>
                    {(!collapsed || isMobile) && (
                      <>
                        <motion.span
                          initial={{
                            opacity: 0,
                            width: 0,
                          }}
                          animate={{
                            opacity: 1,
                            width: 'auto',
                          }}
                          exit={{
                            opacity: 0,
                            width: 0,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          className="flex-1 text-left text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>

                        <motion.div
                          animate={{
                            rotate:
                              expandedMenu === item.label
                                ? 180
                                : 0,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                        >
                          <ChevronDown
                            size={18}
                          />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                </button>

                {/* =================================================
                    SUBMENU
                ================================================== */}

                <AnimatePresence>
                  {expandedMenu === item.label &&
                    (!collapsed || isMobile) && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="overflow-hidden mt-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700"
                      >

                        {item.submenu.map(
                          (subitem) => (
                            <Link
                              key={subitem.path}
                              to={subitem.path}
                              onClick={() =>
                                setMobileOpen(false)
                              }
                              className={`block px-4 py-2 my-0.5 text-sm rounded-lg transition-colors ${
                                isActive(
                                  subitem.path
                                )
                                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {subitem.label}
                            </Link>
                          )
                        )}

                      </motion.div>
                    )}
                </AnimatePresence>

              </div>
            ) : (

              /* =================================================
                 NORMAL MENU ITEM
              ================================================== */

              <Link
                to={item.path}
                onClick={() =>
                  setMobileOpen(false)
                }
                title={
                  collapsed && !isMobile
                    ? item.label
                    : undefined
                }
                className={`px-4 py-2.5 mb-1 flex items-center rounded-xl transition-all duration-200 ${
                  collapsed && !isMobile
                    ? 'justify-center'
                    : 'gap-3'
                } ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >

                <item.icon
                  size={20}
                  className="flex-shrink-0"
                />

                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        width: 0,
                      }}
                      animate={{
                        opacity: 1,
                        width: 'auto',
                      }}
                      exit={{
                        opacity: 0,
                        width: 0,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

              </Link>
            )}

          </div>
        ))}

      </nav>

      {/* =====================================================
          PROFILE CARD
      ====================================================== */}

      <div
        className={`p-3 border-t border-gray-200 dark:border-gray-700 ${
          collapsed && !isMobile
            ? 'px-2'
            : ''
        }`}
      >

        <Link
          to="/profile"
          onClick={() =>
            setMobileOpen(false)
          }
          title={
            collapsed && !isMobile
              ? 'Profile'
              : undefined
          }
          className={`group flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all ${
            collapsed && !isMobile
              ? 'justify-center'
              : 'gap-3'
          }`}
        >

          {/* Profile image */}

          <div className="relative flex-shrink-0">

            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-11 h-11 rounded-xl object-cover border border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                {getInitials()}
              </div>
            )}

            {/* Online indicator */}

            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800" />

          </div>

          {/* Profile information */}

          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{
                  opacity: 0,
                  width: 0,
                }}
                animate={{
                  opacity: 1,
                  width: 'auto',
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
              >

                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {profile?.fullName ||
                    `${profile?.firstName || 'User'} ${
                      profile?.lastName || ''
                    }`}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {profile?.targetRole ||
                    profile?.currentRole ||
                    'View Profile'}
                </p>

              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <User
                  size={16}
                  className="text-gray-400 group-hover:text-primary-500 transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

        </Link>

      </div>

    </div>
  );

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <>
      {/* =====================================================
          MOBILE TOGGLE
      ====================================================== */}

      <button
        onClick={() =>
          setMobileOpen(true)
        }
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded-lg glass text-gray-700 dark:text-gray-200"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <motion.div
        animate={{
          width: collapsed ? 80 : 220,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="hidden md:flex relative bg-white dark:bg-dark-800 h-screen sticky top-0 flex-col border-r border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
      >

        {/* ===================================================
            COLLAPSE BUTTON
        ==================================================== */}

        <button
          onClick={() =>
            setCollapsed((prev) => !prev)
          }
          className="absolute right-3 top-5 z-30 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center justify-center shadow-sm transition-all duration-200"
          aria-label={
            collapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          title={
            collapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >

          <motion.div
            animate={{
              rotate: collapsed ? 180 : 0,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <ChevronLeft size={17} />
          </motion.div>

        </button>

        <SidebarContent />

      </motion.div>

      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <AnimatePresence>

        {mobileOpen && (
          <>

            {/* Overlay */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMobileOpen(false)
              }
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Sidebar */}

            <motion.div
              initial={{
                x: -300,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -300,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-dark-800 z-50 md:hidden flex flex-col"
            >

              {/* Close button */}

              <button
                onClick={() =>
                  setMobileOpen(false)
                }
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>

              <SidebarContent isMobile />

            </motion.div>

          </>
        )}

      </AnimatePresence>
    </>
  );
}