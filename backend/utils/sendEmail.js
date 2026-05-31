const axios = require("axios");

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("Missing BREVO_API_KEY");
    }

    const recipients = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME || "My App",
          email: process.env.EMAIL_FROM,
        },
        to: recipients,
        subject,
        htmlContent: html || `<p>${text}</p>`,
        textContent: text || "",
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Brevo Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || error.message
    );
  }
};

module.exports = sendEmail;