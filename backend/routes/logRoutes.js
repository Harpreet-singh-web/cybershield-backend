const Express = require('express')
const router = Express.Router()
const { getLogs } = require('../controllers/logController')
router.get('/' , getLogs)

module.exports = router
