const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");

// MIDDLEWARE
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[a-f0-9]{24}$/i)) {
    return res.status(404).json({ message: "El ID del libro no es válido." });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "El libro no fue encontrado." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.book = book;
  next();
};

// Get all the books [GET ALL]
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    console.log({ method: "GET ALL", books });
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new book, resource [POST]
router.post("/", async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  if (!title || !author || !genre || !publication_date) {
    return res.status(400).json({
      message: "Los campos título, autor, género y fecha son obligatorios ",
    });
  }

  const book = new Book({ title, author, genre, publication_date });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
    console.log(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", getBook, async (req, res) => {
  res.json(res.book);
});

router.put("/:id", getBook, async (req, res) => {
  try {
    const { book } = res;
    book.title = req?.body?.title || book.title;
    book.author = req?.body?.author || book.author;
    book.genre = req?.body?.genre || book.genre;
    book.publication_date =
      req?.body?.publication_date || book.publication_date;
    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getBook, async (req, res) => {
  if (
    !req?.body?.title &&
    !req?.body?.author &&
    !req?.body?.genre &&
    !req?.body?.publication_date
  ) {
    res.status(400).json({
      message:
        "Al menos uno de estos campos debe ser enviado: Título, autor, género, fecha de publicación.",
    });
  }
  try {
    const { book } = res;
    book.title = req?.body?.title || book.title;
    book.author = req?.body?.author || book.author;
    book.genre = req?.body?.genre || book.genre;
    book.publication_date =
      req?.body?.publication_date || book.publication_date;
    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", getBook, async (req, res) => {
  try {
    const { book } = res;
    await book.deleteOne({ _id: book._id });
    res.json({ message: `Fue eliminado el libro '${book.title}'` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
