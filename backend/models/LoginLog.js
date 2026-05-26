const mongoose = require("mongoose")

const loginLogSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },

  ipAddress: {
    type: String
  },

  status: {
    type: String,
    enum: ["success", "failed"],
    required: true
  },

  country: String,

  city: String,

lat: Number,
lon: Number,

  timestamp: {
    type: Date,
    default: Date.now
  }

})

module.exports =
mongoose.model("LoginLog", loginLogSchema)