import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaBook, FaUser } from 'react-icons/fa';
import './NotFound.css';

/**
 * Страница 404 (Не найдено)
 * Отображается когда пользователь пытается доступ к несуществующему маршруту
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Страница не найдена</h1>
          <p className="error-description">
            Похоже, страница, которую вы ищете, была переведена в другое место или удалена.
          </p>
          
          <div className="suggestions">
            <p className="suggestions-title">Может быть вы ищете:</p>
            <div className="suggestions-links">
              <Link to="/" className="suggestion-link">
                <FaHome size={18} /> На главную страницу
              </Link>
              <Link to="/books" className="suggestion-link">
                <FaBook size={18} /> Каталог книг
              </Link>
              <Link to="/profile" className="suggestion-link">
                <FaUser size={18} /> Мой профиль
              </Link>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            title="Вернуться на предыдущую страницу"
          >
            ← Вернуться назад
          </button>
        </div>

        <div className="not-found-graphic">
          <div className="book-stack">
            <div className="book book-1"></div>
            <div className="book book-2"></div>
            <div className="book book-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
