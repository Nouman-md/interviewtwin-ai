import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

import {
  LogOut,
  Moon,
  Sun,
  Bell,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Search,
  ArrowRight,
  Calculator,
  LayoutDashboard,
  FileText,
  Briefcase,
  Brain,
  Code,
  BarChart3,
  FileCheck,
  User,
  Settings,
} from 'lucide-react';

export default function Navbar() {

  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // =========================================================
  // SEARCH
  // =========================================================

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const searchItems = [
    {
      title: 'Dashboard',
      description: 'View your InterviewTwin dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      keywords: 'dashboard home overview',
    },

    {
      title: 'Upload Resume',
      description: 'Upload and manage your resume',
      path: '/resume-upload',
      icon: FileText,
      keywords: 'resume cv upload',
    },

    {
      title: 'ATS Checker',
      description: 'Check your resume ATS score',
      path: '/ats-checker',
      icon: FileCheck,
      keywords: 'ats resume score applicant tracking',
    },

    {
      title: 'Job Match',
      description: 'Analyze your job description',
      path: '/job-analyzer',
      icon: Briefcase,
      keywords: 'job jobs match analyzer description',
    },

    {
      title: 'Start Interview',
      description: 'Practice your interview',
      path: '/interview-selection',
      icon: Brain,
      keywords: 'interview practice technical hr case',
    },

    {
      title: 'Interview History',
      description: 'View your previous interviews',
      path: '/reports',
      icon: FileCheck,
      keywords: 'interview history reports results',
    },

    {
      title: 'Coding Practice',
      description: 'Practice programming problems',
      path: '/coding-round',
      icon: Code,
      keywords: 'coding programming dsa problems',
    },

    // =======================================================
    // APTITUDE
    // =======================================================

    {
      title: 'Aptitude',
      description:
        'Practice aptitude questions and improve your reasoning skills',
      path: '/aptitude',
      icon: Calculator,
      keywords:
        'aptitude quantitative reasoning logical reasoning verbal ability mathematics questions practice',
    },

    {
      title: 'Performance',
      description: 'Track your preparation progress',
      path: '/performance',
      icon: BarChart3,
      keywords: 'performance analytics progress score',
    },

    {
      title: 'Reports',
      description: 'View your preparation reports',
      path: '/reports',
      icon: FileCheck,
      keywords: 'reports analytics interview',
    },

    {
      title: 'Profile',
      description: 'Manage your profile',
      path: '/profile',
      icon: User,
      keywords: 'profile account user personal',
    },

    {
      title: 'Settings',
      description: 'Manage application settings',
      path: '/settings',
      icon: Settings,
      keywords: 'settings preferences configuration',
    },
  ];

  const filteredSearchItems =
    searchTerm.trim().length === 0
      ? []
      : searchItems.filter((item) => {

          const search =
            searchTerm.toLowerCase().trim();

          return (
            item.title
              .toLowerCase()
              .includes(search) ||

            item.description
              .toLowerCase()
              .includes(search) ||

            item.keywords
              .toLowerCase()
              .includes(search)
          );
        });

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    setShowSearchResults(
      value.trim().length > 0
    );
  };

  const handleSearchNavigate = (path) => {
    setSearchTerm('');
    setShowSearchResults(false);
    navigate(path);
  };

  const handleSearchKeyDown = (e) => {

    if (e.key === 'Escape') {
      setSearchTerm('');
      setShowSearchResults(false);
      return;
    }

    if (e.key === 'Enter') {

      if (filteredSearchItems.length > 0) {
        handleSearchNavigate(
          filteredSearchItems[0].path
        );
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearchResults(false);
  };


  // =========================================================
  // PROFILE PICTURE
  // =========================================================

  const [profileImageUrl, setProfileImageUrl] =
    useState(null);

  const loadProfilePicture = async () => {

    try {

      const response =
        await userAPI.getProfilePicture();

      const blobUrl =
        URL.createObjectURL(response.data);

      setProfileImageUrl(prev => {

        if (prev) {
          URL.revokeObjectURL(prev);
        }

        return blobUrl;
      });

    } catch (err) {

      if (err.response?.status !== 404) {

        console.error(
          'Navbar profile picture error:',
          err
        );
      }

      setProfileImageUrl(null);
    }
  };

  useEffect(() => {

    loadProfilePicture();

    return () => {

      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }

    };

  }, []);


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title: 'Welcome to InterviewTwin!',
        message:
          'Complete your profile to get started',
        type: 'info',
        read: false,
      },

      {
        id: 2,
        title: 'New Feature Available',
        message:
          'Try our AI-powered interview practice',
        type: 'success',
        read: false,
      },
    ]);


  const unreadCount =
    notifications.filter(
      n => !n.read
    ).length;


  const markAsRead = (id) => {

    setNotifications(
      notifications.map(n =>
        n.id === id
          ? {
              ...n,
              read: true,
            }
          : n
      )
    );
  };


  const getIcon = (type) => {

    switch (type) {

      case 'success':

        return (
          <CheckCircle2
            size={18}
            className="text-success"
          />
        );

      case 'error':

        return (
          <AlertCircle
            size={18}
            className="text-danger"
          />
        );

      default:

        return (
          <Info
            size={18}
            className="text-primary-500"
          />
        );
    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {

    await logout();

    navigate('/');
  };


  // =========================================================
  // INITIAL
  // =========================================================

  const getInitial =
    user?.firstName?.[0]?.toUpperCase() || 'U';


  // =========================================================
  // NAVBAR
  // =========================================================

  return (

    <motion.nav
      initial={{
        y: -20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
      }}
      className="glass sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700"
    >

      <div className="px-4 md:px-6 py-3 flex justify-between items-center">


        {/* =====================================================
            MOBILE LOGO
        ====================================================== */}

        <Link
          to="/dashboard"
          className="flex items-center gap-2 md:hidden"
        >

          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">

            <Sparkles
              className="text-white"
              size={16}
            />

          </div>

          <span className="font-bold text-gray-900 dark:text-white">
            InterviewTwin
          </span>

        </Link>


        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="hidden md:block flex-1 max-w-lg relative">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => {

                if (searchTerm.trim()) {
                  setShowSearchResults(true);
                }

              }}
              placeholder="Search InterviewTwin..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary-400 focus:bg-white dark:focus:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-all"
            />


            {searchTerm && (

              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >

                <X size={15} />

              </button>

            )}

          </div>


          {/* ===================================================
              SEARCH RESULTS
          ==================================================== */}

          <AnimatePresence>

            {showSearchResults && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.98,
                }}
                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden z-[60]"
              >

                {filteredSearchItems.length > 0 ? (

                  <div className="py-2">

                    <div className="px-4 py-2">

                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Quick Navigation
                      </p>

                    </div>


                    {filteredSearchItems
                      .slice(0, 6)
                      .map((item) => {

                        const Icon =
                          item.icon;

                        return (

                          <button
                            key={item.path + item.title}
                            type="button"
                            onClick={() =>
                              handleSearchNavigate(
                                item.path
                              )
                            }
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors group"
                          >

                            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">

                              <Icon
                                size={18}
                                className="text-primary-600 dark:text-primary-400"
                              />

                            </div>


                            <div className="flex-1 min-w-0">

                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.title}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {item.description}
                              </p>

                            </div>


                            <ArrowRight
                              size={16}
                              className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                            />

                          </button>

                        );

                      })}


                    {filteredSearchItems.length > 6 && (

                      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">

                        <p className="text-xs text-gray-400">
                          {filteredSearchItems.length - 6} more results available
                        </p>

                      </div>

                    )}

                  </div>

                ) : (

                  <div className="p-8 text-center">

                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 mx-auto mb-3 flex items-center justify-center">

                      <Search
                        size={22}
                        className="text-gray-400"
                      />

                    </div>

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      No results found
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Try searching for resume, interview, coding, aptitude or performance
                    </p>

                  </div>

                )}

              </motion.div>

            )}

          </AnimatePresence>

        </div>


        {/* =====================================================
            RIGHT ACTIONS
        ====================================================== */}

        <div className="flex items-center gap-2 md:gap-3">


          {/* ===================================================
              THEME TOGGLE
          ==================================================== */}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >

            <AnimatePresence mode="wait">

              {isDark ? (

                <motion.div
                  key="sun"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                >

                  <Sun size={20} />

                </motion.div>

              ) : (

                <motion.div
                  key="moon"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                  }}
                >

                  <Moon size={20} />

                </motion.div>

              )}

            </AnimatePresence>

          </button>


          {/* ===================================================
              NOTIFICATIONS
          ==================================================== */}

          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >

              <Bell size={20} />

              {unreadCount > 0 && (

                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full animate-pulse" />

              )}

            </button>


            {/* Notification Dropdown */}

            <AnimatePresence>

              {showNotifications && (

                <>

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
                    className="fixed inset-0 z-40"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                  />


                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      scale: 0.95,
                    }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  >

                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">

                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Notifications
                      </h3>

                      <button
                        onClick={() =>
                          setShowNotifications(false)
                        }
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >

                        <X
                          size={18}
                          className="text-gray-500"
                        />

                      </button>

                    </div>


                    <div className="max-h-96 overflow-y-auto">

                      {notifications.length > 0 ? (

                        notifications.map(
                          notification => (

                            <motion.div
                              key={notification.id}
                              initial={{
                                opacity: 0,
                                x: -10,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                !notification.read
                                  ? 'bg-primary-50/50 dark:bg-primary-900/10'
                                  : ''
                              }`}
                              onClick={() =>
                                markAsRead(
                                  notification.id
                                )
                              }
                            >

                              <div className="flex gap-3">

                                <div className="flex-shrink-0 mt-0.5">

                                  {getIcon(
                                    notification.type
                                  )}

                                </div>


                                <div className="flex-1 min-w-0">

                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                                    {notification.title}
                                  </h4>

                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {notification.message}
                                  </p>

                                </div>


                                {!notification.read && (

                                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />

                                )}

                              </div>

                            </motion.div>

                          )
                        )

                      ) : (

                        <div className="p-8 text-center">

                          <Bell
                            size={40}
                            className="mx-auto text-gray-300 dark:text-gray-600 mb-2"
                          />

                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No notifications
                          </p>

                        </div>

                      )}

                    </div>

                  </motion.div>

                </>

              )}

            </AnimatePresence>

          </div>


          {/* ===================================================
              USER MENU + PROFILE PICTURE
          ==================================================== */}

          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >

            <div className="relative w-8 h-8">

              {profileImageUrl ? (

                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                />

              ) : (

                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">

                  {getInitial}

                </div>

              )}

            </div>


            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.firstName || 'User'}
            </span>

          </Link>


          {/* ===================================================
              LOGOUT
          ==================================================== */}

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Logout"
          >

            <LogOut size={20} />

          </button>

        </div>

      </div>

    </motion.nav>
  );
}