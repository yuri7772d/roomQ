module.exports = (req, res, next) => {
  const bodyDate = req.body?.date;
  const queryDate = req.query?.date;
  if (queryDate) {
    console.log("++++")
    const newDate = new Date(queryDate);
    newDate.setHours(0, 0, 0, 0);
    req.date = newDate;
  }
  if (bodyDate) {
    const newDate = new Date(bodyDate);
    newDate.setHours(0, 0, 0, 0);
    req.date = newDate;
  }

  next();
};
