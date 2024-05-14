const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/bookflowdb")
  .then(() => {
    console.log("Бд подключена");
  })
  .catch(() => {
    console.log("Что-то пошло не так");
  });

app.use(cors());

app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
