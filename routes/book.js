const router = require("express").Router();

const {
  getBooks,
  createBook,
  deleteBook,
} = require("../controllers/book");

const {
  validateDeleteBook,
  validateBook,
} = require("../middlewares/bookValidation");

router.get("/", getBooks);
router.post("/", validateBook, createBook);
router.delete("/:bookId", validateDeleteBook, deleteBook);

module.exports = router;
