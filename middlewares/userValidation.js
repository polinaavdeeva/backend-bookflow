const { celebrate, Joi } = require("celebrate");
const { dateRegex } = require("../utils/constants");

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    city: Joi.string().required().min(2).max(30),
    dateOfBirth: Joi.string().required().pattern(dateRegex),
    gender: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
});

const validateUserAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    city: Joi.string().required().min(2).max(30),
    dateOfBirth: Joi.string().required().pattern(dateRegex),
    gender: Joi.string().required(),
  }),
});

module.exports = {
  validateUserUpdate,
  validateUserAuthentication,
  validateUserInfo,
};
