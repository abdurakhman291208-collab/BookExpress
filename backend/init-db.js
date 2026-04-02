require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Book = require('./models/Book');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookexpress';

const sampleBooks = [
  {
    title: 'Властелин колец',
    author: 'Джон Рональд',
    price: 2728,
    description: 'A romantic novel of manners and marriage',
    image: 'https://s.f.kz/prod/1296/1295029_1000.jpg',
    stock: 18,
  },
  {
    title: 'Брюс Ли',
    author: 'Шеннон Ли',
    price: 4847,
    description: 'A story of teenage rebellion and alienation',
    image: 'https://s.f.kz/prod/3770/3769577_1000.jpg',
    stock: 10,
  },
  {
    title: 'Драконы',
    author: 'Джордж Рэймонд',
    price: 4686.99,
    description: 'A futuristic dystopia of pleasure and conformity',
    image: 'https://s.f.kz/prod/1369/1368488_1000.jpg',
    stock: 14,
  },
  {
    title: 'Криштиану Роналду',
    author: 'Родригу Карлуш',
    price: 4687,
    description: 'An adventure fantasy novel',
    image: 'https://s.f.kz/prod/2753/2752821_1000.jpg',
    stock: 16,
  },
  {
    title: 'Зеленая миля',
    author: 'Стивен Кинг',
    price: 7544,
    description: 'A gothic romance novel',
    image: 'https://s.f.kz/prod/1668/1667399_550.jpg',
    stock: 9,
  },
  {
    title: 'Стив Джобс',
    author: 'Уолтер Айзексон',
    price: 3999,
    description: 'A dystopian novel about totalitarianism',
    image: 'https://s.f.kz/prod/226/225602_550.jpg',
    stock: 20,
  },
  {
    title: 'Виктор Цой',
    author: 'Виталий Николаевич',
    price: 9830,
    description: 'A classic American novel set in the Jazz Age',
    image: 'https://s.f.kz/prod/4068/4067765_1000.jpg',
    stock: 15,
  },
  {
    title: 'Миссия',
    author: 'Маргулан Сейсембай',
    price: 5697,
    description: 'A gripping tale of racial injustice and growth',
    image: 'https://s.f.kz/prod/5540/5539686_1000.jpg',
    stock: 12,
  },
];

const initializeDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('123456', 10);
    const adminUser = new User({
      name: 'Admin User',
      phone: '+1234567890',
      email: 'admin@bookexpress.com',
      password: adminPassword,
      address: '123 Admin St',
      city: 'Admin City',
      isAdmin: true,
    });
    await adminUser.save();
    console.log('Created admin user');

    // Add sample books
    await Book.insertMany(sampleBooks);
    console.log(`Added ${sampleBooks.length} sample books`);

    console.log('✓ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
};

initializeDatabase();
