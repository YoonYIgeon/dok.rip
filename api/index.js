const express = require('express')

const app = express()
// body-parser
app.use(express.json())

// router
const accountRouter = require("./routes/account/index")
const filesRouter = require("./routes/files/index")
const bookRouter = require("./routes/book/index")

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
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useFindAndModify: false
})

app.get("/", (req, res, next) => {
  res.send("Hello")
})

app.use("/account", accountRouter)
app.use("/files", filesRouter)
app.use("/book", bookRouter)

// error handler
app.use(function (err, req, res, next) {
  // Do logging and user-friendly error message display
  console.log("errorHandler", err)
  // console.error(err.stack);
  res.status(500).send(err.message || '서버 에러');
});

module.exports = {
  path: "/api",
  handler: app
}
