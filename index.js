const  server  = require("./src/server/http.reserv");


const repo = require('./src/repo/auth');

 async function main() {
   // const res =await repo.create("czcc","dasd",1)
 //console.log(res);
 server.start()
 }
 main()