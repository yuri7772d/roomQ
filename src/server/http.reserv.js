const express = require('express')
const app = express()
const { server } = require('./../config.load')
const authRouter = require('./router/auth')
const cookieParser = require('cookie-parser')


exports.start = () => {

app.use(express.json())
    app.use(cookieParser())
    app.get('/', (req, res) => {
        res.status(200).json({ msg: "ok" })
    })
    app.use('/auth', authRouter);
    app.listen(server.port, () => {
        console.log(`server start on port : ${server.port}`)
    })
}