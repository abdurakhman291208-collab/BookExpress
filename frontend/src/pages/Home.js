import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { bookService } from '../services/api';
import './Home.css';

/**
 * Главная страница каталога книг
 * Отображает список доступных книг с функцией поиска и добавления в корзину
 */
export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Загрузить книги при монтировании компонента
  useEffect(() => {
    loadBooks();
  }, []);

  /**
   * Загружает список книг с сервера
   */
  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки книг:', error);
      setAlert({
        message: error.response?.data?.error || 'Ошибка при загрузке книг',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Фильтрует книги по поисковому запросу (название, автор, описание)
   */
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;

    const query = searchQuery.toLowerCase();
    return books.filter((book) => {
      const titleMatch = book.title?.toLowerCase().includes(query);
      const authorMatch = book.author?.toLowerCase().includes(query);
      const descriptionMatch = book.description?.toLowerCase().includes(query);
      return titleMatch || authorMatch || descriptionMatch;
    });
  }, [books, searchQuery]);

  /**
   * Добавляет выбранную книгу в корзину
   * @param {Object} book - Объект книги для добавления
   */
  const handleAddToCart = (book) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item) => item.id === book._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: book._id,
          title: book.title,
          price: book.price,
          image: book.image,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      setAlert({
        message: `"${book.title}" добавлена в корзину!`,
        type: 'success',
      });
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      setAlert({
        message: 'Ошибка при добавлении в корзину',
        type: 'error',
      });
    }
  };

  /**
   * Очищает поисковый запрос
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) return <Loader isLoading={true} message="Загрузка каталога..." />;

  return (
    <div className="home-page">
      <div className="container">
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />

        <div className="page-header">
          <h1>Книжный магазин</h1>
          <p>Откройте для себя и заказывайте ваши любимые книги</p>
        </div>

        {/* Поисковая строка */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Поиск по названию, автору или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Поиск книг"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="clear-search-btn"
                aria-label="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="search-results-count">
              Найдено книг: <strong>{filteredBooks.length}</strong>
            </p>
          )}
        </div>

        {/* Список книг */}
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchQuery
                ? `Книги не найдены по запросу "${searchQuery}"`
                : 'Книги не доступны'}
            </p>
            {searchQuery && (
              <button onClick={clearSearch} className="btn btn-secondary">
                Очистить поиск
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-image">
                  <img src={book.image} alt={book.title} loading="lazy" onError={(e) => {e.target.src = "https://via.placeholder.com/150x220?text=No+Image";
  }}
/>
                  {book.stock <= 5 && (
                    <div className="stock-warning">
                      Осталось {book.stock} шт.
                    </div>
                  )}
                </div>
                <div className="book-content">
                  <h3 className="book-title">{book.title}</h3>
                  {book.author && <p className="book-author">{book.author}</p>}
                  {book.description && (
                    <p className="book-description">{book.description}</p>
                  )}
                  <p className="book-price">₸{book.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="btn btn-primary btn-block"
                    disabled={book.stock === 0}
                    aria-label={`Добавить "${book.title}" в корзину`}
                  >
                    {book.stock > 0 ? 'В корзину' : 'Нет в наличии'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
