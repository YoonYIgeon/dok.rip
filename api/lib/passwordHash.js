const crypto = require('crypto');

const {
  sessionSecret
} = require("../config")

module.exports = function (password) {
  return crypto
    .createHash("sha512")
    .update(password + sessionSecret)
    .digest("base64")
}
