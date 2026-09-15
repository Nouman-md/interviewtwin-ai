import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8080/api';


/*
 * =========================================================
 * ADMIN API CLIENT
 * =========================================================
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


/*
 * =========================================================
 * REQUEST INTERCEPTOR
 * =========================================================
 *
 * Automatically attaches the current admin JWT.
 */

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem('adminToken');

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/*
 * =========================================================
 * RESPONSE INTERCEPTOR
 * =========================================================
 *
 * If the access token expires:
 *
 * 401
 *  ↓
 * /auth/refresh
 *  ↓
 * New access token
 *  ↓
 * Retry original request
 *
 * The refresh token itself is NEVER read by JavaScript.
 * It remains inside the HttpOnly cookie.
 * =========================================================
 */

let isRefreshing = false;

let refreshSubscribers = [];


/*
 * Add a request to the waiting queue.
 */
const subscribeToRefresh = (callback) => {

  refreshSubscribers.push(callback);
};


/*
 * Resolve all requests waiting for a new token.
 */
const notifyRefreshSubscribers = (newToken) => {

  refreshSubscribers.forEach(
    (callback) => callback(newToken)
  );

  refreshSubscribers = [];
};


/*
 * Reject all waiting requests when refresh fails.
 */
const rejectRefreshSubscribers = (error) => {

  refreshSubscribers.forEach(
    (callback) => callback(null, error)
  );

  refreshSubscribers = [];
};


/*
 * Perform the refresh request.
 *
 * IMPORTANT:
 * We use a separate axios request here so that
 * this request does NOT pass through the same interceptor.
 */
const refreshAccessToken = async () => {

  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const newToken =
    response.data?.token;

  if (!newToken) {

    throw new Error(
      'Refresh response did not contain an access token'
    );
  }

  localStorage.setItem(
    'adminToken',
    newToken
  );

  return newToken;
};


api.interceptors.response.use(

  /*
   * -------------------------------------------------------
   * SUCCESS
   * -------------------------------------------------------
   */

  (response) => response,


  /*
   * -------------------------------------------------------
   * ERROR
   * -------------------------------------------------------
   */

  async (error) => {

    const originalRequest =
      error.config;


    /*
     * Only handle 401 responses.
     */

    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {

      return Promise.reject(error);
    }


    /*
     * Never attempt to refresh the refresh endpoint itself.
     */

    if (
      originalRequest.url?.includes(
        '/auth/refresh'
      )
    ) {

      return Promise.reject(error);
    }


    /*
     * Prevent infinite retry loops.
     */

    if (originalRequest._retry) {

      return Promise.reject(error);
    }

    originalRequest._retry = true;


    /*
     * -------------------------------------------------------
     * ANOTHER REQUEST IS ALREADY REFRESHING
     * -------------------------------------------------------
     */

    if (isRefreshing) {

      return new Promise(
        (resolve, reject) => {

          subscribeToRefresh(
            (newToken, refreshError) => {

              if (refreshError || !newToken) {

                reject(
                  refreshError ||
                  new Error(
                    'Unable to refresh authentication'
                  )
                );

                return;
              }


              originalRequest.headers =
                originalRequest.headers || {};

              originalRequest.headers.Authorization =
                `Bearer ${newToken}`;

              resolve(
                api(originalRequest)
              );
            }
          );
        }
      );
    }


    /*
     * -------------------------------------------------------
     * START REFRESH
     * -------------------------------------------------------
     */

    isRefreshing = true;


    try {

      const newToken =
        await refreshAccessToken();


      /*
       * Tell queued requests about the new token.
       */

      notifyRefreshSubscribers(
        newToken
      );


      /*
       * Retry the original request.
       */

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;


      return api(
        originalRequest
      );

    } catch (refreshError) {

      console.error(
        'Admin token refresh failed:',
        refreshError
      );


      /*
       * Reject requests waiting for refresh.
       */

      rejectRefreshSubscribers(
        refreshError
      );


      /*
       * The refresh cookie is invalid/expired.
       *
       * Remove the local admin session.
       */

      localStorage.removeItem(
        'adminToken'
      );

      localStorage.removeItem(
        'adminUser'
      );


      return Promise.reject(
        refreshError
      );

    } finally {

      isRefreshing = false;
    }
  }
);


/*
 * =========================================================
 * AUTH API
 * =========================================================
 */

export const adminAuthAPI = {

  login: (email, password) =>
    api.post('/auth/login', {
      email,
      password,
    }),

  logout: () =>
    api.post('/auth/logout'),

  getAdminProfile: () =>
    api.get('/admin/me'),

};


