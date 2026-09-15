import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { login, loading, error } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);

      navigate('/dashboard', {
        replace: true,
      });
    } catch (err) {
      console.error('Admin login failed:', err);
    }
  };

  return (
    <div className="admin-login-page">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="admin-login-background">
        <div className="admin-login-glow admin-login-glow-one" />
        <div className="admin-login-glow admin-login-glow-two" />
      </div>


      {/* =====================================================
          LOGIN CONTAINER
          ===================================================== */}

      <div className="admin-login-container">


        {/* ===================================================
            BRAND
            =================================================== */}

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <ShieldCheck
              size={28}
              strokeWidth={2}
            />
          </div>

          <div className="admin-brand-content">

            <h1>
              InterviewTwinAI
            </h1>

            <span>
              ADMIN PORTAL
            </span>

          </div>

        </div>


        {/* ===================================================
            LOGIN CARD
            =================================================== */}

        <div className="admin-login-card">


          {/* =================================================
              SECURITY ICON
              ================================================= */}

          <div className="admin-login-header">

            <div className="admin-security-icon">
              <ShieldCheck
                size={27}
                strokeWidth={2}
              />
            </div>


            <h2>
              Welcome back
            </h2>


            <p>
              Sign in to access the InterviewTwinAI
              administration portal.
            </p>

          </div>


          {/* =================================================
              LOGIN FORM
              ================================================= */}

          <form onSubmit={handleSubmit}>


            {/* ===============================================
                ERROR
                =============================================== */}

            {error && (
              <div
                className="admin-login-error"
                role="alert"
              >
                <span>
                  {error}
                </span>
              </div>
            )}


            {/* ===============================================
                EMAIL
                =============================================== */}

            <div className="admin-form-group">

              <label htmlFor="admin-email">
                Administrator email
              </label>


              <div className="admin-input-wrapper">

                <Mail
                  size={19}
                  strokeWidth={1.8}
                  className="admin-input-icon"
                />


                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* ===============================================
                PASSWORD
                =============================================== */}

            <div className="admin-form-group">

              <label htmlFor="admin-password">
                Password
              </label>


              <div className="admin-input-wrapper">

                <Lock
                  size={19}
                  strokeWidth={1.8}
                  className="admin-input-icon"
                />


                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />


                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  disabled={loading}
                >

                  {showPassword ? (
                    <EyeOff
                      size={18}
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      size={18}
                      strokeWidth={1.8}
                    />
                  )}

                </button>

              </div>

            </div>


            {/* ===============================================
                SUBMIT
                =============================================== */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? 'Signing in...'
                  : 'Sign in to Admin Portal'}
              </span>

            </button>

          </form>


          {/* =================================================
              SECURITY FOOTER
              ================================================= */}

          <div className="admin-login-security">

            <ShieldCheck
              size={17}
              strokeWidth={2}
            />

            <span>
              Protected by InterviewTwinAI security
            </span>

          </div>

        </div>


        {/* ===================================================
            PAGE FOOTER
            =================================================== */}

        <p className="admin-login-footer">
          InterviewTwinAI Administration
          <span> · </span>
          Bangalore, India
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;