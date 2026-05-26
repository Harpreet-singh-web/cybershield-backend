const LoginLog = require('../models/LoginLog')

exports.getLogs = async (req, res) => {
  try {
    const logs = await LoginLog.find().sort({ timestamp: -1 })
    res.json(logs)
  } catch (error) {
    console.error("Error fetching logs:", error)
    res.status(500).json({ message: "Server error" })
  }
}
