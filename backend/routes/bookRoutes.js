const express = require('express');
const bookController = require('../controllers/bookController');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBook);
router.post('/', adminMiddleware, bookController.addBook);
router.put('/:id', adminMiddleware, bookController.updateBook);
router.delete('/:id', adminMiddleware, bookController.deleteBook);

module.exports = router;
