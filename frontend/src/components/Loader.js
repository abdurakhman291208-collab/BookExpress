import React from 'react';
import './Loader.css';

/**
 * Компонент Loader для отображения индикатора загрузки
 * @param {Object} props - Пропсы компонента
 * @param {boolean} props.isLoading - Показывать ли лоадер
 * @param {string} props.message - Текст сообщения (опционально)
 * @returns {JSX.Element|null} Лоадер или null
 */
export default function Loader({ isLoading = true, message = 'Загрузка...' }) {
  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
}
