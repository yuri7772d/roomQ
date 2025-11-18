const repo = require("../repo/room");
const { root, jwt: jwtConf } = require("../config.load");
const errExep = require("../errExep");
const jwt = require("jsonwebtoken");
exports.create = async (name) => {
   const room_id = await repo.create(name)
   if (!room_id) throw new Error(errExep.CREATE_FAIL);
  return {room_id} ;
};

exports.edit = async (room_id, name) => {
  const result = await repo.edit(room_id, name);
  // if (!result) throw new Error(errExep.EDIT_FAIL);
 return result ;
};
 

exports.listing = async (page, per_page) => {
   // console.log(await repo.listing(page, per_page));
    
  return await repo.listing(page, per_page);
};

exports.remove = async (room_id) => {
  return await repo.delete(room_id);
};
