const express = require('express');
const courierController = require('../controllers/courierController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, courierController.createCourierApplication);

router.get('/', adminMiddleware, courierController.getCourierApplications);
router.get('/approved', adminMiddleware, courierController.getApprovedCouriers);
router.put('/:id', adminMiddleware, courierController.updateCourierStatus);

module.exports = router;