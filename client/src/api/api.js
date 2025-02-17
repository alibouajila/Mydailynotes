import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, 
});

const isTokenExpired = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return true;

  const [, payloadBase64] = token.split('.'); 
  const payload = JSON.parse(atob(payloadBase64)); 
  const currentTime = Math.floor(Date.now() / 1000); 

  return payload.exp < currentTime; 
};

const refreshToken = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3001/refresh-token',
      {}, // No body needed
      { withCredentials: true } // Ensure cookies are sent
    );

    const newToken = response.data.token;
    localStorage.setItem('authToken', newToken); // Store new token
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Force login again
    throw error;
  }
};


api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('authToken');

    if (isTokenExpired() && token) {
      token = await refreshToken(); 
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); 
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
