const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  updateUserInfo,
  getCurrentUser,
  uploadAvatar,
  getAvatar,
  addRating,
  getAverageRating,
} = require("../controllers/user");
const { validateUserUpdate } = require("../middlewares/userValidation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateUserInfo);
router.post("/me/avatar", uploadAvatar);
router.post("/:userId/rating", addRating);
router.get("/:userId/rating", getAverageRating);

module.exports = router;
