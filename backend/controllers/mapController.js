const LoginLog = require("../models/LoginLog")

exports.getAttackLocations =
async (req,res)=>{

  try{

    const attacks = await LoginLog.find({
      status: "failed"
    })

    res.json(attacks)

  }catch(err){

    console.log(err)

    res.status(500).json({
      message: "Server Error"
    })

  }

}