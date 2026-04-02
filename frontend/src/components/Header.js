import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { orderService } from '../services/api';
import './Header.css';
import logoImg from '../images/1.png';

const BookExpressLogo = () => (
  <img 
    src={logoImg} 
    alt="BookExpress Logo" 
    width="200" 
    height="150"
    className="logo-img"
  />
);

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  // ✅ БЕРЕМ ИЗ USER
  const isCourier = user?.isCourier;
  const isAdmin = user?.email === 'admin@bookexpress.com';

  /**
   * 📦 Корзина
   */
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(count);
      } catch (error) {
        console.error('Ошибка корзины:', error);
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);

  }, []); // ❗ убрали location (лишний ререндер)

  /**
   * 📦 Получение активных заказов
   */
  const fetchActiveOrders = async () => {
    try {
      const response = await orderService.getCourierOrders();

      if (response.data && Array.isArray(response.data)) {
        const activeCount = response.data.filter(
          order =>
            order.status === 'accepted' ||
            order.status === 'in_delivery'
        ).length;

        setActiveOrdersCount(activeCount);
      }
    } catch (error) {
      console.error('Ошибка заказов курьера:', error);
      setActiveOrdersCount(0);
    }
  };

  /**
   * 🔁 Автообновление (ТОЛЬКО ЕСЛИ ЕСТЬ USER И ОН КУРЬЕР)
   */
  useEffect(() => {
    if (!user || !isCourier) return;

    fetchActiveOrders();

    const interval = setInterval(fetchActiveOrders, 5000);

    return () => clearInterval(interval);
  }, [user, isCourier]);

  /**
   * 🚪 Выход
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMenuOpen(false);
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">

          {/* ЛОГО */}
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <BookExpressLogo />
          </Link>

          {/* МЕНЮ */}
          <button 
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>

            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Главная
            </Link>

            <Link 
              to="/cart" 
              className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Корзина
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </Link>

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Профиль
                </Link>

                {isCourier && (
                  <Link 
                    to="/courier/dashboard" 
                    className={`nav-link ${location.pathname.startsWith('/courier') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    🚚 Курьер
                    {activeOrdersCount > 0 && (
                      <span className="badge">{activeOrdersCount}</span>
                    )}
                  </Link>
                )}

                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`nav-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaCog size={18} /> Админ
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm logout-btn"
                >
                  Выход
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Вход
                </Link>

                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm register-btn"
                >
                  Регистрация
                </Link>
              </>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}