const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const requiredVariables = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_MAIL",
      "SMTP_PASSWORD",
    ];

    const missingVariables = requiredVariables.filter(
      (variableName) => !process.env[variableName],
    );

    if (missingVariables.length > 0) {
      throw new Error(
        `Missing email environment variables: ${missingVariables.join(", ")}`,
      );
    }

    if (!to || !subject || (!html && !text)) {
      throw new Error("Email recipient, subject, and content are required.");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_MAIL:", process.env.SMTP_MAIL);

    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const mailOptions = {
      from: `"MERN Auth" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      text,
      html,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
