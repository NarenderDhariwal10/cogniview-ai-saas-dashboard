// server/services/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInviteEmail = async (to, link, role) => {
  const mailOptions = {
    from: `"SaaS Dashboard" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You’ve been invited!",
    html: `
      <h3>You have been invited to join as ${role}</h3>
      <p>Click the link below to accept your invite:</p>
      <a href="${link}" target="_blank">Accept Invite</a>
      <p>This link expires in 24 hours.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendGenericEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"SaaS Dashboard" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export default transporter;
