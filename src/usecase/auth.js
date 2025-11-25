const repo = require("../repo/auth");
const { root, jwt: jwtConf } = require("../config.load");
const errExep = require("../errExep");
const jwt = require("jsonwebtoken");
exports.create = async (username, password, role) => {
  if (!(role == 2 || role == 1)) {
    throw new Error(errExep.ROLE_INVALID);
  }
  let auth_id;
  try {
    auth_id = await repo.create(username, password, role);
    console.log(auth_id);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error(errExep.USER_USED);
    }
  }
  return { id: auth_id, username: username, role };
};

exports.login = async (username, password) => {
  let payload;
  if (username == root.username) {
    if (password != root.password) {
      throw new Error(errExep.PASSWORD_INVALID);
    }
    payload = { id: -1, username: root.username, role: 0 };
  } else {
    const userDB = await repo.get_by_username(username);
    //console.log(userDB);
    if (userDB.length == 0) {
      throw new Error(errExep.USER_NOT_FOUND);
    }
    if (password != userDB[0].password) {
      throw new Error(errExep.PASSWORD_INVALID);
    }
    payload = { id: userDB[0].id, username: username, role: userDB[0].role };
  }

  const secret = jwt.sign(payload, jwtConf.secret, { expiresIn: "1d" });

  return { payload, token: secret };
};

exports.me = async (token) => {
  let decode;
  try {
    decode = jwt.verify(token, jwtConf.secret);
  } catch (error) {
    console.log(error);

    throw new Error(errExep.TOKEN_INVALID);
  }

  if (decode.username != root.username) {
    const userDB = await repo.get_by_id(decode.id);

    if (userDB.length == 0) {
      throw new Error(errExep.USER_NOT_FOUND);
    }
  }
  return decode;
};

exports.listing = async () => {
  return await repo.listing();
};

exports.remove = async (auth_id) => {
  return await repo.remove_by_id(auth_id);
};
