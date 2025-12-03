const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

module.exports = async function sendResetPassEmail(email, token) {
  const resetLink = `${process.env.FRONT_URL}/update-password/${token}`;

  const mailOptions = {
    from: `"Coole Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password 🔒",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${resetLink}" style="background-color:#28a745; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">Reset Password</a>
      <p>If you didn’t request a password reset, you can ignore this email.</p>
      <p>This link is valid for <strong>1 hour</strong>.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to: ${email}`);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
  }
};
