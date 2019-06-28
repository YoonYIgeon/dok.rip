const router = require("express").Router()
const authMiddleware = require("../../lib/authMiddleware")
const c = require("./controller")

router.get("/unique", c.unique)
"/api/account/unique"
router.get("/check", authMiddleware, c.check)
router.get("/server", authMiddleware, c.getServer)
router.get("/db", authMiddleware, c.getDatabase)
router.get("/mypage", authMiddleware, c.mypage)

router.post("/register", c.register)
router.post("/login", c.login)

router.patch("/profile", authMiddleware, c.update)
router.patch("/password", authMiddleware, c.updatePassword)

module.exports = router
