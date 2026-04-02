import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import CourierDashboard from './pages/CourierDashboard';
import NotFound from './pages/NotFound';
import './styles/global.css';

// Компонент для защиты маршрутов (требует аутентификации)
const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Компонент для защиты админ-маршрутов
const AdminRoute = ({ children, isAuthenticated, isAdmin, isLoading }) => {
  console.log('🛡️ AdminRoute check:', { isAuthenticated, isAdmin, isLoading });
  
  if (isLoading) {
    console.log('⏳ AdminRoute - Still loading');
    return null;
  }
  
  if (!isAuthenticated) {
    console.log('❌ AdminRoute - Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    console.log('❌ AdminRoute - Not admin, redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  console.log('✅ AdminRoute - Access granted to admin panel');
  return children;
};

// Компонент для защиты курьерских маршрутов
const CourierRoute = ({ children, isAuthenticated, isCourier, isLoading }) => {
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isCourier) return <Navigate to="/profile" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Загрузить данные пользователя при монтировании
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Ошибка парсинга пользователя:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Проверяем является ли пользователь админом
  const isAdmin = user?.email === 'admin@bookexpress.com';
  
  // Debug logs
  if (user) {
    console.log('👤 Current user:', user.email);
    console.log('🔐 Is Admin?', isAdmin);
  }
  
  // Проверяем является ли пользователь курьером
  const isCourier = user?.isCourier || false;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleLogin = (userData) => {
    console.log('📱 Login handler - User data:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          
          {/* Защищённые маршруты */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute isAuthenticated={!!user} isLoading={isLoading}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute isAuthenticated={!!user} isLoading={isLoading}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmed"
            element={
              <ProtectedRoute isAuthenticated={!!user} isLoading={isLoading}>
                <OrderConfirmed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={!!user} isLoading={isLoading}>
                <Profile onCourierStatusChange={(status) => setUser({ ...user, isCourier: status })} />
              </ProtectedRoute>
            }
          />

          {/* Админ маршруты */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute isAuthenticated={!!user} isAdmin={isAdmin} isLoading={isLoading}>
                <Admin />
              </AdminRoute>
            }
          />

          {/* Курьерские маршруты */}
          <Route
            path="/courier/dashboard"
            element={
              <CourierRoute isAuthenticated={!!user} isCourier={isCourier} isLoading={isLoading}>
                <CourierDashboard user={user} />
              </CourierRoute>
            }
          />

          {/* 404 маршрут (всегда последний) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
