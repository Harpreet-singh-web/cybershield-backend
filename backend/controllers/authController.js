const axios = require("axios")
const User = require("../models/User")
const IPBlock = require("../models/IPBlock")
const LoginLog = require("../models/LoginLog")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookies = require("cookie-parser")

// =====================================
// REGISTER USER
// =====================================

exports.register = async (req, res) => {

    try {

        const { username, email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hash
        })

        res.status(201).json({
            message: "User registered successfully"
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            message: "Server error"
        })
    }
}


// =====================================
// LOGIN USER
// =====================================

exports.login = async (req, res) => {

    try {

        console.log("🔥 LOGIN API HIT")

        const { email, password } = req.body

        // GET IP
        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress

        console.log("IP:", ip)

        // =====================================
        // GEOLOCATION
        // =====================================

        let geoData = {}

        try {

            const response = await axios.get(
                `http://ip-api.com/json/${ip}`
            )

            geoData = response.data

            console.log("🌍 GEO:", geoData)

        } catch (err) {

            console.log("❌ GEO API ERROR")

        }

        // =====================================
        // CHECK BLOCKED IP FOR THIS ACCOUNT ONLY
        // =====================================

        let blockedIP = await IPBlock.findOne({
            ipAddress: ip,
            email: email
        })

        // REMOVE EXPIRED BLOCK
        if (
            blockedIP &&
            blockedIP.blockedUntil < Date.now()
        ) {

            await IPBlock.deleteOne({
                ipAddress: ip,
                email: email
            })

            blockedIP = null
        }

        // STILL BLOCKED
        if (blockedIP) {

            console.log("🚫 BLOCKED IP")

            return res.status(403).json({
                message:
                    "Your IP is temporarily blocked for this account"
            })
        }

        // =====================================
        // FIND USER
        // =====================================

        const user = await User.findOne({ email })

        console.log("USER:", user)

        // =====================================
        // USER NOT FOUND
        // =====================================

        if (!user) {

            console.log("❌ USER NOT FOUND")

            const log = await LoginLog.create({
                email,
                ipAddress: ip,
                status: "failed",

                country: geoData.country || "Unknown",
                city: geoData.city || "Unknown",
                lat: geoData.lat || 0,
                lon: geoData.lon || 0,
                isp: geoData.isp || "Unknown"
            })

            console.log("✅ FAILED LOG SAVED:", log)

            await handleFailedAttempts(ip, email)

            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // =====================================
        // CHECK PASSWORD
        // =====================================

        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        console.log("PASSWORD MATCH:", isMatch)

        // =====================================
        // WRONG PASSWORD
        // =====================================

        if (!isMatch) {

            console.log("❌ WRONG PASSWORD")

            const log = await LoginLog.create({
                email,
                ipAddress: ip,
                status: "failed",

                country: geoData.country || "Unknown",
                city: geoData.city || "Unknown",
                lat: geoData.lat || 0,
                lon: geoData.lon || 0,
                isp: geoData.isp || "Unknown"
            })

            console.log("✅ FAILED LOG SAVED:", log)

            await handleFailedAttempts(ip, email)

            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // =====================================
        // SUCCESS LOGIN
        // =====================================

        console.log("✅ LOGIN SUCCESS")

        const successLog = await LoginLog.create({
            email,
            ipAddress: ip,
            status: "success",

            country: geoData.country || "Unknown",
            city: geoData.city || "Unknown",
            lat: geoData.lat || 0,
            lon: geoData.lon || 0,
            isp: geoData.isp || "Unknown"
        })

        console.log("✅ SUCCESS LOG SAVED:", successLog)

        // =====================================
        // GENERATE JWT
        // =====================================

        const token = jwt.sign(
            {
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        // =====================================
        // SEND RESPONSE
        // =====================================

        res.cookie("token", token)
            .status(200)
            .json({
                message: "Login successful",
                token,
                email: user.email,
                role: user.role
            })

    } catch (error) {

        console.error("🚨 LOGIN ERROR:", error)

        res.status(500).json({
            message: "Server error"
        })
    }
}


// =====================================
// HANDLE FAILED ATTEMPTS
// =====================================

async function handleFailedAttempts(ip, email) {

    // FIND FAILED ATTEMPTS
    const failedAttempts = await LoginLog.find({

        ipAddress: ip,
        email: email,
        status: "failed",

        timestamp: {
            $gte: new Date(
                Date.now() - 2 * 60 * 1000
            )
        }
    })

    console.log(
        "FAILED ATTEMPTS:",
        failedAttempts.length
    )

    // BLOCK AFTER 5 ATTEMPTS
    if (failedAttempts.length >= 5) {

        await IPBlock.findOneAndUpdate(

            {
                ipAddress: ip,
                email: email
            },

            {
                blockedUntil:
                    Date.now() + 15 * 60 * 1000
            },

            {
                upsert: true,
                new: true
            }
        )

        console.log("🚫 IP BLOCKED")
    }
}