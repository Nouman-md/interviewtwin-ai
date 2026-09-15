import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  AdminAuthProvider,
  useAdminAuth,
} from './context/AdminAuthContext';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminInterviews from './pages/AdminInterviews';
import AdminCodingQuestions from './pages/AdminCodingQuestions';
import AdminAptitudeQuestions from './pages/AdminAptitudeQuestions';
import AdminReports from './pages/AdminReports';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import AdminSecureConsole from './pages/AdminSecureConsole';


/*
 * =========================================================
 * ADMIN PROTECTED ROUTE
 * =========================================================
 */

const AdminProtectedRoute = ({ children }) => {

  const {
    isAuthenticated,
    loading,
  } = useAdminAuth();


  if (loading) {

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070b14',
          color: '#ffffff',
        }}
      >
        Verifying administrator access...
      </div>
    );

  }


  return isAuthenticated
    ? children
    : (
      <Navigate
        to="/login"
        replace
      />
    );
};


/*
 * =========================================================
 * ADMIN ROUTES
 * =========================================================
 */

const AdminRoutes = () => {

  const {
    isAuthenticated,
    loading,
  } = useAdminAuth();


  if (loading) {

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070b14',
          color: '#ffffff',
        }}
      >
        Loading...
      </div>
    );

  }


  return (
    <Routes>

      {/* ===================================================
          LOGIN
          =================================================== */}

      <Route
        path="/login"
        element={
          isAuthenticated
            ? (
              <Navigate
                to="/dashboard"
                replace
              />
            )
            : (
              <AdminLogin />
            )
        }
      />


      {/* ===================================================
          DASHBOARD
          =================================================== */}

      <Route
        path="/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />


      {/* ===================================================
          USERS
          =================================================== */}

      <Route
        path="/users"
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />


      {/* ===================================================
          INTERVIEWS
          =================================================== */}

      <Route
        path="/interviews"
        element={
          <AdminProtectedRoute>
            <AdminInterviews />
          </AdminProtectedRoute>
        }
      />


      {/* ===================================================
          CODING QUESTIONS
          =================================================== */}

      <Route
        path="/coding-questions"
        element={
          <AdminProtectedRoute>
            <AdminCodingQuestions />
          </AdminProtectedRoute>
        }
      />

            {/* ===================================================
          APTITUDE QUESTIONS
          =================================================== */}

      <Route
        path="/aptitude"
        element={
          <AdminProtectedRoute>
            <AdminAptitudeQuestions />
          </AdminProtectedRoute>
        }
      />
//--------REPORTS-----------------
<Route
  path="/reports"
  element={
    <AdminProtectedRoute>
      <AdminReports />
    </AdminProtectedRoute>
  }
/>
//-----------ANALYTICS---------------------

<Route
  path="/analytics"
  element={
    <AdminProtectedRoute>
      <AdminAnalytics />
    </AdminProtectedRoute>
  }
/>

//--------------SETTINGS---------------------
<Route
  path="/settings"
  element={
    <AdminProtectedRoute>
      <AdminSettings />
    </AdminProtectedRoute>
  }
/>
//---------------SECURE CONSOLE-------------
<Route
  path="/secure-console"
  element={
    <AdminProtectedRoute>
      <AdminSecureConsole />
    </AdminProtectedRoute>
  }
/>

      {/* ===================================================
          ROOT
          =================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />


      {/* ===================================================
          UNKNOWN ROUTES
          =================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

    </Routes>
  );
};


/*
 * =========================================================
 * APP
 * =========================================================
 */

function App() {

  return (
    <BrowserRouter>

      <AdminAuthProvider>

        <AdminRoutes />

      </AdminAuthProvider>

    </BrowserRouter>
  );
}


export default App;