/*
 * =========================================================
 * DASHBOARD API
 * =========================================================
 */

export const adminDashboardAPI = {

  getStats: () =>
    api.get('/admin/dashboard'),

};


/*
 * =========================================================
 * USERS API
 * =========================================================
 */

export const adminUsersAPI = {

  getAllUsers: () =>
    api.get('/admin/users'),

  getUserById: (userId) =>
    api.get(`/admin/users/${userId}`),

  activateUser: (userId) =>
    api.patch(
      `/admin/users/${userId}/activate`
    ),

  deactivateUser: (userId) =>
    api.patch(
      `/admin/users/${userId}/deactivate`
    ),

  verifyUser: (userId) =>
    api.patch(
      `/admin/users/${userId}/verify`
    ),

  unverifyUser: (userId) =>
    api.patch(
      `/admin/users/${userId}/unverify`
    ),

};


/*
 * =========================================================
 * INTERVIEWS API
 * =========================================================
 */

export const adminInterviewsAPI = {

  getAllInterviews: () =>
    api.get('/admin/interviews'),

  getInterviewById: (sessionId) =>
    api.get(
      `/admin/interviews/${sessionId}`
    ),

  getInterviewsByStatus: (status) =>
    api.get(
      `/admin/interviews/status/${status}`
    ),

  updateInterviewStatus: (sessionId, status) =>
    api.patch(
      `/admin/interviews/${sessionId}/status`,
      {
        status,
      }
    ),

  flagInterviewForReview: (sessionId) =>
    api.patch(
      `/admin/interviews/${sessionId}/flag`
    ),

  unflagInterviewForReview: (sessionId) =>
    api.patch(
      `/admin/interviews/${sessionId}/unflag`
    ),

};


/*
 * =========================================================
 * CODING QUESTIONS API
 * =========================================================
 */

export const adminCodingQuestionsAPI = {

  getAllQuestions: () =>
    api.get('/admin/coding-questions'),

  getQuestionById: (codingId) =>
    api.get(
      `/admin/coding-questions/${codingId}`
    ),

  getQuestionsByCategory: (category) =>
    api.get(
      `/admin/coding-questions/category/${encodeURIComponent(category)}`
    ),

  getQuestionsByDifficulty: (difficulty) =>
    api.get(
      `/admin/coding-questions/difficulty/${encodeURIComponent(difficulty)}`
    ),

  getQuestionsByLanguage: (language) =>
    api.get(
      `/admin/coding-questions/language/${encodeURIComponent(language)}`
    ),

  createQuestion: (questionData) =>
    api.post(
      '/admin/coding-questions',
      questionData
    ),

  updateQuestion: (codingId, questionData) =>
    api.put(
      `/admin/coding-questions/${codingId}`,
      questionData
    ),

  deleteQuestion: (codingId) =>
    api.delete(
      `/admin/coding-questions/${codingId}`
    ),

};


/*
 * =========================================================
 * APTITUDE QUESTIONS API
 * =========================================================
 */

export const adminAptitudeQuestionsAPI = {

  getAllQuestions: () =>
    api.get(
      '/admin/aptitude-questions'
    ),

  getQuestionById: (aptitudeId) =>
    api.get(
      `/admin/aptitude-questions/${aptitudeId}`
    ),

  getQuestionsByCategory: (category) =>
    api.get(
      `/admin/aptitude-questions/category/${encodeURIComponent(category)}`
    ),

  getQuestionsByDifficulty: (difficulty) =>
    api.get(
      `/admin/aptitude-questions/difficulty/${encodeURIComponent(difficulty)}`
    ),

  getQuestionsByCategoryAndDifficulty: (
    category,
    difficulty
  ) =>
    api.get(
      '/admin/aptitude-questions/filter',
      {
        params: {
          category:
            category || undefined,

          difficulty:
            difficulty || undefined,
        },
      }
    ),

  createQuestion: (questionData) =>
    api.post(
      '/admin/aptitude-questions',
      questionData
    ),

  updateQuestion: (
    aptitudeId,
    questionData
  ) =>
    api.put(
      `/admin/aptitude-questions/${aptitudeId}`,
      questionData
    ),

  deleteQuestion: (aptitudeId) =>
    api.delete(
      `/admin/aptitude-questions/${aptitudeId}`
    ),

};


/*
 * =========================================================
 * DEFAULT API CLIENT
 * =========================================================
 */

export default api;