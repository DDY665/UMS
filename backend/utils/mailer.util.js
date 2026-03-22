const nodemailer = require("nodemailer");

const MAIL_PROVIDER = (process.env.MAIL_PROVIDER || "smtp").trim().toLowerCase();
const MAIL_USER = (process.env.MAIL_USER || "").trim();
const MAIL_PASS = (process.env.MAIL_PASS || "").replace(/\s+/g, "");
const RESEND_API_KEY = (process.env.RESEND_API_KEY || "").trim();
const RESEND_FROM_EMAIL = (process.env.RESEND_FROM_EMAIL || "").trim();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  family: 4,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  tls: {
    servername: "smtp.gmail.com",
    minVersion: "TLSv1.2"
  },
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const sendWithSmtp = async (to, subject, html) => {
  if (!MAIL_USER || !MAIL_PASS) {
    throw new Error("Mail service not configured properly");
  }

  await transporter.sendMail({
    from: `"UMS Admin" <${MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendWithResend = async (to, subject, html) => {
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error("Resend mail service not configured properly");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend API error (${response.status}): ${text}`);
  }
};


const sendEmployeeCredentials = async (to, tempPassword, token) => {
  const frontendBaseUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
  const onboardingLink = `${frontendBaseUrl}/onboard?token=${encodeURIComponent(token)}`;

  const subject = "Your UMS Account Credentials";
  const html = `
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
    `;

  if (MAIL_PROVIDER === "resend") {
    await sendWithResend(to, subject, html);
    return;
  }

  await sendWithSmtp(to, subject, html);
};

module.exports = {
  sendEmployeeCredentials,
};