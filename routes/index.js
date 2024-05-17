const router = require("express").Router();
const usersRouter = require("./user");
const { auth } = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");
const { createUser } = require("../controllers/signUp");
const { login } = require("../controllers/signIn");
const {
  validateUserAuthentication,
  validateUserInfo,
} = require("../middlewares/userValidation");

router.post("/signup", createUser, validateUserInfo);
router.post("/signin", login, validateUserAuthentication);

router.use(auth);

router.use("/users", usersRouter);

router.use("*", () => {
  throw new NotFoundError("Ресурс не найден.");
});

module.exports = router;
