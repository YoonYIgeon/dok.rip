const mongoose = require('mongoose')
const passwordHash = require("../lib/passwordHash")

const Schema = mongoose.Schema

const User = new Schema({
  username: String,
  name: String,
  password: String,
  userType: {
    default: 100,
    type: Number
  },
})


// create new User document
User.statics.create = function (userData) {
  const user = new this(userData)

  // return the Promise
  return user.save()
}

// find one user by using username
User.statics.findOneByUsername = function (username) {
  return this.findOne({
    username
  }).exec()
}

// verify the password of the User documment
User.methods.verify = function (password) {
  return this.password === passwordHash(password)
}

User.methods.assignAdmin = function () {
  this.admin = true
  return this.save()
}


module.exports = mongoose.model('user', User)
