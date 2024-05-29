const router = require("express").Router();
const usersRouter = require("./user");

const commentRouter = require("./comment");

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
  getBookImage,
  uploadImage,
  getBookById,
} = require("../controllers/book");
const { getUserById } = require("../controllers/user");
const {
  validateUserAuthentication,
  validateUserInfo,
} = require("../middlewares/userValidation");

const {
  validateDeleteBook,
  validateBook,
} = require("../middlewares/bookValidation");

const { getCommentsByBook } = require("../controllers/comment");

router.post("/signup", createUser, validateUserInfo);
router.post("/signin", login, validateUserAuthentication);
router.get("/books", getBooks);
router.get("/books/image", getBookImage);
router.get("/books/search", searchBooks);
router.get("/booksbyid/:id", getBookById)
router.get("/comments/book/:bookId", getCommentsByBook);
router.post("/books/image", uploadImage);
router.get("/users/:userId", getUserById);

router.use(auth);

router.use("/users", usersRouter);

router.post("/books", validateBook, createBook);

//router.use("/books", booksRouter);
router.get("/books/:ownerId", getBooksByOwner);
router.delete("/books/:bookId", validateDeleteBook, deleteBook);
router.use("/comments", commentRouter);

router.use("*", () => {
  throw new NotFoundError("Ресурс не найден.");
});

module.exports = router;
