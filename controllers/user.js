const User = require("../models/user");
const path = require("path");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const { ConflictError } = require("../errors/ConflictError");

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name, dateOfBirth, gender, lastName, patronymic } = req.body;

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
    const userId = req.user._id;

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
    if (!req.files) {
      res.send({
        status: false,
        message: "Файл не загружен",
      });
    } else {
      let avatar = req.files.avatar;
      const userId = req.user._id;

      avatar.mv(`./uploads/${userId}-${avatar.name}`);

      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: `${userId}-${avatar.name}` },
        { new: true }
      );

      res.send({
        status: true,
        message: "Файл загружен",
        data: {
          user: user.avatar,
          name: userId,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
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
