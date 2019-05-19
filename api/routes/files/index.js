const router = require("express").Router()
const c = require("./controller")
// const authMiddleware = require("../../lib/authMiddleware"

router.post("/upload", c.multer.array("images"), c.uploads)

// router.post("/upload", c.multer.array("images"), c.uploads)
// router.get("/check", authMiddleware, c.check)
// router.get("/server", authMiddleware, c.getServer)
// router.get("/db", authMiddleware, c.getDatabase)

// router.post("/register", c.register)
// router.post("/login", c.login)
// router.post("/server", authMiddleware, c.setServer)
// router.post("/db", authMiddleware, c.setDatabase)

// router.patch("/profile", authMiddleware, c.update)

module.exports = router
