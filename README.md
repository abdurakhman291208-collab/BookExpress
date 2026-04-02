# BookExpress - Online Book Sales and Delivery Platform

A full-stack web application for online book sales with user authentication, shopping cart, order management, and admin panel.

## 🚀 Features

### User Features
- **Authentication**: Registration and login with email/phone
- **Home Page**: Browse catalog of books
- **Shopping Cart**: Add/remove books, adjust quantities
- **Checkout**: Complete order with delivery and payment options
- **Profile**: View and edit personal information
- **Order History**: Track your orders
- **Courier Application**: Apply to become a courier

### Admin Features
- **Book Management**: Add, edit, delete books
- **Order Management**: View and update order status
- **Courier Applications**: Review and accept/reject courier applications

## 🛠 Tech Stack

### Frontend
- React 18
- React Router v6
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation and Setup

### 1. Clone and Navigate to Project
```bash
cd BookExpress
```

### 2. Install All Dependencies
```bash
npm run install-all
```

This will install dependencies for:
- Main project
- Frontend
- Backend

### 3. Configure Environment Variables

**Backend** - Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookexpress
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Frontend** - `frontend/.env` is already configured:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod
```

## ▶️ Running the Application

### Option 1: Run Both Servers in Separate Terminals

**Terminal 1 - Backend:**
```bash
npm run dev-backend
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run start-frontend
```
App opens at: `http://localhost:3000`

### Option 2: Run Individually
```bash
# Backend only
cd backend && npm start

# Frontend only
cd frontend && npm start
```

## 🔐 Demo Admin Account

After registering a user, you can create an admin account by:
1. Register with email: `admin@bookexpress.com`
2. Password: `123456`
3. Access admin panel at: `/admin`

**Note**: The demo checks for the specific email. In production, use database flag for better security.

## 📱 Application Structure

### Frontend (`/frontend`)
```
src/
├── components/          # Reusable components
│   ├── Header.js
│   ├── Alert.js
│   └── Loader.js
├── pages/              # Page components
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── Cart.js
│   ├── Checkout.js
│   ├── OrderConfirmed.js
│   ├── Profile.js
│   ├── Admin.js
│   └── NotFound.js
├── services/           # API integration
│   └── api.js
├── styles/             # Global styles
│   └── global.css
└── App.js              # Main app component
```

### Backend (`/backend`)
```
├── models/             # MongoDB schemas
│   ├── User.js
│   ├── Book.js
│   ├── Order.js
│   └── Courier.js
├── controllers/        # Business logic
│   ├── authController.js
│   ├── bookController.js
│   ├── orderController.js
│   └── courierController.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── orderRoutes.js
│   └── courierRoutes.js
├── middleware/         # Custom middleware
│   └── auth.js
└── server.js           # Express server
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)
- `PUT /api/auth/profile` - Update profile (auth required)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Orders
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders/my-orders` - Get user orders (auth required)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)

### Couriers
- `POST /api/couriers` - Submit courier application
- `GET /api/couriers` - Get applications (admin only)
- `PUT /api/couriers/:id` - Update application status (admin only)

## 🎨 Design System

### Colors
- **White**: #ffffff
- **Gray**: #f5f5f5
- **Dark Gray**: #666666
- **Light Gray**: #e0e0e0
- **Purple (Primary)**: #7c3aed
- **Purple Light**: #a78bfa

### Components
- Minimalist design with clean lines
- Consistent spacing and typography
- Full responsive design (desktop & mobile)
- Smooth transitions and hover effects

## 📱 Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## ✅ Testing Checklist

### User Features
- [ ] Register with valid/invalid data
- [ ] Login with email and phone
- [ ] Browse books on home page
- [ ] Add books to cart
- [ ] Modify cart quantities
- [ ] Checkout with delivery options
- [ ] View order confirmation
- [ ] Access profile and orders
- [ ] Apply to become courier

### Admin Features
- [ ] Add new books
- [ ] Edit book details
- [ ] Delete books
- [ ] View all orders
- [ ] Update order status
- [ ] Review courier applications
- [ ] Accept/reject couriers

### Technical
- [ ] No console errors
- [ ] Form validation works
- [ ] Error messages display
- [ ] Loading states appear
- [ ] Mobile responsive layout
- [ ] API endpoints functional

## 🐛 Error Handling

- Invalid credentials: Clear error message
- Form validation: Field-level validation
- API errors: User-friendly messages
- 404 pages: Custom not found page
- Authentication: Redirect to login if needed

## 🚀 Production Deployment

### Frontend
```bash
npm run build-frontend
# Deploy the `frontend/build` folder
```

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Update `MONGODB_URI` to production database
3. Set strong `JWT_SECRET`
4. Deploy to hosting service (Heroku, AWS, etc.)

## 📝 Notes

- Default MongoDB connection is local. Update URI for cloud database.
- Demo admin account uses email checking. Implement proper admin role in production.
- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens expire in 7 days
- Cart data stored in localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC

## 👨‍💻 Author

BookExpress Team

---

**Happy Coding!** 🎉
