const Book = require('../models/Book');

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Не удалось получить книги' });
  }
};

// Get single book
exports.getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Не удалось получить книгу' });
  }
};

// Add book (admin)
exports.addBook = async (req, res) => {
  try {
    const { title, price, image, description, author, stock } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Цена должна быть положительной' });
    }

    const newBook = new Book({
      title,
      price,
      image: image || 'https://via.placeholder.com/200x300?text=Book+Cover',
      description: description || '',
      author: author || '',
      stock: stock || 10,
    });

    await newBook.save();

    res.status(201).json({
      message: 'Книга успешно добавлена',
      book: newBook,
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Не удалось добавить книгу' });
  }
};

// Update book (admin)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, image, description, author, stock } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    if (title) book.title = title;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ error: 'Цена должна быть положительной' });
      }
      book.price = price;
    }
    if (image) book.image = image;
    if (description) book.description = description;
    if (author) book.author = author;
    if (stock !== undefined) book.stock = stock;

    await book.save();

    res.json({
      message: 'Книга успешно обновлена',
      book,
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Не удалось обновить книгу' });
  }
};

// Delete book (admin)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    res.json({ message: 'Книга успешно удалена' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Не удалось удалить книгу' });
  }
};
