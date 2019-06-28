const router = require("express").Router()
const authMiddleware = require("../../lib/authMiddleware")
const c = require("./controller")


router.get("/", c.search)

router.post("/enroll", authMiddleware, c.enroll)


module.exports = router
