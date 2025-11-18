const express = require("express");
const router = express.Router();
const roomUsecase = require("./../../usecase/room");
const { body, query } = require("express-validator");
const errValidator = require("../middlewere/err.validator");
const permit = require("../middlewere/permit");

router.post(
  "/create",
  [body("name").isString().notEmpty()],
  errValidator,
  permit([0]),
  async (req, res) => {
    
    try {
      const { name} = req.body;
      const result = await roomUsecase.create(name);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

router.patch(
  "/",
  [body("name").isString().notEmpty(), body("room_id").isNumeric().notEmpty()],
  errValidator,
  permit([0]),
  async (req, res) => {
    const { room_id, name } = req.body;
    try {
      const result = await roomUsecase.edit(room_id, name);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

router.get(
  "/listing",
  [
    query("page").isNumeric().notEmpty(),
    query("per_page").isNumeric().notEmpty(),
  ],
  errValidator,
  permit([0]),
  async (req, res) => {
    try {
      const { page, per_page } = req.query;
      const result = await roomUsecase.listing(page, per_page);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

router.delete(
  "/",
  [body("room_id").isNumeric().notEmpty()],
  errValidator,
  permit([0]),
  async (req, res) => {
    try {
      const { room_id } = req.body;
      const result = await roomUsecase.remove(room_id);
      res.status(200).json({ msg: "ok" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

module.exports = router;
