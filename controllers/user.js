const User = require("../models/user");
const Comment = require("../models/comment");
const Complaint = require("../models/complaints");
const path = require("path");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const { ConflictError } = require("../errors/ConflictError");
const cloudinary = require('../utils/cloudinary');

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name, dateOfBirth, gender, lastName, patronymic, rating } =
    req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      name,
      dateOfBirth,
      gender,
      lastName,
      patronymic,
    },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(
          new NotFoundError(
            `Пользователь с указанным _id: ${req.user._id} не найден.`
          )
        );
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Пользователь с таким email существует."));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные."));
        return;
      }
      next(err);
    });
};

exports.getAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user || !user.avatar) {
      return res.status(404).json({ message: "Аватар пользователя не найден" });
    }

    const avatarPath = path.join(__dirname, "../uploads", user.avatar);

    res.sendFile(avatarPath);
  } catch (error) {
    console.error("Ошибка при получении аватара пользователя:", error);
    res.status(500).json({
      message: "Произошла ошибка при получении аватара пользователя",
    });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.files.avatar || !req.files.avatar) {
      return res.status(400).send({
        status: false,
        message: "Файл не загружен",
      });
    }
      let image = req.files.avatar;
      const userId = req.user._id;
  
      // Загрузка файла в Cloudinary
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "avatars",
      });
      // avatar.mv(`./uploads/${userId}-${avatar.name}`);

      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: result.secure_url },
        { new: true }
      );

      return res.status(200).send({
        status: true,
        message: "Файл загружен",
        data: {
          user: user.avatar,
          name: userId,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.addRating = async (req, res) => {
  const { userId } = req.params;
  const { rating } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.ratings.push(rating);

    const totalRating = user.ratings.reduce((acc, curr) => acc + curr, 0);
    user.rating = parseFloat((totalRating / user.ratings.length).toFixed(2));

    await user.save();

    res.status(200).json({ message: "Оценка успешно добавлена", user });
  } catch (error) {
    console.error("Ошибка при добавлении оценки:", error);
    res.status(500).json({ message: "Произошла ошибка при добавлении оценки" });
  }
};

exports.getAverageRating = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ rating: user.rating });
  } catch (error) {
    console.error("Ошибка при получении среднего рейтинга:", error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при получении среднего рейтинга" });
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(
          new NotFoundError(
            `Пользователь с указанным _id: ${req.user._id} не найден.`
          )
        );
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные."));
        return;
      }
      next(err);
    });
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Ошибка при получении информации о пользователе:", error);
    res.status(500).json({
      message: "Произошла ошибка при получении информации о пользователе",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await User.findByIdAndDelete(userId);
    await Complaint.deleteMany({ user: userId });
    await Comment.deleteMany({ author: userId });

    res.status(200).json({ message: "Пользователь успешно удален" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при удалении пользователя" });
  }
};
