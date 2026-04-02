# BookExpress - Quick Start Guide

## ⚡ 5-Minute Quick Start

### 1. Install & Setup (2 minutes)
```bash
cd BookExpress
npm run install-all
```

### 2. Configure MongoDB (1 minute)
Ensure MongoDB is running:
```bash
mongod
```

### 3. Initialize Database with Sample Data (1 minute)
```bash
cd backend
npm run init-db
cd ..
```

### 4. Start Both Servers (1 minute)

Terminal 1:
```bash
npm run dev-backend
```

Terminal 2:
```bash
npm run start-frontend
```

✅ Done! App opens at http://localhost:3000

## 🔐 Demo Credentials

**Admin Account:**
- Email: `admin@bookexpress.com`
- Password: `123456`

## 📱 Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| Profile | http://localhost:3000/profile |
| Admin Panel | http://localhost:3000/admin |

## 🔌 API Endpoints Reference

### Authentication
```
POST   /api/auth/register              Register new user
POST   /api/auth/login                 Login user
GET    /api/auth/profile               Get user profile (auth)
PUT    /api/auth/profile               Update profile (auth)
```

### Books
```
GET    /api/books                      Get all books
GET    /api/books/:id                  Get single book
POST   /api/books                      Add book (admin)
PUT    /api/books/:id                  Update book (admin)
DELETE /api/books/:id                  Delete book (admin)
```

### Orders
```
POST   /api/orders                     Create order (auth)
GET    /api/orders/my-orders           Get user orders (auth)
GET    /api/orders                     Get all orders (admin)
PUT    /api/orders/:id                 Update order status (admin)
```

### Couriers
```
POST   /api/couriers                   Submit application
GET    /api/couriers                   Get applications (admin)
PUT    /api/couriers/:id               Update application (admin)
```

## 🎨 Design & Colors

The application uses:
- **White** (#ffffff) - Main background
- **Gray** (#f5f5f5) - Secondary background
- **Purple** (#7c3aed) - Buttons & primary actions
- **Dark Gray** (#666666) - Text
- **Light Gray** (#e0e0e0) - Borders

## ✨ Features Implemented

### ✅ User Features
- [x] User Registration
- [x] User Login
- [x] Home page with books catalog
- [x] Add to cart functionality
- [x] Shopping cart management
- [x] Checkout with delivery options
- [x] Payment method selection
- [x] Order confirmation page
- [x] User profile
- [x] Order history
- [x] Courier application form

### ✅ Admin Features
- [x] Book Management (CRUD)
- [x] Order Management
- [x] Order status updates
- [x] Courier application review
- [x] Accept/Reject couriers

### ✅ Technical Features
- [x] Form validation
- [x] Error handling & alerts
- [x] Loading states
- [x] Responsive design (mobile + desktop)
- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] MongoDB integration
- [x] API error handling
- [x] 404 page

## 🐛 Troubleshooting

**MongoDB not connecting?**
```bash
# Start MongoDB
mongod
```

**Port 5000 in use?**
```bash
# Change PORT in backend/.env to 5001
```

**Dependencies missing?**
```bash
npm run install-all
```

**Clear database & reinit?**
```bash
cd backend
npm run init-db
```

## 📋 Project Structure

```
BookExpress/
├── backend/           # Express server
│   ├── models/       # MongoDB schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── server.js     # Main server
│   └── init-db.js    # DB initialization
├── frontend/          # React app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API client
│   │   ├── styles/     # Global CSS
│   │   └── App.js      # Main component
│   └── package.json
├── README.md          # Full documentation
├── SETUP.md           # Setup guide
└── package.json       # Root configuration
```

## 🚀 Commands Reference

```bash
# Install and setup
npm run install-all

# Start backend
npm run dev-backend

# Start frontend
npm run start-frontend

# Initialize database
cd backend && npm run init-db && cd ..

# Build for production
npm run build-frontend

# Manually install dependencies
npm install && cd frontend && npm install && cd ../backend && npm install
```

## 💡 Tips & Tricks

1. **Auto-reload**: Backend automatically reloads with changes (nodemon)
2. **GitHub**: Initialize git repository: `git init`
3. **Ignore files**: `.gitignore` already configured
4. **Logging**: Check terminal where servers run for logs
5. **localStorage**: Cart data saved locally in browser

## 🔒 Security Notes

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Change `JWT_SECRET` in production
- MongoDB credentials should be environment variables
- Admin check uses email (upgrade to database flag in production)

## 📚 Additional Resources

- React Documentation: https://react.dev
- Express.js: https://expressjs.com
- MongoDB: https://www.mongodb.com/docs
- Mongoose: https://mongoosejs.com

---

**❓ Need Help?**

1. Check SETUP.md for detailed setup instructions
2. Review README.md for complete documentation
3. Check browser console for frontend errors (F12)
4. Check terminal for backend errors
5. Verify MongoDB is running

**🎉 Enjoy using BookExpress!**
