const jwt = require("jsonwebtoken");
const errExep = require("../../errExep");
const { jwt:jwtConf } = require("../../config.load");

module.exports = (roles) => {
   return  (req, res, next) => {
  const toket = req.cookies?.token ;
  if (!toket) {
    return  res.status(401).json({ msg: errExep.TOKEN_INVALID});
  }
    let decode;
    try {
        decode = jwt.verify(toket,jwtConf.secret)
    } catch (error) {
        console.log(error);
       return res.status(401).json({ msg: errExep.TOKEN_INVALID});
    }
let isUse = false ;
  for (const role of roles) {
     if (decode.role == role){
          isUse =true ;
          break;
     }
  }
   if(!isUse) {
    return  res.status(401).json({ msg: errExep.TOKEN_INVALID});
   }
   req.payload = decode ;
  next();
};
}