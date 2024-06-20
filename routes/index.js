const router = require("express").Router();
const usersRouter = require("./user");

const commentRouter = require("./comment");

const booksRouter = require("./book");
const complaintRouter = require("./complaints");

const { auth } = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");
const { createUser } = require("../controllers/signUp");
const { login } = require("../controllers/signIn");
const {
  getBooks,
  createBook,
  createExistingBook,
  deleteBook,
  searchBooks,

  getBooksByOwner,
  getBookImage,
  uploadImage,
  getBookById,
  receiveBook,
  getAllReceivedBooks,
} = require("../controllers/book");
const { uploadAdsImage, getAdsImage } = require("../controllers/advertisment");
const { getUserById, getAvatar } = require("../controllers/user");
const {
  validateUserAuthentication,
  validateUserInfo,
} = require("../middlewares/userValidation");

const {
  validateDeleteBook,
  validateBook,
} = require("../middlewares/bookValidation");

const { getCommentsByBook } = require("../controllers/comment");

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Успешная регистрация
 */
router.post("/signup", createUser, validateUserInfo);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Аутентификация пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 */
router.post("/signin", login, validateUserAuthentication);

/**
 * @swagger
 * /ads:
 *   post:
 *     summary: Загрузка рекламы
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Успешная загрузка рекламы
 */
router.post("/ads", uploadAdsImage);

/**
 * @swagger
 * /ads/{number}:
 *   get:
 *     summary: Получение изображения рекламы по номеру
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Номер рекламы
 *     responses:
 *       200:
 *         description: Изображение рекламы
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/ads/:number", getAdsImage);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Возвращает список книг
 *     responses:
 *       200:
 *         description: Список книг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Название книги"
 */
router.get("/books", getBooks);

/**
 * @swagger
 * /books/image:
 *   get:
 *     summary: Получение изображения книги
 *     responses:
 *       200:
 *         description: Изображение книги
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/books/image", getBookImage);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Поиск книг
 *     responses:
 *       200:
 *         description: Список найденных книг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Название книги"
 */
router.get("/books/search", searchBooks);

/**
 * @swagger
 * /booksbyid/{id}:
 *   get:
 *     summary: Получение книги по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID книги
 *     responses:
 *       200:
 *         description: Информация о книге
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Название книги"
 */
router.get("/booksbyid/:id", getBookById);

/**
 * @swagger
 * /comments/book/{bookId}:
 *   get:
 *     summary: Получение комментариев к книге
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID книги
 *     responses:
 *       200:
 *         description: Комментарии к книге
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   text:
 *                     type: string
 *                     example: "Отличная книга!"
 */
router.get("/comments/book/:bookId", getCommentsByBook);

/**
 * @swagger
 * /books/image:
 *   post:
 *     summary: Загрузка изображения книги
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Изображение книги успешно загружено
 */
router.post("/books/image", uploadImage);

/**
 * @swagger
 * /superusers/{userId}:
 *   get:
 *     summary: Получить информацию о пользователе по идентификатору
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор пользователя
 *     responses:
 *       200:
 *         description: Информация о пользователе успешно получена
 */
router.get("/superusers/:userId", getUserById);

/**
 * @swagger
 * /usersavatar/{userId}:
 *   get:
 *     summary: Получить аватар пользователя по идентификатору
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор пользователя
 *     responses:
 *       200:
 *         description: Аватар успешно получен
 */
router.get("/usersavatar/:userId", getAvatar);

router.use(auth);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.use("/users", usersRouter);

/**
 * @swagger
 * /api/books/receive:
 *   post:
 *     summary: Принять книгу
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReceiveBookRequest'
 *     responses:
 *       200:
 *         description: Книга успешно принята
 *       400:
 *         description: Ошибка в запросе
 */
router.post("/books/receive", receiveBook);

/**
 * @swagger
 * /api/books/receivedMy:
 *   get:
 *     summary: Получить все принятые мной книги
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Список принятых книг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/books/receivedMy", getAllReceivedBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Создать новую книгу
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Книга успешно создана
 *       400:
 *         description: Ошибка в запросе
 */
router.post("/books", validateBook, createBook);

/**
 * @swagger
 * /api/existingBooks:
 *   post:
 *     summary: Создать существующую книгу
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Существующая книга успешно добавлена
 *       400:
 *         description: Ошибка в запросе
 */

router.post("/existingBooks", createExistingBook);

/**
 * @swagger
 * /api/books/{ownerId}:
 *   get:
 *     summary: Получить книги по идентификатору владельца
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список книг владельца
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: Книги владельца не найдены
 */
router.get("/books/:ownerId", getBooksByOwner);

/**
 * @swagger
 * /api/books/{bookId}:
 *   delete:
 *     summary: Удалить книгу по идентификатору
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Книга успешно удалена
 *       400:
 *         description: Ошибка в запросе
 */
router.delete("/books/:bookId", validateDeleteBook, deleteBook);

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Получить все комментарии
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Список комментариев
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *   post:
 *     summary: Создать новый комментарий
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Комментарий успешно создан
 *       400:
 *         description: Ошибка в запросе
 */
router.use("/comments", commentRouter);

/**
 * @swagger
 * /api/complaints:
 *   get:
 *     summary: Получить все жалобы
 *     tags:
 *       - Complaints
 *     responses:
 *       200:
 *         description: Список жалоб
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Complaint'
 *   post:
 *     summary: Создать новую жалобу
 *     tags:
 *       - Complaints
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Complaint'
 *     responses:
 *       201:
 *         description: Жалоба успешно создана
 *       400:
 *         description: Ошибка в запросе
 */
router.use("/complaints", complaintRouter);

router.use("*", () => {
  throw new NotFoundError("Ресурс не найден.");
});

module.exports = router;
