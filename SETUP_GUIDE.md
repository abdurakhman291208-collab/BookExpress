# BookExpress - Руководство по запуску

## Статус: ✅ ВСЕ КОМПОНЕНТЫ РАБОТАЮТ

### Проверенные компоненты:

**Backend:**
- ✅ Express сервер работает на порту 5000
- ✅ MongoDB подключена (mongodb://localhost:27017/bookexpress)
- ✅ API endpoints работают
- ✅ Регистрация пользователей работает и сохраняет в БД
- ✅ Вход работает и возвращает JWT токен
- ✅ Базу данных инициализирована с админ-пользователем и 8 книгами

**Frontend:**
- ✅ React приложение настроено
- ✅ API URL правильно настроена (http://localhost:5000/api)
- ✅ Все страницы переведены на русский язык
- ✅ Logo добавлен в Header
- ✅ Emojis удалены из интерфейса

**Database:**
- ✅ MongoDB запущена и работает
- ✅ База данных "bookexpress" создана
- ✅ Коллекции: users, books, orders, couriers
- ✅ Админ пользователь создан

---

## Быстрый старт

### 1. Убедитесь что MongoDB работает

Откройте MongoDB Compass и подключитесь к:
```
mongodb://localhost:27017/
```

Должна быть видна база данных **bookexpress**

### 2. Запустите Backend

```bash
cd backend
node server.js
```

или для работы с горячей перезагрузкой:
```bash
npm run dev
```

Сервер должен вывести:
```
Connected to MongoDB
Server is running on port 5000
```

### 3. Инициализируйте базу данных (один раз)

```bash
cd backend
node init-db.js
```

Это создаст:
- Админ пользователя (admin@bookexpress.com / 123456)
- 8 примеров книг

### 4. Запустите Frontend

```bash
cd frontend
npm start
```

Приложение откроется на http://localhost:3000

---

## Тестовые учётные записи

### Админ
- **Email:** admin@bookexpress.com
- **Пароль:** 123456
- **Доступ:** Панель администратора, управление книгами, заказами, курьерами

### Простой пользователь
- **Email:** любой email
- **Пароль:** любой пароль (минимум 6 символов)
- **Действия:** Просмотр каталога, покупки, профиль

---

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/profile` - Получить профиль (требует токен)
- `PUT /api/auth/profile` - Обновить профиль (требует токен)

### Книги
- `GET /api/books` - Получить все книги
- `GET /api/books/:id` - Получить одну книгу
- `POST /api/books` - Добавить книгу (админ)
- `PUT /api/books/:id` - Обновить книгу (админ)
- `DELETE /api/books/:id` - Удалить книгу (админ)

### Заказы
- `POST /api/orders` - Создать заказ
- `GET /api/orders/my-orders` - Мои заказы (требует токен)
- `GET /api/orders` - Все заказы (админ)
- `PUT /api/orders/:id` - Обновить статус заказа (админ)

### Курьеры
- `POST /api/couriers` - Отправить заявку курьера
- `GET /api/couriers` - Получить заявки (админ)
- `PUT /api/couriers/:id` - Обновить статус заявки (админ)

---

## Структура проекта

```
BookExpress/
├── backend/
│   ├── controllers/       # Логика обработки запросов
│   ├── models/           # Mongoose модели (User, Book, Order, Courier)
│   ├── routes/           # API маршруты
│   ├── middleware/       # Аутентификация, авторизация
│   ├── server.js         # Главный файл сервера
│   ├── init-db.js        # Инициализация БД
│   ├── .env              # Переменные окружения
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # Страницы приложения
│   │   ├── components/   # React компоненты
│   │   ├── services/     # API запросы
│   │   ├── styles/       # CSS файлы
│   │   └── App.js
│   ├── .env              # Переменные окружения фронтенда
│   └── package.json
│
└── README.md
```

---

## Переменные окружения

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookexpress
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Возможные проблемы и решения

### Проблема: "CORS error" при обращении к API

**Решение:** 
- Убедитесь что backend запущен на http://localhost:5000
- Проверьте что URL в frontend/.env правильный
- Очистите кеш браузера (Ctrl+Shift+Delete)

### Проблема: "Cannot connect to MongoDB"

**Решение:**
- Убедитесь что MongoDB запущена
- Проверьте URI в backend/.env: mongodb://localhost:27017/bookexpress
- Откройте MongoDB Compass и проверьте соединение

### Проблема: "Port 5000 already in use"

**Решение:**
- Найдите процесс использующий порт: `netstat -ano | findstr :5000`
- Убейте процесс или используйте другой порт в .env

### Проблема: "npm install не работает"

**Решение:**
- Используйте `& "C:\Program Files\nodejs\npm.cmd" install` в PowerShell
- Или используйте Command Prompt (cmd.exe)

---

## Перевод на русский язык

Все текстовые элементы приложения перепроданы на русский:
- Все страницы (Регистрация, Вход, Каталог, Профиль, Админ-панель)
- Все сообщения об ошибках  
- Все кнопки и ярлыки
- API сообщения из backend

---

## Следующие шаги

1. Протестируйте регистрацию и вход на фронтенде
2. Добавьте новые книги через админ-панель
3. Создавайте заказы и проверяйте их в админ-панели
4. Применяйте для курьерской работы

**Все готово к использованию!** 🎉
