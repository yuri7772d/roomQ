const mysql = require('mysql2/promise')
const {mysql:mysqlConf} =require('../config.load')
const db =mysql.createPool({
    host:mysqlConf.host,
    user:mysqlConf.usernsme,
    password:mysqlConf.password,
    database:mysqlConf.db,
    port:mysqlConf.port,
});

module.exports = db ;