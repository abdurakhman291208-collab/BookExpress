import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBooks from './AdminBooks';
import AdminOrders from './AdminOrders';
import AdminCouriers from './AdminCouriers';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('books');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Панель администратора</h2>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-button ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Книги
          </button>
          <button
            className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Заказы
          </button>
          <button
            className={`nav-button ${activeTab === 'couriers' ? 'active' : ''}`}
            onClick={() => setActiveTab('couriers')}
          >
            Курьеры
          </button>
          <button onClick={() => navigate('/')} className="nav-button">
            Вернуться в магазин
          </button>
          <button onClick={handleLogout} className="nav-button logout">
            Выход
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'books' && <AdminBooks />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'couriers' && <AdminCouriers />}
      </div>
    </div>
  );
}
