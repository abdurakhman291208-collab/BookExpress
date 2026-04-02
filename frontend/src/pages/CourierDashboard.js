import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import './CourierDashboard.css';

export default function CourierDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getCourierOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (id) => {
    try {
      await orderService.acceptOrder(id);
      fetchOrders();
    } catch (err) {
      console.error('Ошибка принятия заказа:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="courier-container">
      <h1>🚚 Панель курьера</h1>

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order._id} className="order-card">

            <h3>📦 Заказ #{order._id.slice(0, 6)}</h3>

            {/* СТАТУС */}
            <span className={`status ${order.status}`}>
              {order.status === 'pending' && 'Свободный'}
              {order.status === 'accepted' && 'Принят'}
              {order.status === 'in_delivery' && 'В доставке'}
              {order.status === 'delivered' && 'Доставлен'}
            </span>

            {/* ДАННЫЕ КЛИЕНТА */}
            <p><strong>👤 Клиент:</strong> {order.userId?.name || 'Не указано'}</p>
            <p><strong>📞 Телефон:</strong> {order.userId?.phone || '—'}</p>
            <p><strong>📍 Адрес:</strong> {order.address}</p>
            <p><strong>💰 Сумма:</strong> {order.totalPrice} ₸</p>

            {/* КНОПКИ */}
            <div className="actions">

              {/* Свободный заказ */}
              {order.status === 'pending' && (
                <button onClick={() => acceptOrder(order._id)}>
                  ✅ Принять
                </button>
              )}

              {/* Мои заказы */}
              {order.isMine && order.status === 'accepted' && (
                <button onClick={() => updateStatus(order._id, 'in_delivery')}>
                  🚚 В доставке
                </button>
              )}

              {order.isMine && order.status === 'in_delivery' && (
                <button onClick={() => updateStatus(order._id, 'delivered')}>
                  📦 Доставлено
                </button>
              )}

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}