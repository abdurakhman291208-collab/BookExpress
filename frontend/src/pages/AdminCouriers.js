import React, { useState, useEffect, useMemo } from 'react';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { FaTruck, FaUserCheck } from 'react-icons/fa';
import { MdPhoneInTalk, MdMail, MdPerson } from 'react-icons/md';
import { courierService } from '../services/api';
import './Admin.css';

/**
 * Страница администратора для управления курьерами
 * Отображает заявки курьеров и одобренных курьеров
 */
export default function AdminCouriers() {
  const [applications, setApplications] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [filter, setFilter] = useState('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Загрузить заявки и одобренных курьеров
   */
  const loadData = async () => {
    try {
      const [applicationsRes, couriersRes] = await Promise.all([
        courierService.getApplications(),
        courierService.getCouriers(),
      ]);

      setApplications(applicationsRes.data || []);
      setCouriers(couriersRes.data || []);
    } catch (error) {
      setAlert({
        message: 'Не удалось загрузить данные',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Одобрить заявку курьера
   */
  const handleApprove = async (applicationId, userId) => {
    try {
      await courierService.approveApplication(applicationId, userId);
      setAlert({ message: 'Курьер успешно одобрен', type: 'success' });
      loadData();
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || 'Ошибка при одобрении',
        type: 'error',
      });
    }
  };

  /**
   * Отклонить заявку курьера
   */
  const handleReject = async (applicationId) => {
    if (!rejectReason?.trim()) {
      setAlert({ message: 'Укажите причину отклонения', type: 'error' });
      return;
    }

    try {
      await courierService.rejectApplication(applicationId, rejectReason);
      setAlert({ message: 'Заявка отклонена', type: 'success' });
      setShowRejectForm(null);
      setRejectReason('');
      loadData();
    } catch (error) {
      setAlert({
        message: 'Ошибка при отклонении',
        type: 'error',
      });
    }
  };

  /**
   * Получить статус-класс
   */
  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    };
    return statusMap[status] || 'status-pending';
  };

  /**
   * Получить текст статуса
   */
  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Ожидание',
      approved: 'Одобрено',
      rejected: 'Отклонено',
    };
    return statusMap[status] || 'Неизвестно';
  };

  /**
   * Отфильтрованные заявки
   */
  const filteredApplications = useMemo(() => {
    if (filter === 'all') return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  /**
   * Количество заявок по статусам
   */
  const getApplicationCount = (status) => {
    if (status === 'all') return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  if (loading) return <Loader message="Загрузка данных курьеров..." />;

  return (
    <div className="admin-couriers">
      <div className="admin-header">
        <h1><FaTruck size={28} /> Управление курьерами</h1>
        <p className="text-muted">
          Заявок: {applications.length} | Одобрено: {couriers.length}
        </p>
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
          Все <span className="badge">{getApplicationCount('all')}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Ожидание <span className="badge">{getApplicationCount('pending')}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Одобрено <span className="badge">{getApplicationCount('approved')}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Отклонено <span className="badge">{getApplicationCount('rejected')}</span>
        </button>
      </div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🚚</p>
          <p className="empty-message">
            {filter === 'all'
              ? 'Заявки не найдены'
              : `Заявок со статусом "${getStatusText(filter)}" не найдено`}
          </p>
        </div>
      ) : (
        <div className="applications-grid">
          {filteredApplications.map((app) => (
            <div key={app._id} className={`application-card ${getStatusClass(app.status)}`}>
              <div className="app-header">
                <div className="app-info">
                  <h3 className="app-name">{app.name}</h3>
                  <p className="app-status">
                    <span className={`status-badge ${getStatusClass(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="app-details">
                <div className="detail-row">
                  <span className="label"><MdPhoneInTalk size={16} /> Телефон:</span>
                  <span className="value">{app.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label"><MdMail size={16} /> Email:</span>
                  <span className="value">{app.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label"><MdPerson size={16} /> Город:</span>
                  <span className="value">{app.city}</span>
                </div>
                {app.comment && (
                  <div className="detail-row">
                    <span className="label">Комментарий:</span>
                    <span className="value">{app.comment}</span>
                  </div>
                )}
                {app.rejectionReason && (
                  <div className="detail-row rejection-reason">
                    <span className="label">Причина отклонения:</span>
                    <span className="value">{app.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {app.status === 'pending' && (
                <div className="app-actions">
                  <button
                    className="btn-action approve"
                    onClick={() => handleApprove(app._id, app.userId)}
                    title="Одобрить заявку"
                  >
                    Одобрить
                  </button>
                  <button
                    className="btn-action reject"
                    onClick={() => setShowRejectForm(showRejectForm === app._id ? null : app._id)}
                    title="Отклонить заявку"
                  >
                    Отклонить
                  </button>
                </div>
              )}

              {/* Reject Form */}
              {showRejectForm === app._id && app.status === 'pending' && (
                <div className="reject-form">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Укажите причину отклонения..."
                    rows="3"
                  />
                  <div className="form-actions" style={{ flexDirection: 'row', gap: '12px', marginTop: '12px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleReject(app._id)}
                    >
                      Отклонить
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowRejectForm(null);
                        setRejectReason('');
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approved Couriers Section */}
      {couriers.length > 0 && (
        <div className="couriers-section">
          <h2><FaUserCheck size={24} /> Одобренные курьеры ({couriers.length})</h2>

          <div className="couriers-table">
            <div className="table-header">
              <div className="col-name">Имя</div>
              <div className="col-city">Город</div>
              <div className="col-orders">Заказов</div>
              <div className="col-rating">Рейтинг</div>
            </div>

            {couriers.map((courier) => (
              <div key={courier._id} className="table-row">
                <div className="col-name">
                  <span className="courier-icon"><MdPerson size={18} /></span>
                  {courier.name}
                </div>
                <div className="col-city">{courier.city || 'Не указан'}</div>
                <div className="col-orders">{courier.ordersCompleted || 0}</div>
                <div className="col-rating">
                  {courier.rating ? `☆ ${courier.rating.toFixed(1)}` : 'Нет оценки'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
