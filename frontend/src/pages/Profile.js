import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { FaUser, FaBoxOpen, FaTruck } from 'react-icons/fa';
import { MdLocalShipping, MdStorefront } from 'react-icons/md';
import { authService, orderService, courierService } from '../services/api';
import './Profile.css';

/**
 * Страница профиля пользователя
 * Отображает информацию пользователя, заказы и форму приложения курьера
 */
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [courierStatus, setCourierStatus] = useState(null);
  const [courierFormState, setCourierFormState] = useState('form'); // 'form', 'pending', 'approved'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCourierForm, setShowCourierForm] = useState(false);
  const [courierData, setCourierData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    comment: '',
  });
  const [submittingCourier, setSubmittingCourier] = useState(false);

  /**
   * Загрузить данные пользователя, его заказы и статус приложения
   */
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const profileResponse = await authService.getProfile();
      const userData = profileResponse.data;
      setUser(userData);

      localStorage.setItem('user', JSON.stringify(userData));

      setFormData({
        name: userData.name,
        phone: userData.phone,
        address: userData.address || '',
        city: userData.city || '',
      });

      if (userData.isCourier) {
        setCourierFormState('approved');
        return;
      }

      const ordersResponse = await orderService.getUserOrders();
      setOrders(ordersResponse.data);

      try {
        const appsResponse = await courierService.getApplications();
        if (appsResponse.data?.length > 0) {
          const app = appsResponse.data[0];
          setCourierStatus(app);

          if (app.status === 'approved') setCourierFormState('approved');
          else if (app.status === 'pending') setCourierFormState('pending');
        }
      } catch (e) {
        // Заявка может не существовать, это нормально
      }
    } catch (error) {
      setAlert({
        message: 'Не удалось загрузить профиль',
        type: 'error',
      });
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    const interval = setInterval(() => {
      console.log('🔄 Polling user status...');
      loadUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  /**
   * Валидация формы профиля
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Имя обязательно';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно быть не менее 2 символов';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^[0-9+\-\s()]{10,}/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона';
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Обработчик отправки формы профиля
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setAlert({ message: '', type: '' });

    try {
      await authService.updateProfile(formData);
      setAlert({ message: 'Профиль успешно обновлен', type: 'success' });
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || 'Ошибка обновления',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Обработчик изменения поля формы курьера
   */
  const handleCourierChange = (e) => {
    const { name, value } = e.target;
    setCourierData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Валидация формы курьера
   */
  const validateCourierForm = () => {
    const newErrors = {};

    if (!courierData.name?.trim()) {
      newErrors.name = 'Имя обязательно';
    } else if (courierData.name.trim().length < 2) {
      newErrors.name = 'Имя должно быть не менее 2 символов';
    }

    if (!courierData.phone?.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^[0-9+\-\s()]{10,}/.test(courierData.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (!courierData.email?.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(courierData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!courierData.city?.trim()) {
      newErrors.city = 'Город обязателен';
    } else if (courierData.city.trim().length < 2) {
      newErrors.city = 'Город должен быть не менее 2 символов';
    }

    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  /**
   * Обработчик отправки формы курьера
   */
  const handleCourierSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid } = validateCourierForm();
    if (!isValid) {
      setAlert({ message: 'Заполните все обязательные поля корректно', type: 'error' });
      return;
    }

    setSubmittingCourier(true);
    setAlert({ message: '', type: '' });

    try {
      await courierService.createApplication(courierData);
      setAlert({ message: 'Заявка успешно отправлена! Администратор проверит её в течение дня.', type: 'success' });
      setCourierFormState('pending');
      setShowCourierForm(false);
      setCourierData({
        name: '',
        phone: '',
        email: '',
        city: '',
        comment: '',
      });
      loadUserData();
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || 'Ошибка при отправке заявки',
        type: 'error',
      });
    } finally {
      setSubmittingCourier(false);
    }
  };

  /**
   * Получить текст статуса приложения
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'На рассмотрении';
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      default:
        return 'Неизвестно';
    }
  };

  if (loading) return <Loader message="Загрузка профиля..." />;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1><FaUser size={28} /> Мой профиль</h1>
          <p>Управление личной информацией и заказами</p>
        </div>

        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />

        <div className="profile-container">
          {/* Форма профиля */}
          <div className="profile-card">
            <div className="card-header">
              <h2>📋 Личная информация</h2>
              <p className="text-muted">Ваш аккаунт и контактные данные</p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Имя и фамилия *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'input-error' : ''}
                    placeholder="Ваше полное имя"
                    disabled={saving}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Номер телефона *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'input-error' : ''}
                    placeholder="+7 (999) 123 45 67"
                    disabled={saving}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-disabled"
                />
                <small className="text-muted">Email не может быть изменён</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Адрес доставки</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Улица, дом, квартира"
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">Город</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ваш город"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          </div>

          {/* ===== ЕДИНАЯ СЕКЦИЯ КУРЬЕРА ===== */}
          {/* Когда пользователь уже курьер */}
          {courierFormState === 'approved' && (
            <div className="courier-section">
              <div className="card-header">
                <h2><FaTruck size={24} /> Вы курьер</h2>
              </div>
              <div className="status-badge status-approved">
                <span className="badge-icon">✓</span>
                <div className="badge-content">
                  <strong>Вы одобрены как курьер!</strong>
                  <p>Начните принимать заказы на доставку прямо сейчас.</p>
                  <button 
                    onClick={() => navigate('/courier/dashboard')}
                    className="btn btn-primary mt-3"
                  >
                    Открыть панель курьера →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Когда пользователь НЕ курьер - показываем форму со 3 состояниями */}
          {courierFormState !== 'approved' && (
            <div className="courier-section">
              {/* Состояние 1: Форма для подачи заявки */}
              {courierFormState === 'form' && (
                <div>
                  <div className="card-header">
                    <h2><FaTruck size={24} /> Стать курьером</h2>
                    <p className="text-muted">Заработок на доставке книг</p>
                  </div>
                  
                  {!showCourierForm ? (
                    <div className="courier-benefits">
                      <h3 style={{ marginBottom: '16px', color: 'var(--dark)' }}>Преимущества работы курьером:</h3>
                      <ul className="benefits-list">
                        <li>✓ Гибкий график работы</li>
                        <li>✓ Конкурентная заработная плата</li>
                        <li>✓ Быстрая обработка заказов</li>
                        <li>✓ Поддержка 24/7</li>
                      </ul>
                      <button
                        onClick={() => setShowCourierForm(true)}
                        className="btn btn-primary btn-lg btn-block"
                      >
                        Отправить заявку
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCourierSubmit} className="courier-form">
                      <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="courier-name">Имя *</label>
                      <input
                        id="courier-name"
                        type="text"
                        name="name"
                        value={courierData.name}
                        onChange={handleCourierChange}
                        placeholder="Ваше имя"
                        disabled={submittingCourier}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="courier-phone">Телефон *</label>
                      <input
                        id="courier-phone"
                        type="tel"
                        name="phone"
                        value={courierData.phone}
                        onChange={handleCourierChange}
                        placeholder="+7 (999) 123 45 67"
                        disabled={submittingCourier}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="courier-email">Email (Gmail) *</label>
                      <input
                        id="courier-email"
                        type="email"
                        name="email"
                        value={courierData.email}
                        onChange={handleCourierChange}
                        placeholder="your.email@gmail.com"
                        disabled={submittingCourier}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="courier-city">Город *</label>
                      <input
                        id="courier-city"
                        type="text"
                        name="city"
                        value={courierData.city}
                        onChange={handleCourierChange}
                        placeholder="Город, в котором вы хотите работать"
                        disabled={submittingCourier}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="courier-comment">Комментарий (опционально)</label>
                    <textarea
                      id="courier-comment"
                      name="comment"
                      value={courierData.comment}
                      onChange={handleCourierChange}
                      placeholder="Дополнительная информация о вас..."
                      disabled={submittingCourier}
                      rows="4"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={submittingCourier}
                    >
                      {submittingCourier ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCourierForm(false)}
                      disabled={submittingCourier}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}
                </div>
              )}

              {/* Состояние 2: Ожидание рассмотрения */}
              {courierFormState === 'pending' && (
                <div>
                  <div className="card-header">
                    <h2><FaTruck size={24} /> Статус заявки</h2>
                  </div>
                  <div className="status-badge status-pending">
                    <span className="badge-icon">⏳</span>
                    <div className="badge-content">
                      <strong>Ваша заявка на рассмотрении</strong>
                      <p>Администратор проверит её в течение 1-2 рабочих дней. Мы свяжемся с вами по указанным контактам.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Состояние 3: Одобрено как курьер */}
              {courierFormState === 'approved' && (
                <div>
                  <div className="card-header">
                    <h2><FaTruck size={24} /> Заявка одобрена!</h2>
                  </div>
                  <div className="status-badge status-approved">
                    <span className="badge-icon">✓</span>
                    <div className="badge-content">
                      <strong>Поздравляем! Вы одобрены как курьер 🎉</strong>
                      <p>Теперь вы можете начать принимать заказы на доставку. Перейдите в вашу панель курьера для просмотра доступных заказов.</p>
                      <button 
                        onClick={() => navigate('/courier-dashboard')}
                        className="btn btn-primary mt-3"
                      >
                        Перейти в панель курьера →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Мои заказы */}
        <div className="orders-section">
          <div className="card-header">
            <h2><FaBoxOpen size={24} /> Мои заказы</h2>
            <p className="text-muted">{orders.length} заказ(ов) в системе</p>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📚</p>
              <p className="empty-message">У вас пока нет заказов</p>
              <a href="/" className="btn btn-primary btn-sm">Начать покупки</a>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <p className="order-id">№ {order._id.slice(0, 8).toUpperCase()}</p>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`status-badge status-${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="order-details">
                    <div className="detail-item">
                      <span className="label">Товары:</span>
                      <span className="value">{order.books.length} позиций</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Итого:</span>
                      <span className="value price">₸{order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Доставка:</span>
                      <span className="value">
                        {order.deliveryType === 'courier' ? <><MdLocalShipping size={16} /> Курьером</> : <><MdStorefront size={16} /> Самовывоз</>}
                      </span>
                    </div>
                  </div>

                  {order.deliveryType === 'courier' && (
                    <div className="order-address">
                      <small className="text-muted">Адрес доставки:</small>
                      <p>{order.address}, {order.city}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
