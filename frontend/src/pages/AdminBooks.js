import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { bookService } from '../services/api';
import './Admin.css';

/**
 * Страница администратора для управления книгами
 * Отображает все книги, позволяет добавлять, редактировать и удалять
 */
export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  /**
   * Загрузить все книги
   */
  const loadBooks = async () => {
    try {
      const response = await bookService.getBooks();
      setBooks(response.data);
    } catch (error) {
      setAlert({
        message: 'Не удалось загрузить книги',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработчик изменения поля формы
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Очистить форму
   */
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      price: '',
      stock: '',
      description: '',
      image: '',
    });
    setEditingBook(null);
  };

  /**
   * Редактировать книгу
   */
  const handleEdit = (book) => {
    setEditingBook(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      description: book.description,
      image: book.image,
    });
    setShowForm(true);
  };

  /**
   * Сохранить книгу
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      setAlert({ message: 'Название книги обязательно', type: 'error' });
      return;
    }

    try {
      if (editingBook) {
        await bookService.updateBook(editingBook, formData);
        setAlert({ message: 'Книга успешно обновлена', type: 'success' });
      } else {
        await bookService.addBook(formData);
        setAlert({ message: 'Книга успешно добавлена', type: 'success' });
      }
      resetForm();
      setShowForm(false);
      loadBooks();
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || 'Ошибка при сохранении книги',
        type: 'error',
      });
    }
  };

  /**
   * Удалить книгу
   */
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        await bookService.deleteBook(id);
        setAlert({ message: 'Книга успешно удалена', type: 'success' });
        loadBooks();
      } catch (error) {
        setAlert({
          message: 'Ошибка при удалении книги',
          type: 'error',
        });
      }
    }
  };

  if (loading) return <Loader message="Загрузка книг..." />;

  return (
    <div className="admin-books">
      <div className="admin-header">
        <h1>📚 Управление книгами</h1>
        <p className="text-muted">Всего книг: {books.length}</p>
      </div>

      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />

      {/* Add Book Button */}
      <button
        className="btn btn-primary btn-lg"
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        style={{ marginBottom: '24px' }}
      >
        + Добавить книгу
      </button>

      {/* Form */}
      {showForm && (
        <div className="form-card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0 }}>
            {editingBook ? <><FaEdit size={16} /> Редактировать книгу</> : <><FaPlus size={16} /> Добавить новую книгу</>}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Название *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Название книги"
                  required
                />
              </div>

              <div className="form-group">
                <label>Автор</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Имя автора"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Цена (₸)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Запас (количество)</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Описание книги..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>URL изображения</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-actions" style={{ flexDirection: 'row', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                {editingBook ? 'Обновить' : 'Добавить'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Books List */}
      <div className="books-container">
        {books.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📚</p>
            <p className="empty-message">Книги не найдены</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-image">
                  <img src={book.image} alt={book.title} loading="lazy" />
                </div>

                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author || 'Неизвестный автор'}</p>

                  <div className="book-details">
                    <div className="detail">
                      <span className="label">Цена:</span>
                      <span className="value price">₸{book.price.toFixed(2)}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Запас:</span>
                      <span className={`value ${book.stock <= 5 ? 'low' : ''}`}>
                        {book.stock} шт.
                      </span>
                    </div>
                  </div>

                  {book.description && (
                    <p className="book-description">{book.description}</p>
                  )}

                  <div className="book-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(book)}
                      title="Редактировать"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(book._id)}
                      title="Удалить"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
