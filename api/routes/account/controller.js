const jwt = require("jsonwebtoken")
const User = require("../../models/user")
const Book = require("../../models/book")
const passwordHash = require("../../lib/passwordHash")

const nodemailer = require("nodemailer");
const {
  nodeMailerConfig
} = require("../../config")


//get
// 정보확인
exports.check = (req, res) => {
  const {
    username
  } = req.decoded

  User.findOneByUsername(username).then(r => {
    if (r) {
      r.password = ''
      res.json({
        success: true,
        info: r
      })
    } else {
      res.status(404).json({
        success: false,
        info: "User not fount"
      })
    }
  })
}

// 중복확인
exports.unique = (req, res, next) => {
  console.log(req.query)
  const {
    username
  } = req.query

  User.findOneByUsername(username).then(r => {
    if (r === null) {
      // 등록 가능한 이메일인 경우
      // 6자리 인증 코드 생성
      const code = (Math.random() + "").substr(2, 6)
      // todo 메일 전송
      try {
        let transporter = nodemailer.createTransport(nodeMailerConfig);

        let mailOptions = {
          from: nodeMailerConfig.auth.user, // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
          to: username, // 수신 메일 주소
          subject: '$[{code}]독립 이메일 인증 메일입니다.', // 제목
          text: `인증코드는 ${code} 입니다.` // 내용
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.send({
          success: true,
          code
        })
      } catch (err) {
        next(err)
      }
    } else {
      res.status(404).send({
        success: false,
        message: "이미 등록된 이메일입니다."
      })
    }
  })
}
exports.getServer = (req, res) => {
  const {
    username
  } = req.decoded
  User.findOneByUsername(username).then(user => {
    res.send(user.serverData)
  })
}
exports.getDatabase = (req, res) => {
  const {
    username
  } = req.decoded
  User.findOneByUsername(username).then(user => {
    res.send(user.dbData)
  })
}

//post
exports.login = (req, res) => {
  const {
    username,
    password
  } = req.body
  const secret = req.app.get("jwt-secret")
  // check the user info & generate the jwt
  const check = user => {
    if (!user) {
      // user does not exist
      throw new Error("일치하는 이메일이 없습니다.")
    } else {
      // user exists, check the password
      if (user.verify(password)) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          const data = {
            _id: user._id,
            username: user.username,
            userType: user.userType
          }
          jwt.sign(
            data,
            secret, {
              expiresIn: "7d",
              issuer: "dokrip",
              subject: "userInfo"
            },
            (err, token) => {
              if (err) reject(err)
              resolve({
                token,
                data,
                user
              })
            }
          )
        })
        return p
      } else {
        throw new Error("잘못 된 비밀번호입니다.")
      }
    }
  }

  // respond the token
  const respond = ({
    token,
    data,
    user
  }) => {
    user.password = null
    res.json({
      message: "logged in successfully",
      token,
      user
    })
  }

  // error occured
  const onError = error => {
    res.status(403).json({
      message: error.message
    })
  }

  // find the user
  User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}

// 회원가입
exports.register = (req, res) => {
  let newUser = null
  // create a new user if does not exist
  const create = user => {
    if (user) {
      throw new Error("중복된 이메일입니다.")
    } else {
      // 랜덤 키 생성
      function createRandomString(length) {
        var str = ""
        for (; str.length < length; str += Math.random()
          .toString(36)
          .substr(2)
        );
        return str.substr(0, length)
      }
      newUser = req.body
      newUser.password = passwordHash(newUser.password)

      const apiKey = createRandomString(12)

      return User.create({
        ...newUser,
        apiKey
      })
    }
  }

  // respond to the client
  const respond = user => {
    res.json({
      message: "success"
    })
  }

  // run when there is an error (username exists)
  const onError = error => {
    if ((error.name = "MongoError" && error.code === 11000)) {
      const errKey = error.errmsg.split(".$")[1].split("_")[0]
      res.status(409).json({
        message: `${errKey} is not unique`
      })
    } else {
      res.status(409).json({
        message: error.message
      })
    }
  }

  // check username duplication
  User.findOneByUsername(req.body.username)
    .then(create)
    .then(respond)
    .catch(onError)
}

// mypage 정보
exports.mypage = async (req, res) => {
  const writerId = req.decoded._id
  const list = await Book.find({
    writerId
  })
  const verified = await Book.countDocuments({
    writerId,
    verify: true
  })
  const verifying = await Book.countDocuments({
    writerId,
    verify: false
  })

  res.send({
    list,
    verified,
    verifying
  })
}

// password 변경
exports.updatePassword = (req, res, next) => {
  const {
    original,
    password,
    password2
  } = req.body
  console.log("updatePassword", original, password, password2)
  const update = user => {
    try {
      if (user.password !== passwordHash(original)) {
        throw new Error("기존 비밀번호가 일치하지 않습니다.")
      } else if (password !== password2) {
        // 프론트에서 한 번 확인, 백에서 한 번 더 확인
        throw new Error("신규 비밀번호가 일치하지 않습니다.")
      } else {
        user.set({
          password: passwordHash(password)
        })
        user.save((err, r) => {
          if (err) {
            throw new Error(err)
          }
          res.send({
            success: true
          })
        })
      }
    } catch (err) {
      console.error(err.stack)
      next(err)
    }
  }
  User.findOneByUsername(req.decoded.username).then(update)
}

// patch
// 정보 업데이트
exports.update = (req, res) => {
  const update = user => {
    try {
      if (!user) {
        throw new Error("update failed")
      } else {
        user.set(req.body)
        user.save((err, r) => {
          if (err) {
            throw new Error(err)
          }
          res.send(r)
        })
      }
    } catch (err) {
      console.error(err.stack)
      next(err)
    }
  }

  User.findOneByUsername(req.decoded.username).then(update)
}
