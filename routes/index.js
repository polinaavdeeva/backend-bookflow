const router = require("express").Router();
const usersRouter = require("./user");
const booksRouter = require("./book");
const { auth } = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");
const { createUser } = require("../controllers/signUp");
const { login } = require("../controllers/signIn");
const {
  getBooks,
  createBook,
  deleteBook,
  searchBooks,
  getBooksByOwner,
} = require("../controllers/book");
const {
  validateUserAuthentication,
  validateUserInfo,
} = require("../middlewares/userValidation");

const {
  validateDeleteBook,
  validateBook,
} = require("../middlewares/bookValidation");

router.post("/signup", createUser, validateUserInfo);
router.post("/signin", login, validateUserAuthentication);
router.get("/books", getBooks);
router.get("/books/search", searchBooks);

router.use(auth);

router.use("/users", usersRouter);
router.post("/books", validateBook, createBook);
//router.use("/books", booksRouter);
router.get("books/:ownerId", getBooksByOwner);
router.delete("books/:bookId", validateDeleteBook, deleteBook);

router.use("*", () => {
  throw new NotFoundError("Ресурс не найден.");
});

module.exports = router;
