# BookExpress - Complete Setup Guide

This guide will help you set up and run the BookExpress application from scratch.

## Prerequisites

Before you begin, ensure you have installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (Local or Cloud)
   - **Local**: Download from https://www.mongodb.com/try/download/community
   - **Cloud**: MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
   - Verify local MongoDB: `mongod` command

3. **npm** or **yarn**
   - Should come with Node.js
   - Verify: `npm --version`

## Step 1: Navigate to Project Directory

```bash
cd BookExpress
```

## Step 2: Install All Dependencies

### Option A: Using npm (Recommended)
```bash
npm run install-all
```

This command will:
- Install root dependencies
- Navigate to `frontend/` and install React dependencies
- Navigate to `backend/` and install Express dependencies

### Option B: Manual Installation
```bash
# Install root dependencies
npm install

# Install frontend
cd frontend
npm install
cd ..

# Install backend
cd backend
npm install
cd ..
```

## Step 3: Configure Environment Variables

### Backend Configuration

Edit `backend/.env`:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookexpress
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

**For MongoDB Atlas** (Cloud):
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookexpress
```

### Frontend Configuration

File `frontend/.env` (already configured, no changes needed):
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 4: Start MongoDB

### Local MongoDB
```bash
# On Windows (in CMD or PowerShell)
mongod

# On Mac
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

Verify MongoDB is running - it should output:
```
[initandlisten] waiting for connections on port 27017
```

### MongoDB Atlas (Cloud)
- No action needed, just ensure your connection string is correct in `.env`

## Step 5: Initialize Database (Optional but Recommended)

Navigate to backend and run initialization:

```bash
cd backend
npm run init-db
```

This will:
- Create an admin account (admin@bookexpress.com / 123456)
- Load 8 sample books for testing
- Clear any existing data

Output should show:
```
✓ Database initialization complete!
```

## Step 6: Start the Backend Server

In a **NEW TERMINAL**:

```bash
npm run dev-backend
```

Or manually:
```bash
cd backend
npm run dev
```

You should see:
```
Connected to MongoDB
Server is running on port 5000
```

## Step 7: Start the Frontend Application

In a **THIRD TERMINAL**:

```bash
npm run start-frontend
```

Or manually:
```bash
cd frontend
npm start
```

The app will automatically open at `http://localhost:3000`

If not, manually navigate to: **http://localhost:3000**

## ✅ Verify Everything is Running

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"Backend is running"}
```

### Frontend
- Visit http://localhost:3000
- You should see the BookExpress homepage with books

## 🔐 First Login with Demo Account

1. Click **"Login"** on the homepage
2. Use credentials:
   - Email: `admin@bookexpress.com`
   - Password: `123456`
3. You'll be redirected to `/admin` panel

## 📚 Testing the Application

### User Registration & Login
1. Click **"Register"**
2. Fill in all fields:
   - Name: Your Name
   - Phone: +1 (555) 123-4567
   - Email: your@email.com
   - Password: 123456
3. Click **"Register"**
4. Now login with your new account

### Shopping
1. On **Home** page, click **"Add to Cart"** on any book
2. Go to **Cart** page
3. Adjust quantities if needed
4. Click **"Checkout"**
5. Fill delivery information
6. Select delivery method and payment
7. Click **"Confirm Order"**
8. You'll see order confirmation

### Profile & Orders
1. Go to **Profile** page
2. View and edit personal information
3. Scroll down to see your orders
4. Click **"Become a Courier"** to apply

### Admin Panel
1. Login with admin account
2. Go to **Admin** (you'll be redirected)
3. In left sidebar:
   - **📚 Books**: Add, edit, delete books
   - **📦 Orders**: View and update order status
   - **🚚 Couriers**: Manage courier applications

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running (`mongod` in terminal)
- Check MONGODB_URI in `.env` is correct
- If using Atlas, verify connection string

### Issue: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in `backend/.env` to different port (e.g., 5001)
- Or kill the process using port 5000

### Issue: Port 3000 Already in Use
```
Error: Port 3000 is already in use
```
**Solution:**
- Press `q` in the frontend terminal then `y`
- Or use: `PORT=3001 npm start`

### Issue: Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
cd backend
npm install
```

### Issue: CORS Errors
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`

## 📝 Project Structure Reference

```
BookExpress/
├── README.md
├── SETUP.md (this file)
├── package.json
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── init-db.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── App.js
    │   └── index.js
    ├── .env
    └── package.json
```

## 🚀 Running in Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized build in `frontend/build/` - deploy this folder to hosting service.

### Backend Production
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager (PM2):
```bash
npm install -g pm2
pm2 start backend/server.js --name bookexpress
```

## 🆘 Need Help?

### Check Logs
- **Backend logs**: Check terminal where `npm run dev-backend` runs
- **Frontend logs**: Check browser console (F12)
- **Database logs**: Check MongoDB terminal

### Restart Everything
1. Close backend terminal (Ctrl+C)
2. Close frontend terminal (Ctrl+C)
3. Restart both servers
4. Clear browser cache (Ctrl+Shift+Delete)

### Test API Endpoints
Use Postman or curl to test:
```bash
# Get all books
curl http://localhost:5000/api/books

# Health check
curl http://localhost:5000/api/health
```

## ✨ Features Quick Reference

| Feature | URL | Status |
|---------|-----|--------|
| Home | http://localhost:3000 | ✓ |
| Register | http://localhost:3000/register | ✓ |
| Login | http://localhost:3000/login | ✓ |
| Cart | http://localhost:3000/cart | ✓ |
| Checkout | http://localhost:3000/checkout | ✓ |
| Profile | http://localhost:3000/profile | ✓ |
| Admin | http://localhost:3000/admin | ✓ |
| 404 | http://localhost:3000/any-invalid-page | ✓ |

---

🎉 **Setup Complete! Happy Coding!**

For issues or questions, refer to README.md for more details.
