const mongoose = require("mongoose")

const ipBlockSchema = new mongoose.Schema({

  ipAddress: {
    type: String
  },

  email: {
    type: String
  },

  blockedUntil: {
    type: Date
  },

  permanentlyBlocked: {
    type: Boolean,
    default: false
  }

})

module.exports =
mongoose.model("IPBlock", ipBlockSchema)