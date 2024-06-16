const router = require("express").Router();

const {
  createComplaint,
  getComplaints,
  deleteComplaint,
} = require("../controllers/complaint.js");

router.post("/", createComplaint);
router.get("/", getComplaints);
router.delete("/:id", deleteComplaint);

module.exports = router;
