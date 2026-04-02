import React, { useState, useEffect, useMemo } from 'react';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { FaBoxOpen } from 'react-icons/fa';
import { MdLocalShipping, MdStorefront } from 'react-icons/md';
import { orderService } from '../services/api';
import './Admin.css';

/**
 * Страница администратора для управления заказами
 * Отображает все заказы, фильтрует по статусам, позволяет изменять статус
 */
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  /**
   * Загрузить все заказы с сервера
   */
  const loadOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      setAlert({
        message: 'Не удалось загрузить заказы',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Получить отфильтрованный список заказов
   */
  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  /**
   * Обновить статус заказа
   */
  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setAlert({ message: 'Статус заказа обновлен', type: 'success' });
      loadOrders();
      setExpandedOrder(null);
    } catch (error) {
      setAlert({
        message: 'Не удалось обновить статус',
        type: 'error',
      });
    }
  };

  /**
   * Получить текст статуса
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'Новый заказ';
      case 'accepted':
        return 'Принят';
      case 'in_delivery':
        return 'На доставке';
      case 'delivered':
        return 'Доставлен';
      default:
        return status;
    }
  };

  /**
   * Получить класс статуса
   */
  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  /**
   * Подсчитать заказы по статусам
   */
  const getOrderCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  if (loading) return <Loader message="Загрузка заказов..." />;

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1><FaBoxOpen size={28} /> Управление заказами</h1>
        <p className="text-muted">Всего заказов: {orders.length}</p>
      </div>

      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все <span className="badge">{getOrderCount('all')}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
          onClick={() => setFilter('new')}
        >
          Новые <span className="badge">{getOrderCount('new')}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Принятые <span className="badge">{getOrderCount('accepted')}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'in_delivery' ? 'active' : ''}`}
          onClick={() => setFilter('in_delivery')}
        >
          На доставке <span className="badge">{getOrderCount('in_delivery')}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => setFilter('delivered')}
        >
          Доставлены <span className="badge">{getOrderCount('delivered')}</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <p className="empty-message">Нет заказов в этой категории</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`order-card ${expandedOrder === order._id ? 'expanded' : ''}`}
              >
                <div
                  className="order-card-header"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order._id ? null : order._id
                    )
                  }
                >
                  <div className="order-info">
                    <p className="order-id">№ {order._id.slice(0, 8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>

                  <div className="order-customer">
                    <p className="customer-name">{order.name || 'Неизвестный'}</p>
                    <p className="customer-phone">{order.phone}</p>
                  </div>

                  <div className="order-price">
                    <p className="price">₸{order.totalPrice.toFixed(2)}</p>
                    <p className="items-count">{order.books.length} товар(ов)</p>
                  </div>

                  <div className="order-status">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <button className="expand-btn">
                    {expandedOrder === order._id ? '▼' : '▶'}
                  </button>
                </div>

                {/* Order Details */}
                {expandedOrder === order._id && (
                  <div className="order-card-details">
                    <div className="details-section">
                      <h4>📍 Информация о доставке</h4>
                      <div className="detail-row">
                        <span className="label">Адрес:</span>
                        <span className="value">{order.address}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Город:</span>
                        <span className="value">{order.city}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Тип доставки:</span>
                        <span className="value">
                          {order.deliveryType === 'courier' ? <><MdLocalShipping size={16} /> Курьер</> : <><MdStorefront size={16} /> Самовывоз</>}
                        </span>
                      </div>
                    </div>

                    <div className="details-section">
                      <h4>💳 Отчисления</h4>
                      <div className="detail-row">
                        <span className="label">Способ оплаты:</span>
                        <span className="value">
                          {order.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Всего:</span>
                        <span className="value price">₸{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="details-section">
                      <h4>📦 Товары</h4>
                      <div className="items-table">
                        {order.books.map((book, idx) => (
                          <div key={idx} className="items-row">
                            <span className="item-title">{book.title || 'Книга'}</span>
                            <span className="item-qty">x{book.quantity}</span>
                            <span className="item-price">
                              ₸{(book.price * book.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Change */}
                    <div className="status-controls">
                      <h4>🔄 Изменить статус</h4>
                      <div className="status-buttons">
                        {['new', 'accepted', 'in_delivery', 'delivered'].map((status) => (
                          <button
                            key={status}
                            className={`status-btn ${order.status === status ? 'current' : ''}`}
                            onClick={() => handleStatusChange(order._id, status)}
                            disabled={order.status === status}
                          >
                            {getStatusText(status)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
