import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { authService } from '../services/api';
import './Auth.css';

/**
 * Страница входа
 * @param {Object} props - Пропсы компонента
 * @param {Function} props.onLogin - Функция для обновления состояния пользователя
 */
export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginField: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  /**
   * Валидация формы
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.loginField.trim()) {
      newErrors.loginField = 'Email или телефон обязателен';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Пароль должен быть не менее 4 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Обработчик изменения поля формы
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Очистить ошибку поля при изменении
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert({ message: '', type: '' });

    try {
      const response = await authService.login(formData);
      
      console.log('✅ Login response:', response.data);
      console.log('👤 User from response:', response.data.user);
      
      // Сохранить токен и данные пользователя
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Вызвать функцию onLogin если передана
      if (onLogin) {
        onLogin(response.data.user);
      }

      setAlert({ message: 'Успешный вход!', type: 'success' });

      // Перенаправить в зависимости от роли пользователя
      setTimeout(() => {
        const isAdmin = response.data.user.email === 'admin@bookexpress.com';
        console.log('🔐 Is this user admin?', isAdmin);
        console.log('🔓 Navigating to:', isAdmin ? '/admin' : '/');
        navigate(isAdmin ? '/admin' : '/');
      }, 1500);
    } catch (error) {
      console.error('Ошибка входа:', error);
      setAlert({
        message: error.response?.data?.error || 'Ошибка при входе. Проверьте данные.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container-sm">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Вход в аккаунт</h1>
            <p>Введите ваши учётные данные для входа</p>
          </div>

          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ message: '', type: '' })}
          />

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="loginField">Email или телефон *</label>
              <input
                id="loginField"
                type="text"
                name="loginField"
                value={formData.loginField}
                onChange={handleChange}
                placeholder="user@example.com или +7 999 123 45 67"
                className={errors.loginField ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.loginField && (
                <span className="error-message">{errors.loginField}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль *</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                className={errors.password ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? 'Обработка...' : 'Вход'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Нет аккаунта?{' '}
              <Link to="/register" className="auth-link">
                Создать аккаунт
              </Link>
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
}
