const router = require("express").Router();

const { createComplaint, getComplaints } = require("../controllers/complaint");

router.post("/", createComplaint);
router.get("/", getComplaints);

module.exports = router;
