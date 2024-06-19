const Complaint = require("../models/complaints.js");

module.exports.createComplaint = (req, res) => {
  const { reason, text, userId, bookId, id } = req.body;
  if (!reason || !text) {
    return res.status(400).json({ message: "Неверно введены данные" });
  }
  const complaint = new Complaint({ reason, text, userId, bookId, id });
  complaint
    .save()
    .then((result) => {
      res.status(201).json({ message: "Жалоба отправлена", complaint: result });
    })
    .catch((err) => {
      res.status(500).json({ message: "Ошибка отправки жалобы", error: err });
    });
};

module.exports.getComplaints = (req, res) => {
  Complaint.find()
    .then((complaints) => {
      res.status(200).json(complaints);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Ошибка при получении жалоб", error: err });
    });
};

module.exports.deleteComplaint = (req, res) => {
  const { id } = req.params;
  Complaint.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Жалоба успешно удалена" });
      } else {
        res.status(404).json({ message: "Жалоба не найдена" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Ошибка при удалении жалобы", error: err });
    });
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name surname");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
