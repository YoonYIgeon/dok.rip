const awsConfig = require("../../awsConfig")
const multer = require("multer")
const multerS3 = require("multer-s3")
const AWS = require("aws-sdk")


AWS.config.update({
  secretAccessKey: awsConfig.secretAccessKey,
  accessKeyId: awsConfig.accessKeyId,
  region: awsConfig.region,
  // credentials: new AWS.CognitoIdentityCredentials({
  //   IdentityPoolId: awsConfig.IdentityPoolId
  // })
})

const s3 = new AWS.S3({
  apiVersion: "2006-03-01"
})

exports.multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: "dok.rip",
    key: function (req, file, callback) {
      callback(null, `dokrip_${Date.now()}.${file.originalname.split('.')[file.originalname.split('.').length-1]}`)
    },
    acl: 'public-read-write',
  })
});

exports.uploads = (req, res) => {
  res.send(req.files)
}
