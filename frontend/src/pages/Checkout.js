import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { FmapPin, FaTruck, FaCreditCard } from 'react-icons/fa';
import { MdPayment, MdLocationOn, MdLocalShipping } from 'react-icons/md';
import { orderService } from '../services/api';
import './Checkout.css';

/**
 * Страница оформления заказа
 * Сбирает информацию о доставке и способе оплаты перед созданием заказа
 */
export default function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    deliveryType: 'courier',
    paymentMethod: 'card',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Загрузить данные пользователя и корзину
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/login');
        return;
      }

      setUser(userData);
      setFormData((prev) => ({
        ...prev,
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
      }));

      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cartData.length === 0) {
        navigate('/cart');
        return;
      }
      
      setCart(cartData);
      const total = cartData.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Ошибка инициализации Checkout:', error);
      navigate('/');
    }
  }, [navigate]);

  /**
   * Валидация формы
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

    if (!formData.address?.trim()) {
      newErrors.address = 'Адрес обязателен';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Адрес должен быть не менее 5 символов';
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'Город обязателен';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'Город должен быть не менее 2 символов';
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
      // Подготовить данные заказа
      const books = cart.map((item) => ({
        bookId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        books,
        totalPrice,
        ...formData,
      };

      // Создать заказ
      const response = await orderService.createOrder(orderData);

      // Очистить корзину
      localStorage.removeItem('cart');
      
      setAlert({ message: 'Заказ успешно оформлен!', type: 'success' });

      // Перенаправить на страницу подтверждения
      setTimeout(() => {
        navigate('/order-confirmed', { state: { orderId: response.data._id } });
      }, 1500);
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      setAlert({
        message: error.response?.data?.error || 'Ошибка при оформлении заказа. Попробуйте позже.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) return null;

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Оформление заказа</h1>
          <p>Последний шаг перед завершением покупки</p>
        </div>

        <Loader isLoading={loading} message="Обработка заказа..." />

        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />

        <div className="checkout-container">
          {/* Форма оформления */}
          <div className="checkout-form">
            <form onSubmit={handleSubmit} noValidate>
              {/* Информация о доставке */}
              <div className="form-section">
                <h3 className="section-title"><MdLocationOn size={20} /> Информация о доставке</h3>

                <div className="form-group">
                  <label htmlFor="name">Имя и фамилия *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ваше полное имя"
                    className={errors.name ? 'input-error' : ''}
                    disabled={loading}
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
                    placeholder="+7 (999) 123 45 67"
                    className={errors.phone ? 'input-error' : ''}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Адрес доставки *</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Улица, дом, квартира"
                    className={errors.address ? 'input-error' : ''}
                    disabled={loading}
                  />
                  {errors.address && (
                    <span className="error-message">{errors.address}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">Город *</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ваш город"
                    className={errors.city ? 'input-error' : ''}
                    disabled={loading}
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>
              </div>

              {/* Способ доставки */}
              <div className="form-section">
                <h3 className="section-title"><MdLocalShipping size={20} /> Способ доставки</h3>

                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="courier"
                      checked={formData.deliveryType === 'courier'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">
                      <strong>Доставка курьером</strong>
                      <small>1-3 дня, стоимость уточняется</small>
                    </span>
                  </label>
                </div>

                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={formData.deliveryType === 'pickup'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">
                      <strong>Самовывоз</strong>
                      <small>Бесплатно, готово к выдаче в течение 1 часа</small>
                    </span>
                  </label>
                </div>
              </div>

              {/* Способ оплаты */}
              <div className="form-section">
                <h3 className="section-title"><MdPayment size={20} /> Способ оплаты</h3>

                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">
                      <strong>Оплата картой</strong>
                      <small>Безопасная оплата банковской картой онлайн</small>
                    </span>
                  </label>
                </div>

                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">
                      <strong>Оплата при доставке</strong>
                      <small>Рассчитайтесь при получении заказа</small>
                    </span>
                  </label>
                </div>
              </div>

              {/* Кнопка отправки */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading || cart.length === 0}
                >
                  {loading ? 'Обработка заказа...' : 'Подтвердить заказ'}
                </button>
                <Link to="/cart" className="btn btn-secondary btn-lg">
                  ← Вернуться в корзину
                </Link>
              </div>
            </form>
          </div>

          {/* Сводка заказа */}
          <aside className="order-summary">
            <div className="summary-card">
              <h3>📋 Сводка заказа</h3>

              <div className="order-items">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div>
                        <p className="item-title">{item.title}</p>
                        <p className="item-qty">{item.quantity} шт.</p>
                      </div>
                    </div>
                    <p className="item-price">
                      ₸{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Товары:</span>
                  <span>₸{cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toFixed(2)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Доставка:</span>
                  <span className="highlight">
                    {formData.deliveryType === 'pickup' ? 'Бесплатно' : 'Уточняется'}
                  </span>
                </div>
                <div className="breakdown-row total">
                  <span>Итого к оплате:</span>
                  <span className="price">₸{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Информация о защите */}
              <div className="security-info">
                <p>✓ Безопасная доставка и оплата</p>
                <p>✓ Возврат в течение 14 дней</p>
                <p>✓ Поддержка 24/7</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
