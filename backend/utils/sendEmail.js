const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    if (!to || !subject || (!html && !text)) {
      throw new Error(
        "Email recipient, subject, and content are required."
      );
    }

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html: html || `<p>${text}</p>`,
      text,
    });

    console.log("✅ Email sent successfully");
    console.log(response);

    return response;
  } catch (error) {
    console.error("❌ Resend Error:", error);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;