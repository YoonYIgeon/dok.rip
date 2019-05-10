const express = require('express')

const app = express()
// body-parser
app.use(express.json())

// router
const accountRouter = require("./routes/account/index")

// config
const {
  mongoURL,
  sessionSecret
} = require("./config")


// jwt
app.set("jwt-secret", sessionSecret)

//MongoDB 접속
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on("error", console.error)
db.once("open", function () {
  console.log("mongodb connect")
})

// session 등록
const session = require("express-session")

// session 설정
var connectMongo = require("connect-mongo")
var MongoStore = connectMongo(session)

var sessionMiddleWare = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14 //지속시간 14일
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60
  })
})
app.use(sessionMiddleWare)


// connect
mongoose.connect(mongoURL)

app.get("/", (req, res, next) => {
  res.send("Hello")
})

app.use("/account", accountRouter)

module.exports = {
  path: "/api",
  handler: app
}
