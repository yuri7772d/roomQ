const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    server: getServerEnv(),
    mysql: getMysqlEnv(),
    jwt: getJwtEnv(),
    root: getRootEnv(),
}

function getServerEnv() {
    const portEnv = process.env?.PORT;
    if (!portEnv) {
        throw new Error("PORT invalid!");

    }

    const port = Number(portEnv);
    if (!port) {
        throw new Error("PORT invalid!");

    }
    return { port }
}
function getMysqlEnv() {
    const portEnv = process.env?.MYSQL_PORT;
    if (!portEnv) {
        throw new Error("MYSQL_PORT invalid!");

    }

    const port = Number(portEnv);
    if (!port) {
        throw new Error("MYSQL_PORT invalid!");
    }

    const host = process.env?.MYSQL_HOST;
    if (!host) {
        throw new Error("MYSQL_HOST invalid!");
    }


    const password = process.env?.MYSQL_PASSWORD;
    if (!password) {
        throw new Error("MYSQL_PASSWORD invalid!");
    }


    const usernsme = process.env?.MYSQL_USERNAME;
    if (!usernsme) {
        throw new Error("MYSQL_USERNAME invalid!");
    }
        const db = process.env?.MYSQL_DB;
    if (!db) {
        throw new Error("MYSQL_DB invalid!");
    }

    return { host, port, password, usernsme,db }

}
function getJwtEnv() {
    const secret = process.env?.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET invalid!");
    }
    const refresh_secret = process.env?.JWT_REFRESH_SECRET;
    if (!refresh_secret) {
        throw new Error("JWT_REFRESH_SECRET invalid!");
    }
    return { secret}
}
function getRootEnv() {

    const password = process.env?.ROOT_PASSWORD;
    if (!password) {
        throw new Error("ROOT_PASSWORD invalid!");
    }


    const usernsme = process.env?.ROOT_USERNAME;
    if (!usernsme) {
        throw new Error("ROOT_USERNAME invalid!");
    }
    return { password, username: usernsme }
}