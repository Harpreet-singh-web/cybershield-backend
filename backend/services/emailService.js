const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendSecurityAlert = async (toEmail, ip) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "🚨 Security Alert - Suspicious Login Activity",
      html: `
        <h2>Security Alert</h2>
        <p>We detected multiple failed login attempts on your account.</p>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p>If this wasn't you, please secure your account immediately.</p>
      `
    })

    console.log("📧 Email sent successfully")
  } catch (error) {
    console.error("❌ Email error:", error)
  }
}

module.exports = sendSecurityAlert