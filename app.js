require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const router = require("./routes/index");
const { handleError } = require("./middlewares/errorsHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const path = require("path");
const fileUpload = require("express-fileupload");
const { swaggerUi, swaggerSpec } = require("./swagger");

const { PORT = 4000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://polinaavdeeva:bookflow123.@bookflow.wx21ipq.mongodb.net/bookflowdb?retryWrites=true&w=majority&appName=BookFlow"
  )
  .then(() => {
    console.log("Бд подключена");
  })
  .catch(() => {
    console.log("Что-то пошло не так");
  });

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://bookflow-api.vercel.app",
    "http://bookflow-api.vercel.app",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(requestLogger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
