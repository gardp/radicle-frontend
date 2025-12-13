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
  
  // Response interceptor: Handle token expiration and refresh (hardened)
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;

      const status = error?.response?.status;
      const code = error?.response?.data?.code;
      const is401 = status === 401;
      const isTokenInvalid = code === 'token_not_valid';
      const isRefreshCall = originalRequest?.url?.includes('/accounts/token/refresh/');
      const alreadyRetried = Boolean(originalRequest?._retry);

      // Attempt a one-time token refresh on 401 token_not_valid (but not for the refresh endpoint itself)
      if (is401 && isTokenInvalid && !alreadyRetried && !isRefreshCall) {
        originalRequest._retry = true; // prevent loops
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          try {
            const resp = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = resp?.data?.access;
            if (newAccessToken) {
              localStorage.setItem('access_token', newAccessToken);
              originalRequest.headers = {
                ...(originalRequest.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
              };
              return api(originalRequest); // retry with fresh token
            }
          } catch (refreshError) {
            console.error('Unable to refresh token:', refreshError);
            // Fall through to rejection below after cleanup/redirect
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
      }

      // Optional structured logging to help diagnostics
      if (!error?.response) {
        console.error('Network/No-response error:', {
          message: error?.message,
          url: originalRequest?.url,
          method: originalRequest?.method,
        });
      } else {
        console.error('API error:', {
          status: error.response.status,
          url: originalRequest?.url,
          data: error.response.data,
        });
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
  
  // Music API- getiing the libraries and tracks to add to the playlist
  export const libraryApi = {
    getLibraries: () => api.get('/libraries/')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get libraries:', error);
      throw error;
    }),
    getLibraryDetail: (id) => api.get(`/libraries/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get library detail:', error);
      throw error;
    }),
  };

  // Music API- getting track for library and license
  export const trackApi = {
    getTracks: (params = {}) => api.get('/tracks/', {params}) // params for search, pagination etc.
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get tracks:', error);
      throw error;
    }),
    getTrackDetail: (id) => api.get(`/tracks/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get track detail:', error);
      throw error;
    }),
    // createTrack: (trackData) => api.post('/tracks/', trackData),
  };

export const trackLicenseOptionApi = {
    getTrackLicenseOption: () => api.get(`/track-license-options/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get track license option:', error);
      throw error;
    }),
    getTrackLicenseOptionById: (id) => api.get(`/track-license-options/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get track license option:', error);
      throw error;
    }),
    getTrackLicenseOptionByTrackId: (id) => api.get(`/track-license-options/by-track/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get track license option by track id:', error);
      throw error;
    }),
  };



  // Track Licensing Option which is a combination of a track and a license type
  export const trackStorageFileApi = {
    getTrackStorageFile: () => api.get(`/track-storage-files/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get track storage file:', error);
      throw error;
    }),
    getTrackStorageFileById: (id) => api.get(`/track-storage-files/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get track storage file:', error);
      throw error;
    }),
  };
  

  // License Type API to extract the license types for the pricing table
export const licenseTypeApi = {
    getLicenseTypes: () => api.get('/license_types/')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get license types:', error);
      throw error;
    }),
    getLicenseTypeById: (id) => api.get(`/license_types/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get license type:', error);
      throw error;
    }),
  };

  // now the endpoint to get the license to show to the licensee after the backend has created it
  export const licenseApi = {
    getLicense: () => api.get('/licenses/')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get license:', error);
      throw error;
    }),
    getLicenseById: (id) => api.get(`/licenses/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to get license:', error);
      throw error;
    }),
  };

  //now export orderApi for the checkout to submit order before payment
  export const orderApi = {
    checkoutOrder: (orderData, config = {}) => api.post('/orders/checkout/', orderData, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to checkout order:', error);
      throw error;
    }),
  };

  // Now the payment API
  export const paymentApi = {
    paymentIntent: (paymentData, config = {}) => api.post('/payments/create_payment_intent/', paymentData, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Failed to process payment:', error);
      throw error;
    }),
    // Add this for PayPal capture
    capturePayPalOrder: (data, config = {}) => api.post('/payments/capture_paypal_order/', data, config)
    .then(response => response.data)
    .catch(error => {
      console.error('Failed to capture PayPal order:', error);
      throw error;
    }),
  };



