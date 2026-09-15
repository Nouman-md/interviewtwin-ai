import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

import {
  authAPI,
  userAPI,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================
  // RESTORE SESSION
  // =========================================================
  // Access token is memory-only.
  //
  // After a page reload, the HttpOnly refreshToken cookie is
  // still available to the browser. We use it to obtain a
  // fresh access token.
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);

            if (
              parsed &&
              typeof parsed === 'object' &&
              Number.isFinite(Number(parsed.userId)) &&
              Number(parsed.userId) > 0
            ) {
              if (mounted) {
                setUser(parsed);
              }
            } else {
              localStorage.removeItem('user');
            }
          } catch (parseError) {
            console.warn(
              'Invalid cached user data, clearing local copy.'
            );

            localStorage.removeItem('user');
          }
        }

        // Ask the backend for a fresh access token.
        //
        // The refreshToken is HttpOnly, so JavaScript cannot
        // read it. The browser sends it automatically.
        try {
          const response = await authAPI.refresh();
          const data = response.data;

          if (
            data?.success &&
            typeof data.token === 'string' &&
            data.token.trim()
          ) {
            setAccessToken(data.token);

            // Fetch authoritative user information.
            try {
              const profileResponse =
                await userAPI.getProfile();

              const userData = profileResponse.data;

              if (
                userData &&
                typeof userData === 'object' &&
                Number.isFinite(Number(userData.userId)) &&
                Number(userData.userId) > 0
              ) {
                localStorage.setItem(
                  'user',
                  JSON.stringify(userData)
                );

                if (mounted) {
                  setUser(userData);
                }
              }
            } catch (profileError) {
              // Cached profile can remain available for UI.
              // Authentication is still based on the
              // in-memory access token.
              console.warn(
                'Unable to refresh user profile.'
              );
            }
          } else {
            clearAccessToken();
          }
        } catch (refreshError) {
          // No refresh cookie simply means there is no
          // active login session.
          clearAccessToken();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);


  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (data) => {
    try {
      setError(null);

      const response =
        await authAPI.register(data);

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Registration failed';

      setError(errorMessage);

      throw err;
    }
  };


  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (email, password) => {
    try {
      setError(null);

      const response =
        await authAPI.login({
          email,
          password,
        });

      const data = response.data;

      if (
        !data?.success ||
        typeof data.token !== 'string' ||
        !data.token.trim()
      ) {
        const errorMessage =
          data?.message || 'Login failed';

        setError(errorMessage);

        throw new Error(errorMessage);
      }

      const {
        token,
        userId,
        firstName,
        lastName,
      } = data;

      // Store access token ONLY in memory.
      setAccessToken(token);

      // Fetch the authoritative profile.
      try {
        const profileResponse =
          await userAPI.getProfile();

        const userData =
          profileResponse.data;

        if (
          !userData ||
          typeof userData !== 'object' ||
          !Number.isFinite(Number(userData.userId)) ||
          Number(userData.userId) <= 0
        ) {
          throw new Error(
            'Invalid user profile received'
          );
        }

        localStorage.setItem(
          'user',
          JSON.stringify(userData)
        );

        setUser(userData);
      } catch (profileError) {
        // Do not manufacture security-related values such as
        // isVerified=true or isActive=true.
        //
        // Use only the identity returned by the successful
        // login response.
        if (
          !Number.isFinite(Number(userId)) ||
          Number(userId) <= 0
        ) {
          clearAccessToken();

          throw new Error(
            'Unable to establish user session'
          );
        }

        const fallbackUser = {
          userId,
          email,
          firstName,
          lastName,
          fullName:
            `${firstName || ''} ${lastName || ''}`.trim(),
        };

        localStorage.setItem(
          'user',
          JSON.stringify(fallbackUser)
        );

        setUser(fallbackUser);

        console.warn(
          'Unable to fetch user profile after login.'
        );
      }

      return data;
    } catch (err) {
      clearAccessToken();

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed';

      setError(errorMessage);

      throw err;
    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Local session must still be cleared even if the
      // backend logout request fails.
      console.warn(
        'Logout request failed.'
      );
    } finally {
      clearAccessToken();

      localStorage.removeItem('user');

      setUser(null);
      setError(null);
    }
  };


  // =========================================================
  // AUTH CONTEXT VALUE
  // =========================================================

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,

    // The user is considered authenticated only when both
    // profile state and an in-memory access token exist.
    isAuthenticated:
      !!user && !!getAccessToken(),
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// =========================================================
// useAuth
// =========================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};