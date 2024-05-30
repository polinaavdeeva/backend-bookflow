const router = require("express").Router();

const { addComment, deleteComment } = require("../controllers/comment");

router.post("/", addComment);
router.delete("/:commentId", deleteComment);

module.exports = router;
