const Book = require("../models/book");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
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

module.exports.deleteBook = (req, res, next) => {
  Book.findById(req.params.bookId)
    .then((book) => {
      if (!book) {
        next(new NotFoundError(`Книга с указанным _id: ${req.params.bookId} не найдена.`));
        return;
      }

    //   if (movie.owner.toString() !== req.user._id) {
    //     next(new ForbiddenError("Можно удалять только свои добавленные фильмы."));
    //     return;
    //   }

      Book.deleteOne(book)
        .then(() => res.status(200).send(book))
        .catch(next);
    })
    .catch(next);
};

module.exports.createBook = (req, res, next) => {
  const {
    name,
    description,
    image,
    author,
    rating,
    postingDate,
    // bookId,
  } = req.body;

  const owner = req.user._id;

  Book.create({
    name,
    description,
    image,
    author,
    rating,
    postingDate,
    // bookId,
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
