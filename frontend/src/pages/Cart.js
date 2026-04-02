import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import './Cart.css';

/**
 * Страница корзины покупок
 * Позволяет просматривать, изменять количество и удалять товары из корзины
 */
export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Загрузить корзину при монтировании
  useEffect(() => {
    loadCart();
  }, []);

  /**
   * Загружает корзину из localStorage
   */
  const loadCart = () => {
    try {
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(cartData);
      calculateTotal(cartData);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      setAlert({
        message: 'Ошибка при загрузке корзины',
        type: 'error',
      });
    }
  };

  /**
   * Рассчитывает общую сумму корзины
   */
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    setTotalPrice(total);
  };

  /**
   * Обновляет количество товара в корзине
   * @param {string} id - ID товара
   * @param {number} newQuantity - Новое количество
   */
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  /**
   * Удаляет товар из корзины
   * @param {string} id - ID товара
   */
  const handleRemoveItem = (id) => {
    const item = cart.find((item) => item.id === id);
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    
    if (item) {
      setAlert({
        message: `"${item.title}" удалена из корзины`,
        type: 'success',
      });
    }
  };

  /**
   * Переходит к оформлению заказа
   */
  const handleCheckout = () => {
    navigate('/checkout');
  };

  /**
   * Очищает всю корзину
   */
  const handleClearCart = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      setCart([]);
      localStorage.removeItem('cart');
      calculateTotal([]);
      setAlert({
        message: 'Корзина очищена',
        type: 'success',
      });
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Корзина покупок</h1>
          <p>Замечательный выбор книг!</p>
        </div>

        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">📚</div>
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте интересующие вас книги в корзину и вернитесь сюда!</p>
            <Link to="/" className="btn btn-primary btn-lg">
              Начать покупки
            </Link>
          </div>
        ) : (
          <div className="cart-container">
            {/* Товары в корзине */}
            <div className="cart-items">
              <div className="cart-items-header">
                <span>Товаров в корзине: <strong>{cart.length}</strong></span>
                <button
                  onClick={handleClearCart}
                  className="btn btn-secondary btn-sm"
                  aria-label="Очистить корзину"
                >
                  Очистить корзину
                </button>
              </div>

              <div className="items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-price">₸{item.price?.toFixed(2) || '0.00'}</p>
                    </div>

                    <div className="item-quantity">
                      <label htmlFor={`qty-${item.id}`}>Количество:</label>
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="qty-btn"
                          aria-label="Уменьшить количество"
                        >
                          −
                        </button>
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                          }
                          className="qty-input"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="qty-btn"
                          aria-label="Увеличить количество"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="item-subtotal">
                      <p className="subtotal-label">Сумма</p>
                      <p className="subtotal-value">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn btn-danger btn-sm remove-btn"
                      aria-label={`Удалить "${item.title}" из корзины`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Сумма заказа */}
            <aside className="cart-summary">
              <div className="summary-card">
                <h3>Итого по заказу</h3>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="label">Товаров:</span>
                    <span className="value">{cart.length} шт.</span>
                  </div>
                  
                  <div className="summary-row">
                    <span className="label">Промежуточный итог:</span>
                    <span className="value">₸{totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span className="label">Доставка:</span>
                    <span className="value highlight">Уточняется</span>
                  </div>

                  <div className="divider"></div>

                  <div className="summary-row total">
                    <span className="label">К оплате:</span>
                    <span className="value">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn btn-primary btn-lg btn-block"
                  disabled={cart.length === 0}
                >
                  Перейти к оформлению →
                </button>

                <p className="continue-shopping">
                  <Link to="/">← Продолжить покупки</Link>
                </p>
              </div>

              {/* Информационная карточка */}
              <div className="info-card">
                <h4>Информация о доставке</h4>
                <ul>
                  <li>✓ Доставка по стране за 1-3 дня</li>
                  <li>✓ Возврат в течение 14 дней</li>
                  <li>✓ Поддержка по телефону 24/7</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
