import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../services/api';

const AdminAuthContext =
  createContext(null);


export const AdminAuthProvider = ({
  children,
}) => {

  const [admin, setAdmin] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  // ---------------------------------------------------------
  // CHECK EXISTING ADMIN SESSION
  // ---------------------------------------------------------

  useEffect(() => {

    const restoreAdminSession =
      async () => {

        const token =
          localStorage.getItem(
            'adminToken'
          );

        const adminData =
          localStorage.getItem(
            'adminUser'
          );


        if (!token || !adminData) {

          setLoading(false);

          return;
        }


        try {

          const parsed =
            JSON.parse(adminData);


          if (
            !parsed ||
            typeof parsed !== 'object'
          ) {

            throw new Error(
              'Invalid admin data'
            );
          }


          /*
           * IMPORTANT:
           *
           * Use the central api client.
           *
           * If the access token is expired,
           * api.js will automatically:
           *
           * 401
           * ↓
           * /auth/refresh
           * ↓
           * new access token
           * ↓
           * retry /admin/me
           */

          const response =
            await api.get(
              '/admin/me'
            );


          if (
            response.data?.role !==
            'ADMIN'
          ) {

            throw new Error(
              'Administrator access required'
            );
          }


          setAdmin({

            ...parsed,

            role: 'ADMIN',

          });

        } catch (err) {

          console.error(
            'Admin session validation failed:',
            err
          );


          localStorage.removeItem(
            'adminToken'
          );

          localStorage.removeItem(
            'adminUser'
          );


          setAdmin(null);

        } finally {

          setLoading(false);

        }

      };


    restoreAdminSession();

  }, []);


  // ---------------------------------------------------------
  // ADMIN LOGIN
  // ---------------------------------------------------------

  const login = async (
    email,
    password
  ) => {

    try {

      setLoading(true);

      setError(null);


      // Step 1: Normal authentication

      const loginResponse =
        await api.post(
          '/auth/login',
          {
            email,
            password,
          }
        );


      const data =
        loginResponse.data;


      if (
        !data.success ||
        !data.token
      ) {

        throw new Error(
          data.message ||
          'Login failed'
        );
      }


      /*
       * Store ONLY the short-lived
       * access JWT.
       *
       * The refresh token is kept
       * inside the HttpOnly cookie.
       */

      localStorage.setItem(
        'adminToken',
        data.token
      );


      // Step 2: Verify ADMIN access

      const adminResponse =
        await api.get(
          '/admin/me'
        );


      /*
       * Spring Security should return:
       *
       * 200 → ADMIN
       * 403 → authenticated but not ADMIN
       */

      if (
        adminResponse.data?.role !==
        'ADMIN'
      ) {

        throw new Error(
          'Administrator access required'
        );
      }


      // Step 3: Create admin session

      const adminUser = {

        userId:
          data.userId,

        email:
          data.email ||
          email,

        firstName:
          data.firstName,

        lastName:
          data.lastName,

        fullName:
          `${data.firstName || ''} ${
            data.lastName || ''
          }`.trim(),

        role: 'ADMIN',

      };


      localStorage.setItem(
        'adminUser',
        JSON.stringify(adminUser)
      );


      setAdmin(adminUser);


      return adminUser;

    } catch (err) {

      console.error(
        'Admin login failed:',
        err
      );


      localStorage.removeItem(
        'adminToken'
      );

      localStorage.removeItem(
        'adminUser'
      );


      const message =
        err.response?.status ===
        403

          ? 'This account does not have administrator access.'

          : err.response?.data?.message ||
            err.message ||
            'Admin login failed';


      setAdmin(null);

      setError(message);


      throw err;

    } finally {

      setLoading(false);

    }

  };


  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------

  const logout = async () => {

    try {

      await api.post(
        '/auth/logout'
      );

    } catch (err) {

      console.error(
        'Admin logout error:',
        err
      );

    } finally {

      localStorage.removeItem(
        'adminToken'
      );

      localStorage.removeItem(
        'adminUser'
      );

      setAdmin(null);

    }

  };


  const value = {

    admin,

    loading,

    error,

    login,

    logout,

    isAuthenticated:
      !!admin,

  };


  return (

    <AdminAuthContext.Provider
      value={value}
    >

      {children}

    </AdminAuthContext.Provider>

  );

};


export const useAdminAuth = () => {

  const context =
    useContext(
      AdminAuthContext
    );


  if (!context) {

    throw new Error(
      'useAdminAuth must be used within AdminAuthProvider'
    );

  }


  return context;

};


export default AdminAuthContext;