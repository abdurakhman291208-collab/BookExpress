const Order = require('../models/Order');

/**
 * 📦 СОЗДАТЬ ЗАКАЗ
 */
exports.createOrder = async (req, res) => {
  try {
    const { books, totalPrice, name, phone, address, city, deliveryType, paymentMethod } = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }

    const newOrder = new Order({
      userId: req.userId,
      books,
      totalPrice,
      name,
      phone,
      address,
      city,
      deliveryType,
      paymentMethod,
      status: 'pending',
    });

    await newOrder.save();

    res.status(201).json({ message: 'Заказ создан', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка создания заказа' });
  }
};

/**
 * 👤 МОИ ЗАКАЗЫ
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('books.bookId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

/**
 * 🚚 ЗАКАЗЫ ДЛЯ КУРЬЕРА
 */
exports.getCourierOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ deliveryType: 'courier' })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    const result = orders.map(order => ({
      ...order.toObject(),
      isMine: order.courierId?.toString() === userId
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

/**
 * 📦 ВСЕ ЗАКАЗЫ (АДМИН)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name phone email')
      .populate('books.bookId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

/**
 * 🚚 ПРИНЯТЬ ЗАКАЗ
 */
exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    if (order.deliveryType !== 'courier') {
      return res.status(400).json({ error: 'Не курьерский заказ' });
    }

    // ❗ уже занят
    if (order.courierId) {
      return res.status(400).json({ error: 'Заказ уже занят' });
    }

    // ❗ не доступен
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Заказ недоступен' });
    }

    order.courierId = req.userId;
    order.status = 'accepted';

    await order.save();

    res.json({ message: 'Заказ принят', order });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка принятия заказа' });
  }
};

/**
 * 🚚 СТАТУС КУРЬЕРОМ
 */
exports.updateOrderStatusByCourier = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    // ❗ ТОЛЬКО СВОЙ ЗАКАЗ
    if (order.courierId?.toString() !== req.userId) {
      return res.status(403).json({ error: 'Это не ваш заказ' });
    }

    const allowed = ['accepted', 'in_delivery', 'delivered'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Статус обновлён', order });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
};

/**
 * 🛠 АДМИН МЕНЯЕТ СТАТУС
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка' });
  }
};