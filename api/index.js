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
