const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* =========================
   SEND EMPLOYEE CREDENTIALS
========================= */

const sendEmployeeCredentials = async (to, tempPassword, token) => {

  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error("Mail service not configured properly");
  }

  const frontendBaseUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
  const onboardingLink = `${frontendBaseUrl}/onboard?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: `"UMS Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your UMS Account Credentials",
    html: `
      <h2>Welcome to UMS</h2>
      <p>Your account has been created by Admin.</p>

      <p><b>Email:</b> ${to}</p>
      <p><b>Temporary Password:</b> ${tempPassword}</p>

      <p>You must change your password after first login.</p>

      <p>
        <a href="${onboardingLink}" 
           style="padding:12px 20px;background:#2563eb;color:white;
                  text-decoration:none;border-radius:6px;">
          Click here to set your password
        </a>
      </p>

      <p>This link will expire in 24 hours.</p>
    `,
  });
};

module.exports = {
  sendEmployeeCredentials,
};