const Courier = require('../models/Courier');

// Create courier application
exports.createCourierApplication = async (req, res) => {
  try {
    const { name, phone, email, city, comment } = req.body;

    if (!name || !phone || !email || !city) {
      return res.status(400).json({ error: 'Имя, телефон, email и город обязательны' });
    }

    const newCourier = new Courier({
      userId: req.userId,
      name,
      phone,
      email,
      city,
      comment: comment || '',
    });

    await newCourier.save();

    res.status(201).json({
      message: 'Заявка успешно отправлена',
      courier: newCourier,
    });
  } catch (error) {
    console.error('Create courier application error:', error);
    res.status(500).json({ error: 'Не удалось отправить заявку' });
  }
};

// Get all courier applications (admin)
exports.getCourierApplications = async (req, res) => {
  try {
    console.log('📥 Backend: GET /couriers - User:', req.userEmail);
    console.log('✅ Admin check passed - Fetching courier applications...');
    
    const couriers = await Courier.find().sort({ createdAt: -1 });
    
    console.log('✅ Found', couriers.length, 'courier applications');
    res.json(couriers);
  } catch (error) {
    console.error('Get courier applications error:', error);
    res.status(500).json({ error: 'Не удалось получить заявки' });
  }
};

// Get only approved couriers
exports.getApprovedCouriers = async (req, res) => {
  try {
    console.log('📥 Backend: GET /couriers/approved - User:', req.userEmail);
    console.log('✅ Admin check passed - Fetching approved couriers...');
    
    const couriers = await Courier.find({ status: 'approved' }).sort({ createdAt: -1 });
    
    console.log('✅ Found', couriers.length, 'approved couriers');
    res.json(couriers);
  } catch (error) {
    console.error('Get approved couriers error:', error);
    res.status(500).json({ error: 'Не удалось получить одобренных курьеров' });
  }
};

// Update courier status (admin)
exports.updateCourierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, userId, rejectionReason } = req.body;

    console.log('📥 Backend: PUT /couriers/:id - Status update to:', status);

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    const updateData = { status };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const courier = await Courier.findByIdAndUpdate(id, updateData, { new: true });
    console.log('🔥 status:', status);
    console.log('🔥 userId из body:', userId);
    console.log('🔥 courier.userId:', courier.userId);

    if (!courier) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    // If approval, update user record to mark as courier
    if (status === 'approved') {
  const User = require('../models/User');

  const targetUserId = userId || courier.userId;

  if (!targetUserId) {
    console.error('❌ userId отсутствует');
    return res.status(400).json({ error: 'userId не найден' });
  }

  const updatedUser = await User.findByIdAndUpdate(
    targetUserId,
    { isCourier: true },
    { new: true }
  );

  console.log('✅ User updated:', updatedUser);
}

    console.log('✅ Courier status updated:', status);
    res.json({
      message: 'Статус заявки обновлен',
      courier,
    });
  } catch (error) {
    console.error('Update courier status error:', error);
    res.status(500).json({ error: 'Не удалось обновить статус' });
  }
};
