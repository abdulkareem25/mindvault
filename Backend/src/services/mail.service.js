import axios from "axios";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const brevoClient = axios.create({
  baseURL: BREVO_URL,
  headers: {
    "api-key": process.env.BREVO_API_KEY,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const verifyEmailService = async () => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY missing in env");
    }

    console.log("Brevo email service ready");
  } catch (err) {
    console.error("Email service config error:", err.message);
  }
};


export const sendEmail = async ( to, subject, html ) => {
  try {
    const response = await brevoClient.post("", {
      sender: {
        name: "MindVault",
        email: process.env.EMAIL_USER,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("Email sent:", response.data.messageId);
    return true;
  } catch (error) {
    console.error(
      "Brevo send error:",
      error.response?.data || error.message
    );
    return false;
  }
};