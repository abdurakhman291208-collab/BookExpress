# 📚 BookExpress Documentation Index

Welcome to BookExpress! Here's a quick guide to find what you need.

## 🚀 Getting Started

**First time? Start here:**
1. **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
2. **[SETUP.md](SETUP.md)** - Detailed setup instructions with troubleshooting

## 📖 Main Documentation

- **[README.md](README.md)** - Complete project documentation, features, and API reference
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What's included, project structure, and checklist

## 🔌 API & Testing

- **[API-TESTING.md](API-TESTING.md)** - How to test API endpoints using curl
- **API Endpoints** - See README.md Section "API Endpoints"

## 📁 Project Structure

```
BookExpress/
├── QUICKSTART.md          ← Start here! (5 min setup)
├── SETUP.md               ← Detailed setup guide
├── README.md              ← Full documentation
├── PROJECT_SUMMARY.md     ← What's included
├── API-TESTING.md         ← API testing guide
├── backend/               ← Node.js/Express server
└── frontend/              ← React application
```

## 🎯 Quick Navigation

### I want to...

| Goal | Document |
|------|----------|
| Get started quickly | [QUICKSTART.md](QUICKSTART.md) |
| Follow step-by-step setup | [SETUP.md](SETUP.md) |
| See all features | [README.md](README.md) |
| Understand project structure | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |
| Test API endpoints | [API-TESTING.md](API-TESTING.md) |
| Find API reference | [README.md](README.md#-api-endpoints) |
| Deploy to production | [README.md](README.md#-production-deployment) |
| Troubleshoot issues | [SETUP.md](SETUP.md#-common-issues--solutions) |

## ⚡ Development Commands

```bash
# Install everything
npm run install-all

# Start development servers
npm run dev-backend        # Terminal 1
npm run start-frontend     # Terminal 2

# Initialize database with sample data
cd backend && npm run init-db && cd ..

# Build for production
npm run build-frontend
```

## 🔐 Demo Account

```
Email: admin@bookexpress.com
Password: 123456
```

Use after running database initialization.

## 📱 URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Cart | http://localhost:3000/cart |
| Profile | http://localhost:3000/profile |
| Admin | http://localhost:3000/admin |

## 🆘 Help & Troubleshooting

1. **Can't connect to MongoDB?**
   → See [SETUP.md](SETUP.md#issue-mongodb-connection-error)

2. **Port already in use?**
   → See [SETUP.md](SETUP.md#issue-port-5000-already-in-use)

3. **Dependencies not installing?**
   → See [SETUP.md](SETUP.md#issue-module-not-found)

4. **CORS errors?**
   → See [SETUP.md](SETUP.md#issue-cors-errors)

## 📊 Project Statistics

- **Frontend**: 15+ React components
- **Backend**: 16 API endpoints
- **Database**: 4 MongoDB collections
- **Lines of Code**: 2500+
- **Pages**: 10
- **Admin Features**: 3 management sections

## ✨ Features Implemented

✅ User registration & login
✅ Book catalog with search
✅ Shopping cart
✅ Order checkout
✅ User profile
✅ Order tracking
✅ Courier applications
✅ Admin panel
✅ Book management
✅ Order management
✅ Responsive design
✅ Form validation
✅ Error handling
✅ Loading states
✅ 404 page

## 🎨 Design System

- **Colors**: White, Gray, Purple
- **Responsive**: Desktop, tablet, mobile
- **Minimalist**: Clean, simple design
- **Icons**: Emoji-based
- **Animations**: Smooth transitions

## 🔒 Security Features

✅ JWT authentication
✅ Password hashing
✅ Protected routes
✅ Admin verification
✅ Input validation
✅ CORS enabled
✅ Token expiration

## 📚 Technology Stack

**Frontend**
- React 18
- React Router v6
- Axios
- CSS3

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

## 🚀 How to Read This Documentation

1. **If new to the project**: Start with QUICKSTART.md
2. **If setting up locally**: Follow SETUP.md
3. **If implementing features**: Check README.md
4. **If testing API**: Use API-TESTING.md
5. **For troubleshooting**: See SETUP.md section

## 📝 Documentation Standards

All documentation includes:
- Clear step-by-step instructions
- Code examples
- Troubleshooting tips
- Quick reference tables
- Terminal commands

## 🆘 Still Need Help?

1. Check the relevant documentation file
2. Read the troubleshooting section
3. Review API-TESTING.md for API help
4. Check browser console (F12) for errors
5. Check terminal for backend errors

## 🎉 Ready to Build?

```bash
# Clone/navigate to directory
cd BookExpress

# Quick setup
npm run install-all
mongod                    # In separate terminal
npm run dev-backend       # Terminal 1
npm run start-frontend    # Terminal 2
```

Visit **http://localhost:3000** - Done! 🚀

---

**Choose your path:**
- 🏃 **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- 📋 **Detailed Setup**: [SETUP.md](SETUP.md)
- 📖 **Full Docs**: [README.md](README.md)
- 🔍 **Project Info**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- 🔌 **API Testing**: [API-TESTING.md](API-TESTING.md)

Happy coding! 🚀
