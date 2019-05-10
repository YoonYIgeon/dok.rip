const router = require("express").Router()
const authMiddleware = require("../../lib/authMiddleware")
const c = require("./controller")


router.get("/unique", c.unique)
router.get("/check", authMiddleware, c.check)
router.get("/server", authMiddleware, c.getServer)
router.get("/db", authMiddleware, c.getDatabase)

router.post("/register", c.register)
router.post("/login", c.login)
router.post("/server", authMiddleware, c.setServer)
router.post("/db", authMiddleware, c.setDatabase)

router.patch("/profile", authMiddleware, c.update)


module.exports = router
