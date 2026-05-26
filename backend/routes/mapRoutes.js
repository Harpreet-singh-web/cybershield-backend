const express = require("express")

const router = express.Router()

const {
  getAttackLocations
} = require("../controllers/mapController")

router.get("/attacks", getAttackLocations)

module.exports = router