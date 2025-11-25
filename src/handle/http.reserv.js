const express = require("express");
const app = express();
const { server } = require("./../config.load");
const authRouter = require("./router/auth");
const queueRouter = require("./router/queue");
const roomRouter = require("./router/room");
const cookieParser = require("cookie-parser");
const cors = require('cors');

exports.start = () => {
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "ok sdfsfadfgahfh" });
  });
  app.use("/auth", authRouter);
  app.use("/queue", queueRouter);
  app.use("/room", roomRouter);
  app.listen(server.port, () => {
    console.log(`server start on port : ${server.port}`);
  });
};
