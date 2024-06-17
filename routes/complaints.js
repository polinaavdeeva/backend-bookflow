const router = require("express").Router();

const {
  createComplaint,
  getComplaints,
  deleteComplaint,
} = require("../controllers/complaint.js");
const { getUserById } = require("../controllers/user.js");

router.post("/", createComplaint);
router.get("/", getComplaints);
router.delete("/:id", deleteComplaint);
router.get("/:userId", getUserById);

module.exports = router;
