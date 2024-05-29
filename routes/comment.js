const router = require("express").Router();

const {
  addComment,
  deleteComment,
  updateComment,
} = require("../controllers/comment");

router.post("/", addComment);
router.delete("/:commentId", deleteComment);
router.put("/:commentId", updateComment);

module.exports = router;
