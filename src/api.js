import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: '/api/v1',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const fetchTracks = async () => {
//   // The query function in React Query is passed an object with queryKey, etc.
//   // We don't need it for this request, so we ignore it.
//   const { data } = await apiClient.get('/music/tracks/');
//   return data;
// };

// Get base URL from environment variables
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
console.log('API_BASE_URL', API_BASE_URL);

if (!API_BASE_URL) {
    throw new Error('REACT_APP_API_BASE_URL is not defined in the environment variables');
}

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add JWT access token to requests
api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('access_token'); // Or use a secure cookie
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor: Handle token expiration and refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      // Check if error is due to expired access token and not a refresh token request itself
      if (error.response.status === 401 && !originalRequest._retry && error.response.data.code === 'token_not_valid') {
        originalRequest._retry = true; // Mark this request as retried
        const refreshToken = localStorage.getItem('refresh_token');
  
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken); // Store new access token
  
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Update header for original request
            return api(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.error('Unable to refresh token:', refreshError);
            // Handle refresh token failure (e.g., redirect to login)
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login'; // Redirect to login page
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );
  
  
  // --- API Call Functions ---
  
  // User/Auth API
//   export const authApi = {
//     login: (username, password) => api.post('/accounts/token/', { username, password }),
//     register: (userData) => api.post('/accounts/register/', userData),
//     getMe: () => api.get('/accounts/me/'),
//     getProfile: () => api.get('/accounts/profile/'),
//     updateProfile: (profileData) => api.patch('/accounts/profile/', profileData),
//   };
  
  // Music API
  export const musicApi = {
    getTracks: (params = {}) => api.get('/tracks/', { params }), // params for search, pagination etc.
    getTrackDetail: (id) => api.get(`/tracks/${id}/`),
    // createTrack: (trackData) => api.post('/tracks/', trackData),
    // ... more music related calls
  };

  
  
  // Licensing API: getting the license types to choose from
  export const licenseApi = {
    // getting a specific license
    getLicense: (id) => api.get(`/licenses/${id}/`),
    // getting all the license types to match to the current track
    getLicenseTypes: () => api.get('/license_types/'),
  };
  
  // You can add more API groups as needed (e.g., cartApi, orderApi)

export default api;
