const Book = require("../models/book");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const path = require("path");
const ForbiddenError = require("../errors/ForbiddenError");

// module.exports.getBooks = (req, res, next) => {
//   Book.find({ owner: req.user._id })
//     .then((movies) => res.status(200).send(movies))
//     .catch(next);
// };

module.exports.getBooks = (req, res, next) => {
  Book.find({})
    .then((books) => res.status(200).send(books))
    .catch(next);
};

module.exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Ошибка при получении книги:", error);
    res.status(500).json({
      message: "Произошла ошибка при получении книги",
    });
  }
};

module.exports.searchBooks = (req, res, next) => {
  const { name } = req.query;
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  Book.find(query)
    .then((books) => res.status(200).send(books))
    .catch(next);
};

exports.getBookImage = async (req, res) => {
  try {
    const { bookId } = req.query;

    const book = await Book.findById(bookId);

    if (!book || !book.image) {
      return res.status(404).json({ message: "Обложка книги не найдена" });
    }

    const imagePath = path.join(__dirname, "../uploads", book.image);

    res.sendFile(imagePath);
  } catch (error) {
    console.error("Ошибка при получении обложки книги:", error);
    res.status(500).json({
      message: "Произошла ошибка при получении обложки книги",
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "Файл не загружен",
      });
    } else {
      let image = req.files.image;
      const bookId = req.body._id;

      image.mv(`./uploads/${bookId}-${image.name}`);

      const book = await Book.findByIdAndUpdate(
        bookId,
        { image: `${bookId}-${image.name}` },
        { new: true }
      );

      res.send({
        status: true,
        message: "Файл загружен",
        data: {
          book: book.image,
          name: bookId,
          mimetype: image.mimetype,
          size: image.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.deleteBook = (req, res, next) => {
  Book.findById(req.params.bookId)
    .then((book) => {
      if (!book) {
        next(
          new NotFoundError(
            `Книга с указанным _id: ${req.params.bookId} не найдена.`
          )
        );
        return;
      }

      Book.deleteOne(book)
        .then(() => res.status(200).send(book))
        .catch(next);
    })
    .catch(next);
};

module.exports.createBook = (req, res, next) => {
  const { name, description, author, rating, postingDate } = req.body;

  const owner = req.user._id;

  Book.create({
    name,
    description,
    author,
    rating,
    postingDate,
    owner,
  })
    .then((book) => res.status(200).send(book))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные при добавлении книги."));
        return;
      }
      next(err);
    });
};

module.exports.createExistingBook = async (req, res, next) => {
  const bookId = req.body.book_id;
  const owner = req.user._id;

  try {
    await Book.findByIdAndUpdate(
      bookId,
      { $push: { owner: owner } },
      { new: true }
    );
    res.status(200).json({ message: "Добавлено в существующий раздел" });
  } catch {
    res
      .status(500)
      .json({ message: "Произошла ошибка при добавлении нового владельца" });
  }
};

exports.getBooksByOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const books = await Book.find({ owner: ownerId });

    res.status(200).json({ books });
  } catch (error) {
    console.error("Ошибка при получении книг пользователя:", error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при получении книг пользователя" });
  }
};

exports.getAllReceivedBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("receivedBooks");

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json(user.receivedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.receiveBook = async (req, res) => {
  const ownerId = req.body.ownerId;
  const getterUser = req.user._id;
  const bookId = req.body.bookId;

  const book = await Book.findById(bookId);

  try {
    const result = await Book.findByIdAndUpdate(
      bookId,
      { $pull: { owner: ownerId } },
      { new: true }
    );

    if (result) {
      console.log("Владелец успешно удален из книги:", result);
      const res2 = await User.findByIdAndUpdate(
        getterUser,
        { $push: { receivedBooks: bookId } },
        { new: true }
      );

      if (res2) {
        console.log("Добавлено в список мои книги", res2);
        res.status(200).json("Добавлено в список мои книги");
        return res2;
      } else {
        console.log("Книга с указанным id не найдена");
        return null;
      }
    } else {
      console.log("Книга с указанным id не найдена");
      return null;
    }
  } catch (err) {
    console.error("Ошибка при удалении владельца из книги:", err);
    throw err;
  }
};
