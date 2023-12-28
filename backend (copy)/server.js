const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const GameDBRouter = require("./controllers/GameDB.controller");
const userRouter = require("./controllers/user.controller.js");
app.use(express.json());
dotenv.config();
app.use(cors());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 4000;

app.use("/", GameDBRouter);
app.use("/user", userRouter);
app.listen(port, () => {
  console.log("server is running " + port);
});
