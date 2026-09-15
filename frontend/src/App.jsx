import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './layouts/Navbar';
import Sidebar from './layouts/Sidebar';

// =========================================================
// PUBLIC PAGES
// =========================================================

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';

// =========================================================
// PROTECTED PAGES
// =========================================================

import Dashboard from './pages/Dashboard.jsx';

import ResumeUpload from './pages/ResumeUpload.jsx';
import ATSChecker from './pages/ATSChecker.jsx';
import JobDescriptionAnalyzer from './pages/JobDescriptionAnalyzer.jsx';
import PDFSearch from './pages/PDFSearch.jsx';

import InterviewSelection from './pages/InterviewSelection.jsx';
import TechnicalInterview from './pages/TechnicalInterview.jsx';
import HRInterview from './pages/HRInterview.jsx';
import CaseInterview from './pages/CaseInterview.jsx';

import CodingRound from './pages/CodingRound.jsx';
import Aptitude from './pages/Aptitude.jsx';

import PerformanceDashboard from './pages/PerformanceDashboard.jsx';
import Reports from './pages/Reports.jsx';

import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

import NotFound from './pages/NotFound.jsx';

// =========================================================
// LOADING SCREEN
// =========================================================

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070d] text-white">
      <div className="text-center">

        <div className="w-10 h-10 mx-auto rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />

        <p className="mt-4 text-sm text-gray-400">
          Loading InterviewTwin...
        </p>

      </div>
    </div>
  );
};

// =========================================================
// PROTECTED ROUTE
// =========================================================

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// =========================================================
// AUTHENTICATED LAYOUT
// =========================================================
//
// IMPORTANT:
// Sidebar and the main application area are siblings in a flex
// container. This prevents the page content from covering the
// sidebar.
//
// Sidebar:
//   width = 256px expanded
//   width = 80px collapsed
//
// Main area:
//   flex-1
//   min-w-0
//
// =========================================================

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-[#05070d]">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sidebar />

      {/* =====================================================
          RIGHT SIDE APPLICATION AREA
          ===================================================== */}

      <div className="flex-1 min-w-0 min-h-screen flex flex-col">

        {/* ===================================================
            NAVBAR
            =================================================== */}

        <Navbar />

        {/* ===================================================
            MAIN CONTENT

            flex-1 allows content to use remaining width.
            min-w-0 prevents large dashboard cards from forcing
            the content underneath/over the sidebar.
            overflow-x-hidden prevents horizontal overflow.
            =================================================== */}

        <main className="flex-1 min-w-0 w-full overflow-x-hidden">

          <div className="w-full min-w-0">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
};

// =========================================================
// PROTECTED PAGE
// =========================================================

const ProtectedPage = ({ children }) => {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
};

// =========================================================
// ROUTES
// =========================================================

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* =====================================================
          PUBLIC
          ===================================================== */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Register />
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/privacy-policy"
        element={<PrivacyPolicy />}
      />

      <Route
        path="/terms-conditions"
        element={<TermsConditions />}
      />

      <Route
  path="/cookies"
  element={<CookiePolicy />}
/>

      {/* =====================================================
          DASHBOARD
          ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedPage>
            <Dashboard />
          </ProtectedPage>
        }
      />

      {/* =====================================================
          RESUME / CAREER
          ===================================================== */}

      <Route
        path="/resume-upload"
        element={
          <ProtectedPage>
            <ResumeUpload />
          </ProtectedPage>
        }
      />

      <Route
        path="/ats-checker"
        element={
          <ProtectedPage>
            <ATSChecker />
          </ProtectedPage>
        }
      />

      <Route
        path="/job-analyzer"
        element={
          <ProtectedPage>
            <JobDescriptionAnalyzer />
          </ProtectedPage>
        }
      />

      <Route
        path="/pdf-search"
        element={
          <ProtectedPage>
            <PDFSearch />
          </ProtectedPage>
        }
      />

      {/* =====================================================
          INTERVIEW SELECTION
          ===================================================== */}

      <Route
        path="/interview-selection"
        element={
          <ProtectedPage>
            <InterviewSelection />
          </ProtectedPage>
        }
      />

      {/* =====================================================
          INTERVIEWS
          ===================================================== */}

      <Route
        path="/technical-interview/:sessionId"
        element={
          <ProtectedPage>
            <TechnicalInterview />
          </ProtectedPage>
        }
      />

      <Route
        path="/hr-interview/:sessionId"
        element={
          <ProtectedPage>
            <HRInterview />
          </ProtectedPage>
        }
      />

      <Route
        path="/case-interview/:sessionId"
        element={
          <ProtectedPage>
            <CaseInterview />
          </ProtectedPage>
        }
      />

      {/* =====================================================
          PRACTICE
          ===================================================== */}

      <Route
        path="/coding-round"
        element={
          <ProtectedPage>
            <CodingRound />
          </ProtectedPage>
        }
      />

      <Route
        path="/aptitude"
        element={
          <ProtectedPage>
            <Aptitude />
          </ProtectedPage>
        }
      />

      {/* =====================================================
          PERFORMANCE
          ===================================================== */}

      <Route
        path="/performance"
        element={
          <ProtectedPage>
            <PerformanceDashboard />
          </ProtectedPage>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedPage>
            <Reports />
          </ProtectedPage>
        }
      />

      {/* =====================================================
          USER ACCOUNT
          ===================================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedPage>
            <Profile />
          </ProtectedPage>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedPage>
            <Settings />
          </ProtectedPage>
        }
      />

      {/* =====================================================
          404
          ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

// =========================================================
// MAIN APP
// =========================================================

const App = () => {
  return (
    <BrowserRouter>

      <ThemeProvider>

        <AuthProvider>

          <AppRoutes />

        </AuthProvider>

      </ThemeProvider>

    </BrowserRouter>
  );
};

export default App;