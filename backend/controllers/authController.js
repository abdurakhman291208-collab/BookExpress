const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Register user
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !phone || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Пароли не совпадают' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Неверный формат электронной почты' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с этой электронной почтой или телефоном уже существует' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        isCourier: false,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Регистрация не удалась' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { loginField, password } = req.body;

    console.log('🔐 Login attempt - Email/Phone:', loginField);

    // Validation
    if (!loginField || !password) {
      return res.status(400).json({ error: 'Электронная почта/телефон и пароль обязательны' });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: loginField }, { phone: loginField }],
    });

    if (!user) {
      console.log('❌ User not found:', loginField);
      return res.status(401).json({ error: 'Неверные учётные данные' });
    }

    console.log('✅ User found:', user.email);

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('❌ Password mismatch for user:', user.email);
      return res.status(401).json({ error: 'Неверные учётные данные' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated for user:', user.email);
    console.log('🔑 Token payload - userId:', user._id, 'email:', user.email);

    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        isCourier: user.isCourier || false,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка входа' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Не удалось получить профиль' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;

    await user.save();

    res.json({
      message: 'Профиль успешно обновлен',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Не удалось обновить профиль' });
  }
};
