import React, { useEffect } from 'react';
import './Alert.css';

/**
 * Компонент Alert для отображения уведомлений
 * @param {Object} props - Пропсы компонента
 * @param {string} props.message - Текст сообщения
 * @param {string} props.type - Тип уведомления ('success', 'error', 'info')
 * @param {function} props.onClose - Функция закрытия
 * @returns {JSX.Element|null} Уведомление или null
 */
export default function Alert({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span>{message}</span>
        {onClose && (
          <button className="alert-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
