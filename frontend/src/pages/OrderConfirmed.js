import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { MdLocalShipping, MdStorefront, MdLocationOn } from 'react-icons/md';
import { FaBoxOpen, FaEnvelope } from 'react-icons/fa';
import { orderService } from '../services/api';
import './OrderConfirmed.css';

/**
 * Страница подтверждения заказа
 * Отображает успешное оформление заказа с деталями
 */
export default function OrderConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Загрузить информацию о заказе
   */
  const loadOrderData = async () => {
    try {
      const orderId = location.state?.orderId;
      if (orderId) {
        const response = await orderService.getOrder(orderId);
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки заказа:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Загрузка информации о заказе..." />;

  return (
    <div className="confirmed-page">
      <div className="container">
        <div className="confirmation-content">
          {/* Success Animation */}
          <div className="success-animation">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          {/* Confirmation Card */}
          <div className="confirmation-card">
            <h1 className="confirmation-title">Спасибо за заказ!</h1>
            <p className="confirmation-subtitle">Ваш заказ успешно оформлен и обрабатывается</p>

            {order && (
              <div className="order-info">
                <div className="info-section">
                  <h3>📋 Детали заказа</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Номер заказа:</span>
                      <span className="info-value">{order._id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Дата:</span>
                      <span className="info-value">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Статус:</span>
                      <span className="status-badge status-new">Новый</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Товаров:</span>
                      <span className="info-value">{order.books.length} позиций</span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3><FaBoxOpen size={20} /> Стоимость</h3>
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Сумма товаров:</span>
                      <span>₸{order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>Доставка:</span>
                      <span className="highlight">
                        {order.deliveryType === 'pickup' ? 'Бесплатно (самовывоз)' : 'Уточняется'}
                      </span>
                    </div>
                    <div className="price-row total">
                      <span>Итого:</span>
                      <span>₸{order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3><MdLocationOn size={20} /> Адрес доставки</h3>
                  <div className="delivery-info">
                    <p className="delivery-address">{order.address}</p>
                    <p className="delivery-city">{order.city}</p>
                    <p className="delivery-type">
                      {order.deliveryType === 'courier' 
                        ? <><MdLocalShipping size={16} /> Доставка курьером</>
                        : <><MdStorefront size={16} /> Самовывоз</>}
                    </p>
                  </div>
                </div>

                <div className="info-section">
                  <h3><FaBoxOpen size={20} /> Товары</h3>
                  <div className="items-list">
                    {order.books.map((book, idx) => (
                      <div key={idx} className="item-row">
                        <span className="item-name">
                          {book.title || 'Книга'}
                          <span className="item-qty">x{book.quantity}</span>
                        </span>
                        <span className="item-price">${(book.price * book.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="next-steps">
              <h3><FaEnvelope size={20} /> Что дальше?</h3>
              <ul className="steps-list">
                <li>На ваш email будет отправлено письмо с подтверждением заказа</li>
                <li>Вы сможете отслеживать статус заказа в личном кабинете</li>
                <li>При доставке курьером - контактные данные курьера придут за 1-2 дня</li>
                <li>В случае вопросов можете обратиться в поддержку</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={() => navigate('/profile')}
                className="btn btn-primary btn-lg"
              >
                Мои заказы
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary btn-lg"
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
