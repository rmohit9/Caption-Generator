import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 Unauthorized and we haven't already retried this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    // Ask backend for a new access token
                    const response = await axios.post(`${api.defaults.baseURL}token/refresh/`, {
                        refresh: refreshToken
                    });

                    // Save new access token
                    const newAccess = response.data.access;
                    localStorage.setItem('access', newAccess);

                    // Update the authorization header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    
                    processQueue(null, newAccess);
                    return api(originalRequest);
                    
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    // Refresh token is also expired/invalid -> Force logout
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('full_name');
                    
                    if (window.location.pathname !== '/login') {
                        window.dispatchEvent(new CustomEvent('session-expired'));
                        window.location.href = '/login?expired=1';
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                isRefreshing = false;
                // No refresh token exists -> Force logout
                localStorage.removeItem('access');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;