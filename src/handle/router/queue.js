const express = require("express");
const router = express.Router();
const queueUsecase = require("./../../usecase/queue");
const { body, query } = require("express-validator");
const errValidator = require("../middlewere/err.validator");
const permit = require("../middlewere/permit");
const timeValidator = require("../middlewere/time.validator");
router.post(
  "/booking",
  [
    body("title").isString().notEmpty(),
    body("detail").isString().notEmpty(),
    body("room_id").isNumeric().notEmpty(),
    body("date").isISO8601(),
  ],
  errValidator,
  timeValidator,
  permit([1, 2]),
  async (req, res) => {
    const { title, detail,  room_id } = req.body;
    const { date } = req;
    const { payload } = req;
    console.log(payload.id);
    
    try {
      const result = await queueUsecase.booking(
        title,
        detail,
        payload.id,
        room_id,
        date
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

router.put(
  "/approve",
  [
    body("queue_id").isNumeric().notEmpty(),
    body("room_id").isNumeric().notEmpty(),
    body("date").isISO8601().notEmpty(),
  ],
  errValidator,
  timeValidator,
  permit([1, 0]),
  async (req, res) => {
    const { queue_id, room_id } = req.body;
    const { date } = req;
    try {
      const result = await queueUsecase.approve(queue_id, date, room_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

router.put(
  "/cancal",
  [
    body("queue_id").isNumeric().notEmpty(),
    body("room_id").isNumeric().notEmpty(),
    body("date").isISO8601().notEmpty(),
  ],
  errValidator,
  timeValidator,
  permit([1, 0]),
  async (req, res) => {
    const { queue_id, room_id } = req.body;
    const { date } = req;
    try {
      const result = await queueUsecase.cancal(queue_id, date, room_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

router.get(
  "/listing",
  [
    query("year").isNumeric().notEmpty(),
    query("room_id").isNumeric().notEmpty(),
    query("month").isNumeric().notEmpty(),
  ],
  errValidator,
  timeValidator,
  permit([0, 1, 2]),
  async (req, res) => {
    const { room_id, year, month } = req.query;
    const { role } = req.payload;
    try {
      const result = await queueUsecase.listing(role, room_id, year, month);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

router.get(
  "/by_date",
  [query("room_id").isNumeric().notEmpty(), query("date").isISO8601().notEmpty()],
  errValidator,
  timeValidator,
  permit([0, 1, 2]),
  async (req, res) => {
    const { room_id } = req.query;
    const { date } = req;
    const { role } = req.payload;
   // console.log(date, room, role);

    try {
      const result = await queueUsecase.get_by_date(role, room_id, date);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

module.exports = router;
