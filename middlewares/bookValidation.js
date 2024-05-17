const { celebrate, Joi } = require("celebrate");
//const { regExp } = require("../utils/constants");

const validateBook = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    author: Joi.string().required(),
    rating: Joi.number().required(),
    postingDate: Joi.string().required(),
    bookId: Joi.number().required(),
  }),
});

const validateDeleteBook = celebrate({
  params: Joi.object().keys({
    bookId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateDeleteBook,
  validateBook,
};
