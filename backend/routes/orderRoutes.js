const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);

// 👇 ВАЖНО (добавили)
router.get('/courier', authMiddleware, orderController.getCourierOrders);

router.get('/my-orders', authMiddleware, orderController.getUserOrders);

router.get('/', authMiddleware, orderController.getAllOrders);

router.post('/:id/accept', authMiddleware, orderController.acceptOrder);

router.put('/:id/status', authMiddleware, orderController.updateOrderStatusByCourier);

router.put('/:id', adminMiddleware, orderController.updateOrderStatus);

module.exports = router;