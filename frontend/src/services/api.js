import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bookexpress.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Перехватчик для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Очистить данные пользователя при ошибке 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Сервис аутентификации
 */
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

/**
 * Сервис работы с книгами
 */
export const bookService = {
  getBooks: () => api.get('/books'),
  getBook: (id) => api.get(`/books/${id}`),
  addBook: (data) => api.post('/books', data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

/**
 * Сервис работы с заказами
 */
export const orderService = {
  getCourierOrders: () => api.get('/orders/courier'),
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  acceptOrder: (id) => api.post(`/orders/${id}/accept`),
  getOrder: (id) => api.get(`/orders/${id}`),
  getMyActiveOrders: () => api.get('/orders/my-orders'),
};

/**
 * Сервис работы с курьерами
 */
export const courierService = {
  createApplication: (data) => api.post('/couriers', data),
  getApplications: () => {
    console.log('📤 Frontend: Sending GET /couriers with token');
    return api.get('/couriers');
  },
  getCouriers: () => {
    console.log('📤 Frontend: Sending GET /couriers/approved');
    return api.get('/couriers/approved');
  },
  updateStatus: (id, data) => api.put(`/couriers/${id}`, data),
  approveApplication: (applicationId, userId) => {
    console.log('📤 Frontend: Approving courier', applicationId);
    return api.put(`/couriers/${applicationId}`, { status: 'approved', userId });
  },
  rejectApplication: (applicationId, reason) => {
    console.log('📤 Frontend: Rejecting courier', applicationId);
    return api.put(`/couriers/${applicationId}`, { status: 'rejected', rejectionReason: reason });
  },
};

export default api;
