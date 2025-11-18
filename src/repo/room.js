const db = require("./connector");

exports.create = async (name) => {
  const result = await db.execute(
    "INSERT INTO room (name) VALUES (?) ;",
    [name]
  );
  return result[0].insertId;
};

exports.listing = async (page,per_page) => {
    console.log(page,per_page);
    
  const limit = per_page ;
  const offset = (page-1) * per_page;
  console.log(limit,offset);
  const [row] = await db.execute(
    `SELECT * FROM room ORDER BY id ASC LIMIT ${limit} OFFSET  ${offset};`
  );
  return row;
};


exports.edit = async (room_id, name) => {
  await db.execute("UPDATE room SET name = ? WHERE id = ? ;", [
    name,
    room_id,
  ]);
};

exports.delete = async (room_id) => {
  await db.execute("DELETE FROM room WHERE id = ?;", [
    room_id,
  ]);
};