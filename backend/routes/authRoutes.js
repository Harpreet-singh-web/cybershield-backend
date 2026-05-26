const Express = require("express");
const router = Express.Router()

const {register,login} = require("../controllers/authController")

router.post("/register",register)
router.post("/login",login)
console.log("Auth routes loaded")
module.exports = router