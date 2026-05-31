const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("Missing BREVO_API_KEY");
    }

    if (!to || !subject || (!html && !text)) {
      throw new Error(
        "Email recipient, subject, and content are required."
      );
    }

    const email = new brevo.SendSmtpEmail();

    email.subject = subject;

    email.sender = {
      name: process.env.EMAIL_FROM_NAME || "My App",
      email: process.env.EMAIL_FROM,
    };

    email.to = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];

    email.htmlContent = html || `<p>${text}</p>`;
    email.textContent = text || "";

    const response = await apiInstance.sendTransacEmail(email);

    console.log("✅ Email sent successfully");
    console.log(response);

    return response;
  } catch (error) {
    console.error("❌ Brevo Error:", error);

    throw new Error(
      `Email could not be sent: ${
        error.response?.body?.message || error.message
      }`
    );
  }
};

module.exports = sendEmail;