const Comment = require("../models/comment");
const User = require("../models/user");
const Book = require("../models/book");
const mongoose = require("mongoose");

exports.getCommentsByBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;

    const comments = await Comment.find({ bookId: bookId });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Ошибка при получении комментариев книги:", error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при получении комментариев книги" });
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { content, bookId, rating } = req.body;
    const authorId = req.user._id;

    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    book.ratings.push(rating);

    const totalRating = book.ratings.reduce((acc, curr) => acc + curr, 0);
    book.rating = parseFloat((totalRating / book.ratings.length).toFixed(2));

    const comment = new Comment({
      content,
      author: authorId,
      bookId: bookId,
      rating: rating,
    });

    await comment.save();
    await book.save();

    res.status(201).json({ message: "Комментарий успешно добавлен", comment });
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при добавлении комментария" });
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Вы не можете удалить этот комментарий" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Комментарий успешно удален" });
  } catch (error) {
    console.error("Ошибка при удалении комментария:", error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при удалении комментария" });
  }
};
