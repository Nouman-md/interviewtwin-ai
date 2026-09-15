import axios from 'axios';

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8080/api';


// =========================================================
// IN-MEMORY ACCESS TOKEN
// =========================================================
// The access JWT is intentionally never stored in
// localStorage/sessionStorage.
//
// The refresh token is stored by the backend in an
// HttpOnly cookie and is automatically sent by the browser.
// =========================================================

let accessToken = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken =
    typeof token === 'string' && token.trim()
      ? token.trim()
      : null;
};

export const clearAccessToken = () => {
  accessToken = null;
};


// =========================================================
// AXIOS CLIENT
// =========================================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// =========================================================
// ADD ACCESS TOKEN TO REQUESTS
// =========================================================

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// =========================================================
// HANDLE RESPONSES
// =========================================================

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // -------------------------------------------------------
    // BASIC ERROR LOGGING
    // -------------------------------------------------------

    if (error.response) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        message:
          error.response.data?.message ||
          error.message,
      });
    } else if (error.request) {
      console.error(
        'API Error - No response received:',
        {
          url: error.config?.url,
          method: error.config?.method,
          message:
            'Backend server may be down or unreachable',
        }
      );
    } else {
      console.error(
        'API Error - Request setup failed:',
        error.message
      );
    }


    // -------------------------------------------------------
    // HANDLE EXPIRED ACCESS TOKEN
    // -------------------------------------------------------
    // Only 401 should trigger token refresh.
    //
    // 403 means the request is forbidden and should NOT
    // automatically trigger a refresh.
    // -------------------------------------------------------

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      const requestUrl =
        originalRequest?.url || '';

      // -----------------------------------------------------
      // NEVER REFRESH AUTH ENDPOINTS
      // -----------------------------------------------------

      const isAuthRequest =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/logout') ||
        requestUrl.includes('/auth/refresh') ||
        requestUrl.includes('/auth/forgot-password') ||
        requestUrl.includes('/auth/verify-reset-code') ||
        requestUrl.includes('/auth/reset-password') ||
        requestUrl.includes('/auth/verify-email') ||
        requestUrl.includes('/auth/resend-verification');

      if (!isAuthRequest) {
        originalRequest._retry = true;

        try {
          // ---------------------------------------------------
          // Browser automatically sends the HttpOnly cookie.
          // ---------------------------------------------------

          const refreshResponse =
            await apiClient.post('/auth/refresh');

          const newToken =
            refreshResponse.data?.token;

          if (
            typeof newToken !== 'string' ||
            !newToken.trim()
          ) {
            throw new Error(
              'No access token returned from refresh endpoint'
            );
          }

          // ---------------------------------------------------
          // Keep new access token ONLY in memory.
          // ---------------------------------------------------

          setAccessToken(newToken);

          // ---------------------------------------------------
          // Retry failed request with new token.
          // ---------------------------------------------------

          originalRequest.headers =
            originalRequest.headers || {};

          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          return apiClient(originalRequest);

        } catch (refreshError) {
          clearAccessToken();

          // User profile is cached data, not an auth credential.
          // Remove it because the refresh session is invalid.
          localStorage.removeItem('user');

          console.warn(
            'Token refresh failed. Session cleared.'
          );

          if (
            window.location.pathname !==
            '/login'
          ) {
            window.location.replace('/login');
          }

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);


// =========================================================
// AUTH APIs
// =========================================================

export const authAPI = {

  register: (data) =>
    apiClient.post(
      '/auth/register',
      data
    ),

  login: (data) =>
    apiClient.post(
      '/auth/login',
      data
    ),

  logout: () =>
    apiClient.post(
      '/auth/logout'
    ),

  refresh: () =>
    apiClient.post(
      '/auth/refresh'
    ),

  verifyEmail: (email, code) =>
    apiClient.post(
      '/auth/verify-email',
      null,
      {
        params: {
          email,
          code,
        },
      }
    ),

  resendVerificationCode: (email) =>
    apiClient.post(
      '/auth/resend-verification',
      null,
      {
        params: {
          email,
        },
      }
    ),

  forgotPassword: (email) =>
    apiClient.post(
      '/auth/forgot-password',
      null,
      {
        params: {
          email,
        },
      }
    ),

  verifyResetCode: (email, code) =>
    apiClient.post(
      '/auth/verify-reset-code',
      null,
      {
        params: {
          email,
          code,
        },
      }
    ),

  resetPassword: (
    email,
    resetToken,
    newPassword
  ) =>
    apiClient.post(
      '/auth/reset-password',
      {
        email,
        resetToken,
        newPassword,
      }
    ),
};


// =========================================================
// USER APIs
// =========================================================

export const userAPI = {

  getProfile: () =>
    apiClient.get(
      '/users/profile'
    ),

  getUser: (userId) =>
    apiClient.get(
      `/users/${userId}`
    ),

  updateUser: (userId, data) =>
    apiClient.put(
      `/users/${userId}`,
      data
    ),

  changePassword: (userId, data) =>
    apiClient.post(
      `/users/${userId}/change-password`,
      data
    ),

  deleteUser: (userId) =>
    apiClient.delete(
      `/users/${userId}`
    ),

  uploadProfilePicture: (file) => {
    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    return apiClient.post(
      '/users/profile-picture',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );
  },

  getProfilePicture: () =>
    apiClient.get(
      '/users/profile-picture',
      {
        responseType: 'blob',
      }
    ),

  removeProfilePicture: () =>
    apiClient.delete(
      '/users/profile-picture'
    ),
};


// =========================================================
// RESUME APIs
// =========================================================

export const resumeAPI = {

  upload: (file) => {
    const formData =
      new FormData();

    formData.append(
      'file',
      file
    );

    return apiClient.post(
      '/resumes/upload',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );
  },

  getResumes: () =>
    apiClient.get(
      '/resumes'
    ),

  getResume: (resumeId) =>
    apiClient.get(
      `/resumes/${resumeId}`
    ),

  setPrimary: (resumeId) =>
    apiClient.put(
      `/resumes/${resumeId}/set-primary`
    ),

  deleteResume: (resumeId) =>
    apiClient.delete(
      `/resumes/${resumeId}`
    ),

  downloadResume: (resumeId) =>
    apiClient.get(
      `/resumes/${resumeId}/download`,
      {
        responseType: 'blob',
      }
    ),

  searchInResume: (
    resumeId,
    query
  ) =>
    apiClient.get(
      `/resumes/${resumeId}/search`,
      {
        params: {
          query,
        },
      }
    ),

  searchAcrossAllResumes: (
    query
  ) =>
    apiClient.get(
      '/resumes/search',
      {
        params: {
          query,
        },
      }
    ),
};


// =========================================================
// ATS APIs
// =========================================================

export const atsAPI = {

  analyzeResume: (resumeId) =>
    apiClient.post(
      `/ats/analyze/${resumeId}`
    ),

  getReports: () =>
    apiClient.get(
      '/ats/reports'
    ),

  getLatestReport: () =>
    apiClient.get(
      '/ats/latest'
    ),

  getReport: (reportId) =>
    apiClient.get(
      `/ats/${reportId}`
    ),

  analyzeJobMatchText: (
    resumeId,
    data
  ) =>
    apiClient.post(
      `/ats/analyze-job-match-text/${resumeId}`,
      data
    ),
};


// =========================================================
// INTERVIEW APIs
// =========================================================

export const interviewAPI = {

  startInterview: (type) =>
    apiClient.post(
      `/interviews/start/${type}`
    ),

  getSession: (sessionId) =>
    apiClient.get(
      `/interviews/${sessionId}`
    ),

  getNextQuestion: (sessionId) =>
    apiClient.get(
      `/interviews/${sessionId}/next-question`
    ),

  submitAnswer: (
    sessionId,
    data
  ) =>
    apiClient.post(
      `/interviews/${sessionId}/submit-answer`,
      data
    ),

  endInterview: (sessionId) =>
    apiClient.post(
      `/interviews/${sessionId}/end`
    ),

  getUserSessions: () =>
    apiClient.get(
      '/interviews/user/sessions'
    ),

  getCompletedSessions: () =>
    apiClient.get(
      '/interviews/user/completed'
    ),

  getSessionAnswers: (
    sessionId
  ) =>
    apiClient.get(
      `/interviews/${sessionId}/answers`
    ),
};


// =========================================================
// CODING APIs
// =========================================================

export const codingAPI = {

  getQuestion: (codingId) =>
    apiClient.get(
      `/coding/questions/${codingId}`
    ),

  getQuestionsByDifficulty: (
    difficulty
  ) =>
    apiClient.get(
      `/coding/questions/difficulty/${difficulty}`
    ),

  getRandomQuestions: (
    count = 5,
    type = null
  ) =>
    apiClient.get(
      '/coding/questions/random',
      {
        params: {
          count,
          type,
        },
      }
    ),

  getQuestionsByFilters: (
    filters
  ) =>
    apiClient.get(
      '/coding/questions/filter',
      {
        params: filters,
      }
    ),

  getQuestionsByType: (
    questionType
  ) =>
    apiClient.get(
      `/coding/questions/type/${questionType}`
    ),

  searchQuestions: (
    query
  ) =>
    apiClient.get(
      '/coding/questions/search',
      {
        params: {
          query,
        },
      }
    ),

  getQuestionsByTopic: (
    category
  ) =>
    apiClient.get(
      `/coding/questions/topic/${category}`
    ),

  getCodingStats: () =>
    apiClient.get(
      '/coding/stats'
    ),

  submitCode: (
    codingId,
    data
  ) =>
    apiClient.post(
      `/coding/submit/${codingId}`,
      data
    ),

  getSubmission: (
    submissionId
  ) =>
    apiClient.get(
      `/coding/submissions/${submissionId}`
    ),

  getUserSubmissions: () =>
    apiClient.get(
      '/coding/submissions/user'
    ),

  getQuestionSubmissions: (
    codingId
  ) =>
    apiClient.get(
      `/coding/submissions/question/${codingId}`
    ),
};


// =========================================================
// APTITUDE APIs
// =========================================================

export const aptitudeAPI = {

  getAllQuestions: () =>
    apiClient.get(
      '/aptitude/questions'
    ),

  getQuestion: (
    aptitudeId
  ) =>
    apiClient.get(
      `/aptitude/questions/${aptitudeId}`
    ),

  getRandomQuestions: (
    count = 10
  ) =>
    apiClient.get(
      '/aptitude/questions/random',
      {
        params: {
          count,
        },
      }
    ),

  getQuestionsByCategory: (
    category
  ) =>
    apiClient.get(
      `/aptitude/questions/category/${encodeURIComponent(category)}`
    ),

  getQuestionsByDifficulty: (
    difficulty
  ) =>
    apiClient.get(
      `/aptitude/questions/difficulty/${encodeURIComponent(difficulty)}`
    ),

  getQuestionsByFilters: (
    category,
    difficulty
  ) =>
    apiClient.get(
      '/aptitude/questions/filter',
      {
        params: {
          category:
            category || undefined,
          difficulty:
            difficulty || undefined,
        },
      }
    ),

  getCategories: () =>
    apiClient.get(
      '/aptitude/categories'
    ),

  submitAnswer: (
    aptitudeId,
    answer
  ) =>
    apiClient.post(
      `/aptitude/submit/${aptitudeId}`,
      {
        answer,
      }
    ),

  getStats: () =>
    apiClient.get(
      '/aptitude/stats'
    ),
};


// =========================================================
// PERFORMANCE APIs
// =========================================================

export const performanceAPI = {

  getPerformance: () =>
    apiClient.get(
      '/performance'
    ),

  identifyWeakAreas: () =>
    apiClient.post(
      '/performance/identify-weak-areas'
    ),
};


export default apiClient;